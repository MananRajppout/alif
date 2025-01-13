import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Use getServerSession
import { Formidable } from "formidable";



export async function PUT(req: NextRequest) {
  try {
    const connect = await apiConnector;
    await connect.connectDB(); // Connect to the database

    const session = await getServerSession(authOptions); // Get the session

    const authorizationHeader = req.headers.get("authorization");
    const accessToken = authorizationHeader
      ? authorizationHeader.substring(7)
      : session?.user.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // Parse the form data
    const formData = await req.formData();

    // Extract image file if provided
    const profileImage = formData.get("profileImage") as File | null;

   
    // Extract user data from form fields
    const userData = {
      fullName: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
      },
      phoneNumber: formData.get("phoneNumber") as string,
      aboutMe: formData.get("aboutMe") as string,
    };

    const reqQuery = {
      accessToken,
      userData,
    };

    const user = await connect.updateUser(reqQuery, profileImage); // Update user in the database

    return NextResponse.json(
      {
        message: "Successfully updated user",
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
