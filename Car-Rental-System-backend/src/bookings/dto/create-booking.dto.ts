import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'ID of the vehicle to book' })
  @IsUUID()
  @IsNotEmpty()
  vehicle_id: string;

  @ApiProperty({ description: 'Start date of the booking (ISO 8601 format)' })
  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @ApiProperty({ description: 'End date of the booking (ISO 8601 format)' })
  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @ApiProperty({ description: 'Total price for the booking' })
  @IsNumber()
  @Min(0)
  total_price: number;

  @ApiProperty({ required: false, description: 'Additional notes for the booking' })
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ required: false })
  notes?: string;
}
