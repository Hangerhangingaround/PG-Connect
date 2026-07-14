import { UserRole } from "./User";

export type RoomStatus = "AVAILABLE" | "LOCKED" | "FULL";

export interface Room {
    RoomId: string;
    RoomNumber: string;
    Type: "Single" | "Double" | "Triple" | "Quadruple";
    Price: number;
    MaxCapacity: number;
    CurrentOccupancy: number;
    Status: RoomStatus;
    GuestIds: string[];
    Guests?: {
        Id: string;
        Name: string;
        Email: string;
        Phone?: string;
    }[];
}

export interface Floor {
    FloorNumber: number;
    Rooms: Room[];
}

export interface Landmark {
    Name: string;
    Distance: string;
}

export interface RentAgreement {
    MinMonths: number;
    MaxMonths: number;
    Conditions?: string;
}

export type GenderPreference = "MALE" | "FEMALE" | "ANY" | "OTHER";

export interface PgListing {
    Id: string;
    OwnerId: string;
    Title: string;
    Description: string;
    FullAddress: string;
    City: string;
    Area: string;
    Rent: number;
    SecurityDeposit: number;
    Amenities: string[];
    Equipment?: string[];
    NearbyLandmarks: Landmark[];
    Images: string[];
    Videos?: string[];
    RentAgreement: RentAgreement;
    Floors: Floor[];
    GenderPreference: GenderPreference;
    IsVerified: boolean;
    Latitude?: number;
    Longitude?: number;
    GoogleMapsUrl?: string;
    IsAcceptingGuests: boolean;
    CreatedAt: Date;
    UpdatedAt: Date;
}
