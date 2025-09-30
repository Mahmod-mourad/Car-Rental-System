import { PaymentsService } from './payments.service';
import { PaymentMethod } from './dto/create-payment.dto';
import { PaymentStatus } from './dto/update-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from '../database/entities/payment.entity';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    create(createPaymentDto: CreatePaymentDto, req: any): Promise<Payment>;
    findAll(status?: PaymentStatus, method?: PaymentMethod, startDate?: string, endDate?: string, minAmount?: number, maxAmount?: number, page?: number, limit?: number): Promise<{
        data: Payment[];
        count: number;
    }>;
    findUserPayments(req: any, status?: PaymentStatus, page?: number, limit?: number): Promise<{
        data: Payment[];
        count: number;
    }>;
    getBookingPayments(bookingId: string, req: any): Promise<Payment[]>;
    getTotalPaid(bookingId: string, req: any): Promise<number>;
    findOne(id: string, req: any): Promise<Payment>;
    update(id: string, updatePaymentDto: UpdatePaymentDto, req: any): Promise<Payment>;
    remove(id: string, req: any): Promise<void>;
    processRefund(id: string, amount: number, reason: string, req: any): Promise<Payment>;
}
