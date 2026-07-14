export interface Message {
    Id: string;
    SenderId: string;
    ReceiverId: string;
    PgId: string;
    Content: string;
    CreatedAt: string; // Stored as ISO string or Date, but string is safer for JSON serialization
    Read: boolean;
}
