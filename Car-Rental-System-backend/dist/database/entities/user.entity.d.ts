import { Profile } from './profile.entity';
import { Vehicle } from './vehicle.entity';
import { Booking } from './booking.entity';
import { Review } from './review.entity';
export declare enum UserRole {
    ADMIN = "admin",
    USER = "user",
    OWNER = "owner",
    CUSTOMER = "customer",
    AGENT = "agent"
}
export declare class User {
    id: string;
    email: string;
    password_hash: string;
    role: UserRole;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    last_login: Date;
    profile: Profile;
    vehicles: Vehicle[];
    bookings: Booking[];
    reviews: Review[];
}
