import { Controller, Post, Get, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { PropertyListingService } from './property-listing.service';
import { BasicDetailsDto } from './dto/basic-details.dto';
import { LocationDto } from './dto/location.dto';
import { PropertyDetailsDto } from './dto/property-details.dto';
import { MediaUploadDto } from './dto/media-upload.dto';
import { DocumentUploadDto } from './dto/document-upload.dto';
import { AvailabilityDto } from './dto/availability.dto';
import { VerificationDto } from './dto/verification.dto';
import { RejectListingDto } from './dto/reject-listing.dto';
import { GetUser } from '../auth-identity/decorators/get-user.decorator';
import { RolesGuard } from '../auth-identity/guards/roles.guard';
import { JwtAuthGuard } from '../auth-identity/guards/jwt-auth.guard';
import { Roles } from '../auth-identity/decorators/roles.decorator';

@ApiTags('Listings')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('api/listings')
export class PropertyListingController {
  constructor(private readonly propertyListingService: PropertyListingService) {}

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Create a new draft listing' })
  @ApiResponse({ status: 201, description: 'Listing created successfully' })
  createListing(@GetUser() user: any) {
    return this.propertyListingService.createListing(user);
  }

  @Post(':property_id/basic-details')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Save basic details for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  saveBasicDetails(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
    @Body() dto: BasicDetailsDto,
  ) {
    return this.propertyListingService.saveBasicDetails(propertyId, user, dto);
  }

  @Get(':property_id/basic-details')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Get basic details of a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  getBasicDetails(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getBasicDetails(propertyId, user);
  }

  @Post(':property_id/location')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Save location details for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  saveLocation(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
    @Body() dto: LocationDto,
  ) {
    return this.propertyListingService.saveLocation(propertyId, user, dto);
  }

  @Get(':property_id/location')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Get location details of a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  getLocation(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getLocation(propertyId, user);
  }

  @Get(':property_id/progress')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Get the progress of a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  getProgress(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getProgress(propertyId, user);
  }

  @Post(':property_id/details')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Save property details for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  saveDetails(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
    @Body() dto: PropertyDetailsDto,
  ) {
    return this.propertyListingService.saveDetails(propertyId, user, dto);
  }

  @Get(':property_id/details')
  @ApiOperation({ summary: 'Get property details of a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  getDetails(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getDetails(propertyId, user);
  }

  @Post(':property_id/media')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Upload media for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    dest: './uploads/media',
  }))
  uploadMedia(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
    @UploadedFile() file: any,
    @Body() dto: MediaUploadDto,
  ) {
    return this.propertyListingService.uploadMedia(propertyId, user, file, dto);
  }

  @Delete(':property_id/media/:media_id')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Delete media from a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  @ApiParam({ name: 'media_id', description: 'The ID of the media' })
  deleteMedia(
    @Param('property_id') propertyId: string,
    @Param('media_id') mediaId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.deleteMedia(propertyId, mediaId, user);
  }

  @Get(':property_id/media')
  @ApiOperation({ summary: 'Get media for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  getMedia(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getMedia(propertyId, user);
  }

  @Post(':property_id/documents')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Upload document for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', {
    dest: './uploads/documents',
  }))
  uploadDocument(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
    @UploadedFile() file: any,
    @Body() dto: DocumentUploadDto,
  ) {
    return this.propertyListingService.uploadDocument(propertyId, user, file, dto);
  }

  @Get(':property_id/documents')
  @ApiOperation({ summary: 'Get documents for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  getDocuments(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getDocuments(propertyId, user);
  }

  @Post(':property_id/availability')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Save availability details for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  saveAvailability(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
    @Body() dto: AvailabilityDto,
  ) {
    return this.propertyListingService.saveAvailability(propertyId, user, dto);
  }

  @Get(':property_id/availability')
  @ApiOperation({ summary: 'Get availability details for a listing' })
  @ApiParam({ name: 'property_id', description: 'The ID of the property' })
  getAvailability(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getAvailability(propertyId, user);
  }

  @Post(':property_id/ai-review')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Generate AI review for listing' })
  triggerAIReview(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.triggerAIReview(propertyId, user.sub || user.userId);
  }

  @Get(':property_id/ai-review')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Get saved AI review' })
  getAIReview(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getAIReview(propertyId, user.sub || user.userId);
  }

  @Post(':property_id/verification')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Save verification info' })
  saveVerification(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
    @Body() dto: VerificationDto,
  ) {
    return this.propertyListingService.saveVerification(propertyId, user.sub || user.userId, dto);
  }

  @Post(':property_id/submit')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiOperation({ summary: 'Submit listing for admin review' })
  submitListing(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.submitListing(propertyId, user.sub || user.userId);
  }

  @Post('admin/:property_id/approve')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Approve and publish a listing' })
  approveListing(
    @Param('property_id') propertyId: string,
  ) {
    return this.propertyListingService.approveListing(propertyId);
  }

  @Post('admin/:property_id/reject')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Reject a submitted listing' })
  rejectListing(
    @Param('property_id') propertyId: string,
    @Body() dto: RejectListingDto,
  ) {
    return this.propertyListingService.rejectListing(propertyId, dto.reason);
  }

  @Get('seller/my-listings')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all listings grouped by status' })
  getSellerListings(@GetUser() user: any) {
    return this.propertyListingService.getSellerListings(user.sub || user.userId);
  }

  @Get('seller/:property_id/analytics')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get analytics for a specific listing' })
  getSellerListingAnalytics(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getSellerListingAnalytics(propertyId, user.sub || user.userId);
  }

  @Get(':property_id/inquiries')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all inquiries for listing' })
  getSellerInquiries(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getSellerInquiries(propertyId, user.sub || user.userId);
  }

  @Patch('inquiries/:inquiry_id/read')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark inquiry as read' })
  markInquiryRead(
    @Param('inquiry_id') inquiryId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.markInquiryRead(inquiryId, user.sub || user.userId);
  }

  @Get(':property_id/offers')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get all offers for listing' })
  getSellerOffers(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.getSellerOffers(propertyId, user.sub || user.userId);
  }

  @Post(':property_id/offers/:offer_id/accept')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Accept an offer' })
  acceptOffer(
    @Param('property_id') propertyId: string,
    @Param('offer_id') offerId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.acceptOffer(propertyId, offerId, user.sub || user.userId);
  }

  @Post(':property_id/offers/:offer_id/reject')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Reject an offer' })
  rejectOffer(
    @Param('property_id') propertyId: string,
    @Param('offer_id') offerId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.rejectOffer(propertyId, offerId, user.sub || user.userId);
  }

  @Post(':property_id/mark-sold')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Mark listing as sold' })
  markSold(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.markSold(propertyId, user.sub || user.userId);
  }

  @Post('admin/analytics/refresh')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Manually trigger analytics refresh' })
  refreshAnalytics(
    @Body() body: { property_id?: string },
  ) {
    return this.propertyListingService.refreshAnalytics(body.property_id);
  }

  @Delete(':property_id')
  @UseGuards(RolesGuard)
  @Roles('seller', 'buyer', 'admin')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a listing entirely' })
  deleteListing(
    @Param('property_id') propertyId: string,
    @GetUser() user: any,
  ) {
    return this.propertyListingService.deleteListing(propertyId, user.sub || user.userId);
  }

}

