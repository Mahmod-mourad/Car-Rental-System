"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REPOSITORY_TOKENS = exports.repositoryClasses = exports.repositories = exports.repositoryProviders = void 0;
const user_entity_1 = require("../entities/user.entity");
const profile_entity_1 = require("../entities/profile.entity");
const vehicle_entity_1 = require("../entities/vehicle.entity");
const booking_entity_1 = require("../entities/booking.entity");
const payment_entity_1 = require("../entities/payment.entity");
const review_entity_1 = require("../entities/review.entity");
const user_repository_1 = require("./user.repository");
const vehicle_repository_1 = require("./vehicle.repository");
const booking_repository_1 = require("./booking.repository");
const payment_repository_1 = require("./payment.repository");
const review_repository_1 = require("./review.repository");
exports.repositoryProviders = [
    {
        provide: 'USER_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(user_entity_1.User),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PROFILE_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(profile_entity_1.Profile),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'VEHICLE_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(vehicle_entity_1.Vehicle),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'BOOKING_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(booking_entity_1.Booking),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PAYMENT_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(payment_entity_1.Payment),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'REVIEW_REPOSITORY',
        useFactory: (dataSource) => dataSource.getRepository(review_entity_1.Review),
        inject: ['DATA_SOURCE'],
    },
];
exports.repositories = [
    user_repository_1.UserRepository,
    vehicle_repository_1.VehicleRepository,
    booking_repository_1.BookingRepository,
    payment_repository_1.PaymentRepository,
    review_repository_1.ReviewRepository,
];
exports.repositoryClasses = [
    {
        provide: 'USER_REPOSITORY_CLASS',
        useClass: user_repository_1.UserRepository,
    },
    {
        provide: 'VEHICLE_REPOSITORY_CLASS',
        useClass: vehicle_repository_1.VehicleRepository,
    },
    {
        provide: 'BOOKING_REPOSITORY_CLASS',
        useClass: booking_repository_1.BookingRepository,
    },
    {
        provide: 'PAYMENT_REPOSITORY_CLASS',
        useClass: payment_repository_1.PaymentRepository,
    },
    {
        provide: 'REVIEW_REPOSITORY_CLASS',
        useClass: review_repository_1.ReviewRepository,
    },
];
exports.REPOSITORY_TOKENS = {
    USER: 'USER_REPOSITORY',
    PROFILE: 'PROFILE_REPOSITORY',
    VEHICLE: 'VEHICLE_REPOSITORY',
    BOOKING: 'BOOKING_REPOSITORY',
    PAYMENT: 'PAYMENT_REPOSITORY',
    REVIEW: 'REVIEW_REPOSITORY',
};
//# sourceMappingURL=index.js.map