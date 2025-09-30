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
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("../database/entities/vehicle.entity");
const user_entity_1 = require("../database/entities/user.entity");
const date_fns_1 = require("date-fns");
let VehiclesService = class VehiclesService {
    vehiclesRepository;
    usersRepository;
    constructor(vehiclesRepository, usersRepository) {
        this.vehiclesRepository = vehiclesRepository;
        this.usersRepository = usersRepository;
    }
    async create(createVehicleDto, userId) {
        const owner = await this.usersRepository.findOne({ where: { id: userId } });
        if (!owner) {
            throw new common_1.NotFoundException('Owner not found');
        }
        const vehicle = this.vehiclesRepository.create({
            ...createVehicleDto,
            owner,
        });
        return this.vehiclesRepository.save(vehicle);
    }
    async findAll(filters = {}) {
        const { make, model, minYear, maxYear, type, minPrice, maxPrice, minRating, isFeatured, available, location, page = 1, limit = 10 } = filters;
        const query = this.vehiclesRepository.createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.owner', 'owner')
            .leftJoinAndSelect('vehicle.reviews', 'reviews')
            .where('1=1');
        if (make) {
            query.andWhere('LOWER(vehicle.make) LIKE LOWER(:make)', { make: `%${make}%` });
        }
        if (model) {
            query.andWhere('LOWER(vehicle.model) LIKE LOWER(:model)', { model: `%${model}%` });
        }
        if (minYear) {
            query.andWhere('vehicle.year >= :minYear', { minYear });
        }
        if (maxYear) {
            query.andWhere('vehicle.year <= :maxYear', { maxYear });
        }
        if (type) {
            const vehicleType = type;
            query.andWhere('vehicle.type = :type', { type: vehicleType });
        }
        if (minPrice !== undefined) {
            query.andWhere('vehicle.price_per_day >= :minPrice', { minPrice });
        }
        if (maxPrice !== undefined) {
            query.andWhere('vehicle.price_per_day <= :maxPrice', { maxPrice });
        }
        if (available !== undefined) {
            query.andWhere('vehicle.available = :available', { available });
        }
        if (minRating !== undefined) {
            query.andWhere('vehicle.average_rating >= :minRating', { minRating });
        }
        if (isFeatured !== undefined) {
            query.andWhere('vehicle.is_featured = :isFeatured', { isFeatured });
        }
        if (location) {
            const { lat, lng, radiusKm = 50 } = location;
            if (lat && lng) {
                query.andWhere(`ST_DWithin(
            ST_MakePoint(vehicle.longitude, vehicle.latitude)::geography,
            ST_MakePoint(:lng, :lat)::geography,
            :radius * 1000
          )`, { lng, lat, radius: radiusKm });
            }
        }
        const [data, count] = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();
        return {
            data,
            count,
        };
    }
    async findOne(id) {
        const vehicle = await this.vehiclesRepository.findOne({
            where: { id },
            relations: ['owner', 'reviews'],
        });
        if (!vehicle) {
            throw new common_1.NotFoundException(`Vehicle with ID ${id} not found`);
        }
        return vehicle;
    }
    async update(id, updateVehicleDto, userId) {
        const vehicle = await this.vehiclesRepository.findOne({
            where: { id },
            relations: ['owner']
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const isAdmin = user?.role === 'admin';
        if (vehicle.owner.id !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You are not authorized to update this vehicle');
        }
        const { type, ...updateData } = updateVehicleDto;
        const updatedVehicle = {
            ...vehicle,
            ...updateData,
            ...(type && { type: type }),
        };
        return this.vehiclesRepository.save(updatedVehicle);
    }
    async remove(id, userId) {
        const vehicle = await this.vehiclesRepository.findOne({
            where: { id },
            relations: ['owner']
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        const isAdmin = user?.role === 'admin';
        if (vehicle.owner.id !== userId && !isAdmin) {
            throw new common_1.ForbiddenException('You do not have permission to delete this vehicle');
        }
        await this.vehiclesRepository.remove(vehicle);
    }
    async findFeatured(limit = 6) {
        return this.vehiclesRepository.find({
            where: {
                is_featured: true,
                available: true
            },
            relations: ['reviews', 'owner'],
            order: {
                average_rating: 'DESC',
                created_at: 'DESC'
            },
            take: limit,
        });
    }
    async findLatest(limit = 6) {
        const oneMonthAgo = (0, date_fns_1.subMonths)(new Date(), 1);
        return this.vehiclesRepository.find({
            where: {
                available: true,
                created_at: (0, typeorm_2.MoreThanOrEqual)(oneMonthAgo)
            },
            relations: ['reviews', 'owner'],
            order: {
                created_at: 'DESC'
            },
            take: limit,
        });
    }
    async findSimilar(vehicleId, limit = 4) {
        const vehicle = await this.vehiclesRepository.findOne({
            where: { id: vehicleId },
            relations: ['reviews']
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        const similarVehicles = await this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .leftJoinAndSelect('vehicle.reviews', 'reviews')
            .leftJoinAndSelect('vehicle.owner', 'owner')
            .where('vehicle.id != :vehicleId', { vehicleId })
            .andWhere('vehicle.available = :available', { available: true })
            .andWhere(qb => {
            const subQuery = qb.subQuery()
                .select('v.id')
                .from('vehicle', 'v')
                .where('v.type = :type', { type: vehicle.type })
                .orWhere('v.make = :make', { make: vehicle.make })
                .andWhere('v.id != :vehicleId', { vehicleId })
                .getQuery();
            return `vehicle.id IN ${subQuery}`;
        })
            .orderBy('(SELECT AVG(r.rating) FROM review r WHERE r.vehicle_id = vehicle.id)', 'DESC')
            .addOrderBy('vehicle.created_at', 'DESC')
            .take(limit)
            .getMany();
        return similarVehicles;
    }
    async getPopularBrands(limit = 5) {
        const result = await this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .select('vehicle.make', 'brand')
            .addSelect('COUNT(vehicle.id)', 'count')
            .groupBy('vehicle.make')
            .orderBy('count', 'DESC')
            .limit(limit)
            .getRawMany();
        return result;
    }
    async getPriceRange() {
        const result = await this.vehiclesRepository
            .createQueryBuilder('vehicle')
            .select('MIN(vehicle.price_per_day)', 'min')
            .addSelect('MAX(vehicle.price_per_day)', 'max')
            .where('vehicle.available = :available', { available: true })
            .getRawOne();
        return {
            min: parseFloat(result.min) || 0,
            max: parseFloat(result.max) || 0
        };
    }
    async findUserVehicles(userId) {
        return this.vehiclesRepository.find({
            where: { owner: { id: userId } },
            relations: ['reviews'],
        });
    }
    async updateAvailability(id, available, userId) {
        const vehicle = await this.findOne(id);
        if (vehicle.owner.id !== userId) {
            const user = await this.usersRepository.findOne({ where: { id: userId } });
            if (!user || user.role !== 'admin') {
                throw new common_1.ForbiddenException('You are not authorized to update this vehicle');
            }
        }
        vehicle.available = available;
        return this.vehiclesRepository.save(vehicle);
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map