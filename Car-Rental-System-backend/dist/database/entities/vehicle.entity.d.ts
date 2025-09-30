import { User } from './user.entity';
import { Review } from './review.entity';
type Booking = any;
export declare enum VehicleType {
    SEDAN = "sedan",
    SUV = "suv",
    TRUCK = "truck",
    VAN = "van",
    LUXURY = "luxury"
}
export declare enum TransmissionType {
    AUTOMATIC = "automatic",
    MANUAL = "manual"
}
export declare enum FuelType {
    GASOLINE = "gasoline",
    DIESEL = "diesel",
    ELECTRIC = "electric",
    HYBRID = "hybrid"
}
export declare class Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    type: VehicleType;
    transmission: TransmissionType;
    fuel_type: FuelType;
    seats: number;
    price_per_day: number;
    available: boolean;
    average_rating: number;
    review_count: number;
    is_featured: boolean;
    location: any;
    images: string[];
    features: Record<string, any>;
    created_at: Date;
    updated_at: Date;
    owner: User;
    owner_id: string;
    bookings: Booking[];
    reviews: Review[];
}
export {};
