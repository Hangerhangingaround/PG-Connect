import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { PgApplication } from "@/models/PgApplication";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const ownerId = searchParams.get("ownerId");
        const pgId = searchParams.get("pgId");

        const db = await getDb();
        const appCol = db.collection("applications");

        let query: any = {};
        if (pgId) {
            query.PgId = pgId;
        } else if (ownerId) {
            const pgCol = db.collection("pg-listings");
            const ownerPgs = await pgCol.find({ OwnerId: ownerId }).toArray();
            const pgIds = ownerPgs.map(p => p.Id);
            query.PgId = { $in: pgIds };
        }

        const apps = await appCol.find(query).sort({ CreatedAt: -1 }).toArray();

        // Resolve guest user details from users collection
        const userCol = db.collection("users");
        const appsWithGuest = await Promise.all(apps.map(async (app) => {
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
                } : {
                    Name: "Aman Sharma",
                    Email: "aman.sharma@gmail.com",
                    Phone: "+91 98765 43210",
                    College: "Amity University"
                }
            };
        }));

        return NextResponse.json(appsWithGuest);
    } catch (err: any) {
        console.error("GET applications error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
 
        const body = await req.json();
        const db = await getDb();
        const appCol = db.collection("applications");

        const newApp: PgApplication = {
            ...body,
            Id: crypto.randomUUID(),
            Status: "PENDING",
            CreatedAt: new Date()
        };

        await appCol.insertOne(newApp);
        return NextResponse.json({ success: true, id: newApp.Id });
    } catch (err: any) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "PG_OWNER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
 
        const body = await req.json(); // { id, status, floorNumber, roomId }
        const { id, status, floorNumber, roomId, pgId } = body;

        const db = await getDb();
        const appCol = db.collection("applications");
        const pgCol = db.collection("pg-listings");

        await appCol.updateOne({ Id: id }, { $set: { Status: status } });

        if (status === "APPROVED" && pgId && roomId) {
            // Update occupancy in PG listing
            await pgCol.updateOne(
                { Id: pgId, "Floors.FloorNumber": floorNumber, "Floors.Rooms.RoomId": roomId },
                { 
                    $inc: { "Floors.$[f].Rooms.$[r].CurrentOccupancy": 1 }
                },
                {
                    arrayFilters: [
                        { "f.FloorNumber": floorNumber },
                        { "r.RoomId": roomId }
                    ]
                }
            );

            // Fetch updated room to see if it's full
            const pg = await pgCol.findOne({ Id: pgId });
            const floor = pg?.Floors.find((f: any) => f.FloorNumber === floorNumber);
            const room = floor?.Rooms.find((r: any) => r.RoomId === roomId);

            if (room && room.CurrentOccupancy >= room.MaxCapacity) {
                await pgCol.updateOne(
                    { Id: pgId, "Floors.FloorNumber": floorNumber, "Floors.Rooms.RoomId": roomId },
                    { $set: { "Floors.$[f].Rooms.$[r].Status": "FULL" } },
                    {
                        arrayFilters: [
                            { "f.FloorNumber": floorNumber },
                            { "r.RoomId": roomId }
                        ]
                    }
                );
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("Patch Error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
