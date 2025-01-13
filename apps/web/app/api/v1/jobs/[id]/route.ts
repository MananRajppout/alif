import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { requireEmployer } from "@/mongo/middleware/authenticate";
import JobModel from "@/mongo/models/job.model";
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

    const user = await requireEmployer(accessToken);
    if(!user){
        NextResponse.json(
            { message: "User not authenticated", error: "Server Error" },
            { status: 401 }
          );
    }


    const companyId = params.id;
    
    const jobs = await JobModel.find({
        company: companyId,
    })


    return NextResponse.json(
      {
        message: "Successfully found all applications for this company",
        data: jobs,
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
