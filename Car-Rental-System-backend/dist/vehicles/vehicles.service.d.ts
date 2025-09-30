import { Repository } from 'typeorm';
import { Vehicle } from '../database/entities/vehicle.entity';
import { User } from '../database/entities/user.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
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
    location?: {
        lat: number;
        lng: number;
        radiusKm?: number;
    };
    page?: number;
    limit?: number;
}
export declare class VehiclesService {
    private vehiclesRepository;
    private usersRepository;
    constructor(vehiclesRepository: Repository<Vehicle>, usersRepository: Repository<User>);
    create(createVehicleDto: CreateVehicleDto, userId: string): Promise<Vehicle>;
    findAll(filters?: SearchFilters): Promise<{
        data: Vehicle[];
        count: number;
    }>;
    findOne(id: string): Promise<Vehicle>;
    update(id: string, updateVehicleDto: UpdateVehicleDto, userId: string): Promise<Vehicle>;
    remove(id: string, userId: string): Promise<void>;
    findFeatured(limit?: number): Promise<Vehicle[]>;
    findLatest(limit?: number): Promise<Vehicle[]>;
    findSimilar(vehicleId: string, limit?: number): Promise<Vehicle[]>;
    getPopularBrands(limit?: number): Promise<{
        brand: string;
        count: number;
    }[]>;
    getPriceRange(): Promise<{
        min: number;
        max: number;
    }>;
    findUserVehicles(userId: string): Promise<Vehicle[]>;
    updateAvailability(id: string, available: boolean, userId: string): Promise<Vehicle>;
}
