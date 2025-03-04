// Update your app/api/upload/route.ts file

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    // Get the form data
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Create a unique filename
    const buffer = Buffer.from(await file.arrayBuffer());
    const uniqueId = nanoid(8);
    const extension = file.name.split(".").pop() || "jpg"; // Default to jpg if no extension
    const filename = `${uniqueId}.${extension}`;

    // Ensure directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (err) {
      // Directory might already exist, that's fine
    }

    // Save the file
    const path = join(uploadDir, filename);
    await writeFile(path, buffer);

    // Log for debugging
    console.log(`File saved to: ${path}`);

    // Return a properly formatted URL path with leading slash
    // This is critical for consistent image referencing
    const url = `/uploads/${filename}`;

    return NextResponse.json({
      url: url,
      message: "File uploaded successfully",
    });
  } catch (error: any) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      {
        error: error.message || "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}
