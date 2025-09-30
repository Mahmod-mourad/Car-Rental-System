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
exports.VehicleRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("../entities/vehicle.entity");
const base_repository_1 = require("./base.repository");
let VehicleRepository = class VehicleRepository extends base_repository_1.BaseRepository {
    vehicleRepository;
    constructor(vehicleRepository) {
        super(vehicleRepository);
        this.vehicleRepository = vehicleRepository;
    }
    async findAvailableVehicles(startDate, endDate, type, fuelType, transmission, minPrice, maxPrice) {
        const query = this.vehicleRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.bookings', 'booking')
            .where('vehicle.available = :available', { available: true })
            .andWhere(`(booking.id IS NULL OR 
        NOT (
          booking.start_date <= :endDate AND 
          booking.end_date >= :startDate AND
          booking.status IN ('confirmed', 'active')
        ))`, { startDate, endDate });
        if (type) {
            query.andWhere('vehicle.type = :type', { type });
        }
        if (fuelType) {
            query.andWhere('vehicle.fuel_type = :fuelType', { fuelType });
        }
        if (transmission) {
            query.andWhere('vehicle.transmission = :transmission', { transmission });
        }
        if (minPrice) {
            query.andWhere('vehicle.price_per_day >= :minPrice', { minPrice });
        }
        if (maxPrice) {
            query.andWhere('vehicle.price_per_day <= :maxPrice', { maxPrice });
        }
        return query.getMany();
    }
    async findVehiclesByOwner(ownerId) {
        return this.vehicleRepository.find({
            where: { owner_id: ownerId },
            relations: ['bookings'],
        });
    }
    async updateVehicleAvailability(id, available) {
        await this.vehicleRepository.update(id, { available });
    }
};
exports.VehicleRepository = VehicleRepository;
exports.VehicleRepository = VehicleRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VehicleRepository);
//# sourceMappingURL=vehicle.repository.js.map