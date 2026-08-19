import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID of the vehicle to book' })
  @IsUUID()
  @IsNotEmpty()
  vehicle_id: string;

  @ApiProperty({ description: 'First day of the rental (ISO 8601 date)' })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({ description: 'Return day of the rental (ISO 8601 date)' })
  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  // total_price is deliberately not accepted from the client. The server prices
  // the booking from the vehicle's price_per_day so a caller cannot pick its own
  // total. See BookingsService.create.

  @ApiPropertyOptional({ description: 'Free-text notes for the rental' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  @ApiPropertyOptional({ description: 'Where the renter collects the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  pickup_location?: string;

  @ApiPropertyOptional({ description: 'Where the renter returns the vehicle' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  return_location?: string;

  @ApiPropertyOptional({ description: "The renter's driving licence number" })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  driver_license?: string;
}
