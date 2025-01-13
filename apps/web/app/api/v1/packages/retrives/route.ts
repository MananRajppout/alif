import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

/**
 * Handles package-related API requests.
 */
export async function GET() {
  const connect = await apiConnector;
  // Connect to the database
  await connect.connectDB();

  try {
    const packages = await connect.getPackages();

    return NextResponse.json(
      {
        message: "Successfully fetched all packages",
        data: packages,
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

export async function POST(req: NextRequest) {
  const connect = await apiConnector;
  // Connect to the database
  await connect.connectDB();

  try {
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

    const body = await req.json(); // Parse the request body

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      body,
    };

    await connect.createPackage(reqQuery);

    return NextResponse.json(
      {
        message: "Package created successfully",
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
