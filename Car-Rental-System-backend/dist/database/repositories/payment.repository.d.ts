import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { BaseRepository } from './base.repository';
export declare class PaymentRepository extends BaseRepository<Payment> {
    private readonly paymentRepository;
    constructor(paymentRepository: Repository<Payment>);
    findPaymentsByUser(userId: string, status?: PaymentStatus, startDate?: Date, endDate?: Date): Promise<Payment[]>;
    findPaymentsByBooking(bookingId: string): Promise<Payment[]>;
    updatePaymentStatus(paymentId: string, status: PaymentStatus, transactionId?: string): Promise<void>;
    getTotalRevenue(startDate?: Date, endDate?: Date): Promise<{
        total: number;
        count: number;
    }>;
}
