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
exports.ReviewRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const review_entity_1 = require("../entities/review.entity");
const base_repository_1 = require("./base.repository");
let ReviewRepository = class ReviewRepository extends base_repository_1.BaseRepository {
    reviewRepository;
    constructor(reviewRepository) {
        super(reviewRepository);
        this.reviewRepository = reviewRepository;
    }
    async findVehicleReviews(vehicleId) {
        return this.reviewRepository.find({
            where: { vehicle_id: vehicleId },
            relations: ['user', 'vehicle'],
            order: { created_at: 'DESC' },
        });
    }
    async findUserReviews(userId) {
        return this.reviewRepository.find({
            where: { user_id: userId },
            relations: ['vehicle'],
            order: { created_at: 'DESC' },
        });
    }
    async getAverageRating(vehicleId) {
        const result = await this.reviewRepository
            .createQueryBuilder('review')
            .select('AVG(review.rating)', 'average')
            .where('review.vehicle_id = :vehicleId', { vehicleId })
            .getRawOne();
        return parseFloat(result.average) || 0;
    }
    async addResponse(reviewId, response) {
        await this.reviewRepository.update(reviewId, {
            response,
        });
    }
    async findRecentReviews(limit = 5) {
        return this.reviewRepository.find({
            relations: ['user', 'vehicle'],
            order: { created_at: 'DESC' },
            take: limit,
        });
    }
};
exports.ReviewRepository = ReviewRepository;
exports.ReviewRepository = ReviewRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_entity_1.Review)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ReviewRepository);
//# sourceMappingURL=review.repository.js.map