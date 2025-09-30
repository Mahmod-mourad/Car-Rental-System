import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { Review } from './entities/review.entity';
import { databaseProviders } from './database.providers';
import { UserRepository } from './repositories/user.repository';
import { VehicleRepository } from './repositories/vehicle.repository';
import { BookingRepository } from './repositories/booking.repository';
import { PaymentRepository } from './repositories/payment.repository';
import { ReviewRepository } from './repositories/review.repository';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      User,
      Profile,
      Vehicle,
      Booking,
      Payment,
      Review,
      UserRepository,
      VehicleRepository,
      BookingRepository,
      PaymentRepository,
      ReviewRepository,
    ]),
  ],
  providers: [
    ...databaseProviders,
    UserRepository,
    VehicleRepository,
    BookingRepository,
    PaymentRepository,
    ReviewRepository,
  ],
  exports: [
    TypeOrmModule,
    UserRepository,
    VehicleRepository,
    BookingRepository,
    PaymentRepository,
    ReviewRepository,
  ],
})
export class DatabaseModule {}
