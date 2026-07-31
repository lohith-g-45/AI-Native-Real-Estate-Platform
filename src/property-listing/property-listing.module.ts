import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyListing } from './entities/property-listing.entity';
import { ListingBasicDetails } from './entities/listing-basic-details.entity';
import { ListingLocation } from './entities/listing-location.entity';
import { ListingDetails } from './entities/listing-details.entity';
import { ListingMedia } from './entities/listing-media.entity';
import { ListingDocuments } from './entities/listing-documents.entity';
import { ListingAvailability } from './entities/listing-availability.entity';
import { ListingAiReview } from './entities/listing-ai-review.entity';
import { ListingVerification } from './entities/listing-verification.entity';
import { SavedProperty } from './entities/saved-property.entity';
import { RecentlyViewed } from './entities/recently-viewed.entity';
import { PropertyAnalytics } from './entities/property-analytics.entity';
import { Inquiry } from './entities/inquiry.entity';
import { Offer } from './entities/offer.entity';
import { PropertyListingController } from './property-listing.controller';
import { PropertyListingService } from './property-listing.service';
import { AIReviewService } from './services/ai-review.service';
import { PublicListingController } from './public-listing.controller';
import { AnalyticsCronService } from './analytics-cron.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyListing,
      ListingBasicDetails,
      ListingLocation,
      ListingDetails,
      ListingMedia,
      ListingDocuments,
      ListingAvailability,
      ListingAiReview,
      ListingVerification,
      SavedProperty,
      RecentlyViewed,
      PropertyAnalytics,
      Inquiry,
      Offer,
    ]),
  ],
  controllers: [PropertyListingController, PublicListingController],
  providers: [PropertyListingService, AIReviewService, AnalyticsCronService],
  exports: [TypeOrmModule, PropertyListingService],
})
export class PropertyListingModule {}
