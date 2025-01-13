import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Changed to the new import

export async function GET(req: NextRequest) {
  try {
    const connect = await apiConnector;
    await connect.connectDB(); // Connect to the database

    const session = await getServerSession(authOptions); // Use getServerSession instead of unstable_getServerSession

    const accessToken = req.headers.get('authorization')?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const data = await connect.getDashboardStat(
      session?.user.accessToken ? session?.user.accessToken : accessToken
    );

    return NextResponse.json(
      {
        message: "Successfully fetched user dashboard statistics",
        data,
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
