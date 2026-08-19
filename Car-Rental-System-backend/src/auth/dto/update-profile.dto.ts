import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'Nour' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  first_name?: string;

  @ApiPropertyOptional({ example: 'Hassan' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  last_name?: string;

  @ApiPropertyOptional({ example: '+201234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  // email and role are absent on purpose — see AuthService.updateProfile.
}
