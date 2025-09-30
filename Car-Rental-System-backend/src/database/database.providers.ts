import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { Profile } from './entities/profile.entity';
import { Vehicle } from './entities/vehicle.entity';
import { Booking } from './entities/booking.entity';
import { Payment } from './entities/payment.entity';
import { Review } from './entities/review.entity';
import { UserRepository } from './repositories/user.repository';
import { VehicleRepository } from './repositories/vehicle.repository';
import { BookingRepository } from './repositories/booking.repository';
import { PaymentRepository } from './repositories/payment.repository';
import { ReviewRepository } from './repositories/review.repository';

const entities = [
  User,
  Profile,
  Vehicle,
  Booking,
  Payment,
  Review,
];

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.name'),
        entities: entities,
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      });

      return dataSource.initialize();
    },
  },
];
