import { Controller, Get, Post, Delete, Param, Query, Req, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PropertyListingService } from './property-listing.service';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth-identity/guards/jwt-auth.guard';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Public } from '../auth-identity/decorators/public.decorator';


@ApiTags('Public Properties')
@Controller('api/properties')
export class PublicListingController {
  constructor(
    private readonly propertyListingService: PropertyListingService,
  ) {}

  private extractOptionalUser(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = Buffer.from(token.split('.')[1], 'base64').toString();
        const decoded = JSON.parse(payload);
        return decoded?.sub || decoded?.userId || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private extractSession(req: Request): string | null {
    return (req.headers['x-session-id'] as string) || null;
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get top 4 featured properties for home page' })
  getFeaturedListings() {
    return this.propertyListingService.getFeaturedListings();
  }

  @Public()
  @Get('recently-viewed/list')
  @ApiOperation({ summary: 'Get recently viewed properties' })
  getRecentlyViewed(@Req() req: Request) {
    const userId = this.extractOptionalUser(req);
    const sessionId = this.extractSession(req);
    return this.propertyListingService.getRecentlyViewed(userId, sessionId);
  }

  @Get('user/saved')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all saved properties for logged in user' })
  getSavedProperties(@Req() req: any) {
    const user = req.user;
    return this.propertyListingService.getSavedProperties(user.sub || user.userId);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Browse and search published properties' })
  @ApiQuery({ name: 'city', required: false })
  @ApiQuery({ name: 'property_type', required: false })
  @ApiQuery({ name: 'listing_type', required: false })
  @ApiQuery({ name: 'min_price', required: false, type: Number })
  @ApiQuery({ name: 'max_price', required: false, type: Number })
  @ApiQuery({ name: 'bedrooms', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getPublicListings(@Query() filters: any) {
    return this.propertyListingService.getPublicListings(filters);
  }

  @Public()
  @Get(':property_id')
  @ApiOperation({ summary: 'Get full property detail' })
  getPublicListingDetail(
    @Param('property_id') propertyId: string,
    @Req() req: Request,
  ) {
    const userId = this.extractOptionalUser(req);
    const sessionId = this.extractSession(req);
    return this.propertyListingService.getPublicListingDetail(propertyId, userId, sessionId);
  }

  @Post(':property_id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Save a property to favourites' })
  saveProperty(
    @Param('property_id') propertyId: string,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.propertyListingService.saveProperty(propertyId, user.sub || user.userId);
  }

  @Delete(':property_id/save')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Remove property from favourites' })
  unsaveProperty(
    @Param('property_id') propertyId: string,
    @Req() req: any,
  ) {
    const user = req.user;
    return this.propertyListingService.unsaveProperty(propertyId, user.sub || user.userId);
  }

  @Post(':property_id/inquiry')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit inquiry to seller' })
  submitInquiry(
    @Param('property_id') propertyId: string,
    @Req() req: any,
    @Body() dto: CreateInquiryDto,
  ) {
    const user = req.user;
    return this.propertyListingService.submitInquiry(propertyId, user.sub || user.userId, dto);
  }

  @Post(':property_id/offer')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Submit offer on property' })
  submitOffer(
    @Param('property_id') propertyId: string,
    @Req() req: any,
    @Body() dto: CreateOfferDto,
  ) {
    const user = req.user;
    return this.propertyListingService.submitOffer(propertyId, user.sub || user.userId, dto);
  }
}
