import { NextRequest, NextResponse } from "next/server";

/**
 * Handles fetching, updating, and deleting reviews based on HTTP methods.
 */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Fetch the review data here using `id`
    return NextResponse.json({
      message: "Successfully fetched review",
      data: { id }, // Example: Return the fetched review data
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json(); // Parse the request body

    // Update the review here using `id` and `body`
    return NextResponse.json({
      message: "Successfully updated review",
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Delete the review here using `id`
    return NextResponse.json({
      message: "Successfully deleted review",
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}
