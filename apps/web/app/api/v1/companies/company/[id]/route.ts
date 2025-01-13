// app/api/company/[id]/route.ts
import { NextResponse, NextRequest } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import path from "path";
import { Readable } from "stream";

// Multer configuration for file uploads
// Update company profile (PUT)
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    await connect.connectDB();
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    // Create res object for multer

    // Access uploaded files
   

    // Parse other form fields
    const formData = await req.formData();
    const companyInput = {
      companyName: formData.get("companyName"),
      companyTagline: formData.get("companyTagline"),
      category: formData.get("category"),
      companyEmail: formData.get("companyEmail"),
      phoneNumber: formData.get("phoneNumber"),
      establishedDate: formData.get("establishedDate"),
      companyWebsite: formData.get("companyWebsite"),
      averageSalary: formData.get("averageSalary"),
      companySize: formData.get("companySize"),
      description: formData.get("description"),
      location: formData.get("location"),
      locationMap: {
        latitude: formData.get("locationLatitude"),
        longitude: formData.get("locationLongitude"),
      },
      videoLink: formData.get("videoLink"),
      socialLink: {
        linkedin: formData.get("linkedinLink"),
        facebook: formData.get("facebookLink"),
        twitter: formData.get("twitterLink"),
      },
    };

    const logoImage = formData.get("logoImage");
    const headerImage = formData.get("headerImage");

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      companyInput,
      images: { logoImage, headerImage },
      companyId: params.id,
    };

    await connect.updateCompany(reqQuery);

    return NextResponse.json({ message: "Successfully Updated Company Profile" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Server error", error: e.message }, { status: 500 });
  }
}

// Get company by ID (GET)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    await connect.connectDB();

    const companyResult = await connect.getSingleCompany(params.id);

    return NextResponse.json({ message: "Company Profile Found", data: companyResult }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Server Error", error: e.message }, { status: 500 });
  }
}

// Delete company by ID (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
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
      companyId: params.id,
    };

    await connect.deleteCompany(reqQuery);

    return NextResponse.json({ message: "Successfully deleted company" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ message: "Server Error", error: e.message }, { status: 500 });
  }
}
