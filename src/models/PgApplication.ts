export interface PgApplication {
    Id: string;
    GuestId: string;
    PgId: string;
    FloorNumber?: number;
    RoomId?: string;
    Conditions: string;
    Guest?: {
        Name: string;
        Email: string;
        Phone: string;
        College?: string;
    };
    Status: "PENDING" | "APPROVED" | "REJECTED";
    CreatedAt: Date;
}
