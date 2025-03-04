// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost } from "../../../lib/blog-utils";

export async function GET() {
  try {
    const posts = await getAllPosts();

    // Convert MongoDB documents to plain objects with proper ID string conversion
    const serializedPosts = posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt ? post.createdAt.toISOString() : null,
      updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
    }));

    return NextResponse.json(serializedPosts);
  } catch (error: any) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Debug received data
    console.log("POST request data:", {
      title: data.title,
      slug: data.slug,
      contentExists: !!data.content,
      contentLength: data.content ? data.content.length : 0,
    });

    if (!data.content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // Sanitize HTML content if needed
    // (Consider adding a sanitization library like DOMPurify server-side)

    // Create the post
    const post = await createPost(data);

    // Convert MongoDB document to plain object for response
    const serializedPost = {
      ...post.toObject(),
      _id: post._id.toString(),
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      createdAt: post.createdAt ? post.createdAt.toISOString() : null,
      updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
    };

    return NextResponse.json(serializedPost);
  } catch (error: any) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: 500 }
    );
  }
}
