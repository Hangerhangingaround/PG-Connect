import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: pgId } = await params;
        const session = await getServerSession(authOptions);
        
        if (!session || (session.user as any).role !== "PG_OWNER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = (session.user as any).id;

        const body = await req.json();
        const { roomId, floorNumber, status, guestIdToCheckout } = body;

        if (!roomId || floorNumber === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = await getDb();
        const pgCol = db.collection("pg-listings");

        // Verify PG listing exists and belongs to the owner
        const pg = await pgCol.findOne({ Id: pgId });
        if (!pg) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }
        if (pg.OwnerId !== userId) {
            return NextResponse.json({ error: "Unauthorized property owner" }, { status: 403 });
        }

        // 1. Update room status if provided
        if (status) {
            await pgCol.updateOne(
                { Id: pgId, "Floors.FloorNumber": floorNumber, "Floors.Rooms.RoomId": roomId },
                { 
                    $set: { "Floors.$[f].Rooms.$[r].Status": status }
                },
                {
                    arrayFilters: [
                        { "f.FloorNumber": floorNumber },
                        { "r.RoomId": roomId }
                    ]
                }
            );
        }

        // 2. Checkout resident if provided
        if (guestIdToCheckout) {
            await pgCol.updateOne(
                { Id: pgId, "Floors.FloorNumber": floorNumber, "Floors.Rooms.RoomId": roomId },
                { 
                    $pull: { "Floors.$[f].Rooms.$[r].GuestIds": guestIdToCheckout },
                    $inc: { "Floors.$[f].Rooms.$[r].CurrentOccupancy": -1 }
                },
                {
                    arrayFilters: [
                        { "f.FloorNumber": floorNumber },
                        { "r.RoomId": roomId }
                    ]
                }
            );

            // Fetch room details again to auto-resolve capacity status
            const updatedPg = await pgCol.findOne({ Id: pgId });
            const floor = updatedPg?.Floors.find((f: any) => f.FloorNumber === floorNumber);
            const room = floor?.Rooms.find((r: any) => r.RoomId === roomId);

            if (room && room.CurrentOccupancy < room.MaxCapacity && room.Status === "FULL") {
                await pgCol.updateOne(
                    { Id: pgId, "Floors.FloorNumber": floorNumber, "Floors.Rooms.RoomId": roomId },
                    { $set: { "Floors.$[f].Rooms.$[r].Status": "AVAILABLE" } },
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
        console.error("Room Patch Error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
