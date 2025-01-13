import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

/**
 * Call API function to fetch Review Data.
 * @param {Object} options.
 * @returns {Object} Review Data.
 */

export async function PUT(req: NextRequest,{
    params
}:{
    params:{
        id: string;
    }
}) {
  try {
    const connect = await apiConnector;
    await connect.connectDB();

    // const { searchParams } = new URL(req.url);
    // const id = searchParams.get("id");

    const { id } = params;


    const session = await getServerSession(authOptions);
    const headers = req.headers;
    const authorization = headers.get("authorization");
    console.log("authorization header === ", authorization);
    const accessToken = authorization?.substring(7) || session?.user.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const rewQuery = {
      accessToken,
      companyId: id,
      companyStatus: body.status,
    };

    const message = await connect.updateCompanyStatus(rewQuery);

    return NextResponse.json({ message }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json(
      {
        message: e.message,
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}
