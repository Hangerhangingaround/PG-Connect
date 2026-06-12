import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { PgListing } from "@/models/PgListing";
import crypto from "crypto";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
 
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const ownerId = searchParams.get("ownerId");
        
        const db = await getDb();
        const pgCol = db.collection("pg-listings");
 
        let query: any = ownerId ? { OwnerId: ownerId } : {};
        
        const gender = searchParams.get("gender");
        if (gender) {
            query.$or = [
                { GenderPreference: gender },
                { GenderPreference: "ANY" }
            ];
        }

        const listings = await pgCol.find(query).sort({ CreatedAt: -1 }).toArray();
 
        return NextResponse.json(listings);
    } catch (err: any) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
 
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        console.log("POST /api/pg-listings - Session found:", !!session);
 
        if (!session || (session.user as any).role !== "PG_OWNER") {
            console.log("POST /api/pg-listings - Unauthorized access attempt. Session:", JSON.stringify(session?.user || "null"));
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
 
        const body = await req.json();
        const db = await getDb();
        const pgCol = db.collection("pg-listings");
 
        const newListing: PgListing = {
            ...body,
            OwnerId: (session.user as any).id,
            Id: crypto.randomUUID(),
            GenderPreference: body.GenderPreference || "ANY",
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
            IsVerified: false,
            IsAcceptingGuests: true
        };
 
        await pgCol.insertOne(newListing);
 
        return NextResponse.json({ success: true, id: newListing.Id });
    } catch (err: any) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
