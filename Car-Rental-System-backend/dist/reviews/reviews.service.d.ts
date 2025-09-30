import { Repository } from 'typeorm';
import { Review } from '../database/entities/review.entity';
import { Booking } from '../database/entities/booking.entity';
import { User } from '../database/entities/user.entity';
import { Vehicle } from '../database/entities/vehicle.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewDto } from './dto/review-response.dto';
export declare class ReviewsService {
    private reviewsRepository;
    private bookingsRepository;
    private usersRepository;
    private vehiclesRepository;
    constructor(reviewsRepository: Repository<Review>, bookingsRepository: Repository<Booking>, usersRepository: Repository<User>, vehiclesRepository: Repository<Vehicle>);
    private mapToDto;
    create(createReviewDto: CreateReviewDto, userId: string): Promise<ReviewDto>;
    findAll(vehicleId?: string, userId?: string): Promise<ReviewDto[]>;
    findOne(id: string): Promise<ReviewDto>;
    update(id: string, updateReviewDto: UpdateReviewDto, userId: string, isAdmin?: boolean): Promise<ReviewDto>;
    remove(id: string, userId: string, isAdmin?: boolean): Promise<void>;
    addResponse(reviewId: string, response: {
        comment: string;
    }, userId: string): Promise<ReviewDto>;
    private updateVehicleRating;
}
