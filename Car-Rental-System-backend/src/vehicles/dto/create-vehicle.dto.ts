import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { FuelType, TransmissionType, VehicleType } from '../../database/entities/vehicle.entity';

export class CoordinatesDto {
  @ApiProperty({ example: 30.0444 })
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat: number;

  @ApiProperty({ example: 31.2357 })
  @IsNumber()
  @Min(-180)
  @Max(180)
  lng: number;
}

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @MaxLength(100)
  make: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @MaxLength(100)
  model: string;

  @ApiProperty({ example: 2023 })
  @IsInt()
  @Min(1900)
  @Max(2100)
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

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(50)
  seats: number;

  @ApiProperty({ example: 250 })
  @IsNumber()
  @Min(0)
  price_per_day: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @ApiPropertyOptional({ example: 'Well maintained, full service history.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: 'Silver' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  color?: string;

  @ApiPropertyOptional({ example: 45000, description: 'Odometer reading in kilometres' })
  @IsOptional()
  @IsInt()
  @Min(0)
  mileage?: number;

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  doors?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  air_conditioning?: boolean;

  @ApiPropertyOptional({ example: 'Cairo International Airport' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location_name?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({ type: [String], example: ['GPS', 'Bluetooth'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  features?: string[];

  @ApiPropertyOptional({
    type: CoordinatesDto,
    description: 'Pickup coordinates, stored as a PostGIS point for radius search',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CoordinatesDto)
  location?: CoordinatesDto;

  // owner_id is not accepted. The owner is the authenticated user creating the
  // vehicle — letting a caller name the owner would let an agent file a vehicle
  // under someone else's account.
}
