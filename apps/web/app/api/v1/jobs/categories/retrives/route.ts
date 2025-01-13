import { apiProvider as apiConnector } from "@/mongo/index";
import { NextResponse } from "next/server";

// GET: Fetch all categories
export async function GET() {
  try {
    const connect = await apiConnector;
    await connect.connectDB();

    const categories = await connect.getCategories();

    return NextResponse.json(
      {
        message: "Successfully fetched all categories",
        data: categories,
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
