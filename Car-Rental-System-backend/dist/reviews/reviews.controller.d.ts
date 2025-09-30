import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewDto } from './dto/review-response.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(createReviewDto: CreateReviewDto, req: any): Promise<ReviewDto>;
    findAll(vehicleId?: string, userId?: string, req?: any): Promise<ReviewDto[]>;
    findOne(id: string): Promise<ReviewDto>;
    update(id: string, updateReviewDto: UpdateReviewDto, req: any): Promise<ReviewDto>;
    remove(id: string, req: any): Promise<void>;
    addResponse(id: string, comment: string, req: any): Promise<ReviewDto>;
}
