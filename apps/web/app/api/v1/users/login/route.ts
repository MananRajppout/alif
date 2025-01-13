import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { setCookie } from "cookies-next";

export async function POST(req: NextRequest) {
  const connect = await apiConnector;

  // Connect to database
  await connect.connectDB();

  try {
    // Parse the request body
    const body = await req.json();
    
    // Attempt to log the user in
    const { accessToken } = await connect.loginUser(body);

    // Set accessToken to cookie
    setCookie("accessToken", accessToken, {
      req: req as any, // Cast req to any to bypass type incompatibility
      res: NextResponse as any, // Cast NextResponse to any to bypass type incompatibility
      httpOnly: true,
      maxAge: 900000, // 15 min
      path: "/",
      secure: process.env.NODE_ENV === "production", // Set secure flag in production
    });

    return NextResponse.json(
      { message: "Successfully user logged in", accessToken },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message, error: e.message },
      { status: 500 }
    );
  }
}
