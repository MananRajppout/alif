import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

/**
 * Call API function to update notification status.
 * @param {Object} options.
 * @returns {Object} Status Update Response.
 */

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const connect = await apiConnector;
  // connect to database
  await connect.connectDB();

  try {
    const { id } = params; // Extracting id from params
    const { status } = await req.json(); // Parsing body

    const session = await getServerSession(authOptions);

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.substring(7) || session?.user.accessToken;

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      notificationId: id,
      status,
    };

    const notifications = await connect.updateNotification(reqQuery);

    return NextResponse.json(
      {
        message: "Successfully updated notification status",
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
