import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "../../../../lib/mongodb";
import Post from "../../../../models/Post";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Slug parameter is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const existingPost = await Post.findOne({ slug });

    return NextResponse.json({ exists: !!existingPost });
  } catch (error) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { error: "Failed to check slug" },
      { status: 500 }
    );
  }
}
