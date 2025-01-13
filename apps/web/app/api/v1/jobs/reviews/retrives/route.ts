import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Handle the logic for creating a job review here
    const body = await req.json(); // Parse the request body if needed

    // Perform any required operations with the parsed data (e.g., save review to DB)

    return NextResponse.json({
      message: "Job-review created successfully",
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}
