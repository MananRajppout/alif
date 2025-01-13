import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Helper: Get access token from headers or session
async function getAccessToken(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const authorizationHeader = req.headers.get("authorization");

  const accessToken = authorizationHeader
    ? authorizationHeader.substring(7)
    : session?.user.accessToken;

  if (!accessToken) {
    throw new Error("User not authenticated");
  }
  return accessToken;
}

// GET: Fetch all job applications
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    const accessToken = await getAccessToken(req);

    const jobID = params.id;
    const reqQuery = { accessToken, jobID };
    const japplyData = await connect.getJobApplication(reqQuery);

    return NextResponse.json(
      {
        message: "Successfully found all applications for this job",
        data: japplyData,
      },
      { status: 200 }
    );
  } catch (e: any) {
    const status = e.message === "User not authenticated" ? 401 : 500;
    return NextResponse.json(
      { message: e.message, error: "Server Error" },
      { status }
    );
  }
}

// PUT: Update job application status
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    const accessToken = await getAccessToken(req);

    const applyId = params.id;
    const { status } = await req.json();
    const applyData = { status };

    const reqQuery = { accessToken, applyData, applyId };
    const application = await connect.updateApplyStatus(reqQuery);

    if (!application) {
      return NextResponse.json(
        { message: "Application Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Application Updated", application },
      { status: 200 }
    );
  } catch (e: any) {
    const status = e.message === "User not authenticated" ? 401 : 500;
    return NextResponse.json(
      { message: e.message, error: "Server Error" },
      { status }
    );
  }
}
