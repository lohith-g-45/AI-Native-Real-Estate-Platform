import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PropertyListingService } from './property-listing.service';

@Injectable()
export class AnalyticsCronService {
  private readonly logger = new Logger(AnalyticsCronService.name);

  constructor(private readonly propertyListingService: PropertyListingService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDailyAnalyticsRefresh() {
    this.logger.log('Running daily analytics refresh...');
    try {
      await this.propertyListingService.refreshAnalytics();
      this.logger.log('Daily analytics refresh completed.');
    } catch (error) {
      this.logger.error('Analytics cron job failed:', error.message);
      // Never throw — cron must not crash the application
    }
  }
}
