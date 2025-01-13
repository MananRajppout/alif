import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Helper function to connect to the database
async function connectDB() {
  const connect = await apiConnector;
  await connect.connectDB();
}

// Handle GET request for notifications
async function handleGet() {
  try {
    return NextResponse.json(
      {
        message: "Successfully fetched all jobs",
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

// Handle POST request for creating email template
async function handlePost(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
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

    const body = await req.json();
    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      emailType: body.emailType,
      body,
    };

    const connect = await apiConnector;
    await connect.createEmailSettings(reqQuery);

    return NextResponse.json(
      {
        message: 'Email template created successfully',
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

// Main handler functions for GET and POST methods
export async function GET(req: NextRequest) {
  return handleGet();
}

export async function POST(req: NextRequest, context: { params: { id: string } }) {
  return handlePost(req, context);
}
