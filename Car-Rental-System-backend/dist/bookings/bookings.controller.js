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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const update_booking_dto_1 = require("./dto/update-booking.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../database/entities/user.entity");
const booking_entity_1 = require("../database/entities/booking.entity");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    create(createBookingDto, req) {
        return this.bookingsService.create(createBookingDto, req.user.userId);
    }
    findAll(userId, vehicleId, status, startDate, endDate, page = 1, limit = 10) {
        const options = {
            userId,
            vehicleId,
            status,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            page,
            limit,
        };
        return this.bookingsService.findAll(options);
    }
    findUserBookings(req) {
        return this.bookingsService.getUserBookings(req.user.userId);
    }
    findVehicleBookings(vehicleId) {
        return this.bookingsService.getVehicleBookings(vehicleId);
    }
    async findOne(id, req) {
        const booking = await this.bookingsService.findOne(id);
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.user.id !== req.user.userId && req.user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('You are not authorized to view this booking');
        }
        return booking;
    }
    update(id, updateBookingDto, req) {
        return this.bookingsService.update(id, updateBookingDto, req.user.userId, req.user.role === user_entity_1.UserRole.ADMIN);
    }
    cancel(id, req) {
        return this.bookingsService.cancel(id, req.user.userId, req.user.role === user_entity_1.UserRole.ADMIN);
    }
    updateStatus(id, status, req) {
        return this.bookingsService.updateStatus(id, status, req.user.userId, req.user.role === user_entity_1.UserRole.ADMIN);
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Booking successfully created', type: booking_entity_1.Booking }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_booking_dto_1.CreateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookings (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of bookings', type: [booking_entity_1.Booking] }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'vehicleId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: booking_entity_1.BookingStatus }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('vehicleId')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(6, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user\'s bookings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of user bookings', type: [booking_entity_1.Booking] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findUserBookings", null);
__decorate([
    (0, common_1.Get)('vehicle/:vehicleId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get bookings for a specific vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of vehicle bookings', type: [booking_entity_1.Booking] }),
    __param(0, (0, common_1.Param)('vehicleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "findVehicleBookings", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a booking by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the booking', type: booking_entity_1.Booking }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking updated successfully', type: booking_entity_1.Booking }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_booking_dto_1.UpdateBookingDto, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel a booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking cancelled successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Cannot cancel booking' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/status/:status'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.AGENT, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update booking status (Agents and Admins only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Booking status updated', type: booking_entity_1.Booking }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid status transition' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Booking not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('status')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], BookingsController.prototype, "updateStatus", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, common_1.Controller)('bookings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map