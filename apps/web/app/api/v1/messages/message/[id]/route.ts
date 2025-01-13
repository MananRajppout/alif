// app/api/message/[id]/route.ts
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";

// Connect to the database
async function connectDB() {
  const connect = await apiConnector;
  await connect.connectDB();
}

// Handle GET request to fetch messages
async function getMessages(req: NextRequest) {
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
      { message: "Successfully get message", data: message },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}

// Handle PUT request to update a message room
async function updateMessageRoom(req: NextRequest, { params }: { params: { id: string } }) {
  const connect = await apiConnector;
  try {
    await connectDB();
    const { id } = params; // Using params instead of searchParams
    const body = await req.json(); // Parse the request body

    const message = await connect.updateMessageRoom(id, body);

    if (message.length === 0) {
      return NextResponse.json({ message: "No Message Found", data: [] }, { status: 200 });
    }

    return NextResponse.json(
      { message: "Successfully updated message", data: message },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}

// Main function to handle different HTTP methods
export async function GET(req: NextRequest) {
  return getMessages(req);
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  return updateMessageRoom(req, context);
}
