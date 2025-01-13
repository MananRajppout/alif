import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { Formidable } from "formidable";


// Middleware to connect to the database
async function connectToDB() {
  const connect = await apiConnector;
  await connect.connectDB();
}

// POST request handler to create a job
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    // Handle the form data using req.formData()
    const data = await req.formData();

    // Get session and access token
    const session = await getServerSession(authOptions);
    const headers = req.headers;
    const accessToken = headers.get('authorization')?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    // Process job data
    const jobData = {
      company: data.get('company') || "",
      jobTitle: data.get('jobTitle') || "",
      location: data.get('location') || "",
      region: data.get('region') || "",
      //@ts-ignore
      jobTypes: data.get('jobTypes')?.split(",") ?? [],
      category: data.get('category') || "",
      jobExperience: data.get('jobExperience') || "",
      //@ts-ignore
      specialTags: typeof data.get('specialTags') === 'string' && data.get('specialTags') ? data.get('specialTags').split(",") : [],
      jobDescription: data.get('jobDescription') || "",
      email: data.get('email') || "",
      applyDeadline: data.get('applyDeadline') || "",
      hourlyrate: {
        minimum: data.get('hourlyrateMinimum') || "",
        maximum: data.get('hourlyrateMaximum') || "",
      },
      salary: {
        minimum: data.get('salaryMinimum') || "",
        maximum: data.get('salaryMaximum') || "",
      },
      applyLink: data.get('applyLink') || "",
    };

    const headerImage = data.get('headerImage') ? data.get('headerImage') : null;

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      jobData,
      headerImage,
    };

    // Create a job using the connector
    const connect = await apiConnector;
    await connect.createJob(reqQuery);

    return NextResponse.json(
      { message: "Successfully created a job" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );
  }
}

// GET request handler to fetch all jobs
export async function GET() {
  try {
    await connectToDB();

    // Fetch jobs
    const connect = await apiConnector;
    const jobs = await connect.getJobs();

    return NextResponse.json(
      { message: "Successfully fetched all jobs", data: jobs },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server error", error: e.message },
      { status: 500 }
    );
  }
}
