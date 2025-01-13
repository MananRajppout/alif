// app/api/search/company/route.ts
import { NextResponse } from "next/server";
import { apiProvider as apiConnector } from "@/mongo/index";

// GET - Search for companies based on query parameters
export async function GET(request: Request) {
  const connect = await apiConnector;

  try {
    // Connect to the database
    await connect.connectDB();

    // Extract query parameters from the URL
    const { searchParams } = new URL(request.url);
    const queries: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      queries[key] = value;
    });

    // Fetch search results from the database
    const companyResult = await connect.getSearchCompany(queries);

    return NextResponse.json({
      message: "Successfully fetched all searched companies",
      data: companyResult,
    }, { status: 200 });

  } catch (e: any) {
    return NextResponse.json({
      message: e.message,
      error: "Server Error",
    }, { status: 500 });
  }
}
