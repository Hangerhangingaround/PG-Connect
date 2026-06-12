import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files.length) {
            return NextResponse.json({ error: "No files provided" }, { status: 400 });
        }
        if (files.length > 50) {
            return NextResponse.json({ error: "Maximum 50 files allowed" }, { status: 400 });
        }

        const db = await getDb();
        const mediaCol = db.collection("media");
        const urls: string[] = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

            const isVideo = file.type.startsWith("video/");
            const uploadOptions: any = {
                folder: "pgconnect/uploads",
                resource_type: isVideo ? "video" : "image",
            };
            if (!isVideo) {
                uploadOptions.transformation = [{ quality: "auto", fetch_format: "auto" }];
            }

            let fileUrl = "";
            let publicId = "";

            try {
                // If api_key is missing, throw to fallback directly
                if (!cloudinary.config().api_key) {
                    throw new Error("Cloudinary api_key is missing");
                }
                const result = await cloudinary.uploader.upload(base64, uploadOptions);
                fileUrl = result.secure_url;
                publicId = result.public_id;
            } catch (cloudErr) {
                console.warn("Cloudinary upload failed, falling back to local storage:", cloudErr);
                
                const fs = require("fs").promises;
                const path = require("path");
                const uploadDir = path.join(process.cwd(), "public", "uploads");
                await fs.mkdir(uploadDir, { recursive: true });
                
                const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
                const filename = `${Date.now()}-${safeName}`;
                const filepath = path.join(uploadDir, filename);
                
                await fs.writeFile(filepath, buffer);
                fileUrl = `/uploads/${filename}`;
                publicId = `local-${filename}`;
            }

            // Store metadata in MongoDB
            await mediaCol.insertOne({
                Url: fileUrl,
                PublicId: publicId,
                OriginalName: file.name,
                MimeType: file.type,
                Size: file.size,
                Source: "direct_upload",
                CreatedAt: new Date(),
            });

            urls.push(fileUrl);
        }

        return NextResponse.json({ urls });
    } catch (err: unknown) {
        console.error("Upload error:", err);
        return NextResponse.json(
            { error: err instanceof Error ? err.message : "Upload failed" },
            { status: 500 }
        );
    }
}
