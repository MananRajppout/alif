import { NextRequest, NextResponse } from "next/server";

// POST handler
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Extract `id` from `params`
    const { id } = params;

    return NextResponse.json(
      {
        message: "Successfully approved review",
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}

// PUT handler
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Extract `id` from `params`
    const { id } = params;

    return NextResponse.json(
      {
        message: "Successfully reported review",
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Server Error",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
