import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";

// Helper function to connect to the database
async function connectDB() {
  const connect = await apiConnector;
  await connect.connectDB();
}

// Handle GET request to fetch notifications
async function handleGet(req: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.substring(7) || session?.user.accessToken;

    if (!accessToken ) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const connect = await apiConnector;
    const notifications = await connect.getNotification(accessToken);

    return NextResponse.json(
      {
        message: "Successfully fetched recent activities",
        data: notifications,
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      {
        message: "Server Error",
        error: e.message,
      },
      { status: 500 }
    );
  }
}

// Handle POST request to create notifications
async function handlePost() {
  try {
    return NextResponse.json(
      {
        message: "Recent notification created successfully",
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

// Main handlers for GET and POST methods
export async function GET(req: NextRequest) {
  return handleGet(req);
}

export async function POST() {
  return handlePost();
}
