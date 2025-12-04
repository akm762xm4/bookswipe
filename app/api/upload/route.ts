import { NextResponse } from "next/server";
import { cloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export const runtime = "nodejs"; // ensure Node runtime for stream APIs

export async function POST(req: Request) {
  if (!isCloudinaryConfigured) {
    return NextResponse.json({ message: "Cloudinary not configured" }, { status: 503 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "bookswipe/books",
          resource_type: "image",
          format: "jpg",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(buffer);
    });

    return NextResponse.json(
      {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
      },
      { status: 201 }
    );
  } catch (e: any) {
    return NextResponse.json({ message: e?.message || "Upload failed" }, { status: 500 });
  }
}