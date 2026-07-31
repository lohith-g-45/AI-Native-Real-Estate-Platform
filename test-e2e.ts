// @ts-nocheck
import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PropertyListingService } from './src/property-listing/property-listing.service';

import { DataSource } from 'typeorm';

async function bootstrap() {
  console.log('Bootstrapping application context...');
  const app = await NestFactory.createApplicationContext(AppModule, { logger: false });
  const service = app.get(PropertyListingService);

  const dataSource = app.get(DataSource);
  const userRecord = await dataSource.query(`SELECT id FROM "users" LIMIT 1`);
  if (!userRecord || userRecord.length === 0) {
    console.error("No users found in database to test with!");
    return;
  }
  const mockUser = { sub: userRecord[0].id };
  let propertyId: string;

  try {
    console.log('\n--- 1. Creating Listing ---');
    const createRes = await service.createListing(mockUser);
    propertyId = createRes.data.property_id;
    console.log('Created Property ID:', propertyId);

    console.log('\n--- 2. Saving Basic Details ---');
    await service.saveBasicDetails(propertyId, mockUser, {
      title: 'Beautiful Family Home',
      listing_type: 'for_sale',
      property_category: 'residential',
      property_type: 'single_family',
      asking_price: 850000,
      currency: 'CAD',
      price_negotiable: true,
      description: 'A stunning home with a large backyard and updated kitchen.',
    });
    console.log('Basic details saved.');

    console.log('\n--- 3. Saving Location ---');
    await service.saveLocation(propertyId, mockUser, {
      street_address: '123 Maple Street',
      unit_number: '',
      city: 'Toronto',
      province: 'ON',
      postal_code: 'M4B 1B3',
      country: 'Canada',
      latitude: 43.70011,
      longitude: -79.4163,
    });
    console.log('Location saved.');

    console.log('\n--- 4. Saving Property Details ---');
    await service.saveDetails(propertyId, mockUser, {
      bedrooms: 4,
      bathrooms: 3,
      half_bathrooms: 1,
      square_feet: 2500,
      lot_size: 4000,
      year_built: 2010,
      floors: 2,
      property_condition: 'excellent',
    });
    console.log('Property details saved.');

    console.log('\n--- 5. Adding Media ---');
    const mockImage = {
      mimetype: 'image/jpeg',
      size: 50000,
      filename: 'test-image.jpg',
    };
    await service.uploadMedia(propertyId, mockUser, mockImage, { is_cover: true });
    console.log('Media uploaded.');

    console.log('\n--- 6. Adding Availability ---');
    await service.saveAvailability(propertyId, mockUser, {
      contact_name: 'John Doe',
      contact_email: 'john@example.com',
      contact_phone: '123-456-7890',
    });
    console.log('Availability saved.');

    console.log('\n--- 7. Triggering AI Review (This may take a moment) ---');
    const aiRes = await service.triggerAIReview(propertyId, mockUser.sub);
    console.log('AI Review Result Data:');
    console.log(JSON.stringify(aiRes.data, null, 2));

    console.log('\n--- 8. Saving Verification ---');
    const verifyRes = await service.saveVerification(propertyId, mockUser.sub, {
      govt_id_uploaded: true,
      phone_verified: true,
      email_verified: true,
    });
    console.log('Verification Result:', verifyRes.data);

    console.log('\n--- 9. Submitting Listing ---');
    const submitRes = await service.submitListing(propertyId, mockUser.sub);
    console.log('Submit Result:', submitRes.data);

    console.log('\n--- 10. Admin Approving Listing ---');
    const approveRes = await service.approveListing(propertyId);
    console.log('Approve Result:', approveRes.data);

    console.log('\nE2E Test Completed Successfully!');

  } catch (error: any) {
    console.error('\n!!! E2E Test Failed !!!');
    console.error(error.response || error.message || error);
  } finally {
    await app.close();
  }
}

bootstrap();
