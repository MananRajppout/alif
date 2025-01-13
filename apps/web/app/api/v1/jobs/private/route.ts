import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Middleware to connect to the database
async function connectToDB() {
  const connect = await apiConnector;
  await connect.connectDB();
}

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch session and headers
    const session = await getServerSession(authOptions);
    const headers = req.headers;
    const authorizationHeader = headers.get("authorization");

    // Extract access token
    const accessToken = authorizationHeader
      ? authorizationHeader.substring(7)
      : null;

    // Check if user is authenticated
    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    // Fetch private jobs using the session's accessToken or authorization token
    const connect = await apiConnector;
    const jobs = await connect.getJobsPrivate(
      session?.user.accessToken ? session.user.accessToken : accessToken
    );

    // Send a successful response
    return NextResponse.json(
      {
        message: "Successfully fetched all private jobs",
        data: jobs,
      },
      { status: 200 }
    );
  } catch (e: any) {
    // Handle server errors
    return NextResponse.json(
      {
        message: e.message,
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}
