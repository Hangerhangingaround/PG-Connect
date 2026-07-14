import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const email = session.user.email;

        const db = await getDb();
        const userCol = db.collection("users");

        // Find by Id first, fall back to Email
        let user = await userCol.findOne({ Id: userId });
        if (!user && email) {
            user = await userCol.findOne({ Email: email });
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Exclude sensitive details like PasswordHash
        const { PasswordHash, _id, ...safeUser } = user;

        return NextResponse.json(safeUser);
    } catch (err: any) {
        console.error("GET user settings error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        const email = session.user.email;

        const body = await req.json();
        const { name, phone, permanentAddress, gender, password, newPassword } = body;

        const db = await getDb();
        const userCol = db.collection("users");

        // Find user
        let user = await userCol.findOne({ Id: userId });
        if (!user && email) {
            user = await userCol.findOne({ Email: email });
        }

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const updateFields: any = {
            UpdatedAt: new Date()
        };

        if (name) updateFields.Name = name;
        if (phone !== undefined) updateFields.Phone = phone;
        if (permanentAddress !== undefined) updateFields.PermanentAddress = permanentAddress;
        if (gender) updateFields.Gender = gender;

        // Password change logic
        if (newPassword) {
            if (!password) {
                return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 });
            }

            if (!user.PasswordHash) {
                return NextResponse.json({ error: "Password cannot be changed because this account does not have a local password" }, { status: 400 });
            }

            const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
            if (!isPasswordValid) {
                return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
            }

            const salt = await bcrypt.genSalt(12);
            updateFields.PasswordHash = await bcrypt.hash(newPassword, salt);
        }

        // Update MongoDB
        await userCol.updateOne(
            { Id: user.Id },
            { $set: updateFields }
        );

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error("PUT user settings error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
