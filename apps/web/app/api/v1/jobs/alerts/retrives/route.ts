import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";

export async function GET(req: Request) {
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

    const jobAlerts = await connect.getJobAlerts(
      session?.user.accessToken ? session?.user.accessToken : accessToken
    );

    return NextResponse.json({
      message: "Successfully fetched all alerts for this user",
      data: jobAlerts,
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
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

    const reqData = {
      body: await req.json(), // Parse the request body
      accessToken: session?.user.accessToken ? session?.user.accessToken : accessToken,
    };

    await connect.createJobAlerts(reqData);

    return NextResponse.json({
      message: "Job alert created successfully",
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}
