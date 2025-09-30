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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../database/entities/payment.entity");
const booking_entity_1 = require("../database/entities/booking.entity");
const user_entity_1 = require("../database/entities/user.entity");
const update_payment_dto_1 = require("./dto/update-payment.dto");
let PaymentsService = class PaymentsService {
    paymentsRepository;
    bookingsRepository;
    usersRepository;
    constructor(paymentsRepository, bookingsRepository, usersRepository) {
        this.paymentsRepository = paymentsRepository;
        this.bookingsRepository = bookingsRepository;
        this.usersRepository = usersRepository;
    }
    async create(createPaymentDto, userId) {
        const { booking_id, amount, payment_method, transaction_id, metadata } = createPaymentDto;
        const booking = await this.bookingsRepository.findOne({
            where: { id: booking_id },
            relations: ['user'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.user.id !== userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || user.role !== 'admin') {
                throw new common_1.ForbiddenException('You are not authorized to create a payment for this booking');
            }
        }
        const payment = this.paymentsRepository.create({
            amount,
            payment_method,
            transaction_id,
            status: update_payment_dto_1.PaymentStatus.PENDING,
            metadata,
            booking: { id: booking_id },
        });
        const savedPayment = await this.paymentsRepository.save(payment);
        if (booking.payment_status !== booking_entity_1.BookingPaymentStatus.PAID && amount >= booking.total_price) {
            await this.bookingsRepository.update(booking_id, {
                payment_status: booking_entity_1.BookingPaymentStatus.PAID,
            });
        }
        else if (amount > 0) {
            await this.bookingsRepository.update(booking_id, {
                payment_status: booking_entity_1.BookingPaymentStatus.PENDING,
            });
        }
        return savedPayment;
    }
    async findAll(userId, filters = {}, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters.status)
            where.status = filters.status;
        if (filters.method)
            where.payment_method = filters.method;
        if (filters.startDate || filters.endDate) {
            where.created_at = (0, typeorm_2.Between)(filters.startDate || new Date(0), filters.endDate || new Date());
        }
        if (filters.minAmount !== undefined || filters.maxAmount !== undefined) {
            where.amount = (0, typeorm_2.Between)(filters.minAmount !== undefined ? filters.minAmount : 0, filters.maxAmount !== undefined ? filters.maxAmount : Number.MAX_SAFE_INTEGER);
        }
        if (userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || user.role !== 'admin') {
                where.booking = { user: { id: userId } };
            }
        }
        const [data, count] = await this.paymentsRepository.findAndCount({
            where,
            relations: ['booking', 'booking.user', 'booking.vehicle'],
            order: { created_at: 'DESC' },
            skip,
            take: limit,
        });
        return { data, count };
    }
    async findOne(id, userId) {
        const payment = await this.paymentsRepository.findOne({
            where: { id },
            relations: ['booking', 'booking.user', 'booking.vehicle'],
        });
        if (!payment) {
            throw new common_1.NotFoundException(`Payment with ID ${id} not found`);
        }
        if (userId && payment.booking.user.id !== userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || user.role !== 'admin') {
                throw new common_1.ForbiddenException('You are not authorized to view this payment');
            }
        }
        return payment;
    }
    async update(id, updatePaymentDto, userId) {
        const payment = await this.findOne(id, userId);
        if (payment.booking.user.id !== userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || user.role !== 'admin') {
                throw new common_1.ForbiddenException('You are not authorized to update this payment');
            }
        }
        Object.assign(payment, updatePaymentDto);
        if (updatePaymentDto.status === update_payment_dto_1.PaymentStatus.COMPLETED) {
            await this.bookingsRepository.update(payment.booking.id, {
                payment_status: booking_entity_1.BookingPaymentStatus.PAID,
            });
        }
        return this.paymentsRepository.save(payment);
    }
    async remove(id, userId) {
        const payment = await this.findOne(id, userId);
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user || user.role !== 'admin') {
            throw new common_1.ForbiddenException('Only administrators can delete payments');
        }
        await this.paymentsRepository.remove(payment);
    }
    async getBookingPayments(bookingId, userId) {
        const where = { booking: { id: bookingId } };
        if (userId) {
            const booking = await this.bookingsRepository.findOne({
                where: { id: bookingId },
                relations: ['user'],
            });
            if (!booking) {
                throw new common_1.NotFoundException('Booking not found');
            }
            if (booking.user.id !== userId) {
                const user = await this.usersRepository.findOne({ where: { id: userId } });
                if (!user || user.role !== 'admin') {
                    throw new common_1.ForbiddenException('You are not authorized to view these payments');
                }
            }
        }
        return this.paymentsRepository.find({
            where,
            order: { created_at: 'DESC' },
        });
    }
    async getTotalPaid(bookingId) {
        const result = await this.paymentsRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'total')
            .where('payment.booking_id = :bookingId', { bookingId })
            .andWhere('payment.status = :status', { status: update_payment_dto_1.PaymentStatus.COMPLETED })
            .getRawOne();
        return parseFloat(result.total) || 0;
    }
    async processRefund(paymentId, amount, reason, userId) {
        const payment = await this.findOne(paymentId, userId);
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user || user.role !== 'admin') {
            throw new common_1.ForbiddenException('Only administrators can process refunds');
        }
        if (payment.status !== update_payment_dto_1.PaymentStatus.COMPLETED) {
            throw new common_1.BadRequestException('Only completed payments can be refunded');
        }
        if (amount <= 0 || amount > payment.amount) {
            throw new common_1.BadRequestException('Invalid refund amount');
        }
        const refund = this.paymentsRepository.create({
            amount: -amount,
            payment_method: payment.payment_method,
            status: update_payment_dto_1.PaymentStatus.REFUNDED,
            metadata: {
                original_payment_id: payment.id,
                reason,
            },
            booking: { id: payment.booking.id },
        });
        if (amount === payment.amount) {
            payment.status = update_payment_dto_1.PaymentStatus.REFUNDED;
            await this.paymentsRepository.save(payment);
        }
        else {
            payment.metadata = payment.metadata || {};
            payment.metadata.partial_refund = {
                amount,
                refund_id: refund.id,
                timestamp: new Date().toISOString(),
                reason,
            };
            payment.status = update_payment_dto_1.PaymentStatus.PARTIALLY_REFUNDED;
            await this.paymentsRepository.save(payment);
        }
        return this.paymentsRepository.save(refund);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(booking_entity_1.Booking)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map