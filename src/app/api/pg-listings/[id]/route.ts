import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const db = await getDb();
        const pgCol = db.collection("pg-listings");

        const pg = await pgCol.findOne({ Id: id });
        if (!pg) {
            return NextResponse.json({ error: "PG not found" }, { status: 404 });
        }

        return NextResponse.json(pg);
    } catch (err: any) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "PG_OWNER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const db = await getDb();
        const pgCol = db.collection("pg-listings");

        // Verify ownership
        const existingPg = await pgCol.findOne({ Id: id });
        if (!existingPg) {
            return NextResponse.json({ error: "PG not found" }, { status: 404 });
        }
        if (existingPg.OwnerId !== (session.user as any).id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Exclude Id, OwnerId, CreatedAt, and _id from updates
        const { Id, OwnerId, CreatedAt, _id, ...updateFields } = body;
        
        await pgCol.updateOne(
            { Id: id },
            { 
                $set: { 
                    ...updateFields,
                    UpdatedAt: new Date()
                } 
            }
        );

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("PUT listing error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "PG_OWNER") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const db = await getDb();
        const pgCol = db.collection("pg-listings");

        // Verify ownership
        const existingPg = await pgCol.findOne({ Id: id });
        if (!existingPg) {
            return NextResponse.json({ error: "PG not found" }, { status: 404 });
        }
        if (existingPg.OwnerId !== (session.user as any).id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await pgCol.deleteOne({ Id: id });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("DELETE listing error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
