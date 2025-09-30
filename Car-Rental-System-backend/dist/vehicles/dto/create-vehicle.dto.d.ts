import { VehicleType, TransmissionType, FuelType } from '../../database/entities/vehicle.entity';
export declare class CreateVehicleDto {
    make: string;
    model: string;
    year: number;
    type: VehicleType;
    transmission: TransmissionType;
    fuel_type: FuelType;
    seats: number;
    price_per_day: number;
    available?: boolean;
    images?: string[];
    features?: Record<string, any>;
    location?: {
        lat: number;
        lng: number;
    };
    owner_id: string;
}
