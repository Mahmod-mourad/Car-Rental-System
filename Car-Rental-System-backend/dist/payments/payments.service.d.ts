import { Repository } from 'typeorm';
import { Payment } from '../database/entities/payment.entity';
import { Booking } from '../database/entities/booking.entity';
import { User } from '../database/entities/user.entity';
import { CreatePaymentDto, PaymentMethod } from './dto/create-payment.dto';
import { UpdatePaymentDto, PaymentStatus } from './dto/update-payment.dto';
export declare class PaymentsService {
    private paymentsRepository;
    private bookingsRepository;
    private usersRepository;
    constructor(paymentsRepository: Repository<Payment>, bookingsRepository: Repository<Booking>, usersRepository: Repository<User>);
    create(createPaymentDto: CreatePaymentDto, userId: string): Promise<Payment>;
    findAll(userId?: string, filters?: {
        status?: PaymentStatus;
        startDate?: Date;
        endDate?: Date;
        minAmount?: number;
        maxAmount?: number;
        method?: PaymentMethod;
    }, page?: number, limit?: number): Promise<{
        data: Payment[];
        count: number;
    }>;
    findOne(id: string, userId?: string): Promise<Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto, userId: string): Promise<Payment>;
    remove(id: string, userId: string): Promise<void>;
    getBookingPayments(bookingId: string, userId?: string): Promise<Payment[]>;
    getTotalPaid(bookingId: string): Promise<number>;
    processRefund(paymentId: string, amount: number, reason: string, userId: string): Promise<Payment>;
}
