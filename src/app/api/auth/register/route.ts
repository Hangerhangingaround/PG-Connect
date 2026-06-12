import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { User, UserRole } from "@/models/User";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, password, role, permanentAddress, phone, gender } = body;

        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = await getDb();
        const userCol = db.collection("users");

        // Check if user exists
        const existing = await userCol.findOne({ Email: email });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser: User = {
            Id: crypto.randomUUID(),
            Name: name,
            Email: email,
            PasswordHash: passwordHash,
            Role: role as UserRole,
            PermanentAddress: permanentAddress,
            Phone: phone,
            Gender: gender || "OTHER",
            CreatedAt: new Date(),
            UpdatedAt: new Date(),
        };

        await userCol.insertOne(newUser);
        console.log("[REGISTER] User inserted into MongoDB:", email);

        // SYNC WITH .NET BACKEND
        try {
            console.log("[REGISTER] Attempting to sync with .NET Backend...");
            const backendRes = await fetch("http://localhost:5003/api/v1/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role: role === "PG_OWNER" ? "PG_OWNER" : "PayingGuest", // Map role if necessary
                    phoneNumber: phone,
                    permanentAddress: permanentAddress,
                    gender: gender || "OTHER"
                }),
            });

            if (backendRes.ok) {
                console.log("[REGISTER] .NET Backend sync successful");
            } else {
                const backendError = await backendRes.text();
                console.warn("[REGISTER] .NET Backend sync failed:", backendRes.status, backendError);
            }
        } catch (syncErr) {
            console.error("[REGISTER] Critical Error syncing with .NET Backend:", syncErr);
            // We still return success since they are in MongoDB, but warn in logs
        }

        return NextResponse.json({ success: true, user: { name: newUser.Name, email: newUser.Email, role: newUser.Role } });
    } catch (err: any) {
        console.error("Register Error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
