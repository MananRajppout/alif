import { NextRequest, NextResponse } from "next/server";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession as unstable_getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function POST(req: NextRequest) {
  try {
    const connect = await apiConnector;
    await connect.connectDB();

    // Parse the form data using req.formData()
    const data = await req.formData();

    // Retrieve session and authentication details
    const session = await unstable_getServerSession(authOptions);
    const headers = req.headers;
    const accessToken = headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    // Prepare data for creating a category/job
    const reqData = {
      categoryTitle: data.get('categoryTitle') || "",
      subCategory: typeof data.get('subCategory') === 'string' ? (data.get('subCategory') as string).split(",") : [],
      categoryIcon: data.get('categoryIcon'),
      accessToken: session?.user.accessToken ? session?.user.accessToken : accessToken,
    };

    // Create the category/job
    const jobAlert = await connect.createCategory(reqData);

    // Send success response
    return NextResponse.json(
      {
        message: "Successfully created a job",
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
        error: "Server error",
      },
      { status: 500 }
    );
  }
}


// GET request to fetch all jobs
export async function GET() {
  try {
    const connect = await apiConnector;
    await connect.connectDB();

    // Retrieve categories
    const categories = await connect.getCategories();

    // Send success response
    return NextResponse.json(
      {
        message: "Successfully fetched all jobs",
        data: categories,
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
