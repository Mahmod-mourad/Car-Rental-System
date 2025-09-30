import { Repository } from 'typeorm';
import { Vehicle, VehicleType, FuelType, TransmissionType } from '../entities/vehicle.entity';
import { BaseRepository } from './base.repository';
export declare class VehicleRepository extends BaseRepository<Vehicle> {
    private readonly vehicleRepository;
    constructor(vehicleRepository: Repository<Vehicle>);
    findAvailableVehicles(startDate: Date, endDate: Date, type?: VehicleType, fuelType?: FuelType, transmission?: TransmissionType, minPrice?: number, maxPrice?: number): Promise<Vehicle[]>;
    findVehiclesByOwner(ownerId: string): Promise<Vehicle[]>;
    updateVehicleAvailability(id: string, available: boolean): Promise<void>;
}
