import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

// GET - Retrieves messages for a thread or lists all conversations for the user
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = (session.user as any).id;

        const { searchParams } = new URL(req.url);
        const receiverId = searchParams.get("receiverId");
        const pgId = searchParams.get("pgId");

        const db = await getDb();
        const msgCol = db.collection("messages");

        // Case A: Fetch a specific thread between two users for a specific PG
        if (receiverId && pgId) {
            // Find all messages between userId and receiverId for this pgId
            const messages = await msgCol.find({
                PgId: pgId,
                $or: [
                    { SenderId: userId, ReceiverId: receiverId },
                    { SenderId: receiverId, ReceiverId: userId }
                ]
            }).sort({ CreatedAt: 1 }).toArray();

            // Mark received messages as read
            await msgCol.updateMany(
                { SenderId: receiverId, ReceiverId: userId, PgId: pgId, Read: false },
                { $set: { Read: true } }
            );

            return NextResponse.json(JSON.parse(JSON.stringify(messages)));
        }

        // Case B: Fetch the list of all active conversations for the current user
        // Find all messages where the current user is sender or receiver
        const allMessages = await msgCol.find({
            $or: [{ SenderId: userId }, { ReceiverId: userId }]
        }).sort({ CreatedAt: -1 }).toArray();

        // Group messages by unique conversation key: otherUserId + "_" + pgId
        const conversationsMap = new Map<string, any>();
        const userCol = db.collection("users");
        const pgCol = db.collection("pg-listings");

        for (const msg of allMessages) {
            const otherUserId = msg.SenderId === userId ? msg.ReceiverId : msg.SenderId;
            const conversationKey = `${otherUserId}_${msg.PgId}`;

            if (!conversationsMap.has(conversationKey)) {
                // Determine unread count for this conversation (where userId is the receiver and Read is false)
                const unreadCount = allMessages.filter(m => 
                    m.SenderId === otherUserId && 
                    m.ReceiverId === userId && 
                    m.PgId === msg.PgId && 
                    !m.Read
                ).length;

                conversationsMap.set(conversationKey, {
                    OtherUserId: otherUserId,
                    PgId: msg.PgId,
                    LastMessage: msg,
                    UnreadCount: unreadCount
                });
            }
        }

        // Resolve details for each conversation (User names and PG Titles)
        const conversations = await Promise.all(
            Array.from(conversationsMap.values()).map(async (conv) => {
                const otherUser = await userCol.findOne({ Id: conv.OtherUserId });
                const pg = await pgCol.findOne({ Id: conv.PgId });

                return {
                    ...conv,
                    OtherUser: otherUser ? {
                        Name: otherUser.Name,
                        Email: otherUser.Email,
                        Role: otherUser.Role,
                        Phone: otherUser.Phone
                    } : {
                        Name: "System User",
                        Email: "system@pgconnect.com",
                        Role: "PAYING_GUEST"
                    },
                    PgTitle: pg?.Title || "Unknown stay"
                };
            })
        );

        return NextResponse.json(JSON.parse(JSON.stringify(conversations)));
    } catch (err: any) {
        console.error("GET chat error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

// POST - Sends a chat message
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = (session.user as any).id;

        const body = await req.json();
        const { receiverId, pgId, content } = body;

        if (!receiverId || !pgId || !content || !content.trim()) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const db = await getDb();
        const msgCol = db.collection("messages");

        const newMessage = {
            Id: crypto.randomUUID(),
            SenderId: userId,
            ReceiverId: receiverId,
            PgId: pgId,
            Content: content.trim(),
            CreatedAt: new Date(),
            Read: false
        };

        await msgCol.insertOne(newMessage);
        return NextResponse.json({ success: true, message: JSON.parse(JSON.stringify(newMessage)) });
    } catch (err: any) {
        console.error("POST chat error:", err);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
