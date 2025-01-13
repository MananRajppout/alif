import { NextRequest, NextResponse } from "next/server";
import { apiProvider as apiConnector } from "@/mongo/index";

export async function PUT(req: NextRequest) {
  try {
    const connect = await apiConnector;
    const data = await req.json();
    console.log(data);
    const reqQuery = { email:data.email };
    await connect.forgetPassword(reqQuery);

    return NextResponse.json({
      message: "Reset password email sent, please follow the instruction",
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const connect = await apiConnector;
    const data = await req.json();
    const { resetLink, newPassword } = data;
    console.log(data);
    const reqQuery = {
      resetLink,
      newPassword,
    };
    await connect.forgetPassReset(reqQuery);

    return NextResponse.json({
      message: "You have successfully updated your password",
    }, { status: 200 });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}
