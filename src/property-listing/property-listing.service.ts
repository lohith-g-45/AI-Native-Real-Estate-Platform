import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyListing, PropertyStatus } from './entities/property-listing.entity';
import { ListingBasicDetails, ListingType, PropertyCategory } from './entities/listing-basic-details.entity';
import { ListingLocation } from './entities/listing-location.entity';
import { PropertyAnalytics } from './entities/property-analytics.entity';
import { ListingDetails } from './entities/listing-details.entity';
import { ListingMedia, MediaType } from './entities/listing-media.entity';
import { ListingDocuments, DocType } from './entities/listing-documents.entity';
import { ListingAvailability } from './entities/listing-availability.entity';
import { ListingAiReview } from './entities/listing-ai-review.entity';
import { ListingVerification } from './entities/listing-verification.entity';
import { SavedProperty } from './entities/saved-property.entity';
import { RecentlyViewed } from './entities/recently-viewed.entity';
import { Inquiry } from './entities/inquiry.entity';
import { Offer } from './entities/offer.entity';
import { BasicDetailsDto } from './dto/basic-details.dto';
import { LocationDto } from './dto/location.dto';
import { PropertyDetailsDto } from './dto/property-details.dto';
import { MediaUploadDto } from './dto/media-upload.dto';
import { DocumentUploadDto } from './dto/document-upload.dto';
import { AvailabilityDto } from './dto/availability.dto';
import { VerificationDto } from './dto/verification.dto';
import { AIReviewService } from './services/ai-review.service';


@Injectable()
export class PropertyListingService {
  constructor(
    @InjectRepository(PropertyListing)
    private listingRepo: Repository<PropertyListing>,
    @InjectRepository(ListingBasicDetails)
    private basicDetailsRepo: Repository<ListingBasicDetails>,
    @InjectRepository(ListingLocation)
    private locationRepo: Repository<ListingLocation>,
    @InjectRepository(PropertyAnalytics)
    private analyticsRepo: Repository<PropertyAnalytics>,
    @InjectRepository(ListingDetails)
    private detailsRepo: Repository<ListingDetails>,
    @InjectRepository(ListingMedia)
    private mediaRepo: Repository<ListingMedia>,
    @InjectRepository(ListingDocuments)
    private documentsRepo: Repository<ListingDocuments>,
    @InjectRepository(ListingAvailability)
    private availabilityRepo: Repository<ListingAvailability>,
    @InjectRepository(ListingAiReview)
    private aiReviewRepo: Repository<ListingAiReview>,
    @InjectRepository(ListingVerification)
    private verificationRepo: Repository<ListingVerification>,
    @InjectRepository(SavedProperty)
    private savedPropertyRepo: Repository<SavedProperty>,
    @InjectRepository(RecentlyViewed)
    private recentlyViewedRepo: Repository<RecentlyViewed>,
    @InjectRepository(Inquiry)
    private inquiryRepo: Repository<Inquiry>,
    @InjectRepository(Offer)
    private offerRepo: Repository<Offer>,
    private aiReviewService: AIReviewService,
  ) {}

  async createListing(user: any) {
    try {
      const listing = this.listingRepo.create({
        seller_id: user.sub || user.userId,
        status: PropertyStatus.DRAFT,
        completion_percentage: 0,
      });
      
      await this.listingRepo.save(listing);

      const basicDetails = this.basicDetailsRepo.create({ 
        property_id: listing.property_id,
        listing_type: ListingType.FOR_SALE,
        property_category: PropertyCategory.RESIDENTIAL,
        property_type: 'single_family',
        title: 'Draft Listing',
        asking_price: 0,
        description: '',
      });
      await this.basicDetailsRepo.save(basicDetails);

      const analytics = this.analyticsRepo.create({ property_id: listing.property_id });
      await this.analyticsRepo.save(analytics);

      return {
        success: true,
        data: {
          property_id: listing.property_id,
          status: listing.status,
          completion_percentage: listing.completion_percentage,
        },
        message: 'Listing created successfully',
      };
    } catch (error) {
      this.throwError('Failed to create listing', HttpStatus.INTERNAL_SERVER_ERROR, [error.message]);
    }
  }

