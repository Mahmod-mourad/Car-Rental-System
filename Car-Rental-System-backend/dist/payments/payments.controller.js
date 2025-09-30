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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const update_payment_dto_1 = require("./dto/update-payment.dto");
const create_payment_dto_2 = require("./dto/create-payment.dto");
const update_payment_dto_2 = require("./dto/update-payment.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../database/entities/user.entity");
const payment_entity_1 = require("../database/entities/payment.entity");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    create(createPaymentDto, req) {
        return this.paymentsService.create(createPaymentDto, req.user.userId);
    }
    findAll(status, method, startDate, endDate, minAmount = 0, maxAmount = 0, page = 1, limit = 10) {
        return this.paymentsService.findAll(undefined, {
            status,
            method,
            startDate: startDate ? new Date(startDate) : undefined,
            endDate: endDate ? new Date(endDate) : undefined,
            minAmount: minAmount || undefined,
            maxAmount: maxAmount || undefined,
        }, page, limit);
    }
    findUserPayments(req, status, page = 1, limit = 10) {
        return this.paymentsService.findAll(req.user.userId, { status }, page, limit);
    }
    getBookingPayments(bookingId, req) {
        return this.paymentsService.getBookingPayments(bookingId, req.user.userId);
    }
    async getTotalPaid(bookingId, req) {
        await this.paymentsService.getBookingPayments(bookingId, req.user.userId);
        return this.paymentsService.getTotalPaid(bookingId);
    }
    findOne(id, req) {
        return this.paymentsService.findOne(id, req.user.userId);
    }
    update(id, updatePaymentDto, req) {
        return this.paymentsService.update(id, updatePaymentDto, req.user.userId);
    }
    remove(id, req) {
        return this.paymentsService.remove(id, req.user.userId);
    }
    async processRefund(id, amount, reason, req) {
        if (!amount || amount <= 0) {
            throw new common_1.BadRequestException('A valid refund amount is required');
        }
        if (!reason) {
            throw new common_1.BadRequestException('A reason for the refund is required');
        }
        return this.paymentsService.processRefund(id, amount, reason, req.user.userId);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new payment' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Payment successfully created', type: payment_entity_1.Payment }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_2.CreatePaymentDto, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payments (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of payments', type: [payment_entity_1.Payment] }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: update_payment_dto_1.PaymentStatus }),
    (0, swagger_1.ApiQuery)({ name: 'method', required: false, enum: create_payment_dto_1.PaymentMethod }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'minAmount', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'maxAmount', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('method')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __param(4, (0, common_1.Query)('minAmount', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(5, (0, common_1.Query)('maxAmount', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(6, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(7, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('my-payments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user\'s payments' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of user payments', type: [payment_entity_1.Payment] }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, enum: update_payment_dto_1.PaymentStatus }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findUserPayments", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get payments for a specific booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of booking payments', type: [payment_entity_1.Payment] }),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "getBookingPayments", null);
__decorate([
    (0, common_1.Get)('booking/:bookingId/total-paid'),
    (0, swagger_1.ApiOperation)({ summary: 'Get total amount paid for a booking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return total amount paid', type: Number }),
    __param(0, (0, common_1.Param)('bookingId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getTotalPaid", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a payment by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the payment', type: payment_entity_1.Payment }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update a payment (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment updated successfully', type: payment_entity_1.Payment }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_dto_2.UpdatePaymentDto, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a payment (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/refund'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Process a refund (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Refund processed successfully', type: payment_entity_1.Payment }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid refund request' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('amount')),
    __param(2, (0, common_1.Body)('reason')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String, Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "processRefund", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map