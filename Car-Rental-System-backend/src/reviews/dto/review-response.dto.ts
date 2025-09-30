import { ApiProperty } from '@nestjs/swagger';

export class ReviewResponseDto {
  @ApiProperty({ description: 'Response comment from the owner' })
  comment: string;

  @ApiProperty({ description: 'When the response was created' })
  responded_at: Date;
}

export class ReviewDto {
  @ApiProperty({ description: 'Unique identifier of the review' })
  id: string;

  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 })
  rating: number;

  @ApiProperty({ description: 'Optional review comment', required: false })
  comment?: string;

  @ApiProperty({ description: 'Optional response from the vehicle owner', type: ReviewResponseDto, required: false })
  response?: ReviewResponseDto;

  @ApiProperty({ description: 'When the review was created' })
  created_at: Date;

  @ApiProperty({ description: 'When the review was last updated', required: false })
  updated_at?: Date;

  @ApiProperty({ description: 'ID of the user who created the review' })
  user_id: string;

  @ApiProperty({ description: 'Name of the user who created the review' })
  user_name: string;

  @ApiProperty({ description: 'ID of the vehicle being reviewed' })
  vehicle_id: string;

  @ApiProperty({ description: 'Make and model of the vehicle being reviewed' })
  vehicle_name: string;

  @ApiProperty({ description: 'ID of the booking this review is for' })
  booking_id: string;
}
