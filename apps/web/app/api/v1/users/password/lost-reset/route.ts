import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Updated import for getServerSession

export async function PUT(req: NextRequest) {
  try {
    const connect = await apiConnector;
    await connect.connectDB(); // Connect to the database

    const { newPassword, resetLink } = await req.json(); // Parse JSON body

    const reqQuery = {
      newPassword,
      resetLink,
    };

    await connect.forgetPassReset(reqQuery); // Update the password

    return NextResponse.json(
      {
        message: "Successfully reset password",
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
