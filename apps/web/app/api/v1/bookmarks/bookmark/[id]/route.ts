// app/api/bookmarks/[id]/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextResponse } from "next/server";
import {  getServerSession as  unstable_getServerSession } from "next-auth/next";

// Helper to connect to the database
async function connectDB() {
  try {
    const connect = await apiConnector;
    await connect.connectDB();
    return connect;
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

// Helper to get access token from session or headers
async function getAccessToken(request: Request, session: any) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.substring(7);
  return accessToken || session?.user.accessToken || null;
}

// GET - Check a bookmark by job-id
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    const reqQuery = {
      accessToken: accessToken,
      bookmarkId: params.id,
    };

    const bookmarkData = await connect.checkBookmark(reqQuery);

    if (!bookmarkData.isBookmark) {
      return NextResponse.json({
        message: "Bookmark not found",
        data: bookmarkData,
      }, { status: 200 });
    }

    return NextResponse.json({
      message: "Bookmark status found",
      data: bookmarkData,
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

// DELETE - Delete a bookmark by job-id
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    const reqQuery = {
      accessToken: accessToken,
      bookmarkId: params.id,
    };

    const bookmark = await connect.deleteBookmark(reqQuery);
    if (!bookmark) {
      return NextResponse.json({
        message: "Bookmark Not Found",
      }, { status: 404 });
    }

    return NextResponse.json({
      message: "Bookmark Deleted",
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}
