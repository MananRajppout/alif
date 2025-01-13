import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// PUT handler
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    await connect.connectDB();

    const { id } = params; // Extract id from params
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

    const body = await req.json(); // Parse the request body
    const rewQuery = {
      accessToken,
      resumeId: id, // Use id from params
      resumeStatus: body.status, // Status from request body
    };

    const message = await connect.updateResumeStatus(rewQuery);

    return NextResponse.json(
      {
        message,
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
