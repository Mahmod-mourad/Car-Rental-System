import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../database/entities/review.entity';
import { Booking, BookingStatus } from '../database/entities/booking.entity';
import { User } from '../database/entities/user.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewResponseDto, ReviewDto } from './dto/review-response.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewsRepository: Repository<Review>,
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
  ) {}

  private mapToDto(review: Review): ReviewDto {
    const userName = review.user?.profile 
      ? `${review.user.profile.first_name || ''} ${review.user.profile.last_name || ''}`.trim()
      : review.user?.email || 'Unknown User';
      
    const vehicleName = review.vehicle
      ? `${review.vehicle.make || ''} ${review.vehicle.model || ''}`.trim()
      : 'Unknown Vehicle';

    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      response: review.response,
      created_at: review.created_at,
      updated_at: review.updated_at,
      user_id: review.user_id,
      user_name: userName,
      vehicle_id: review.vehicle_id,
      vehicle_name: vehicleName,
      booking_id: review.booking_id,
    };
  }

  async create(createReviewDto: CreateReviewDto, userId: string): Promise<ReviewDto> {
    // Check if the booking exists and is completed
    const booking = await this.bookingsRepository.findOne({
      where: { id: createReviewDto.booking_id },
      relations: [
        'user', 
        'user.profile',
        'vehicle', 
        'vehicle.owner',
        'vehicle.owner.profile'
      ],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if the booking belongs to the user
    if (booking.user.id !== userId) {
      throw new ForbiddenException('You can only review your own bookings');
    }

    // Check if the booking is completed
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('You can only review completed bookings');
    }

    // Check if a review already exists for this booking
    const existingReview = await this.reviewsRepository.findOne({
      where: { booking_id: createReviewDto.booking_id },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this booking');
    }

    // Create the review
    const review = this.reviewsRepository.create({
      rating: createReviewDto.rating,
      comment: createReviewDto.comment,
      user: { id: userId },
      vehicle: { id: booking.vehicle.id },
      booking: { id: booking.id },
      created_at: new Date(),
    });

    const savedReview = await this.reviewsRepository.save(review);
    
    // Update vehicle's average rating and review count
    await this.updateVehicleRating(booking.vehicle.id);

    return this.mapToDto(savedReview);
  }

  async findAll(vehicleId?: string, userId?: string): Promise<ReviewDto[]> {
    const query = this.reviewsRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .leftJoinAndSelect('review.vehicle', 'vehicle')
      .orderBy('review.created_at', 'DESC');

    if (vehicleId) {
      query.andWhere('review.vehicle_id = :vehicleId', { vehicleId });
    }

    if (userId) {
      query.andWhere('review.user_id = :userId', { userId });
    }

    const reviews = await query.getMany();
    return reviews.map(review => this.mapToDto(review));
  }

  async findOne(id: string): Promise<ReviewDto> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return this.mapToDto(review);
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string, isAdmin = false): Promise<ReviewDto> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['user', 'vehicle'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Check if the user is the owner of the review or an admin
    if (review.user_id !== userId && !isAdmin) {
      throw new ForbiddenException('You are not authorized to update this review');
    }

    // Only allow updating rating and comment
    if (updateReviewDto.rating) {
      review.rating = updateReviewDto.rating;
    }
    
    if (updateReviewDto.comment !== undefined) {
      review.comment = updateReviewDto.comment;
    }

    review.updated_at = new Date();
    const updatedReview = await this.reviewsRepository.save(review);

    // Update vehicle's average rating if rating was changed
    if (updateReviewDto.rating) {
      await this.updateVehicleRating(review.vehicle_id);
    }

    return this.mapToDto(updatedReview);
  }

  async remove(id: string, userId: string, isAdmin = false): Promise<void> {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: ['vehicle'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    // Check if the user is the owner of the review or an admin
    if (review.user_id !== userId && !isAdmin) {
      throw new ForbiddenException('You are not authorized to delete this review');
    }

    const vehicleId = review.vehicle_id;
    await this.reviewsRepository.remove(review);

    // Update vehicle's average rating and review count
    await this.updateVehicleRating(vehicleId);
  }

  async addResponse(reviewId: string, response: { comment: string }, userId: string): Promise<ReviewDto> {
    const review = await this.reviewsRepository.findOne({
      where: { id: reviewId },
      relations: ['vehicle', 'vehicle.owner', 'user'],
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${reviewId} not found`);
    }

    // Check if the user is the owner of the vehicle
    if (review.vehicle.owner.id !== userId) {
      throw new ForbiddenException('Only the vehicle owner can respond to reviews');
    }

    // Add or update the response
    review.response = {
      comment: response.comment,
      responded_at: new Date(),
    };

    const updatedReview = await this.reviewsRepository.save(review);
    return this.mapToDto(updatedReview);
  }

  private async updateVehicleRating(vehicleId: string): Promise<void> {
    // Calculate new average rating and review count
    const result = await this.reviewsRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .addSelect('COUNT(review.id)', 'count')
      .where('review.vehicle_id = :vehicleId', { vehicleId })
      .getRawOne();

    // Update the vehicle
    await this.vehiclesRepository.update(vehicleId, {
      average_rating: parseFloat(result.average) || 0,
      review_count: parseInt(result.count, 10) || 0,
    });
  }
}
