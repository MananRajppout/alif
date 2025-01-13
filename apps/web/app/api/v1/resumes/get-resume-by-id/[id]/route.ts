import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

/**
 * Connect to the database.
 */
async function connectToDatabase() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}



/**
 * Handler for fetching all resumes of a candidate.
 */
export async function GET(req: NextRequest,{ params }: { params: { id: string } }) {
  const connect = await connectToDatabase();

  try {
    const session = await getServerSession( authOptions);

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

    const resume = await connect.getResumeById(params.id);

    return NextResponse.json(
      {
        message: "Successfully fetched all resumes",
        data: resume,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Server error",
        error: e.message,
      },
      { status: 500 }
    );
  }
}
