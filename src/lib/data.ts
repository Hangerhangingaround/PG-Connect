import { getDb } from "./mongodb";
import { PgListing, PgApplication } from "@/models";

export async function getOwnerPgs(ownerId: string) {
    const db = await getDb();
    const pgCol = db.collection("pg-listings");
    const listings = await pgCol.find({ OwnerId: ownerId }).sort({ CreatedAt: -1 }).toArray();
    return listings as unknown as PgListing[];
}

export async function getPgById(pgId: string) {
    const db = await getDb();
    const pgCol = db.collection("pg-listings");
    const pg = await pgCol.findOne({ Id: pgId });
    return pg as unknown as PgListing | null;
}

export async function getOwnerApplications(ownerId: string) {
    const db = await getDb();
    const appCol = db.collection("applications");
    const applications = await appCol.find({ OwnerId: ownerId }).sort({ CreatedAt: -1 }).toArray();
    return applications as unknown as PgApplication[];
}

export async function getGuestApplications(guestId: string) {
    const db = await getDb();
    const appCol = db.collection("applications");
    const applications = await appCol.find({ GuestId: guestId }).sort({ CreatedAt: -1 }).toArray();
    return applications as unknown as PgApplication[];
}
