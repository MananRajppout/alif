import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Use getServerSession

export async function POST(req: NextRequest) {
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

    const reqQuery = {
      accessToken: session?.user.accessToken ? session?.user.accessToken : accessToken,
    };

    await connect.resendConfirmEmail(reqQuery); // Call the function to resend confirmation email

    return NextResponse.json({
      message: "Confirmation email sent successfully",
    }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}
