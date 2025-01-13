import { NextRequest, NextResponse } from "next/server";
import { apiProvider as apiConnector } from "@/mongo/index";
// GET request handler
export async function GET(req: NextRequest) {
  try {
    const connect = await apiConnector;
    // Connect to the database
    await connect.connectDB();

    // Extract query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const queries = Object.fromEntries(searchParams.entries());

    console.log("Queries: ", queries);  

    // Fetch the jobs based on the queries
    const jobResult = await connect.getSearchJobs(queries);

    return NextResponse.json(
      {
        message: "Successfully fetched all searched jobs",
        data: jobResult,
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
