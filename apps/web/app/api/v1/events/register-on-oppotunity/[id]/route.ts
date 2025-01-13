import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession as unstable_getServerSession } from "next-auth/next";

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

async function getAccessToken(request: Request, session: any) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.substring(7);
  return accessToken || session?.user.accessToken || null;
}



export async function POST(request: NextRequest,{ params }: { params: { id: string } }) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;



    const data = await request.json();

    const opportunity = await connect.registerOnOppotunity(params.id,data.status,data.user_id);

    return NextResponse.json(
      {
        message: "Successfully registered for Live Interview",
        data: opportunity,
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

