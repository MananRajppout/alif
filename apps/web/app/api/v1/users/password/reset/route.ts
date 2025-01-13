import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Updated import for getServerSession

export async function PUT(req: NextRequest) {
  try {
    const connect = await apiConnector;
    await connect.connectDB(); // Connect to the database

    const session = await getServerSession(authOptions ); // Get the session

    const { headers } = req as any;
    const accessToken = headers.authorization?.substring(7, headers.authorization.length);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Unauthorized",
      }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json(); // Parse JSON body

    const reqQuery = {
      accessToken: session?.user.accessToken ? session?.user.accessToken : accessToken,
      userInput: { currentPassword, newPassword },
    };

    await connect.updatePassword(reqQuery); // Update the password

    return NextResponse.json({
      message: "Successfully reset password",
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server error",
      error: e.message,
    }, { status: 500 });
  }
}
