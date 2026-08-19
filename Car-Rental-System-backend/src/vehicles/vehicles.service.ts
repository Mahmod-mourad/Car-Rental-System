import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createPoint } from '../common/types/postgis.types';
import { Vehicle, VehicleType } from '../database/entities/vehicle.entity';
import { User, UserRole } from '../database/entities/user.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { subMonths } from 'date-fns';

export type VehicleSortField = 'price' | 'rating' | 'year' | 'name';
export type SortDirection = 'asc' | 'desc';

export interface SearchFilters {
  make?: string;
  model?: string;
  minYear?: number;
  maxYear?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  isFeatured?: boolean;
  available?: boolean;
  transmission?: string;
  fuelType?: string;
  minSeats?: number;
  search?: string;
  sortBy?: VehicleSortField;
  sortOrder?: SortDirection;
  location?: {
    lat: number;
    lng: number;
    radiusKm?: number;
  };
  page?: number;
  limit?: number;
}

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehiclesRepository: Repository<Vehicle>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createVehicleDto: CreateVehicleDto,
    userId: string,
  ): Promise<Vehicle> {
    const owner = await this.usersRepository.findOne({ where: { id: userId } });
    if (!owner) {
      throw new NotFoundException('Owner not found');
    }

    const { location, ...fields } = createVehicleDto;

    const vehicle = this.vehiclesRepository.create({
      ...fields,
      owner,
    });

    // A {lat, lng} pair cannot go into a geometry column directly. TypeORM accepts
    // GeoJSON for geometry columns, so the coordinates become a proper point —
    // which is what the radius search reads.
    if (location) {
      vehicle.location = createPoint(location.lng, location.lat);
    }

    return this.vehiclesRepository.save(vehicle);
  }

  async findAll(
    filters: SearchFilters = {},
  ): Promise<{ data: Vehicle[]; count: number }> {
    const {
      make,
      model,
      minYear,
      maxYear,
      type,
      minPrice,
      maxPrice,
      minRating,
      isFeatured,
      available,
      transmission,
      fuelType,
      minSeats,
      search,
      sortBy = 'name',
      sortOrder = 'asc',
      location,
      page = 1,
      limit = 10,
    } = filters;

    const query = this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.owner', 'owner')
      .leftJoinAndSelect('vehicle.reviews', 'reviews')
      .where('1=1');

    if (make) {
      query.andWhere('LOWER(vehicle.make) LIKE LOWER(:make)', {
        make: `%${make}%`,
      });
    }

    if (model) {
      query.andWhere('LOWER(vehicle.model) LIKE LOWER(:model)', {
        model: `%${model}%`,
      });
    }

    if (minYear) {
      query.andWhere('vehicle.year >= :minYear', { minYear });
    }

    if (maxYear) {
      query.andWhere('vehicle.year <= :maxYear', { maxYear });
    }

    if (type) {
      // Cast the type to VehicleType to ensure type safety
      const vehicleType = type as VehicleType;
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

    if (transmission) {
      query.andWhere('vehicle.transmission = :transmission', { transmission });
    }

    if (fuelType) {
      query.andWhere('vehicle.fuel_type = :fuelType', { fuelType });
    }

    if (minSeats !== undefined) {
      query.andWhere('vehicle.seats >= :minSeats', { minSeats });
    }

    if (search) {
      // One box over make and model, which is what the search field on the UI does.
      query.andWhere(
        '(LOWER(vehicle.make) LIKE LOWER(:search) OR LOWER(vehicle.model) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    if (location) {
      const { lat, lng, radiusKm = 50 } = location;
      if (lat && lng) {
        // Radius search against the vehicle's PostGIS point. Casting to geography
        // makes ST_DWithin measure in metres on the spheroid rather than in degrees.
        // The vehicles table has no latitude/longitude columns — the coordinates live
        // in the `location` geometry column, which is what this reads.
        query.andWhere('vehicle.location IS NOT NULL').andWhere(
          `ST_DWithin(
            vehicle.location::geography,
            ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
            :radius * 1000
          )`,
          { lng, lat, radius: radiusKm },
        );
      }
    }

    // Only these four columns can be sorted on. Passing the query parameter
    // straight into orderBy would let a caller name any column, or inject SQL.
    const sortColumns: Record<VehicleSortField, string> = {
      price: 'vehicle.price_per_day',
      rating: 'vehicle.average_rating',
      year: 'vehicle.year',
      name: 'vehicle.make',
    };

    const sortColumn = sortColumns[sortBy] ?? sortColumns.name;
    const direction = sortOrder === 'desc' ? 'DESC' : 'ASC';

    const [data, count] = await query
      .orderBy(sortColumn, direction)
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      count,
    };
  }

  async findOne(id: string): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: ['owner', 'reviews'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${id} not found`);
    }

    return vehicle;
  }

  async update(
    id: string,
    updateVehicleDto: UpdateVehicleDto,
    userId: string,
  ): Promise<Vehicle> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Check if the user is the owner or an admin
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const isAdmin = user?.role === UserRole.ADMIN;

    if (vehicle.owner.id !== userId && !isAdmin) {
      throw new ForbiddenException(
        'You are not authorized to update this vehicle',
      );
    }

    // location arrives as {lat, lng} and has to become a point, so it is applied
    // separately from the plain columns.
    const { location, ...updateData } = updateVehicleDto;

    Object.assign(vehicle, updateData);

    if (location) {
      vehicle.location = createPoint(location.lng, location.lat);
    }

    return this.vehiclesRepository.save(vehicle);
  }

  async remove(id: string, userId: string): Promise<void> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id },
      relations: ['owner'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    // Check if user is the owner or an admin
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    const isAdmin = user?.role === UserRole.ADMIN;

    if (vehicle.owner.id !== userId && !isAdmin) {
      throw new ForbiddenException(
        'You do not have permission to delete this vehicle',
      );
    }

    await this.vehiclesRepository.remove(vehicle);
  }

  async findFeatured(limit: number = 6): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      where: {
        is_featured: true,
        available: true,
      },
      relations: ['reviews', 'owner'],
      order: {
        average_rating: 'DESC',
        created_at: 'DESC',
      },
      take: limit,
    });
  }

  async findLatest(limit: number = 6): Promise<Vehicle[]> {
    const oneMonthAgo = subMonths(new Date(), 1);

    return this.vehiclesRepository.find({
      where: {
        available: true,
        created_at: MoreThanOrEqual(oneMonthAgo),
      },
      relations: ['reviews', 'owner'],
      order: {
        created_at: 'DESC' as const,
      },
      take: limit,
    });
  }

  async findSimilar(vehicleId: string, limit: number = 4): Promise<Vehicle[]> {
    const vehicle = await this.vehiclesRepository.findOne({
      where: { id: vehicleId },
      relations: ['reviews'],
    });

    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }

    const similarVehicles = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.reviews', 'reviews')
      .leftJoinAndSelect('vehicle.owner', 'owner')
      .where('vehicle.id != :vehicleId', { vehicleId })
      .andWhere('vehicle.available = :available', { available: true })
      .andWhere((qb) => {
        // Find vehicles with same type or same make
        const subQuery = qb
          .subQuery()
          .select('v.id')
          .from('vehicle', 'v')
          .where('v.type = :type', { type: vehicle.type })
          .orWhere('v.make = :make', { make: vehicle.make })
          .andWhere('v.id != :vehicleId', { vehicleId })
          .getQuery();
        return `vehicle.id IN ${subQuery}`;
      })
      .orderBy(
        '(SELECT AVG(r.rating) FROM review r WHERE r.vehicle_id = vehicle.id)',
        'DESC',
      )
      .addOrderBy('vehicle.created_at', 'DESC')
      .take(limit)
      .getMany();

    return similarVehicles;
  }

  async getPopularBrands(
    limit: number = 5,
  ): Promise<{ brand: string; count: number }[]> {
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

  async getPriceRange(): Promise<{ min: number; max: number }> {
    const result = await this.vehiclesRepository
      .createQueryBuilder('vehicle')
      .select('MIN(vehicle.price_per_day)', 'min')
      .addSelect('MAX(vehicle.price_per_day)', 'max')
      .where('vehicle.available = :available', { available: true })
      .getRawOne();

    return {
      min: parseFloat(result.min) || 0,
      max: parseFloat(result.max) || 0,
    };
  }

  async findUserVehicles(userId: string): Promise<Vehicle[]> {
    return this.vehiclesRepository.find({
      where: { owner: { id: userId } },
      relations: ['reviews'],
    });
  }

  async updateAvailability(
    id: string,
    available: boolean,
    userId: string,
  ): Promise<Vehicle> {
    const vehicle = await this.findOne(id);

    // Check if the user is the owner or an admin
    if (vehicle.owner.id !== userId) {
      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user || user.role !== UserRole.ADMIN) {
        throw new ForbiddenException(
          'You are not authorized to update this vehicle',
        );
      }
    }

    vehicle.available = available;
    return this.vehiclesRepository.save(vehicle);
  }
}
