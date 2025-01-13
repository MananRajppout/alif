import { apiProvider as apiConnector } from "@/mongo/index";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    return NextResponse.json(
      {
        message: "Thank you for giving us an email",
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
