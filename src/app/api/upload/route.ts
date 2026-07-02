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
        if (!cloudinary.config().api_key) {
            return NextResponse.json(
                { error: "Cloudinary is not configured. Please set the CLOUDINARY_URL environment variable." },
                { status: 500 }
            );
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

            const result = await cloudinary.uploader.upload(base64, uploadOptions);
            const fileUrl = result.secure_url;
            const publicId = result.public_id;

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
