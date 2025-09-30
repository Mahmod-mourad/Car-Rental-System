import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewDto } from './dto/review-response.dto';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER)
  @ApiOperation({ summary: 'Create a new review' })
  @ApiResponse({ status: 201, description: 'The review has been successfully created.', type: ReviewDto })
  @ApiResponse({ status: 400, description: 'Invalid input or review already exists for this booking.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req): Promise<ReviewDto> {
    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews (optionally filtered by vehicle or user)' })
  @ApiResponse({ status: 200, description: 'Return all reviews.', type: [ReviewDto] })
  async findAll(
    @Query('vehicleId') vehicleId?: string,
    @Query('userId') userId?: string,
    @Request() req?
  ): Promise<ReviewDto[]> {
    // If userId is not provided and user is not admin, show only their reviews
    const effectiveUserId = userId || (req?.user?.role === UserRole.ADMIN ? undefined : req?.user?.userId);
    return this.reviewsService.findAll(vehicleId, effectiveUserId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({ status: 200, description: 'Return the review.', type: ReviewDto })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  findOne(@Param('id') id: string): Promise<ReviewDto> {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a review' })
  @ApiResponse({ status: 200, description: 'The review has been successfully updated.', type: ReviewDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req
  ): Promise<ReviewDto> {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return this.reviewsService.update(id, updateReviewDto, req.user.userId, isAdmin);
  }

  @Delete(':id')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete a review' })
  @ApiResponse({ status: 200, description: 'The review has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  remove(@Param('id') id: string, @Request() req): Promise<void> {
    const isAdmin = req.user.role === UserRole.ADMIN;
    return this.reviewsService.remove(id, req.user.userId, isAdmin);
  }

  @Post(':id/response')
  @Roles(UserRole.OWNER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Add or update a response to a review (vehicle owner only)' })
  @ApiResponse({ status: 200, description: 'The response has been added/updated.', type: ReviewDto })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Review not found.' })
  addResponse(
    @Param('id') id: string,
    @Body('comment') comment: string,
    @Request() req
  ): Promise<ReviewDto> {
    return this.reviewsService.addResponse(id, { comment }, req.user.userId);
  }
}
