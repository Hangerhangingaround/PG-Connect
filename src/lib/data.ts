import { getDb } from "./mongodb";
import { PgListing, PgApplication } from "@/models";

export async function getOwnerPgs(ownerId: string) {
    const db = await getDb();
    const pgCol = db.collection("pg-listings");
    const listings = await pgCol.find({ OwnerId: ownerId }).sort({ CreatedAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(listings)) as unknown as PgListing[];
}

export async function getPgById(pgId: string) {
    const db = await getDb();
    const pgCol = db.collection("pg-listings");
    const pg = await pgCol.findOne({ Id: pgId });
    if (!pg) return null;

    // Resolve details for guests assigned to rooms
    const userCol = db.collection("users");
    const updatedFloors = await Promise.all((pg.Floors || []).map(async (floor: any) => {
        const updatedRooms = await Promise.all((floor.Rooms || []).map(async (room: any) => {
            const guestIds = room.GuestIds || [];
            const guests = await Promise.all(guestIds.map(async (gid: string) => {
                const u = await userCol.findOne({ Id: gid });
                return u ? { Id: u.Id, Name: u.Name, Email: u.Email, Phone: u.Phone } : null;
            }));
            return {
                ...room,
                Guests: guests.filter(Boolean)
            };
        }));
        return {
            ...floor,
            Rooms: updatedRooms
        };
    }));

    const pgWithGuests = {
        ...pg,
        Floors: updatedFloors
    };

    return JSON.parse(JSON.stringify(pgWithGuests)) as unknown as PgListing | null;
}

export async function getOwnerApplications(ownerId: string) {
    const db = await getDb();
    const pgCol = db.collection("pg-listings");
    const ownerPgs = await pgCol.find({ OwnerId: ownerId }).toArray();
    const pgIds = ownerPgs.map(p => p.Id);

    const appCol = db.collection("applications");
    const applications = await appCol.find({ PgId: { $in: pgIds } }).sort({ CreatedAt: -1 }).toArray();

    // Resolve guest user details from users collection
    const userCol = db.collection("users");
    const appsWithGuest = await Promise.all(applications.map(async (app) => {
        let guestInfo = null;
        if (app.GuestId) {
            guestInfo = await userCol.findOne({ Id: app.GuestId });
            if (!guestInfo) {
                guestInfo = await userCol.findOne({ Email: app.GuestId });
            }
        }
        return {
            ...app,
            Guest: guestInfo ? {
                Name: guestInfo.Name,
                Email: guestInfo.Email,
                Phone: guestInfo.Phone || "Not Provided",
                College: (guestInfo as any).College || "Amity University"
            } : undefined
        };
    }));

    return JSON.parse(JSON.stringify(appsWithGuest)) as unknown as PgApplication[];
}

export async function getGuestApplications(guestId: string) {
    const db = await getDb();
    const appCol = db.collection("applications");
    const applications = await appCol.find({ GuestId: guestId }).sort({ CreatedAt: -1 }).toArray();
    return JSON.parse(JSON.stringify(applications)) as unknown as PgApplication[];
}
