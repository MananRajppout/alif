import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next"; // Updated import

export async function GET(req: NextRequest) {
  try {
    const connect = await apiConnector;
    await connect.connectDB(); // Connect to the database

    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.substring(7);

    // Check for user authentication
    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    // Fetch user data
    const user = await connect.getUser(
      session?.user.accessToken || accessToken
    );

    return NextResponse.json(user, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message, error: "Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Logic for creating a user goes here
    return NextResponse.json({ message: "User created successfully" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Logic for updating a user goes here
    return NextResponse.json({ message: "Successfully updated user" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Logic for deleting a user goes here
    return NextResponse.json({ message: "Successfully deleted user" }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Server Error", error: e.message },
      { status: 500 }
    );
  }
}
