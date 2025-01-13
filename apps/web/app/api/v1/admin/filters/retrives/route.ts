import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Handler for GET requests
export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const connect = await apiConnector;
    await connect.connectDB();

    const filters = await connect.getFilters(req, res);
    if (!filters) {
      return NextResponse.json(
        {
          message: "Sorry, no filters created yet",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Successfully found all filters",
        data: filters,
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

// Handler for POST requests
export async function POST(req: NextRequest) {
  try {
    const connect = await apiConnector;
    await connect.connectDB();

    const session = await getServerSession(authOptions);
    const authorization = req.headers.get("authorization");
    const accessToken = authorization?.substring(7) || session?.user.accessToken;

    if (!accessToken) {
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
      accessToken,
      body,
    };

    await connect.createFilter(reqQuery);

    return NextResponse.json(
      {
        message: "Filter created successfully",
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
