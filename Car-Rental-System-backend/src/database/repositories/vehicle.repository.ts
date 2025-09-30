import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, VehicleType, FuelType, TransmissionType } from '../entities/vehicle.entity';
import { BaseRepository } from './base.repository';

@Injectable()
export class VehicleRepository extends BaseRepository<Vehicle> {
  constructor(
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
  ) {
    super(vehicleRepository);
  }

  async findAvailableVehicles(
    startDate: Date,
    endDate: Date,
    type?: VehicleType,
    fuelType?: FuelType,
    transmission?: TransmissionType,
    minPrice?: number,
    maxPrice?: number,
  ): Promise<Vehicle[]> {
    const query = this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.bookings', 'booking')
      .where('vehicle.available = :available', { available: true })
      .andWhere(
        `(booking.id IS NULL OR 
        NOT (
          booking.start_date <= :endDate AND 
          booking.end_date >= :startDate AND
          booking.status IN ('confirmed', 'active')
        ))`,
        { startDate, endDate },
      );

    if (type) {
      query.andWhere('vehicle.type = :type', { type });
    }

    if (fuelType) {
      query.andWhere('vehicle.fuel_type = :fuelType', { fuelType });
    }

    if (transmission) {
      query.andWhere('vehicle.transmission = :transmission', { transmission });
    }

    if (minPrice) {
      query.andWhere('vehicle.price_per_day >= :minPrice', { minPrice });
    }

    if (maxPrice) {
      query.andWhere('vehicle.price_per_day <= :maxPrice', { maxPrice });
    }

    return query.getMany();
  }

  async findVehiclesByOwner(ownerId: string): Promise<Vehicle[]> {
    return this.vehicleRepository.find({ 
      where: { owner_id: ownerId },
      relations: ['bookings'],
    });
  }

  async updateVehicleAvailability(id: string, available: boolean): Promise<void> {
    await this.vehicleRepository.update(id, { available });
  }
}
