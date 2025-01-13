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

// GET - Fetch all private companies
export async function GET(request: Request) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const events = await connect.getEventsPrivate(accessToken);

    return NextResponse.json(
      {
        message: "Successfully fetched all private events",
        data: events,
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

export async function POST(request: NextRequest) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const data = await request.formData();

    const eventData = {
      eventName: data.get("eventName"),
      date: data.get("date") ? new Date(data.get("date") as string) : null, // Convert to Date object
      speakers: parseInt(data.get("speakers") as string, 10),
      city: data.get("city"),
      state: data.get("state"),
      country: data.get("country"),
      location: data.get("location"),
      numberOfSeats: parseInt(data.get("numberOfSeats") as string, 10) || 0,
      company: data.get("company"),
      about: data.get("about"),
      bulletPoints: data.getAll("bulletPoints"),
      ticketPrice: parseInt(data.get("ticketPrice") as string)
    };

    const images = {
      coverImage: data.get("coverImage") || null,
      displayImage: data.get("displayImage") || null,
    };

    console.log("event data ", eventData);
    const events = await connect.postEvent(accessToken, eventData, images);

    return NextResponse.json(
      {
        message: "Successfully fetched all private events",
        data: events,
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

export async function PUT(request: NextRequest) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const data = await request.formData();

    const eventData = {
      eventName: data.get("eventName"),
      date: data.get("date") ? new Date(data.get("date") as string) : null, // Convert to Date object
      speakers: parseInt(data.get("speakers") as string, 10),
      city: data.get("city"),
      state: data.get("state"),
      country: data.get("country"),
      location: data.get("location"),
      numberOfSeats: parseInt(data.get("numberOfSeats") as string, 10) || 0,
      company: data.get("company"),
      about: data.get("about"),
      bulletPoints: data.getAll("bulletPoints"),
      status: {
        isPublished: data.get("isPublished") === "true", // Convert to boolean
        isApproved: data.get("isApproved") === "true",
        isActive: data.get("isActive") === "true",
      },
    };

    const images = {
      coverImage: data.get("coverImage") as unknown as FileList,
      displayImage: data.getAll("displayImage") as unknown as FileList,
    };

    // const events = await connect.putEvent(accessToken, data, images);

    // return NextResponse.json(
    //   {
    //     message: "Successfully fetched all private events",
    //     data: events,
    //   },
    //   { status: 200 }
    // );
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

export async function DELETE(request: NextRequest) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await unstable_getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const data = await request.formData();

    const eventId = data.get("eventId");

    // const events = await connect.deleteEvent(accessToken, eventId);

    // return NextResponse.json(
    //   {
    //     message: "Successfully fetched all private events",
    //     data: events,
    //   },
    //   { status: 200 }
    // );
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