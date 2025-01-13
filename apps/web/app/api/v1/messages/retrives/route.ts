// app/api/message-room/route.ts
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
// Connect to the database
async function connectDB() {
  const connect = await apiConnector;
  await connect.connectDB();
}

// Handle GET request to fetch message rooms
async function getMessageRooms(req: NextRequest) {
  const connect = await apiConnector;
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.substring(7) || session?.user.accessToken;

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    const message = await connect.findMessageRoom(accessToken);

    if (message.length === 0) {
      return NextResponse.json({ message: "No Message Found", data: [] }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Fetched message rooms", data: message },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}

// Handle POST request to create message rooms
async function createMessageRoom(req: NextRequest) {
  const connect = await apiConnector;
  try {
    await connectDB();
    const body = await req.json(); // Parse the request body

    const message = await connect.createMessageRoom(body);

    if (message.length === 0) {
      return NextResponse.json(
        { message: "No Message Found", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Messages sent successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message, error: "Server Error" },
      { status: 500 }
    );
  }
}

// Main function to handle different HTTP methods
export async function GET(req: NextRequest) {
  return getMessageRooms(req);
}

export async function POST(req: NextRequest) {
  return createMessageRoom(req);
}
