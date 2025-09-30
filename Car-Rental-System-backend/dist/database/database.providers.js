"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseProviders = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./entities/user.entity");
const profile_entity_1 = require("./entities/profile.entity");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const booking_entity_1 = require("./entities/booking.entity");
const payment_entity_1 = require("./entities/payment.entity");
const review_entity_1 = require("./entities/review.entity");
const entities = [
    user_entity_1.User,
    profile_entity_1.Profile,
    vehicle_entity_1.Vehicle,
    booking_entity_1.Booking,
    payment_entity_1.Payment,
    review_entity_1.Review,
];
exports.databaseProviders = [
    {
        provide: 'DATA_SOURCE',
        inject: [config_1.ConfigService],
        useFactory: async (configService) => {
            const dataSource = new typeorm_1.DataSource({
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
//# sourceMappingURL=database.providers.js.map