import { PaymentStatus } from '../../database/entities/payment.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  @ApiProperty({ enum: PaymentStatus, required: false })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  failure_reason?: string;
}

// Re-exported so existing imports of PaymentStatus from this module keep working,
// while there is only one definition of it.
export { PaymentStatus };
