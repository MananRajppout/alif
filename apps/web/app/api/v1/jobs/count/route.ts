import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";

// Middleware to connect to the database
async function connectToDB() {
  const connect = await apiConnector;
  await connect.connectDB();
}

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // Connect to the database
    await connectToDB();

    // Fetch total count data
    const connect = await apiConnector;
    const countData = await connect.getTotalCount(req, res);

    // Send a successful response
    return NextResponse.json(
      {
        message: "Successfully found total count for jobs, resume, company",
        data: countData,        
      },
      { status: 200 }
    );
  } catch (e: any) {
    // Handle server errors
    console.log(e); 
    return NextResponse.json(
      {
        message: e.message,
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}
