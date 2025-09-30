import { User } from './user.entity';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';
export declare class Review {
    id: string;
    rating: number;
    comment: string;
    response: {
        comment: string;
        responded_at: Date;
    };
    created_at: Date;
    updated_at: Date;
    user: User;
    user_id: string;
    vehicle: Vehicle;
    vehicle_id: string;
    booking: Booking;
    booking_id: string;
}
