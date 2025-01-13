import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function PUT(req: NextRequest, res: NextResponse) {
  const connect = await apiConnector;

  // Connect to database
  await connect.connectDB();

  try {
    // Get the session
    const session = await getServerSession(authOptions);
    
    const headers = req.headers;
    const accessToken = headers.get('authorization')?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    // Parse the request body
    const body = await req.json();
    const packageId = body.packageId;

    const reqQuery = {
      accessToken: session?.user.accessToken ? session?.user.accessToken : accessToken,
      packageId,
    };

    await connect.updateUserPackage(reqQuery);

    return NextResponse.json(
      { message: "Successfully updated user package" },
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
