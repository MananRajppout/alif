import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

/**
 * Connect to the database.
 */
async function connectToDatabase() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}

/**
 * Handler for creating a resume.
 */
export async function POST(req: NextRequest) {
  const connect = await connectToDatabase();

  try {
    const session = await getServerSession( authOptions);

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.substring(7) || session?.user.accessToken;

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    // Parse the multipart form data
    const formData = await req.formData();
    const requestFiles = {
      image: formData.get("image") as File,
      resumeFile: formData.get("resumeFile") as File,
    };

    let sortSkills = [];
    if (formData.get("skills")) {
      const skillsData = formData.get("skills");
      sortSkills = skillsData ? JSON.parse(skillsData as string) : [];
    }

    const resumeInput = {
      name: formData.get("fullName"),
      email: formData.get("email"),
      region: formData.get("region"),
      professionalTitle: formData.get("professionalTitle"),
      location: formData.get("location"),
      video: formData.get("video"),
      category: formData.get("category"),
      workingRate: formData.get("workingRate"),
      education: formData.get("education") ? JSON.parse(formData.get("education") as string) : null,
      resumeContent: formData.get("resumeContent"),
      skills: sortSkills,
      url: formData.get("url") ? JSON.parse(formData.get("url") as string) : null,
      experience: formData.get("experience") ? JSON.parse(formData.get("experience") as string) : null,
    };

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      resumeInput,
      inputFiles: requestFiles,
    };

    await connect.createResume(reqQuery);

    return NextResponse.json(
      {
        message: "Successfully created a resume",
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

/**
 * Handler for fetching all resumes of a candidate.
 */
export async function GET(req: NextRequest) {
  const connect = await connectToDatabase();

  try {
    const session = await getServerSession( authOptions);

    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.substring(7) || session?.user.accessToken;

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const resumes = await connect.getResumePrivate(
      session?.user.accessToken || accessToken
    );

    return NextResponse.json(
      {
        message: "Successfully fetched all resumes",
        data: resumes,
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
