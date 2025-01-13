import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { requireUser } from "@/mongo/middleware/authenticate";
import UserModel from "@/mongo/models/user.model";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

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

async function getAccessToken(request: Request, session: any) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.substring(7);
  return accessToken || session?.user.accessToken || null;
}

export async function GET(request: NextRequest) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await getServerSession(authOptions);
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

    const user = await requireUser(accessToken);
    if (!user) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const events = await UserModel.find(
      {
        _id: user._id,
        registeredEvents: { $elemMatch: { status: "success" } },
      },
      {
        registeredEvents: {
          $filter: {
            input: "$registeredEvents",
            as: "event",
            cond: { $eq: ["$$event.status", "success"] },
          },
        },
      }
    );

    return NextResponse.json(
      {
        message: "Successfully fetched all public events",
        data: events,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch public events",
        error: error,
      },
      { status: 500 }
    );
  }
}
