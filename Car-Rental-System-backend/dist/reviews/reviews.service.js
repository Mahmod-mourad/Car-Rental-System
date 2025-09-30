"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../database/entities/review.entity");
const booking_entity_1 = require("../database/entities/booking.entity");
const user_entity_1 = require("../database/entities/user.entity");
const vehicle_entity_1 = require("../database/entities/vehicle.entity");
let ReviewsService = class ReviewsService {
    reviewsRepository;
    bookingsRepository;
    usersRepository;
    vehiclesRepository;
    constructor(reviewsRepository, bookingsRepository, usersRepository, vehiclesRepository) {
        this.reviewsRepository = reviewsRepository;
        this.bookingsRepository = bookingsRepository;
        this.usersRepository = usersRepository;
        this.vehiclesRepository = vehiclesRepository;
    }
    mapToDto(review) {
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
    async create(createReviewDto, userId) {
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
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.user.id !== userId) {
            throw new common_1.ForbiddenException('You can only review your own bookings');
        }
        if (booking.status !== booking_entity_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('You can only review completed bookings');
        }
        const existingReview = await this.reviewsRepository.findOne({
            where: { booking_id: createReviewDto.booking_id },
        });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this booking');
        }
        const review = this.reviewsRepository.create({
            rating: createReviewDto.rating,
            comment: createReviewDto.comment,
            user: { id: userId },
            vehicle: { id: booking.vehicle.id },
            booking: { id: booking.id },
            created_at: new Date(),
        });
        const savedReview = await this.reviewsRepository.save(review);
        await this.updateVehicleRating(booking.vehicle.id);
        return this.mapToDto(savedReview);
    }
    async findAll(vehicleId, userId) {
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
    async findOne(id) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user', 'vehicle'],
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        return this.mapToDto(review);
    }
    async update(id, updateReviewDto, userId, isAdmin = false) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['user', 'vehicle'],
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        if (review.user_id !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to update this review');
        }
        if (updateReviewDto.rating) {
            review.rating = updateReviewDto.rating;
        }
        if (updateReviewDto.comment !== undefined) {
            review.comment = updateReviewDto.comment;
        }
        review.updated_at = new Date();
        const updatedReview = await this.reviewsRepository.save(review);
        if (updateReviewDto.rating) {
            await this.updateVehicleRating(review.vehicle_id);
        }
        return this.mapToDto(updatedReview);
    }
    async remove(id, userId, isAdmin = false) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: ['vehicle'],
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        if (review.user_id !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to delete this review');
        }
        const vehicleId = review.vehicle_id;
        await this.reviewsRepository.remove(review);
        await this.updateVehicleRating(vehicleId);
    }
    async addResponse(reviewId, response, userId) {
        const review = await this.reviewsRepository.findOne({
            where: { id: reviewId },
            relations: ['vehicle', 'vehicle.owner', 'user'],
        });
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${reviewId} not found`);
        }
        if (review.vehicle.owner.id !== userId) {
            throw new common_1.ForbiddenException('Only the vehicle owner can respond to reviews');
        }
        review.response = {
            comment: response.comment,
            responded_at: new Date(),
        };
        const updatedReview = await this.reviewsRepository.save(review);
        return this.mapToDto(updatedReview);
    }
    async updateVehicleRating(vehicleId) {
        const result = await this.reviewsRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .addSelect('COUNT(review.id)', 'count')
            .where('review.vehicle_id = :vehicleId', { vehicleId })
            .getRawOne();
        await this.vehiclesRepository.update(vehicleId, {
            average_rating: parseFloat(result.average) || 0,
            review_count: parseInt(result.count, 10) || 0,
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map