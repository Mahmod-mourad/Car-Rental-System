import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsBoolean, IsOptional, IsArray, IsUUID } from 'class-validator';
import { VehicleType, TransmissionType, FuelType } from '../../database/entities/vehicle.entity';

export class CreateVehicleDto {
  @ApiProperty()
  @IsString()
  make: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ enum: TransmissionType })
  @IsEnum(TransmissionType)
  transmission: TransmissionType;

  @ApiProperty({ enum: FuelType })
  @IsEnum(FuelType)
  fuel_type: FuelType;

  @ApiProperty()
  @IsNumber()
  seats: number;

  @ApiProperty()
  @IsNumber()
  price_per_day: number;

  @ApiProperty({ required: false, default: true })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  @ApiProperty({ required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ 
    required: false, 
    type: Object,
    additionalProperties: { type: 'any' },
    example: { hasGPS: true, hasBluetooth: true }
  })
  @IsOptional()
  features?: Record<string, any>;

  @ApiProperty({ 
    required: false, 
    type: Object,
    example: { lat: 37.7749, lng: -122.4194 },
    description: 'Geographic coordinates of the vehicle location'
  })
  @IsOptional()
  location?: { lat: number; lng: number };

  @ApiProperty()
  @IsUUID()
  owner_id: string;
}
