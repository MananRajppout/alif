import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { requireEmployer } from "@/mongo/middleware/authenticate";
import UserModel from "@/mongo/models/user.model";
import EventModel from "@/mongo/models/event.model";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;
    const eventId = params.id;
    const session = await getServerSession(authOptions);
    const accessToken = await getAccessToken(request, session);

    if (!accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Unauthorized" },
        { status: 401 }
      );
    }

    const employer = await requireEmployer(accessToken);
    if (!employer) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Unauthorized" },
        { status: 401 }
      );
    }

    const companyDetails = await request.json();
    if (
      !eventId ||
      !companyDetails ||
      !companyDetails.name ||
      !companyDetails.email
    ) {
      return NextResponse.json(
        { message: "Invalid input data", error: "Bad Request" },
        { status: 400 }
      );
    }

    // Ensure the event exists
    const event = await EventModel.findById(eventId);
    if (!event) {
      return NextResponse.json(
        { message: "Event not found", error: "Not Found" },
        { status: 404 }
      );
    }

    // Update the User model
    const updatedUser = await UserModel.findByIdAndUpdate(
      employer._id,
      {
        $push: {
          registeredEvents: {
            event: eventId,
            date: event.date,
            status: "success",
          },
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        {
          message: "Failed to update user registration",
          error: "Server Error",
        },
        { status: 500 }
      );
    }

    console.log(companyDetails);
    const id = companyDetails.companyId || null;

    // Update the Event model
    event.companiesRegistered.push({
      name: companyDetails.name,
      email: companyDetails.email,
      user: employer._id,
      company: id || null,
      date: new Date(),
      jobs: companyDetails.jobIds || [],
    });

    await event.save();

    return NextResponse.json(
      { message: "Company successfully registered for the event" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Failed to register company for the event",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
