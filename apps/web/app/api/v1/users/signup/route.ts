import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const connect = await apiConnector;
    await connect.connectDB(); // Connect to the database

    const userData = await req.json(); // Parse the JSON body from the request

    const user = await connect.createUser(userData); // Create user in the database

    return NextResponse.json({
      message: "Successfully Created User",
      data: user,
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({
      message: e.message,
      error: "Server Error",
    }, { status: 500 });
  }
}
