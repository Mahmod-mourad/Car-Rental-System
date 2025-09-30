export declare enum PaymentMethod {
    CREDIT_CARD = "credit_card",
    DEBIT_CARD = "debit_card",
    PAYPAL = "paypal",
    BANK_TRANSFER = "bank_transfer",
    OTHER = "other"
}
export declare class CreatePaymentDto {
    booking_id: string;
    amount: number;
    payment_method: PaymentMethod;
    transaction_id?: string;
    metadata?: Record<string, any>;
}
