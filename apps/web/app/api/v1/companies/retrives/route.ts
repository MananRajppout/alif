// app/api/company/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession as unstable_getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { IncomingMessage } from "http";
import { requireEmployer } from "@/mongo/middleware/authenticate";
import { CompanyModel } from "@/mongo/models/company.model";


// Helper to connect to the database
async function connectDB() {
  try {
    const connect = await apiConnector;
    await connect.connectDB();
    return connect;
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Server Error",
        error: e.message,
      },
      { status: 500 }
    );
  }
}

// Helper to get access token from session or headers
async function getAccessToken(request: Request, session: any) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.substring(7);
  return accessToken || session?.user.accessToken || null;
}


// POST - Create a company profile
export async function POST(request: Request) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    if (!formData) {
      return NextResponse.json(
        {
          message: "Invalid form data",
          error: "Server Error",
        },
        { status: 400 }
      );
    }

    const logoImage = formData.get("logoImage") as File | null;
    const headerImage = formData.get("headerImage") as File | null;
    // const logoImagePath = logoImage ? URL.createObjectURL(logoImage) : "";
    // const headerImagePath = headerImage ? URL.createObjectURL(headerImage) : "";

    const companyInput = {
      companyName: formData.get("companyName"),
      companyTagline: formData.get("companyTagline"),
      category: formData.get("category"),
      companyEmail: formData.get("companyEmail"),
      phoneNumber: formData.get("phoneNumber"),
      eatablishedDate: formData.get("eatablishedDate"),
      companyWebsite: formData.get("companyWebsite"),
      avarageSalary: formData.get("avarageSalary"),
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
    console.log(companyInput);
    const reqQuery = {
      accessToken,
      companyInput,
      images: { logoImage, headerImage },
    };

    await connect.createCompany(reqQuery);

    return NextResponse.json(
      {
        message: "Successfully created a company profile",
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      {
        message: "Server Error",
        error: e.message,
      },
      { status: 500 }
    );
  }
}

// GET - Fetch all companies
export async function GET(request: NextRequest) {

  
  try {

    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const user = await requireEmployer(accessToken);

    if(!user){
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }
    
    const companies = await CompanyModel.find({
      user: user._id
    })



    return NextResponse.json(
      {
        message: "Successfully fetched all companies",
        data:companies
      },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      {
        message: "Server Error",
        error: e.message,
      },
      { status: 500 }
    );
  }
}

