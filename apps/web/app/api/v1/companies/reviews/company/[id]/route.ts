// app/api/company/[id]/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Logic to fetch all reviews for the company using the `id`
    return NextResponse.json(
      { message: `Successfully fetched all reviews for company with ID: ${id}` },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}
