import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Helper: Extract access token from headers or session
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

// POST: Create a job application
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const connect = await apiConnector;
    const accessToken = await getAccessToken(req);

    const applyData = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      coverLetter: formData.get("coverLetter") as string,
      jobItem: formData.get("jobItem") as string,
    };

    // Extract the CV file (if any) from form data
    const cvFile = formData.get("cvFile") as File | null;


    const reqQuery = { accessToken, applyData, cvFile };
    await connect.createJobApply(reqQuery);

    return NextResponse.json(
      { message: "You have successfully applied for a job" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}


// GET: Get all applications of the authenticated user
export async function GET(req: NextRequest) {
  try {
    const connect = await apiConnector;
    const accessToken = await getAccessToken(req);

    const applications = await connect.getUserApplication(accessToken);

    return NextResponse.json(
      {
        message: "Successfully fetched all applications for this user",
        data: applications,
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}
