// app/api/blogs/[id]/route.ts
import { NextResponse } from "next/server";
import blogDataLocal from "@/src/data/blogData.json";

// Handle GET request for a single blog using the id from params
export async function GET(
  request: Request, 
  { params }: { params: { slug: string } }
) {
  try {
    const blogId = params.slug;
    const blog = blogDataLocal.find((blog) => blog.slug === blogId);

    if (!blog) {
      return NextResponse.json(
        { message: "Blog not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully fetched a blog",
        data: blog,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Server error",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
