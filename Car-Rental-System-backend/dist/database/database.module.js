"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const profile_entity_1 = require("./entities/profile.entity");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const booking_entity_1 = require("./entities/booking.entity");
const payment_entity_1 = require("./entities/payment.entity");
const review_entity_1 = require("./entities/review.entity");
const database_providers_1 = require("./database.providers");
const user_repository_1 = require("./repositories/user.repository");
const vehicle_repository_1 = require("./repositories/vehicle.repository");
const booking_repository_1 = require("./repositories/booking.repository");
const payment_repository_1 = require("./repositories/payment.repository");
const review_repository_1 = require("./repositories/review.repository");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                profile_entity_1.Profile,
                vehicle_entity_1.Vehicle,
                booking_entity_1.Booking,
                payment_entity_1.Payment,
                review_entity_1.Review,
                user_repository_1.UserRepository,
                vehicle_repository_1.VehicleRepository,
                booking_repository_1.BookingRepository,
                payment_repository_1.PaymentRepository,
                review_repository_1.ReviewRepository,
            ]),
        ],
        providers: [
            ...database_providers_1.databaseProviders,
            user_repository_1.UserRepository,
            vehicle_repository_1.VehicleRepository,
            booking_repository_1.BookingRepository,
            payment_repository_1.PaymentRepository,
            review_repository_1.ReviewRepository,
        ],
        exports: [
            typeorm_1.TypeOrmModule,
            user_repository_1.UserRepository,
            vehicle_repository_1.VehicleRepository,
            booking_repository_1.BookingRepository,
            payment_repository_1.PaymentRepository,
            review_repository_1.ReviewRepository,
        ],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map