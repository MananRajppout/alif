import { apiProvider as apiConnector } from "@/mongo/index";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const connect = await apiConnector;

  await connect.connectDB();

  try {
    const inputData = await req.json();
    const email = await connect.sendContactEmail(inputData);

    return NextResponse.json(
      {
        message: "Thank you for giving us an email",
      },
      { status: 200 }
    );
  } catch (e: any) {
    console.log(e);
    return NextResponse.json(
      {
        message: e.message,
        error: "Server Error",
      },
      { status: 500 }
    );
  }
}