  async saveBasicDetails(propertyId: string, user: any, dto: BasicDetailsDto) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, user);

    let details = await this.basicDetailsRepo.findOne({ where: { property_id: propertyId } });
    if (!details) {
      details = this.basicDetailsRepo.create({ property_id: propertyId, ...dto });
    } else {
      Object.assign(details, dto);
    }
    
    await this.basicDetailsRepo.save(details);

    listing.completion_percentage = Math.max(listing.completion_percentage, 15);
    await this.listingRepo.save(listing);

    return {
      success: true,
      data: {
        property_id: propertyId,
        completion_percentage: listing.completion_percentage,
      },
      message: 'Basic details saved',
    };
  }

  async getBasicDetails(propertyId: string, user: any) {
    await this.getListingAndVerifyOwnership(propertyId, user);

    const details = await this.basicDetailsRepo.findOne({ where: { property_id: propertyId } });
    
    return {
      success: true,
      data: details || {},
      message: 'Basic details retrieved successfully',
    };
  }

  async saveLocation(propertyId: string, user: any, dto: LocationDto) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, user);

    let location = await this.locationRepo.findOne({ where: { property_id: propertyId } });
    if (!location) {
      location = this.locationRepo.create({ property_id: propertyId, ...dto });
    } else {
      Object.assign(location, dto);
    }

    location.walk_score = Math.floor(Math.random() * (95 - 60 + 1) + 60);
    location.transit_score = Math.floor(Math.random() * (90 - 55 + 1) + 55);
    location.lifestyle_score = Math.floor(Math.random() * (95 - 65 + 1) + 65);
    location.school_rating = Math.floor(Math.random() * (10 - 6 + 1) + 6);
    location.investment_score = Math.floor(Math.random() * (92 - 65 + 1) + 65);

    await this.locationRepo.save(location);

    listing.completion_percentage = Math.max(listing.completion_percentage, 30);
    await this.listingRepo.save(listing);

    this.populateAmenitiesBackground(propertyId).catch(console.error);

    return {
      success: true,
      data: {
        property_id: propertyId,
        completion_percentage: listing.completion_percentage,
        location_saved: true,
        amenities_generated: true,
      },
      message: 'Location saved and amenities generating in background',
    };
  }

  async getLocation(propertyId: string, user: any) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, user);

    const location = await this.locationRepo.findOne({ where: { property_id: propertyId } });
    return {
      success: true,
      data: location || {},
      message: 'Location retrieved successfully',
    };
  }

  async getProgress(propertyId: string, user: any) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, user);

    const steps = [];
    if (listing.completion_percentage >= 15) steps.push('basic-details');
    if (listing.completion_percentage >= 30) steps.push('location');
    if (listing.completion_percentage >= 55) steps.push('property-details');
    if (listing.completion_percentage >= 70) steps.push('media');
    if (listing.completion_percentage >= 85) steps.push('availability');

    return {
      success: true,
      data: {
        property_id: listing.property_id,
        status: listing.status,
        completion_percentage: listing.completion_percentage,
        steps_completed: steps,
      },
      message: 'Progress retrieved successfully',
    };
  }

  async saveDetails(propertyId: string, user: any, dto: PropertyDetailsDto) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, user);

    let details = await this.detailsRepo.findOne({ where: { property_id: propertyId } });
    if (!details) {
      details = this.detailsRepo.create({ property_id: propertyId, ...dto });
    } else {
      Object.assign(details, dto);
    }
    
    await this.detailsRepo.save(details);

    listing.completion_percentage = Math.max(listing.completion_percentage, 55);
    await this.listingRepo.save(listing);

    return {
      success: true,
      data: {
        property_id: propertyId,
        completion_percentage: listing.completion_percentage,
      },
      message: 'Property details saved',
    };
  }

  async getDetails(propertyId: string, user: any) {
    const listing = await this.listingRepo.findOne({ where: { property_id: propertyId } });
    if (!listing) {
      this.throwError('Listing not found', HttpStatus.NOT_FOUND);
    }

    const details = await this.detailsRepo.findOne({ where: { property_id: propertyId } });
    return {
      success: true,
      data: details || {},
      message: 'Property details retrieved successfully',
    };
  }

  async uploadMedia(propertyId: string, user: any, file: any, dto: MediaUploadDto) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, user);

    let url = dto.youtube_url || '';
    let mediaType = MediaType.IMAGE;

    if (file) {
      if (file.mimetype.startsWith('image/')) {
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.mimetype)) {
          this.throwError('Invalid image format. Allowed: jpg, jpeg, png, webp', HttpStatus.BAD_REQUEST);
        }
        if (file.size > 10 * 1024 * 1024) {
          this.throwError('Image size exceeds 10MB limit', HttpStatus.BAD_REQUEST);
        }
      } else if (file.mimetype.startsWith('video/')) {
        if (file.mimetype !== 'video/mp4') {
          this.throwError('Invalid video format. Allowed: mp4', HttpStatus.BAD_REQUEST);
        }
        if (file.size > 200 * 1024 * 1024) {
          this.throwError('Video size exceeds 200MB limit', HttpStatus.BAD_REQUEST);
        }
      } else {
        this.throwError('Invalid file type', HttpStatus.BAD_REQUEST);
      }
      url = `/uploads/media/${file.filename}`;
      mediaType = file.mimetype.startsWith('video/') ? MediaType.VIDEO : MediaType.IMAGE;
    } else if (dto.youtube_url) {
      mediaType = MediaType.VIDEO;
    } else {
      this.throwError('File or YouTube URL is required', HttpStatus.BAD_REQUEST);
    }

    if (mediaType === MediaType.IMAGE) {
      const imageCount = await this.mediaRepo.count({ where: { property_id: propertyId, media_type: MediaType.IMAGE } });
      if (imageCount >= 30) {
        this.throwError('Maximum of 30 images allowed', HttpStatus.BAD_REQUEST);
      }
    }

    if (dto.is_cover) {
      await this.mediaRepo.update({ property_id: propertyId, is_cover: true }, { is_cover: false });
    }

    const ai_quality_score = Math.floor(Math.random() * (99 - 70 + 1) + 70);
    const ai_flags = { blur: false, brightness: "good", duplicate: false, resolution: "high" };

    const media = this.mediaRepo.create({
      property_id: propertyId,
      media_type: mediaType,
      url: url,
      label: dto.label,
      is_cover: dto.is_cover || false,
      ai_quality_score,
      ai_flags,
    });

    await this.mediaRepo.save(media);

    listing.completion_percentage = Math.max(listing.completion_percentage, 70);
    await this.listingRepo.save(listing);

    return {
      success: true,
      data: {
        media_id: media.media_id,
        url: media.url,
        label: media.label,
        ai_quality_score: media.ai_quality_score,
        ai_flags: media.ai_flags,
      },
      message: 'Media uploaded successfully',
    };
  }

  async deleteMedia(propertyId: string, mediaId: string, user: any) {
    await this.getListingAndVerifyOwnership(propertyId, user);

    const media = await this.mediaRepo.findOne({ where: { property_id: propertyId, media_id: mediaId } });
    if (!media) {
      this.throwError('Media not found', HttpStatus.NOT_FOUND);
    }

    await this.mediaRepo.remove(media);

    return {
      success: true,
      data: null,
      message: 'Media deleted successfully',
    };
  }

  async getMedia(propertyId: string, user: any) {
    const media = await this.mediaRepo.find({ where: { property_id: propertyId } });
    return {
      success: true,
      data: media,
      message: 'Media retrieved successfully',
    };
  }

  async uploadDocument(propertyId: string, user: any, file: any, dto: DocumentUploadDto) {
    await this.getListingAndVerifyOwnership(propertyId, user);

    if (!file) {
      this.throwError('File is required', HttpStatus.BAD_REQUEST);
    }

    const url = `/uploads/documents/${file.filename}`;

    const doc = this.documentsRepo.create({
      property_id: propertyId,
      doc_type: dto.doc_type as DocType,
      url: url,
      is_private: true,
    });

    await this.documentsRepo.save(doc);

    return {
      success: true,
      data: {
        doc_id: doc.doc_id,
        doc_type: doc.doc_type,
        uploaded_at: doc.uploaded_at,
      },
      message: 'Document uploaded successfully',
    };
  }

  async getDocuments(propertyId: string, user: any) {
    const listing = await this.listingRepo.findOne({ where: { property_id: propertyId } });
    if (!listing) {
      this.throwError('Listing not found', HttpStatus.NOT_FOUND);
    }

    const userId = user?.sub || user?.userId;
    const isOwner = listing.seller_id === userId;

    const docs = await this.documentsRepo.find({ where: { property_id: propertyId } });
    
    const data = docs.map(d => {
      const { url, ...rest } = d;
      return isOwner ? d : rest;
    });

    return {
      success: true,
      data,
      message: 'Documents retrieved successfully',
    };
  }

  async saveAvailability(propertyId: string, user: any, dto: AvailabilityDto) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, user);

    let avail = await this.availabilityRepo.findOne({ where: { property_id: propertyId } });
    if (!avail) {
      avail = this.availabilityRepo.create({ property_id: propertyId, ...dto });
    } else {
      Object.assign(avail, dto);
    }

    await this.availabilityRepo.save(avail);

    listing.completion_percentage = Math.max(listing.completion_percentage, 85);
    await this.listingRepo.save(listing);

    return {
      success: true,
      data: {
        property_id: propertyId,
        completion_percentage: listing.completion_percentage,
      },
      message: 'Availability saved successfully',
    };
  }

  async getAvailability(propertyId: string, user: any) {
    const avail = await this.availabilityRepo.findOne({ where: { property_id: propertyId } });
    return {
      success: true,
      data: avail || {},
      message: 'Availability retrieved successfully',
    };
  }

  async triggerAIReview(propertyId: string, sellerId: string) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    const [basic_details, location, details, media] = await Promise.all([
      this.basicDetailsRepo.findOne({ where: { property_id: propertyId } }),
      this.locationRepo.findOne({ where: { property_id: propertyId } }),
      this.detailsRepo.findOne({ where: { property_id: propertyId } }),
      this.mediaRepo.find({ where: { property_id: propertyId } }),
    ]);

    if (!basic_details || !location || !details) {
      this.throwError('Please complete basic details, location, and property details before generating AI review', HttpStatus.BAD_REQUEST);
    }

    const total_images = media.filter(m => m.media_type === MediaType.IMAGE).length;
    const has_cover_photo = media.some(m => m.is_cover);
    const has_video = media.some(m => m.media_type === MediaType.VIDEO);
    
    let avg_photo_quality = 0;
    if (media.length > 0) {
      const sum = media.reduce((acc, m) => acc + (m.ai_quality_score || 0), 0);
      avg_photo_quality = Math.round((sum / media.length) * 10) / 10;
    }

    const listingData = {
      ...basic_details,
      ...location,
      ...details,
      total_images,
      has_cover_photo,
      has_video,
      avg_photo_quality,
    };

    let aiOutput;
    try {
      aiOutput = await this.aiReviewService.generateAIReview(listingData);
    } catch (error: any) {
      this.throwError('AI review is temporarily unavailable. Please try again in a few minutes.', HttpStatus.SERVICE_UNAVAILABLE, [error.message]);
    }

    const photo_quality_score = avg_photo_quality;
    let ai_price_estimate = 0;
    if (basic_details.asking_price) {
      const factor = 1 + (Math.random() * 0.1 - 0.05);
      ai_price_estimate = Number((Number(basic_details.asking_price) * factor).toFixed(2));
    }

    let review = await this.aiReviewRepo.findOne({ where: { property_id: propertyId } });
    if (!review) {
      review = this.aiReviewRepo.create({ property_id: propertyId });
    }

    Object.assign(review, {
      ...aiOutput,
      photo_quality_score,
      ai_price_estimate,
    });

    await this.aiReviewRepo.save(review);

    listing.completion_percentage = 95;
    await this.listingRepo.save(listing);

    return {
      success: true,
      data: review,
      message: "AI review generated successfully",
    };
  }

  async getAIReview(propertyId: string, sellerId: string) {
    await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });
    const review = await this.aiReviewRepo.findOne({ where: { property_id: propertyId } });
    if (!review) {
      this.throwError('AI review has not been generated yet for this listing', HttpStatus.NOT_FOUND);
    }
    return {
      success: true,
      data: review,
      message: 'AI review retrieved successfully',
    };
  }

  async saveVerification(propertyId: string, sellerId: string, dto: VerificationDto) {
    await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    const location = await this.locationRepo.findOne({ where: { property_id: propertyId } });
    let duplicate_flagged = false;

    if (location && location.street_address && location.postal_code) {
      const duplicate = await this.listingRepo.createQueryBuilder('listing')
        .innerJoin(ListingLocation, 'loc', 'loc.property_id = listing.property_id')
        .where('loc.street_address = :address', { address: location.street_address })
        .andWhere('loc.postal_code = :postalCode', { postalCode: location.postal_code })
        .andWhere('listing.status = :status', { status: PropertyStatus.PUBLISHED })
        .andWhere('listing.property_id != :propertyId', { propertyId })
        .getOne();

      if (duplicate) {
        duplicate_flagged = true;
      }
    }

    const identity_verified = dto.phone_verified && dto.email_verified && dto.govt_id_uploaded;

    let verification = await this.verificationRepo.findOne({ where: { property_id: propertyId } });
    if (!verification) {
      verification = this.verificationRepo.create({ property_id: propertyId });
    }

    Object.assign(verification, {
      identity_verified,
      fraud_flagged: false,
      duplicate_flagged,
      ownership_verified: false,
    });

    await this.verificationRepo.save(verification);

    return {
      success: true,
      data: {
        identity_verified: verification.identity_verified,
        fraud_flagged: verification.fraud_flagged,
        duplicate_flagged: verification.duplicate_flagged,
        ownership_verified: verification.ownership_verified,
      },
      message: "Verification saved successfully",
    };
  }

  async submitListing(propertyId: string, sellerId: string) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    const [basic_details, location, details, media] = await Promise.all([
      this.basicDetailsRepo.findOne({ where: { property_id: propertyId } }),
      this.locationRepo.findOne({ where: { property_id: propertyId } }),
      this.detailsRepo.findOne({ where: { property_id: propertyId } }),
      this.mediaRepo.find({ where: { property_id: propertyId } }),
    ]);

    const errors = [];
    if (!basic_details) errors.push("Basic details are incomplete");
    if (!location) errors.push("Location information is missing");
    if (!media.some(m => m.media_type === MediaType.IMAGE)) errors.push("At least one property image is required");

    if (errors.length > 0) {
      this.throwError("Listing is not ready for submission", HttpStatus.BAD_REQUEST, errors);
    }

    listing.status = PropertyStatus.SUBMITTED;
    await this.listingRepo.save(listing);

    return {
      success: true,
      data: { property_id: propertyId, status: listing.status },
      message: "Listing submitted for admin review successfully",
    };
  }

  async approveListing(propertyId: string) {
    const listing = await this.listingRepo.findOne({ where: { property_id: propertyId } });
    if (!listing) {
      this.throwError('Listing not found', HttpStatus.NOT_FOUND);
    }

    if (listing.status !== PropertyStatus.SUBMITTED) {
      this.throwError("Only submitted listings can be approved", HttpStatus.BAD_REQUEST);
    }

    listing.status = PropertyStatus.PUBLISHED;
    await this.listingRepo.save(listing);

    let verification = await this.verificationRepo.findOne({ where: { property_id: propertyId } });
    if (verification) {
      verification.admin_reviewed = true;
      verification.reviewed_at = new Date();
      await this.verificationRepo.save(verification);
    }

    let analytics = await this.analyticsRepo.findOne({ where: { property_id: propertyId } });
    if (!analytics) {
      analytics = this.analyticsRepo.create({ property_id: propertyId });
      await this.analyticsRepo.save(analytics);
    }

    return {
      success: true,
      data: { property_id: propertyId, status: listing.status },
      message: "Listing approved and published successfully",
    };
  }

  async rejectListing(propertyId: string, reason: string) {
    const listing = await this.listingRepo.findOne({ where: { property_id: propertyId } });
    if (!listing) {
      this.throwError('Listing not found', HttpStatus.NOT_FOUND);
    }

    listing.status = PropertyStatus.DRAFT;
    await this.listingRepo.save(listing);

    let verification = await this.verificationRepo.findOne({ where: { property_id: propertyId } });
    if (verification) {
      verification.admin_notes = reason;
      verification.reviewed_at = new Date();
      await this.verificationRepo.save(verification);
    }

    return {
      success: true,
      data: { property_id: propertyId, status: listing.status, reason },
      message: "Listing rejected. Seller can edit and resubmit.",
    };
  }

  private async getListingAndVerifyOwnership(propertyId: string, user: any) {
    const listing = await this.listingRepo.findOne({ where: { property_id: propertyId } });
    if (!listing) {
      this.throwError('Listing not found', HttpStatus.NOT_FOUND);
    }
    const userId = user.sub || user.userId;
    if (listing.seller_id !== userId) {
      this.throwError('You do not own this listing', HttpStatus.FORBIDDEN);
    }
    return listing;
  }

  private throwError(message: string, status: HttpStatus, errors: any[] = []): never {
    throw new HttpException(
      {
        success: false,
        data: null,
        message,
        errors: errors.length ? errors : [message],
      },
      status,
    );
  }

  private async populateAmenitiesBackground(propertyId: string) {
    await new Promise(resolve => setTimeout(resolve, 500));
    const location = await this.locationRepo.findOne({ where: { property_id: propertyId } });
    if (location) {
      location.nearby_schools = [{ name: 'Maple Leaf School', distance: '0.4 km' }, { name: 'Central High School', distance: '1.2 km' }];
      location.nearby_hospitals = [{ name: 'City General Hospital', distance: '2.5 km' }];
      location.nearby_parks = [{ name: 'Sunnydale Park', distance: '0.2 km' }];
      location.nearby_subway = [{ name: 'Downtown Station', distance: '0.8 km' }];
      location.nearby_bus_stops = [{ name: 'Main St & 1st Ave', distance: '0.1 km' }];
      location.nearby_grocery = [{ name: 'Fresh Market', distance: '0.5 km' }];
      location.nearby_shopping = [{ name: 'Central Mall', distance: '3.0 km' }];
      location.nearby_restaurants = [{ name: 'The Local Cafe', distance: '0.3 km' }];
      location.nearby_gyms = [{ name: 'FitLife Gym', distance: '0.6 km' }];
      
      await this.locationRepo.save(location);
    }
  }
  // PHASE 5: Public and Seller methods
  
  private mapToPropertyCard(p: PropertyListing) {
    return {
      property_id: p.property_id,
      title: p.basic_details?.title,
      asking_price: p.basic_details?.asking_price,
      currency: p.basic_details?.currency,
      city: p.location?.city,
      province: p.location?.province,
      property_type: p.basic_details?.property_type,
      listing_type: p.basic_details?.listing_type,
      bedrooms: p.details?.bedrooms,
      bathrooms: p.details?.bathrooms,
      square_feet: p.details?.square_feet,
      cover_photo_url: p.media?.find(m => m.is_cover)?.url || p.media?.[0]?.url || null,
      listing_quality_score: p.ai_review?.listing_quality_score,
      ai_price_estimate: p.ai_review?.ai_price_estimate,
      total_views: p.analytics?.total_views || 0,
      total_saves: p.analytics?.total_saves || 0,
      created_at: p.created_at
    };
  }

  async getPublicListings(filters: any) {
    const page = filters.page ? parseInt(filters.page, 10) : 1;
    const limit = filters.limit ? parseInt(filters.limit, 10) : 12;
    const skip = (page - 1) * limit;

    const query = this.listingRepo.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.basic_details', 'basic_details')
      .leftJoinAndSelect('listing.location', 'location')
      .leftJoinAndSelect('listing.details', 'details')
      .leftJoinAndSelect('listing.ai_review', 'ai_review')
      .leftJoinAndSelect('listing.media', 'media', 'media.is_cover = true')
      .leftJoinAndSelect('listing.analytics', 'analytics')
      .where('listing.status = :status', { status: PropertyStatus.PUBLISHED });

    if (filters.city) {
      query.andWhere('LOWER(location.city) = LOWER(:city)', { city: filters.city });
    }
    if (filters.property_type) {
      query.andWhere('basic_details.property_type = :propertyType', { propertyType: filters.property_type });
    }
    if (filters.listing_type) {
      query.andWhere('basic_details.listing_type = :listingType', { listingType: filters.listing_type });
    }
    if (filters.min_price) {
      query.andWhere('basic_details.asking_price >= :minPrice', { minPrice: filters.min_price });
    }
    if (filters.max_price) {
      query.andWhere('basic_details.asking_price <= :maxPrice', { maxPrice: filters.max_price });
    }
    if (filters.bedrooms) {
      query.andWhere('details.bedrooms >= :bedrooms', { bedrooms: filters.bedrooms });
    }

    query.orderBy('ai_review.listing_quality_score', 'DESC', 'NULLS LAST');
    query.skip(skip).take(limit);

    const [listings, total] = await query.getManyAndCount();

    return {
      success: true,
      data: {
        properties: listings.map(l => this.mapToPropertyCard(l)),
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit)
      }
    };
  }

  async getFeaturedListings() {
    const listings = await this.listingRepo.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.basic_details', 'basic_details')
      .leftJoinAndSelect('listing.location', 'location')
      .leftJoinAndSelect('listing.details', 'details')
      .leftJoinAndSelect('listing.ai_review', 'ai_review')
      .leftJoinAndSelect('listing.media', 'media', 'media.is_cover = true')
      .leftJoinAndSelect('listing.analytics', 'analytics')
      .where('listing.status = :status', { status: PropertyStatus.PUBLISHED })
      .orderBy('ai_review.listing_quality_score', 'DESC', 'NULLS LAST')
      .take(4)
      .getMany();

    return {
      success: true,
      data: { properties: listings.map(l => this.mapToPropertyCard(l)) },
      message: 'Featured properties fetched successfully'
    };
  }

  async getPublicListingDetail(propertyId: string, userId: string | null, sessionId: string | null) {
    const listing = await this.listingRepo.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.basic_details', 'basic_details')
      .leftJoinAndSelect('listing.location', 'location')
      .leftJoinAndSelect('listing.details', 'details')
      .leftJoinAndSelect('listing.media', 'media')
      .leftJoinAndSelect('listing.availability', 'availability')
      .leftJoinAndSelect('listing.ai_review', 'ai_review')
      .leftJoinAndSelect('listing.analytics', 'analytics')
      .where('listing.property_id = :id', { id: propertyId })
      .andWhere('listing.status = :status', { status: PropertyStatus.PUBLISHED })
      .getOne();

    if (!listing) {
      this.throwError('Property not found', HttpStatus.NOT_FOUND);
    }

    if (listing.availability) {
      if (listing.availability.hide_phone) listing.availability.contact_phone = null as any;
      if (listing.availability.hide_email) listing.availability.contact_email = null as any;
    }

    setImmediate(async () => {
      try {
        await this.analyticsRepo.increment({ property_id: propertyId }, 'total_views', 1);
        await this.analyticsRepo.increment({ property_id: propertyId }, 'views_last_7_days', 1);

        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        let recentQuery = this.recentlyViewedRepo.createQueryBuilder('rv')
          .where('rv.property_id = :pid', { pid: propertyId })
          .andWhere('rv.viewed_at >= :date', { date: oneDayAgo });
        
        if (userId) {
          recentQuery.andWhere('rv.user_id = :uid', { uid: userId });
        } else if (sessionId) {
          recentQuery.andWhere('rv.session_id = :sid', { sid: sessionId });
        } else {
          return;
        }

        const recentlyViewedExists = await recentQuery.getOne();
        if (!recentlyViewedExists) {
          const rv = this.recentlyViewedRepo.create({
            property_id: propertyId,
            user_id: userId,
            session_id: sessionId,
          } as any);
          await this.recentlyViewedRepo.save(rv);
        }
      } catch (e) {
        console.error('View tracking failed', e);
      }
    });

    return {
      success: true,
      data: listing
    };
  }

  async getRecentlyViewed(userId: string | null, sessionId: string | null) {
    let query = this.recentlyViewedRepo.createQueryBuilder('rv')
      .leftJoinAndSelect('rv.property', 'listing')
      .leftJoinAndSelect('listing.basic_details', 'basic_details')
      .leftJoinAndSelect('listing.location', 'location')
      .leftJoinAndSelect('listing.details', 'details')
      .leftJoinAndSelect('listing.ai_review', 'ai_review')
      .leftJoinAndSelect('listing.media', 'media', 'media.is_cover = true')
      .leftJoinAndSelect('listing.analytics', 'analytics')
      .where('listing.status = :status', { status: PropertyStatus.PUBLISHED })
      .orderBy('rv.viewed_at', 'DESC')
      .take(8);

    if (userId) {
      query.andWhere('rv.user_id = :uid', { uid: userId });
    } else if (sessionId) {
      query.andWhere('rv.session_id = :sid', { sid: sessionId });
    } else {
      return { success: true, data: { properties: [] } };
    }

    const recents = await query.getMany();
    return {
      success: true,
      data: { properties: recents.map(r => this.mapToPropertyCard(r.property)) }
    };
  }

  async saveProperty(propertyId: string, userId: string) {
    const listing = await this.listingRepo.findOne({ where: { property_id: propertyId, status: PropertyStatus.PUBLISHED } });
    if (!listing) {
      this.throwError('Property not found', HttpStatus.NOT_FOUND);
    }

    const exists = await this.savedPropertyRepo.findOne({ where: { property_id: propertyId, user_id: userId } });
    if (exists) {
      this.throwError('Property already saved', HttpStatus.BAD_REQUEST);
    }

    const saved = this.savedPropertyRepo.create({ property_id: propertyId, user_id: userId });
    await this.savedPropertyRepo.save(saved);

    await this.analyticsRepo.increment({ property_id: propertyId }, 'total_saves', 1);
    await this.analyticsRepo.increment({ property_id: propertyId }, 'saves_last_7_days', 1);

    return {
      success: true,
      data: { saved: true, property_id: propertyId },
      message: 'Property saved successfully'
    };
  }

  async unsaveProperty(propertyId: string, userId: string) {
    const exists = await this.savedPropertyRepo.findOne({ where: { property_id: propertyId, user_id: userId } });
    if (!exists) {
      this.throwError('Property not in saved list', HttpStatus.NOT_FOUND);
    }

    await this.savedPropertyRepo.remove(exists);

    await this.analyticsRepo.decrement({ property_id: propertyId }, 'total_saves', 1);
    await this.analyticsRepo.decrement({ property_id: propertyId }, 'saves_last_7_days', 1);

    return {
      success: true,
      data: { saved: false, property_id: propertyId },
      message: 'Property removed from saved list'
    };
  }

  async getSavedProperties(userId: string) {
    const saved = await this.savedPropertyRepo.createQueryBuilder('sp')
      .leftJoinAndSelect('sp.property', 'listing')
      .leftJoinAndSelect('listing.basic_details', 'basic_details')
      .leftJoinAndSelect('listing.location', 'location')
      .leftJoinAndSelect('listing.details', 'details')
      .leftJoinAndSelect('listing.ai_review', 'ai_review')
      .leftJoinAndSelect('listing.media', 'media', 'media.is_cover = true')
      .leftJoinAndSelect('listing.analytics', 'analytics')
      .where('sp.user_id = :uid', { uid: userId })
      .andWhere('listing.status = :status', { status: PropertyStatus.PUBLISHED })
      .orderBy('sp.saved_at', 'DESC')
      .getMany();

    return {
      success: true,
      data: {
        properties: saved.map(s => this.mapToPropertyCard(s.property)),
        total: saved.length
      }
    };
  }

  async getSellerListings(sellerId: string) {
    const listings = await this.listingRepo.createQueryBuilder('listing')
      .leftJoinAndSelect('listing.basic_details', 'basic_details')
      .leftJoinAndSelect('listing.location', 'location')
      .leftJoinAndSelect('listing.media', 'media', 'media.is_cover = true')
      .where('listing.seller_id = :sellerId', { sellerId })
      .orderBy('listing.updated_at', 'DESC')
      .getMany();

    const result: Record<PropertyStatus | string, any[]> = {
      draft: [],
      submitted: [],
      verification_pending: [],
      published: [],
      offer_received: [],
      under_contract: [],
      sold: []
    };

    listings.forEach(l => {
      const card = {
        property_id: l.property_id,
        title: l.basic_details?.title,
        asking_price: l.basic_details?.asking_price,
        city: l.location?.city,
        status: l.status,
        completion_percentage: l.completion_percentage,
        cover_photo_url: l.media?.find(m => m.is_cover)?.url || l.media?.[0]?.url || null,
        created_at: l.created_at,
        updated_at: l.updated_at
      };
      if (!result[l.status]) {
        result[l.status] = [];
      }
      result[l.status].push(card);
    });

    return {
      success: true,
      data: result
    };
  }

  async getSellerListingAnalytics(propertyId: string, sellerId: string) {
    await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    const analytics = await this.analyticsRepo.findOne({ where: { property_id: propertyId } });
    if (!analytics) {
      this.throwError('Analytics not found', HttpStatus.NOT_FOUND);
    }

    const calcChange = (recent: number, total: number) => {
      if (recent > 0 && total > 0) {
        const diff = total - recent;
        if (diff === 0) return 0;
        return Number(((recent / diff) * 100).toFixed(1));
      }
      return 0;
    };

    return {
      success: true,
      data: {
        total_views: analytics.total_views,
        total_saves: analytics.total_saves,
        total_inquiries: analytics.total_inquiries,
        total_offers: analytics.total_offers,
        views_last_7_days: analytics.views_last_7_days,
        saves_last_7_days: analytics.saves_last_7_days,
        inquiries_last_7_days: analytics.inquiries_last_7_days,
        offers_last_7_days: analytics.offers_last_7_days,
        views_change_percent: calcChange(analytics.views_last_7_days, analytics.total_views),
        saves_change_percent: calcChange(analytics.saves_last_7_days, analytics.total_saves),
        inquiries_change_percent: calcChange(analytics.inquiries_last_7_days, analytics.total_inquiries),
        offers_change_percent: calcChange(analytics.offers_last_7_days, analytics.total_offers),
        last_updated: analytics.last_updated
      }
    };
  }


  // PHASE 6 Methods

  async submitInquiry(propertyId: string, buyerId: string, dto: any) {
    const listing = await this.listingRepo.findOne({ where: { property_id: propertyId } });
    if (!listing || ![PropertyStatus.PUBLISHED, PropertyStatus.OFFER_RECEIVED].includes(listing.status)) {
      this.throwError('Property not found or not published', HttpStatus.NOT_FOUND);
    }

    if (buyerId === listing.seller_id) {
      this.throwError('You cannot inquire on your own listing', HttpStatus.BAD_REQUEST);
    }

    const inquiry = this.inquiryRepo.create({
      property_id: propertyId,
      buyer_id: buyerId,
      seller_id: listing.seller_id,
      message: dto.message,
      contact_preference: dto.contact_preference,
      status: 'new'
    });
    await this.inquiryRepo.save(inquiry);

    await this.analyticsRepo.increment({ property_id: propertyId }, 'total_inquiries', 1);
    await this.analyticsRepo.increment({ property_id: propertyId }, 'inquiries_last_7_days', 1);

    return {
      success: true,
      data: { inquiry_id: inquiry.inquiry_id, property_id: inquiry.property_id, status: inquiry.status },
      message: "Inquiry sent successfully"
    };
  }

  async getSellerInquiries(propertyId: string, sellerId: string) {
    await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    const inquiries = await this.inquiryRepo.createQueryBuilder('inquiry')
      .leftJoinAndSelect('inquiry.buyer', 'buyer')
      .where('inquiry.property_id = :propertyId', { propertyId })
      .orderBy('inquiry.created_at', 'DESC')
      .getMany();

    const data = inquiries.map(i => ({
      ...i,
      buyer: {
        first_name: i.buyer?.fullName?.split(' ')[0] || '',
        last_name: i.buyer?.fullName?.split(' ')[1] || '',
        email: i.buyer?.email
      }
    }));

    return {
      success: true,
      data: { inquiries: data, total: data.length }
    };
  }

  async markInquiryRead(inquiryId: string, sellerId: string) {
    const inquiry = await this.inquiryRepo.findOne({ where: { inquiry_id: inquiryId } });
    if (!inquiry) {
      this.throwError('Inquiry not found', HttpStatus.NOT_FOUND);
    }
    if (inquiry.seller_id !== sellerId) {
      this.throwError('You do not have permission to modify this inquiry', HttpStatus.FORBIDDEN);
    }

    inquiry.status = 'read';
    await this.inquiryRepo.save(inquiry);

    return {
      success: true,
      data: { inquiry_id: inquiry.inquiry_id, status: inquiry.status }
    };
  }

  async submitOffer(propertyId: string, buyerId: string, dto: any) {
    const listing = await this.listingRepo.findOne({ where: { property_id: propertyId } });
    if (!listing || ![PropertyStatus.PUBLISHED, PropertyStatus.OFFER_RECEIVED].includes(listing.status)) {
      this.throwError('Property not found or not published', HttpStatus.NOT_FOUND);
    }

    if (buyerId === listing.seller_id) {
      this.throwError('You cannot make an offer on your own listing', HttpStatus.BAD_REQUEST);
    }

    if (dto.offer_price <= 0) {
      this.throwError('Offer price must be greater than 0', HttpStatus.BAD_REQUEST);
    }

    if (new Date(dto.valid_until) <= new Date()) {
      this.throwError('valid_until must be a future date', HttpStatus.BAD_REQUEST);
    }

    const existingOffer = await this.offerRepo.findOne({
      where: { property_id: propertyId, buyer_id: buyerId, status: 'pending' }
    });
    if (existingOffer) {
      this.throwError('You already have a pending offer on this property', HttpStatus.BAD_REQUEST);
    }

    const offer = this.offerRepo.create({
      property_id: propertyId,
      buyer_id: buyerId,
      seller_id: listing.seller_id,
      offer_price: dto.offer_price,
      message: dto.message,
      valid_until: dto.valid_until,
      status: 'pending'
    });
    await this.offerRepo.save(offer);

    await this.analyticsRepo.increment({ property_id: propertyId }, 'total_offers', 1);
    await this.analyticsRepo.increment({ property_id: propertyId }, 'offers_last_7_days', 1);

    if (listing.status === PropertyStatus.PUBLISHED) {
      listing.status = PropertyStatus.OFFER_RECEIVED;
      await this.listingRepo.save(listing);
    }

    return {
      success: true,
      data: { offer_id: offer.offer_id, property_id: offer.property_id, offer_price: offer.offer_price, status: offer.status },
      message: "Offer submitted successfully"
    };
  }

  async getSellerOffers(propertyId: string, sellerId: string) {
    await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    const offers = await this.offerRepo.createQueryBuilder('offer')
      .leftJoinAndSelect('offer.buyer', 'buyer')
      .where('offer.property_id = :propertyId', { propertyId })
      .orderBy('offer.created_at', 'DESC')
      .getMany();

    const data = offers.map(o => {
      const isExpired = new Date(o.valid_until) < new Date();
      return {
        ...o,
        status: isExpired && o.status === 'pending' ? 'expired' : o.status,
        buyer: {
          first_name: o.buyer?.fullName?.split(' ')[0] || '',
          last_name: o.buyer?.fullName?.split(' ')[1] || '',
          email: o.buyer?.email
        }
      };
    });

    return {
      success: true,
      data: { offers: data, total: data.length }
    };
  }

  async acceptOffer(propertyId: string, offerId: string, sellerId: string) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    const offer = await this.offerRepo.findOne({ where: { offer_id: offerId } });
    if (!offer) {
      this.throwError('Offer not found', HttpStatus.NOT_FOUND);
    }
    if (offer.property_id !== propertyId) {
      this.throwError('Offer does not belong to this property', HttpStatus.BAD_REQUEST);
    }

    if (offer.status !== 'pending') {
      this.throwError('This offer is no longer pending', HttpStatus.BAD_REQUEST);
    }

    offer.status = 'accepted';
    await this.offerRepo.save(offer);

    await this.offerRepo.createQueryBuilder()
      .update(Offer)
      .set({ status: 'rejected' })
      .where('property_id = :propertyId', { propertyId })
      .andWhere('offer_id != :offerId', { offerId })
      .andWhere('status = :status', { status: 'pending' })
      .execute();

    listing.status = PropertyStatus.UNDER_CONTRACT;
    await this.listingRepo.save(listing);

    return {
      success: true,
      data: {
        offer_id: offer.offer_id,
        listing_status: listing.status,
        message: "Offer accepted. Other pending offers rejected."
      }
    };
  }

  async rejectOffer(propertyId: string, offerId: string, sellerId: string) {
    await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    const offer = await this.offerRepo.findOne({ where: { offer_id: offerId } });
    if (!offer) {
      this.throwError('Offer not found', HttpStatus.NOT_FOUND);
    }
    if (offer.status !== 'pending') {
      this.throwError('Only pending offers can be rejected', HttpStatus.BAD_REQUEST);
    }

    offer.status = 'rejected';
    await this.offerRepo.save(offer);

    return {
      success: true,
      data: { offer_id: offer.offer_id, status: offer.status }
    };
  }

  async markSold(propertyId: string, sellerId: string) {
    const listing = await this.getListingAndVerifyOwnership(propertyId, { sub: sellerId });

    if (![PropertyStatus.UNDER_CONTRACT, PropertyStatus.PUBLISHED, PropertyStatus.OFFER_RECEIVED].includes(listing.status)) {
      this.throwError('Cannot mark this listing as sold', HttpStatus.BAD_REQUEST);
    }

    listing.status = PropertyStatus.SOLD;
    await this.listingRepo.save(listing);

    return {
      success: true,
      data: { property_id: listing.property_id, status: listing.status },
      message: "Listing marked as sold"
    };
  }

  async refreshAnalytics(propertyId?: string) {
    const query = this.listingRepo.createQueryBuilder('listing')
      .where('listing.status = :status', { status: PropertyStatus.PUBLISHED });

    if (propertyId) {
      query.andWhere('listing.property_id = :propertyId', { propertyId });
    }

    const listings = await query.getMany();
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    for (const listing of listings) {
      const pId = listing.property_id;

      const views_last_7_days = await this.recentlyViewedRepo.createQueryBuilder('rv')
        .where('rv.property_id = :pId', { pId })
        .andWhere('rv.viewed_at >= :date', { date: sevenDaysAgo })
        .getCount();

      const saves_last_7_days = await this.savedPropertyRepo.createQueryBuilder('sp')
        .where('sp.property_id = :pId', { pId })
        .andWhere('sp.saved_at >= :date', { date: sevenDaysAgo })
        .getCount();

      const inquiries_last_7_days = await this.inquiryRepo.createQueryBuilder('inq')
        .where('inq.property_id = :pId', { pId })
        .andWhere('inq.created_at >= :date', { date: sevenDaysAgo })
        .getCount();

      const offers_last_7_days = await this.offerRepo.createQueryBuilder('off')
        .where('off.property_id = :pId', { pId })
        .andWhere('off.created_at >= :date', { date: sevenDaysAgo })
        .getCount();

      await this.analyticsRepo.update(
        { property_id: pId },
        {
          views_last_7_days,
          saves_last_7_days,
          inquiries_last_7_days,
          offers_last_7_days,
          last_updated: new Date()
        }
      );
    }

    return {
      success: true,
      data: { refreshed_count: listings.length, timestamp: new Date() },
      message: "Analytics refreshed successfully"
    };
  }

}

