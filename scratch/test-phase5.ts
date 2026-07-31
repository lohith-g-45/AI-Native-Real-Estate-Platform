// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PropertyListingService } from '../src/property-listing/property-listing.service';
import { DataSource } from 'typeorm';

async function bootstrap() {
  console.log('Bootstrapping application context...');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const service = app.get(PropertyListingService);
  const dataSource = app.get(DataSource);

  try {
    const users = await dataSource.query(`SELECT id FROM "users" LIMIT 2`);
    if (users.length < 1) {
      console.log("No users in DB");
      return;
    }
    const sellerId = users[0].id;
    const buyerId = users.length > 1 ? users[1].id : users[0].id;
    
    const publishedListings = await dataSource.query(`SELECT property_id, seller_id FROM "property_listings" WHERE status = 'published' LIMIT 1`);
    
    let propertyId;
    let actualSellerId;
    if (publishedListings.length > 0) {
      propertyId = publishedListings[0].property_id;
      actualSellerId = publishedListings[0].seller_id;
    } else {
      console.log("No published properties found in the DB. Run Phase 4 E2E test to create one first!");
      return;
    }
    
    console.log('\n--- TEST 1: Featured Properties ---');
    const featured = await service.getFeaturedListings();
    console.log(`Found ${featured.data.properties.length} featured properties.`);
    if (featured.data.properties.length > 0) {
      console.log(`Example: ${featured.data.properties[0].title} - Score: ${featured.data.properties[0].listing_quality_score}`);
    }

    console.log('\n--- TEST 2: Browse All Properties (City Filter) ---');
    const browse = await service.getPublicListings({ city: 'Toronto' });
    console.log(`Found ${browse.data.properties.length} properties in Toronto.`);

    console.log('\n--- TEST 3: Property Detail + View Tracking ---');
    const sessionId = 'test-session-' + Date.now();
    const detail1 = await service.getPublicListingDetail(propertyId, null, sessionId);
    console.log('Fetched Detail for property ID:', detail1.data.property_id);
    
    // Trigger another view
    await service.getPublicListingDetail(propertyId, null, sessionId);
    
    // Wait for setImmediate to execute background analytics updates
    await new Promise(r => setTimeout(r, 1000));

    console.log('\n--- TEST 4: Recently Viewed (Guest) ---');
    const recent = await service.getRecentlyViewed(null, sessionId);
    console.log(`Recently viewed items in this session: ${recent.data.properties.length}`);

    console.log('\n--- TEST 6: Save Property ---');
    const saveRes = await service.saveProperty(propertyId, buyerId);
    console.log('Save Result:', saveRes.data);

    console.log('\n--- TEST 7: Get Saved Properties ---');
    const saved = await service.getSavedProperties(buyerId);
    console.log(`Total saved properties for buyer: ${saved.data.total}`);

    console.log('\n--- TEST 8: Unsave Property ---');
    const unsaveRes = await service.unsaveProperty(propertyId, buyerId);
    console.log('Unsave Result:', unsaveRes.data);

    console.log('\n--- TEST 9: Seller My Listings ---');
    const myListings = await service.getSellerListings(actualSellerId);
    console.log(`Published listings for seller:`, myListings.data.published.length);

    console.log('\n--- TEST 10: Seller Analytics ---');
    console.log(`Verifying analytics with exact owner ID: ${actualSellerId}`);
    const analytics = await service.getSellerListingAnalytics(propertyId, String(actualSellerId).trim());
    console.log('Analytics Data:', analytics.data);

    console.log('\n✅ All Phase 5 Tests Completed Successfully!');
  } catch (error: any) {
    console.error('\n!!! Test Failed !!!');
    console.error(error.response || error.message || error);
  } finally {
    await app.close();
  }
}

bootstrap();
