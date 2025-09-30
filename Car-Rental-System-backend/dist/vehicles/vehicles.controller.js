"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesController = void 0;
const common_1 = require("@nestjs/common");
const vehicles_service_1 = require("./vehicles.service");
const create_vehicle_dto_1 = require("./dto/create-vehicle.dto");
const update_vehicle_dto_1 = require("./dto/update-vehicle.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_entity_1 = require("../database/entities/user.entity");
const vehicle_entity_1 = require("../database/entities/vehicle.entity");
let VehiclesController = class VehiclesController {
    vehiclesService;
    constructor(vehiclesService) {
        this.vehiclesService = vehiclesService;
    }
    create(createVehicleDto, req) {
        return this.vehiclesService.create(createVehicleDto, req.user.userId);
    }
    async findAll(make, model, minYear, maxYear, type, minPrice, maxPrice, minRating, isFeatured, available, lat, lng, radiusKm, page = 1, limit = 10) {
        const filters = {
            make,
            model,
            minYear,
            maxYear,
            type,
            minPrice,
            maxPrice,
            minRating: minRating ? Math.min(5, Math.max(1, Number(minRating))) : undefined,
            isFeatured: isFeatured ? isFeatured.toLowerCase() === 'true' : undefined,
            available,
            page,
            limit,
        };
        if (lat && lng) {
            filters.location = {
                lat,
                lng,
                radiusKm,
            };
        }
        return this.vehiclesService.findAll(filters);
    }
    async getFeaturedVehicles(limit) {
        if (limit < 1 || limit > 20) {
            throw new common_1.BadRequestException('Limit must be between 1 and 20');
        }
        return this.vehiclesService.findFeatured(limit);
    }
    async getLatestVehicles(limit) {
        if (limit < 1 || limit > 20) {
            throw new common_1.BadRequestException('Limit must be between 1 and 20');
        }
        return this.vehiclesService.findLatest(limit);
    }
    async getSimilarVehicles(id, limit) {
        if (limit < 1 || limit > 10) {
            throw new common_1.BadRequestException('Limit must be between 1 and 10');
        }
        return this.vehiclesService.findSimilar(id, limit);
    }
    async getPopularBrands(limit) {
        if (limit < 1 || limit > 20) {
            throw new common_1.BadRequestException('Limit must be between 1 and 20');
        }
        return this.vehiclesService.getPopularBrands(limit);
    }
    async getPriceRange() {
        return this.vehiclesService.getPriceRange();
    }
    findUserVehicles(req) {
        return this.vehiclesService.findUserVehicles(req.user.userId);
    }
    findOne(id) {
        return this.vehiclesService.findOne(id);
    }
    update(id, updateVehicleDto, req) {
        return this.vehiclesService.update(id, updateVehicleDto, req.user.userId);
    }
    remove(id, req) {
        return this.vehiclesService.remove(id, req.user.userId);
    }
    updateAvailability(id, available, req) {
        return this.vehiclesService.updateAvailability(id, available, req.user.userId);
    }
};
exports.VehiclesController = VehiclesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.AGENT, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new vehicle (Agents and Admins only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Vehicle successfully created', type: vehicle_entity_1.Vehicle }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_vehicle_dto_1.CreateVehicleDto, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all vehicles with optional filters',
        description: `Search and filter vehicles based on various criteria. 
      - Filter by make, model, year, type, and price range
      - Search by location (latitude/longitude)
      - Filter by availability and featured status
      - Pagination support`
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved list of vehicles',
        type: [vehicle_entity_1.Vehicle],
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - invalid parameters',
    }),
    (0, swagger_1.ApiResponse)({
        status: 500,
        description: 'Internal server error',
    }),
    (0, swagger_1.ApiQuery)({ name: 'make', required: false, description: 'Filter by vehicle make (e.g., Toyota, Honda)' }),
    (0, swagger_1.ApiQuery)({ name: 'model', required: false, description: 'Filter by vehicle model (e.g., Camry, Civic)' }),
    (0, swagger_1.ApiQuery)({
        name: 'minYear',
        required: false,
        type: Number,
        description: 'Filter by minimum manufacturing year'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxYear',
        required: false,
        type: Number,
        description: 'Filter by maximum manufacturing year'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'type',
        required: false,
        description: 'Filter by vehicle type (e.g., SEDAN, SUV, TRUCK)'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minPrice',
        required: false,
        type: Number,
        description: 'Filter by minimum daily rental price'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'maxPrice',
        required: false,
        type: Number,
        description: 'Filter by maximum daily rental price'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'minRating',
        required: false,
        type: Number,
        description: 'Filter by minimum average rating (1-5)'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'isFeatured',
        required: false,
        type: 'boolean',
        description: 'Filter only featured vehicles'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'available',
        required: false,
        type: 'boolean',
        description: 'Filter only currently available vehicles'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'lat',
        required: false,
        type: Number,
        description: 'Latitude for location-based search'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'lng',
        required: false,
        type: Number,
        description: 'Longitude for location-based search'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'radiusKm',
        required: false,
        type: Number,
        description: 'Search radius in kilometers (default: 50km)'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of items per page (default: 10, max: 100)'
    }),
    __param(0, (0, common_1.Query)('make')),
    __param(1, (0, common_1.Query)('model')),
    __param(2, (0, common_1.Query)('minYear', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('maxYear', new common_1.DefaultValuePipe(3000), common_1.ParseIntPipe)),
    __param(4, (0, common_1.Query)('type')),
    __param(5, (0, common_1.Query)('minPrice', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(6, (0, common_1.Query)('maxPrice', new common_1.DefaultValuePipe(1000000), common_1.ParseIntPipe)),
    __param(7, (0, common_1.Query)('minRating')),
    __param(8, (0, common_1.Query)('isFeatured')),
    __param(9, (0, common_1.Query)('available')),
    __param(10, (0, common_1.Query)('lat')),
    __param(11, (0, common_1.Query)('lng')),
    __param(12, (0, common_1.Query)('radiusKm', new common_1.DefaultValuePipe(50), common_1.ParseIntPipe)),
    __param(13, (0, common_1.Query)('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    __param(14, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, String, Number, Number, Number, String, Boolean, Number, Number, Number, Number, Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('featured'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get featured vehicles',
        description: 'Returns a list of featured vehicles, sorted by highest rating and most recent. Featured vehicles are typically highlighted for better visibility.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully retrieved list of featured vehicles',
        type: [vehicle_entity_1.Vehicle]
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - invalid limit parameter'
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Maximum number of featured vehicles to return (default: 6, max: 20)',
        example: 6
    }),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(6), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getFeaturedVehicles", null);
__decorate([
    (0, common_1.Get)('latest'),
    (0, swagger_1.ApiOperation)({ summary: 'Get latest vehicles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of latest vehicles', type: [vehicle_entity_1.Vehicle] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of vehicles to return (default: 6)' }),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(6), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getLatestVehicles", null);
__decorate([
    (0, common_1.Get)('similar/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get similar vehicles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of similar vehicles', type: [vehicle_entity_1.Vehicle] }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of vehicles to return (default: 4)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(4), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getSimilarVehicles", null);
__decorate([
    (0, common_1.Get)('brands/popular'),
    (0, swagger_1.ApiOperation)({ summary: 'Get popular car brands' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of popular car brands with vehicle counts' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Number of brands to return (default: 5)' }),
    __param(0, (0, common_1.Query)('limit', new common_1.DefaultValuePipe(5), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getPopularBrands", null);
__decorate([
    (0, common_1.Get)('price-range'),
    (0, swagger_1.ApiOperation)({ summary: 'Get price range of available vehicles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return min and max price of available vehicles' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], VehiclesController.prototype, "getPriceRange", null);
__decorate([
    (0, common_1.Get)('my-vehicles'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.AGENT, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all vehicles owned by the current user (Agents and Admins only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of vehicles', type: [vehicle_entity_1.Vehicle] }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findUserVehicles", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a vehicle by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return the vehicle', type: vehicle_entity_1.Vehicle }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vehicle not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update a vehicle' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle updated successfully', type: vehicle_entity_1.Vehicle }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vehicle not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_vehicle_dto_1.UpdateVehicleDto, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.AGENT, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a vehicle (Agents and Admins only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vehicle not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/availability'),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.AGENT, user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update vehicle availability (Agents and Admins only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Vehicle availability updated', type: vehicle_entity_1.Vehicle }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Vehicle not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('available')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Boolean, Object]),
    __metadata("design:returntype", void 0)
], VehiclesController.prototype, "updateAvailability", null);
exports.VehiclesController = VehiclesController = __decorate([
    (0, swagger_1.ApiTags)('Vehicles'),
    (0, common_1.Controller)('vehicles'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [vehicles_service_1.VehiclesService])
], VehiclesController);
//# sourceMappingURL=vehicles.controller.js.map