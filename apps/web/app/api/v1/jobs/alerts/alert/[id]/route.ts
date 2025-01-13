import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Your logic for emailing the alert result can go here.
    
    return NextResponse.json({
      message: "Successfully emailed alert result",
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    const session = await getServerSession(authOptions);

    const accessToken = req.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      alertId: params.id,
    };

    const jobAlert = await connect.getSingleJobAlert(reqQuery);

    return NextResponse.json({
      message: "Successfully fetched alert",
      data: jobAlert,
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      alertId: params.id,
      body: await req.json(),
    };

    await connect.updateJobAlert(reqQuery);

    return NextResponse.json({
      message: "Successfully updated alert",
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      alertId: params.id,
      active: (await req.json()).active,
    };

    await connect.updateJobAlertStatus(reqQuery);

    return NextResponse.json({
      message: "Successfully changed alert status",
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const connect = await apiConnector;
    const session = await getServerSession(authOptions);
    const accessToken = req.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    const reqQuery = {
      accessToken: session?.user.accessToken || accessToken,
      alertId: params.id,
    };

    await connect.deleteJobAlert(reqQuery);

    return NextResponse.json({
      message: "Successfully deleted job alert",
    });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}
