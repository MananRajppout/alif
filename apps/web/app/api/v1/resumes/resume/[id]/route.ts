import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

// Helper function to connect to the database
async function connectToDB() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}

// PUT: Update Resume
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const connect = await connectToDB();
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    // Parse form data using req.formData()
    const formData = await req.formData();
    console.log(formData);
    // Extract the file paths and fields
    const imageFile = formData.get("image") as File | null || null;
    const docFile = formData.get("docFile") as File | null || null;
  

    // Extract fields from form data
    const resumeInput = {
      name: formData.get("fullName")?.toString(),
      email: formData.get("email")?.toString(),
      region: formData.get("region")?.toString(),
      professionalTitle: formData.get("professionalTitle")?.toString(),
      location: formData.get("location")?.toString(),
      video: formData.get("video")?.toString(),
      category: formData.get("category")?.toString(),
      workingRate: formData.get("workingRate")?.toString(),
      education: JSON.parse(formData.get("education")?.toString() || "[]"),
      resumeContent: formData.get("resumeContent")?.toString(),
      skills: JSON.parse(formData.get("skills")?.toString() || "[]"),
      url: JSON.parse(formData.get("url")?.toString() || "[]"),
      experience: JSON.parse(formData.get("experience")?.toString() || "[]"),
    };

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      resumeInput,
      inputFiles: { image:imageFile, docFile: docFile },
      resumeId: id,
    };

    await connect.updateResume(reqQuery);
    return NextResponse.json({ message: "Successfully updated user" }, { status: 200 });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ message: "Server error", error: e.message }, { status: 500 });
  }
}


// GET: Retrieve Single Resume
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const connect = await connectToDB();
    const resume = await connect.getSingleResume(id);
    return NextResponse.json({ message: "Successfully retrieved resume", data: resume }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Server error", error: e.message }, { status: 500 });
  }
}

// DELETE: Remove Resume
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const connect = await connectToDB();
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      resumeId: id,
    };

    await connect.deleteResume(reqQuery);
    return NextResponse.json({ message: "Successfully deleted resume" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Server error", error: e.message }, { status: 500 });
  }
}
