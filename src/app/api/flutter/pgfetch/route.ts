import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const city = searchParams.get("city");
        const area = searchParams.get("area");
        
        const db = await getDb();
        const pgCol = db.collection("pg-listings");

        let query: any = {};
        if (city) query.City = city;
        if (area) query.Area = area;
        
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
        console.error("Flutter PGFetch Error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
