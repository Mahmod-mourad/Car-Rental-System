import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { BaseRepository } from './base.repository';
export declare class ReviewRepository extends BaseRepository<Review> {
    private readonly reviewRepository;
    constructor(reviewRepository: Repository<Review>);
    findVehicleReviews(vehicleId: string): Promise<Review[]>;
    findUserReviews(userId: string): Promise<Review[]>;
    getAverageRating(vehicleId: string): Promise<number>;
    addResponse(reviewId: string, response: {
        comment: string;
        respondedAt: Date;
    }): Promise<void>;
    findRecentReviews(limit?: number): Promise<Review[]>;
}
