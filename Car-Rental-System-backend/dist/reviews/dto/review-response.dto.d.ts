export declare class ReviewResponseDto {
    comment: string;
    responded_at: Date;
}
export declare class ReviewDto {
    id: string;
    rating: number;
    comment?: string;
    response?: ReviewResponseDto;
    created_at: Date;
    updated_at?: Date;
    user_id: string;
    user_name: string;
    vehicle_id: string;
    vehicle_name: string;
    booking_id: string;
}
