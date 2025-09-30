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
exports.CreateVehicleDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const vehicle_entity_1 = require("../../database/entities/vehicle.entity");
class CreateVehicleDto {
    make;
    model;
    year;
    type;
    transmission;
    fuel_type;
    seats;
    price_per_day;
    available;
    images;
    features;
    location;
    owner_id;
}
exports.CreateVehicleDto = CreateVehicleDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "make", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "model", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "year", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: vehicle_entity_1.VehicleType }),
    (0, class_validator_1.IsEnum)(vehicle_entity_1.VehicleType),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: vehicle_entity_1.TransmissionType }),
    (0, class_validator_1.IsEnum)(vehicle_entity_1.TransmissionType),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "transmission", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: vehicle_entity_1.FuelType }),
    (0, class_validator_1.IsEnum)(vehicle_entity_1.FuelType),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "fuel_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "seats", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateVehicleDto.prototype, "price_per_day", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, default: true }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateVehicleDto.prototype, "available", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateVehicleDto.prototype, "images", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        type: Object,
        additionalProperties: { type: 'any' },
        example: { hasGPS: true, hasBluetooth: true }
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateVehicleDto.prototype, "features", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        type: Object,
        example: { lat: 37.7749, lng: -122.4194 },
        description: 'Geographic coordinates of the vehicle location'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateVehicleDto.prototype, "location", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateVehicleDto.prototype, "owner_id", void 0);
//# sourceMappingURL=create-vehicle.dto.js.map