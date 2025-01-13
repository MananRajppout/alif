// app/api/blogs/route.ts
import { NextResponse } from "next/server";
import blogDataLocal from "@/src/data/blogData.json";

// Handle GET requests to fetch all blogs
export async function GET() {
  try {
    return NextResponse.json({
      message: "Successfully fetched all blogs",
      data: blogDataLocal,
    }, {
      status: 200
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server error",
      error: e.message,
    }, {
      status: 500
    });
  }
}

// No need to handle onError and onNoMatch since the App Router
// automatically handles invalid method requests and errors.
