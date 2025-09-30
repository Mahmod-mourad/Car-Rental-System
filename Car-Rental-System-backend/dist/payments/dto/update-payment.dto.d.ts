import { CreatePaymentDto } from './create-payment.dto';
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REFUNDED = "refunded",
    PARTIALLY_REFUNDED = "partially_refunded"
}
declare const UpdatePaymentDto_base: import("@nestjs/common").Type<Partial<CreatePaymentDto>>;
export declare class UpdatePaymentDto extends UpdatePaymentDto_base {
    status?: PaymentStatus;
    failure_reason?: string;
}
export {};
