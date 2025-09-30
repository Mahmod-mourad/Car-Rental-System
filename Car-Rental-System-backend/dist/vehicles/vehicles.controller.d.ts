import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from '../database/entities/vehicle.entity';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(createVehicleDto: CreateVehicleDto, req: any): Promise<Vehicle>;
    findAll(make?: string, model?: string, minYear?: number, maxYear?: number, type?: string, minPrice?: number, maxPrice?: number, minRating?: number, isFeatured?: string, available?: boolean, lat?: number, lng?: number, radiusKm?: number, page?: number, limit?: number): Promise<{
        data: Vehicle[];
        count: number;
    }>;
    getFeaturedVehicles(limit: number): Promise<Vehicle[]>;
    getLatestVehicles(limit: number): Promise<Vehicle[]>;
    getSimilarVehicles(id: string, limit: number): Promise<Vehicle[]>;
    getPopularBrands(limit: number): Promise<{
        brand: string;
        count: number;
    }[]>;
    getPriceRange(): Promise<{
        min: number;
        max: number;
    }>;
    findUserVehicles(req: any): Promise<Vehicle[]>;
    findOne(id: string): Promise<Vehicle>;
    update(id: string, updateVehicleDto: UpdateVehicleDto, req: any): Promise<Vehicle>;
    remove(id: string, req: any): Promise<void>;
    updateAvailability(id: string, available: boolean, req: any): Promise<Vehicle>;
}
