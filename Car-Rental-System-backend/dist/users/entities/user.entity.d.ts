export declare enum UserRole {
    ADMIN = "admin",
    CUSTOMER = "customer",
    AGENT = "agent"
}
export declare class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phoneNumber: string;
    avatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
}
