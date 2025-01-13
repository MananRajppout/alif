import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession as unstable_getServerSession } from "next-auth/next";

async function connectDB() {
  try {
    const connect = await apiConnector;
    await connect.connectDB();
    return connect;
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





export async function GET(request: NextRequest) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const data = await connect.getEmployers();
    return NextResponse.json(
      {
        data,
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

