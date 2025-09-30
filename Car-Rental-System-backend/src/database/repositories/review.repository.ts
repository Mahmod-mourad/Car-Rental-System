import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class ReviewRepository extends BaseRepository<Review> {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {
    super(reviewRepository);
  }

  async findVehicleReviews(vehicleId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { vehicle_id: vehicleId },
      relations: ['user', 'vehicle'],
      order: { created_at: 'DESC' },
    });
  }

  async findUserReviews(userId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { user_id: userId },
      relations: ['vehicle'],
      order: { created_at: 'DESC' },
    });
  }

  async getAverageRating(vehicleId: string): Promise<number> {
    const result = await this.reviewRepository
      .createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.vehicle_id = :vehicleId', { vehicleId })
      .getRawOne();

    return parseFloat(result.average) || 0;
  }

  async addResponse(
    reviewId: string,
    response: { comment: string; respondedAt: Date },
  ): Promise<void> {
    await this.reviewRepository.update(reviewId, {
      response,
    });
  }

  async findRecentReviews(limit = 5): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['user', 'vehicle'],
      order: { created_at: 'DESC' },
      take: limit,
    });
  }
}
