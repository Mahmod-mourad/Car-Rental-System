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
exports.PaymentRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("../entities/payment.entity");
const base_repository_1 = require("./base.repository");
let PaymentRepository = class PaymentRepository extends base_repository_1.BaseRepository {
    paymentRepository;
    constructor(paymentRepository) {
        super(paymentRepository);
        this.paymentRepository = paymentRepository;
    }
    async findPaymentsByUser(userId, status, startDate, endDate) {
        const query = this.paymentRepository
            .createQueryBuilder('payment')
            .leftJoinAndSelect('payment.booking', 'booking')
            .where('booking.user_id = :userId', { userId });
        if (status) {
            query.andWhere('payment.status = :status', { status });
        }
        if (startDate && endDate) {
            query.andWhere('payment.created_at BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        return query.orderBy('payment.created_at', 'DESC').getMany();
    }
    async findPaymentsByBooking(bookingId) {
        return this.paymentRepository.find({
            where: { booking_id: bookingId },
            order: { created_at: 'DESC' },
        });
    }
    async updatePaymentStatus(paymentId, status, transactionId) {
        const updateData = { status };
        if (transactionId) {
            updateData.transaction_id = transactionId;
        }
        await this.paymentRepository.update(paymentId, updateData);
    }
    async getTotalRevenue(startDate, endDate) {
        const query = this.paymentRepository
            .createQueryBuilder('payment')
            .select('SUM(payment.amount)', 'total')
            .addSelect('COUNT(payment.id)', 'count')
            .where('payment.status = :status', { status: payment_entity_1.PaymentStatus.COMPLETED });
        if (startDate && endDate) {
            query.andWhere('payment.created_at BETWEEN :startDate AND :endDate', {
                startDate,
                endDate,
            });
        }
        const result = await query.getRawOne();
        return {
            total: parseFloat(result.total) || 0,
            count: parseInt(result.count, 10) || 0,
        };
    }
};
exports.PaymentRepository = PaymentRepository;
exports.PaymentRepository = PaymentRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PaymentRepository);
//# sourceMappingURL=payment.repository.js.map