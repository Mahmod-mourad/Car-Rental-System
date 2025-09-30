import { User } from './user.entity';
export declare class Profile {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
    avatar_url: string;
    address: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        postal_code?: string;
    };
    user: User;
    user_id: string;
}
