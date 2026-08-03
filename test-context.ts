import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { PropertyListingService } from './src/property-listing/property-listing.service';
import { User } from './src/auth-identity/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PropertyListing } from './src/property-listing/entities/property-listing.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const service = app.get(PropertyListingService);
  
  const listing = await app.get(getRepositoryToken(PropertyListing)).findOne({ where: {} });
  if (listing) {
    const res = await service.getSellerListings(listing.seller_id);
    console.log(JSON.stringify(res, null, 2));
  } else {
    console.log("no user");
  }
  await app.close();
}
bootstrap().catch(console.error);
