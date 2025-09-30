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
exports.Vehicle = exports.FuelType = exports.TransmissionType = exports.VehicleType = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
const review_entity_1 = require("./review.entity");
var VehicleType;
(function (VehicleType) {
    VehicleType["SEDAN"] = "sedan";
    VehicleType["SUV"] = "suv";
    VehicleType["TRUCK"] = "truck";
    VehicleType["VAN"] = "van";
    VehicleType["LUXURY"] = "luxury";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var TransmissionType;
(function (TransmissionType) {
    TransmissionType["AUTOMATIC"] = "automatic";
    TransmissionType["MANUAL"] = "manual";
})(TransmissionType || (exports.TransmissionType = TransmissionType = {}));
var FuelType;
(function (FuelType) {
    FuelType["GASOLINE"] = "gasoline";
    FuelType["DIESEL"] = "diesel";
    FuelType["ELECTRIC"] = "electric";
    FuelType["HYBRID"] = "hybrid";
})(FuelType || (exports.FuelType = FuelType = {}));
let Vehicle = class Vehicle {
    id;
    make;
    model;
    year;
    type;
    transmission;
    fuel_type;
    seats;
    price_per_day;
    available;
    average_rating;
    review_count;
    is_featured;
    location;
    images;
    features;
    created_at;
    updated_at;
    owner;
    owner_id;
    bookings;
    reviews;
};
exports.Vehicle = Vehicle;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Vehicle.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "make", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vehicle.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Vehicle.prototype, "year", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: VehicleType,
    }),
    __metadata("design:type", String)
], Vehicle.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransmissionType,
    }),
    __metadata("design:type", String)
], Vehicle.prototype, "transmission", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: FuelType,
    }),
    __metadata("design:type", String)
], Vehicle.prototype, "fuel_type", void 0);
__decorate([
    (0, typeorm_1.Column)('int'),
    __metadata("design:type", Number)
], Vehicle.prototype, "seats", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "price_per_day", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: true }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "available", void 0);
__decorate([
    (0, typeorm_1.Column)('decimal', { precision: 3, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "average_rating", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { default: 0 }),
    __metadata("design:type", Number)
], Vehicle.prototype, "review_count", void 0);
__decorate([
    (0, typeorm_1.Column)('boolean', { default: false }),
    __metadata("design:type", Boolean)
], Vehicle.prototype, "is_featured", void 0);
__decorate([
    (0, typeorm_1.Column)('geometry', {
        type: 'point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", Object)
], Vehicle.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { array: true, default: [] }),
    __metadata("design:type", Array)
], Vehicle.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.Column)('jsonb', { nullable: true }),
    __metadata("design:type", Object)
], Vehicle.prototype, "features", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], Vehicle.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)('timestamp'),
    __metadata("design:type", Date)
], Vehicle.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.vehicles),
    (0, typeorm_1.JoinColumn)({ name: 'owner_id' }),
    __metadata("design:type", user_entity_1.User)
], Vehicle.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Vehicle.prototype, "owner_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)('Booking', (booking) => booking.vehicle, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], Vehicle.prototype, "bookings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (review) => review.vehicle),
    __metadata("design:type", Array)
], Vehicle.prototype, "reviews", void 0);
exports.Vehicle = Vehicle = __decorate([
    (0, typeorm_1.Entity)('vehicles')
], Vehicle);
//# sourceMappingURL=vehicle.entity.js.map