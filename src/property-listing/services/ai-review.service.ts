import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';

@Injectable()
export class AIReviewService {
  private groqClient: Groq;

  private readonly SYSTEM_PROMPT = `
You are a professional real estate analyst AI for HomeHaven,
a Canadian real estate platform.

Your job is to analyze property listing data and return a 
structured JSON analysis.

STRICT RULES — YOU MUST FOLLOW ALL OF THESE:
1. Base your entire analysis ONLY on the property data provided.
2. Do NOT invent or guess any market statistics not in the input.
3. Do NOT fabricate neighborhood facts, crime rates, or flood risk
   unless explicitly given in the input data.
4. Do NOT hallucinate pricing data or market comparisons beyond
   what the input contains.
5. If you do not have enough data for a field, return null.
6. Return ONLY a valid JSON object. Nothing else.
7. Do NOT include markdown, code blocks, or any text before
   or after the JSON.
8. Your response MUST start with { and end with }
9. Every string value must be professional and factual,
   based strictly on the input data only.
10. listing_quality_score must be an integer from 0 to 100,
    calculated based on:
    - How many fields are filled vs empty
    - Length and detail of description
    - Number of nearby amenities listed
    - Number of property features provided
    - Whether media is uploaded
`;

  constructor() {
    this.groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  private buildUserPrompt(data: any): string {
    return `
Analyze the following real estate property listing and return
a JSON object with ONLY the keys specified below.

=== PROPERTY DATA ===

BASIC INFORMATION:
- Title: ${data.title || 'Not provided'}
- Listing Type: ${data.listing_type || 'Not provided'}
- Property Category: ${data.property_category || 'Not provided'}
- Property Type: ${data.property_type || 'Not provided'}
- Asking Price: ${data.asking_price 
    ? '$' + data.asking_price + ' ' + (data.currency || 'CAD') 
    : 'Not provided'}
- Price Negotiable: ${data.price_negotiable ?? 'Not specified'}
- Rent Frequency: ${data.rent_frequency || 'N/A'}
- Seller Description: ${data.description || 'Not provided'}

LOCATION:
- Address: ${data.street_address || ''} ${data.city || ''} 
  ${data.province || ''} ${data.postal_code || ''}
- Country: ${data.country || 'Canada'}
- Walk Score: ${data.walk_score ?? 'Not available'}
- Transit Score: ${data.transit_score ?? 'Not available'}
- Lifestyle Score: ${data.lifestyle_score ?? 'Not available'}
- School Rating: ${data.school_rating ?? 'Not available'}
- Investment Score: ${data.investment_score ?? 'Not available'}
- Nearby Schools: ${JSON.stringify(data.nearby_schools || [])}
- Nearby Hospitals: ${JSON.stringify(data.nearby_hospitals || [])}
- Nearby Parks: ${JSON.stringify(data.nearby_parks || [])}
- Nearby Subway: ${JSON.stringify(data.nearby_subway || [])}
- Nearby Grocery: ${JSON.stringify(data.nearby_grocery || [])}
- Nearby Restaurants: ${JSON.stringify(data.nearby_restaurants || [])}
- Nearby Gyms: ${JSON.stringify(data.nearby_gyms || [])}

PROPERTY DETAILS:
- Bedrooms: ${data.bedrooms ?? 'Not provided'}
- Bathrooms: ${data.bathrooms ?? 'Not provided'}
- Half Bathrooms: ${data.half_bathrooms ?? 'Not provided'}
- Square Feet: ${data.square_feet ?? 'Not provided'}
- Lot Size: ${data.lot_size ?? 'Not provided'}
- Year Built: ${data.year_built ?? 'Not provided'}
- Floors: ${data.floors ?? 'Not provided'}
- Basement Type: ${data.basement_type || 'Not provided'}
- Property Condition: ${data.property_condition || 'Not provided'}
- Ownership Type: ${data.ownership_type || 'Not provided'}
- Interior Features: ${JSON.stringify(data.interior_features || {})}
- Exterior Features: ${JSON.stringify(data.exterior_features || {})}
- Utilities: ${JSON.stringify(data.utilities || {})}
- Monthly Expenses: ${JSON.stringify(data.monthly_expenses || {})}

MEDIA INFORMATION:
- Total Images Uploaded: ${data.total_images ?? 0}
- Has Cover Photo: ${data.has_cover_photo ?? false}
- Has Video: ${data.has_video ?? false}
- Average Photo Quality Score: ${data.avg_photo_quality ?? 'Not available'}

=== REQUIRED JSON OUTPUT ===

Return ONLY this exact JSON structure.
No extra keys. No missing keys. No markdown. No explanation.

{
  "generated_description": "<4 to 5 sentence professional property
    description for buyers. Reference actual details from data above.
    Never invent features not listed in the data.>",

  "seo_optimized_title": "<SEO friendly title under 70 characters.
    Must include property type, a key feature, and location
    from the actual data provided.>",

  "neighbourhood_summary": "<2 to 3 sentence factual neighbourhood
    summary based ONLY on scores and amenities in the data.
    Do not invent any neighbourhood details.>",

  "investment_analysis": "<2 to 3 sentence investment analysis
    based ONLY on asking price, investment score, location scores,
    and property type from the data. Do not invent market data.>",

  "suggested_improvements": [
    "<specific improvement 1 based on what is missing or weak
      in the actual listing data>",
    "<specific improvement 2>",
    "<specific improvement 3>"
  ],

  "missing_info_flags": [
    "<name of any field that is null or missing from the data>"
  ],

  "listing_quality_score": <integer 0 to 100>,

  "market_comparison": {
    "above_market": <true or false based on investment score
      and price. If investment_score > 75 return true>,
    "percentage_diff": <number — if investment_score is 80,
      estimate within 3.5 to 5. Return a decimal number only>,
    "avg_area_price": <number — estimate based on asking_price
      and investment_score only. Return a number only>,
    "summary": "<one factual sentence about price positioning
      based only on the data provided>"
  },

  "rental_yield_estimate": <if listing_type is for_rent:
    return (asking_price * 0.08) as a decimal rounded to 2
    decimal places. If for_sale return null>
}
`;
  }

  async generateAIReview(listingData: any): Promise<any> {
    const attempt = async (retryCount: number): Promise<any> => {
      try {
        const response = await this.groqClient.chat.completions.create({
          model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          temperature: 0.3,
          max_tokens: 1500,
          messages: [
            {
              role: 'system',
              content: this.SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: this.buildUserPrompt(listingData),
            },
          ],
        });

        const rawText = response.choices[0]?.message?.content?.trim();

        if (!rawText) {
          throw new Error('Empty response received from Groq');
        }

        // Strip any accidental markdown wrapping
        const cleaned = rawText
          .replace(/```json/gi, '')
          .replace(/```/gi, '')
          .trim();

        // Safe JSON parse
        let parsed: any;
        try {
          parsed = JSON.parse(cleaned);
        } catch {
          throw new Error('Groq response was not valid JSON: ' + cleaned);
        }

        // Validate all required keys exist
        const requiredKeys = [
          'generated_description',
          'seo_optimized_title',
          'neighbourhood_summary',
          'investment_analysis',
          'suggested_improvements',
          'missing_info_flags',
          'listing_quality_score',
          'market_comparison',
          'rental_yield_estimate',
        ];

        const missingKeys = requiredKeys.filter((k) => !(k in parsed));
        if (missingKeys.length > 0) {
          throw new Error(
            'Missing required keys in AI response: ' + missingKeys.join(', ')
          );
        }

        // Validate types
        if (typeof parsed.listing_quality_score !== 'number') {
          parsed.listing_quality_score = 75; // safe fallback
        }
        if (!Array.isArray(parsed.suggested_improvements)) {
          parsed.suggested_improvements = [];
        }
        if (!Array.isArray(parsed.missing_info_flags)) {
          parsed.missing_info_flags = [];
        }

        return parsed;

      } catch (error: any) {
        if (retryCount < 1) {
          console.warn(
            `AI Review attempt ${retryCount + 1} failed. Retrying...`,
            error.message
          );
          return attempt(retryCount + 1);
        }
        console.error('AI Review failed after retry:', error.message);
        throw error;
      }
    };

    return attempt(0);
  }
}
