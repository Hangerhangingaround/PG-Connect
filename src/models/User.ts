export type UserRole = "PAYING_GUEST" | "PG_OWNER" | "ADMIN";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export interface User {
    Id: string;
    Role: UserRole;
    Name: string;
    Email: string;
    Phone?: string;
    PermanentAddress: string;
    Gender: Gender;
    AvatarUrl?: string;
    PasswordHash?: string;
    CreatedAt: Date;
    UpdatedAt: Date;
}
