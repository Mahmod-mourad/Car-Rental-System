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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDto = exports.ReviewResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class ReviewResponseDto {
    comment;
    responded_at;
}
exports.ReviewResponseDto = ReviewResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Response comment from the owner' }),
    __metadata("design:type", String)
], ReviewResponseDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the response was created' }),
    __metadata("design:type", Date)
], ReviewResponseDto.prototype, "responded_at", void 0);
class ReviewDto {
    id;
    rating;
    comment;
    response;
    created_at;
    updated_at;
    user_id;
    user_name;
    vehicle_id;
    vehicle_name;
    booking_id;
}
exports.ReviewDto = ReviewDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier of the review' }),
    __metadata("design:type", String)
], ReviewDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 }),
    __metadata("design:type", Number)
], ReviewDto.prototype, "rating", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Optional review comment', required: false }),
    __metadata("design:type", String)
], ReviewDto.prototype, "comment", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Optional response from the vehicle owner', type: ReviewResponseDto, required: false }),
    __metadata("design:type", ReviewResponseDto)
], ReviewDto.prototype, "response", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the review was created' }),
    __metadata("design:type", Date)
], ReviewDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When the review was last updated', required: false }),
    __metadata("design:type", Date)
], ReviewDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the user who created the review' }),
    __metadata("design:type", String)
], ReviewDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the user who created the review' }),
    __metadata("design:type", String)
], ReviewDto.prototype, "user_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the vehicle being reviewed' }),
    __metadata("design:type", String)
], ReviewDto.prototype, "vehicle_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Make and model of the vehicle being reviewed' }),
    __metadata("design:type", String)
], ReviewDto.prototype, "vehicle_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the booking this review is for' }),
    __metadata("design:type", String)
], ReviewDto.prototype, "booking_id", void 0);
//# sourceMappingURL=review-response.dto.js.map