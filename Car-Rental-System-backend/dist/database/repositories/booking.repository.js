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
exports.BookingRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../entities/booking.entity");
const base_repository_1 = require("./base.repository");
let BookingRepository = class BookingRepository extends base_repository_1.BaseRepository {
    bookingRepository;
    constructor(bookingRepository) {
        super(bookingRepository);
        this.bookingRepository = bookingRepository;
    }
    async findUserBookings(userId, status) {
        const where = { user_id: userId };
        if (status) {
            where.status = status;
        }
        return this.bookingRepository.find({
            where,
            relations: ['vehicle', 'payments'],
            order: { start_date: 'DESC' },
        });
    }
    async findVehicleBookings(vehicleId, startDate, endDate) {
        const where = { vehicle_id: vehicleId };
        if (startDate && endDate) {
            where.start_date = (0, typeorm_2.Between)(startDate, endDate);
        }
        return this.bookingRepository.find({
            where,
            relations: ['user', 'payments'],
            order: { start_date: 'ASC' },
        });
    }
    async updateBookingStatus(bookingId, status) {
        await this.bookingRepository.update(bookingId, { status });
    }
    async findBookingsByDateRange(startDate, endDate, status) {
        const where = {
            start_date: (0, typeorm_2.Between)(startDate, endDate),
        };
        if (status) {
            where.status = status;
        }
        return this.bookingRepository.find({
            where,
            relations: ['user', 'vehicle', 'payments'],
            order: { start_date: 'ASC' },
        });
    }
};
exports.BookingRepository = BookingRepository;
exports.BookingRepository = BookingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BookingRepository);
//# sourceMappingURL=booking.repository.js.map