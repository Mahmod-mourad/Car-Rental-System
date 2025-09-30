import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Profile } from '../entities/profile.entity';
import { Vehicle } from '../entities/vehicle.entity';
import { Booking } from '../entities/booking.entity';
import { Payment } from '../entities/payment.entity';
import { Review } from '../entities/review.entity';
import { UserRepository } from './user.repository';
import { VehicleRepository } from './vehicle.repository';
import { BookingRepository } from './booking.repository';
import { PaymentRepository } from './payment.repository';
import { ReviewRepository } from './review.repository';
export declare const repositoryProviders: ({
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<User>;
    inject: string[];
} | {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Profile>;
    inject: string[];
} | {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Vehicle>;
    inject: string[];
} | {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Booking>;
    inject: string[];
} | {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Payment>;
    inject: string[];
} | {
    provide: string;
    useFactory: (dataSource: DataSource) => import("typeorm").Repository<Review>;
    inject: string[];
})[];
export declare const repositories: (typeof UserRepository | typeof VehicleRepository | typeof BookingRepository | typeof PaymentRepository | typeof ReviewRepository)[];
export declare const repositoryClasses: ({
    provide: string;
    useClass: typeof UserRepository;
} | {
    provide: string;
    useClass: typeof VehicleRepository;
} | {
    provide: string;
    useClass: typeof BookingRepository;
} | {
    provide: string;
    useClass: typeof PaymentRepository;
} | {
    provide: string;
    useClass: typeof ReviewRepository;
})[];
export declare const REPOSITORY_TOKENS: {
    USER: string;
    PROFILE: string;
    VEHICLE: string;
    BOOKING: string;
    PAYMENT: string;
    REVIEW: string;
};
