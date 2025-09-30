import { Booking } from './booking.entity';
export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    PAYPAL = "paypal",
    BANK_TRANSFER = "bank_transfer",
    OTHER = "other"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded"
}
export declare class Payment {
    id: string;
    amount: number;
    payment_method: PaymentMethod;
    transaction_id: string;
    status: PaymentStatus;
    metadata: Record<string, any>;
    created_at: Date;
    booking: Booking;
    booking_id: string;
}
