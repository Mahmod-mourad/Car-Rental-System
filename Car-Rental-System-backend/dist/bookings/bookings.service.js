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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const booking_entity_1 = require("../database/entities/booking.entity");
const vehicle_entity_1 = require("../database/entities/vehicle.entity");
const user_entity_1 = require("../database/entities/user.entity");
let BookingsService = class BookingsService {
    bookingsRepository;
    vehiclesRepository;
    usersRepository;
    constructor(bookingsRepository, vehiclesRepository, usersRepository) {
        this.bookingsRepository = bookingsRepository;
        this.vehiclesRepository = vehiclesRepository;
        this.usersRepository = usersRepository;
    }
    async create(createBookingDto, userId) {
        const { vehicle_id, start_date, end_date, total_price, notes } = createBookingDto;
        const vehicle = await this.vehiclesRepository.findOne({ where: { id: vehicle_id } });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        if (!vehicle.available) {
            throw new common_1.BadRequestException('Vehicle is not available for booking');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const existingBooking = await this.bookingsRepository
            .createQueryBuilder('booking')
            .where('booking.vehicle_id = :vehicleId', { vehicleId: vehicle_id })
            .andWhere('booking.status != :cancelled', { cancelled: booking_entity_1.BookingStatus.CANCELLED })
            .andWhere('(:startDate BETWEEN booking.start_date AND booking.end_date) OR ' +
            '(:endDate BETWEEN booking.start_date AND booking.end_date) OR ' +
            '(booking.start_date <= :startDate AND booking.end_date >= :endDate)')
            .setParameters({
            startDate: new Date(start_date),
            endDate: new Date(end_date)
        })
            .getOne();
        if (existingBooking) {
            throw new common_1.BadRequestException('The vehicle is already booked for the selected dates');
        }
        const booking = new booking_entity_1.Booking();
        booking.start_date = new Date(start_date);
        booking.end_date = new Date(end_date);
        booking.total_price = total_price;
        booking.status = booking_entity_1.BookingStatus.PENDING;
        booking.payment_status = booking_entity_1.BookingPaymentStatus.PENDING;
        booking.user = { id: userId };
        booking.vehicle = { id: vehicle_id };
        booking.created_at = new Date();
        booking.updated_at = new Date();
        const savedBooking = await this.bookingsRepository.save(booking);
        return this.bookingsRepository.findOneOrFail({
            where: { id: savedBooking.id },
            relations: ['user', 'vehicle']
        });
    }
    async findAll(filters = {}) {
        const { userId, vehicleId, status, startDate, endDate, page = 1, limit = 10, } = filters;
        const skip = (page - 1) * limit;
        const query = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.user', 'user')
            .leftJoinAndSelect('booking.vehicle', 'vehicle')
            .leftJoinAndSelect('vehicle.owner', 'owner');
        const whereConditions = [];
        const params = {};
        if (userId) {
            whereConditions.push('booking.userId = :userId');
            params.userId = userId;
        }
        if (vehicleId) {
            whereConditions.push('booking.vehicleId = :vehicleId');
            params.vehicleId = vehicleId;
        }
        if (status) {
            whereConditions.push('booking.status = :status');
            params.status = status;
        }
        if (startDate) {
            whereConditions.push('booking.start_date >= :startDate');
            params.startDate = new Date(startDate);
        }
        if (endDate) {
            whereConditions.push('booking.end_date <= :endDate');
            params.endDate = new Date(endDate);
        }
        if (whereConditions.length > 0) {
            query.where(whereConditions.join(' AND '), params);
        }
        const [data, count] = await query
            .orderBy('booking.created_at', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();
        return { data, count };
    }
    async findOne(id) {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['user', 'vehicle', 'payments'],
        });
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async update(id, updateBookingDto, userId, isAdmin = false) {
        const booking = await this.findOne(id);
        if (booking.user.id !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to update this booking');
        }
        if (updateBookingDto.start_date || updateBookingDto.end_date) {
            const startDate = updateBookingDto.start_date ? new Date(updateBookingDto.start_date) : booking.start_date;
            const endDate = updateBookingDto.end_date ? new Date(updateBookingDto.end_date) : booking.end_date;
            const conflictingBooking = await this.bookingsRepository
                .createQueryBuilder('booking')
                .where('booking.id != :id', { id })
                .andWhere('booking.vehicle_id = :vehicleId', { vehicleId: booking.vehicle.id })
                .andWhere('booking.status != :cancelled', { cancelled: booking_entity_1.BookingStatus.CANCELLED })
                .andWhere('(:startDate BETWEEN booking.start_date AND booking.end_date) OR ' +
                '(:endDate BETWEEN booking.start_date AND booking.end_date) OR ' +
                '(booking.start_date <= :startDate AND booking.end_date >= :endDate)')
                .setParameters({
                startDate,
                endDate
            })
                .getOne();
            if (conflictingBooking) {
                throw new common_1.BadRequestException('The vehicle is already booked for the selected dates');
            }
        }
        Object.assign(booking, updateBookingDto);
        return this.bookingsRepository.save(booking);
    }
    async cancel(id, userId, isAdmin = false) {
        const booking = await this.findOne(id);
        if (booking.user.id !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to cancel this booking');
        }
        if (booking.status === booking_entity_1.BookingStatus.CANCELLED) {
            throw new common_1.BadRequestException('Booking is already cancelled');
        }
        if (booking.status === booking_entity_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot cancel a completed booking');
        }
        booking.status = booking_entity_1.BookingStatus.CANCELLED;
        return this.bookingsRepository.save(booking);
    }
    async getVehicleBookings(vehicleId) {
        return this.bookingsRepository.find({
            where: { vehicle: { id: vehicleId } },
            relations: ['user'],
            order: { start_date: 'ASC' },
        });
    }
    async getUserBookings(userId) {
        return this.bookingsRepository.find({
            where: { user: { id: userId } },
            relations: ['vehicle'],
            order: { start_date: 'DESC' },
        });
    }
    async updateStatus(id, status, userId, isAdmin = false) {
        const booking = await this.findOne(id);
        if (booking.vehicle.owner.id !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to update the status of this booking');
        }
        if ((booking.status === booking_entity_1.BookingStatus.CANCELLED || booking.status === booking_entity_1.BookingStatus.COMPLETED) &&
            status !== booking.status) {
            throw new common_1.BadRequestException(`Cannot change status from ${booking.status} to ${status}`);
        }
        booking.status = status;
        return this.bookingsRepository.save(booking);
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map