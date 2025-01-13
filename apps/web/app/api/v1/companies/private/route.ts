// app/api/companies/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextResponse } from "next/server";
import { getServerSession as unstable_getServerSession } from "next-auth/next";

// Helper to connect to the database
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

// Helper to get access token from session or headers
async function getAccessToken(request: Request, session: any) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.substring(7);
  return accessToken || session?.user.accessToken || null;
}

// GET - Fetch all private companies
export async function GET(request: Request) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    // Fetch private companies
    const companies = await connect.findCompanyPrivate(accessToken);

    return NextResponse.json(
      {
        message: "Successfully fetched all private companies",
        data: companies,
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

// Default response for other methods
export async function POST() {
  return NextResponse.json(
    {
      message: "Unknown request",
    },
    { status: 400 }
  );
}
