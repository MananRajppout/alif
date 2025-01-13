// app/api/bookmarks/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { NextResponse } from "next/server";
import {  getServerSession as unstable_getServerSession } from "next-auth/next";

// Middleware to connect to the database
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

// Function to fetch access token
async function getAccessToken(request: Request, session: any) {
  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.substring(7);

  return accessToken || session?.user.accessToken || null;
}

// GET all bookmarks of a user
export async function GET(request: Request) {
  try {
    const connect = await connectDB();
    if (!connect) return;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    let bookmarks = [];
    if ('getBookmarks' in connect) {
      bookmarks = await connect.getBookmarks(accessToken);
    } else {
      return connect; // Return the error response if connect is of type NextResponse
    }

    if (bookmarks[0]?.bookmarks?.length === 0) {
      return NextResponse.json({
        message: "No Bookmark Found",
        data: [],
      }, { status: 200 });
    }

    return NextResponse.json({
      message: "Successfully found all bookmarks",
      data: bookmarks[0].bookmarks,
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}

// POST - create a bookmark
export async function POST(request: Request) {
  try {
    const connect = await connectDB();
    if (!connect) return;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json({
        message: "User not authenticated",
        error: "Server Error",
      }, { status: 401 });
    }

    const body = await request.json();

    const reqQuery = {
      accessToken: accessToken,
      body: {
        ...body,
      },
    };

    if ('createBookmark' in connect) {
      await connect.createBookmark(reqQuery);
    } else {
      return connect; // Return the error response if connect is of type NextResponse
    }

    return NextResponse.json({
      message: "Bookmark successfully created",
    }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({
      message: "Server Error",
      error: e.message,
    }, { status: 500 });
  }
}
