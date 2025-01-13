import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Helper function to connect to the database
async function connectDB() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}



export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const connect = await connectDB();
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.slice(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("headerImage") as File;
    const headerImage =  file;

    const jobData = {
      company: formData.get("company"),
      jobTitle: formData.get("jobTitle"),
      location: formData.get("location"),
      region: formData.get("region"),
      jobTypes: formData.get("jobTypes")?.toString().split(","),
      category: formData.get("category"),
      jobExperience: formData.get("jobExperience"),
      specialTags: formData.get("specialTags")?.toString().split(","),
      jobDescription: formData.get("jobDescription"),
      email: formData.get("email"),
      applyDeadline: formData.get("applyDeadline"),
      hourlyrate: {
        minimum: formData.get("hourlyrateMinimum"),
        maximum: formData.get("hourlyrateMaximum"),
      },
      salary: {
        minimum: formData.get("salaryMinimum"),
        maximum: formData.get("salaryMaximum"),
      },
      applyLink: formData.get("applyLink"),
    };

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      jobData,
      headerImage,
      jobID: params.id,
    };

    await connect.updateJob(reqQuery);
    return NextResponse.json({ message: "Successfully updated job" });
  } catch (e: any) {
    return NextResponse.json({ message: "Server error", error: e.message }, { status: 500 });
  }
};

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const connect = await connectDB();
    const job = await connect.getSingleJob(params.id);

    if (!job) {
      return NextResponse.json({ message: "Job Not Found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Job Found",
      data: job.job,
      relatedJobs: job.relatedJobs,
    });
  } catch (e: any) {
    return NextResponse.json({ message: "Server Error", error: e.message }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const connect = await connectDB();
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.slice(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      jobId: params.id,
    };

    await connect.deleteJob(reqQuery);
    return NextResponse.json({ message: "Successfully deleted job" });
  } catch (e: any) {
    return NextResponse.json({ message: "Server Error", error: e.message }, { status: 500 });
  }
};
