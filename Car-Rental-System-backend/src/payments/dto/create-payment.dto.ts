import { PaymentMethod } from '../../database/entities/payment.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID of the booking this payment is for' })
  @IsUUID()
  @IsNotEmpty()
  booking_id: string;

  // The amount is not accepted from the client. The server charges whatever is
  // still owed on the booking. See PaymentsService.create.

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({
    required: false,
    description: 'Transaction ID from payment processor',
  })
  @IsString()
  @IsOptional()
  transaction_id?: string;

  @ApiProperty({ required: false, description: 'Additional payment details' })
  @IsOptional()
  metadata?: Record<string, any>;
}

export { PaymentMethod };
