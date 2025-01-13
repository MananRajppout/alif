import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";

// Helper: Connect to the database
async function connectToDB() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}

// GET: Search Resumes
export async function GET(req: NextRequest) {
  try {
    const connect = await connectToDB();
    const queries = Object.fromEntries(req.nextUrl.searchParams.entries()); // Convert search params to an object'

    // console.log("queries ===  ", queries);

    const resumeResult = await connect.getSearchResume(queries);
    const data = {
      resumes: resumeResult.resumes,
      totalResumeCount: resumeResult.resumeCount,
    };

    return NextResponse.json(
      { message: "Successfully searched resumes", data },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message, error: "Server Error" },
      { status: 500 }
    );
  }
}
