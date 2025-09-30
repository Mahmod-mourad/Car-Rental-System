import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { Payment } from './payment.entity';
import { Review } from './review.entity';
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    ACTIVE = "active",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare enum BookingPaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    REFUNDED = "refunded",
    FAILED = "failed"
}
export declare class Booking {
    id: string;
    start_date: Date;
    end_date: Date;
    total_price: number;
    status: BookingStatus;
    payment_status: BookingPaymentStatus;
    created_at: Date;
    updated_at: Date;
    user: User;
    user_id: string;
    vehicle: Vehicle;
    vehicle_id: string;
    payments: Payment[];
    review: Review;
}
