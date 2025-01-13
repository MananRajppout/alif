import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

/**
 * Call API function to fetch and update email settings.
 * @param {Object} options.
 * @returns {Object} Email settings data.
 */

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const connect = await apiConnector;
  // Connect to the database
  await connect.connectDB();

  try {
    const { id } = params; // Get emailType from params
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
      emailType: id,
    };

    const email = await connect.getEmailSettings(reqQuery);
    return NextResponse.json(
      {
        message: "Successfully fetched email template by email type",
        data: email,
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const connect = await apiConnector;
  // Connect to the database
  await connect.connectDB();

  try {
    const { id } = params; // Get emailType from params
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
      emailType: id,
      body,
    };

    await connect.updateEmailSettings(reqQuery);
    return NextResponse.json(
      {
        message: "Successfully updated email template",
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
