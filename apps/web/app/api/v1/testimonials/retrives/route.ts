import testimonialsDataLocal from "@/src/data/testimonialsData.json";
import { NextRequest, NextResponse } from "next/server";
import { apiProvider as apiConnector } from "@/mongo/index";

// Helper: Connect to the database
async function connectToDB() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}

// GET: Fetch all testimonials
export async function GET(_req: NextRequest) {
  try {
    await connectToDB();

    return NextResponse.json(
      {
        message: "Successfully fetched all testimonials",
        data: testimonialsDataLocal,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}
