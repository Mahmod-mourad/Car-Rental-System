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

// Export repository providers
export const repositoryProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PROFILE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Profile),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'VEHICLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vehicle),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'BOOKING_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Booking),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'PAYMENT_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Payment),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'REVIEW_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Review),
    inject: ['DATA_SOURCE'],
  },
];

// Export repository classes
export const repositories = [
  UserRepository,
  VehicleRepository,
  BookingRepository,
  PaymentRepository,
  ReviewRepository,
];

// Export repository classes for dependency injection
export const repositoryClasses = [
  {
    provide: 'USER_REPOSITORY_CLASS',
    useClass: UserRepository,
  },
  {
    provide: 'VEHICLE_REPOSITORY_CLASS',
    useClass: VehicleRepository,
  },
  {
    provide: 'BOOKING_REPOSITORY_CLASS',
    useClass: BookingRepository,
  },
  {
    provide: 'PAYMENT_REPOSITORY_CLASS',
    useClass: PaymentRepository,
  },
  {
    provide: 'REVIEW_REPOSITORY_CLASS',
    useClass: ReviewRepository,
  },
];

// Export repository tokens
export const REPOSITORY_TOKENS = {
  USER: 'USER_REPOSITORY',
  PROFILE: 'PROFILE_REPOSITORY',
  VEHICLE: 'VEHICLE_REPOSITORY',
  BOOKING: 'BOOKING_REPOSITORY',
  PAYMENT: 'PAYMENT_REPOSITORY',
  REVIEW: 'REVIEW_REPOSITORY',
};
