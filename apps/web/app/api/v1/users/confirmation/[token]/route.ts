import { NextRequest, NextResponse } from "next/server";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      token: string;
    };
  }
) {
  const connect = await apiConnector;

  // Connect to database
  await connect.connectDB();
  const { token } = params;
  if (!token) {
    return NextResponse.json({ message: "Token is required" }, { status: 400 });
  }

  const session = await getServerSession(authOptions); // Get the session

  const { headers } = req as any;
  const accessToken = headers.authorization?.substring(
    7,
    headers.authorization.length
  );

  if (!accessToken && !session?.user.accessToken) {
    return NextResponse.json(
      {
        message: "User not authenticated",
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  try {
    const reqQuery = {
      accessToken: token,
    };

    const update = await connect.confirmUserEmail(reqQuery);

    return NextResponse.json(
      { message: "Successfully confirmed user email" },
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
