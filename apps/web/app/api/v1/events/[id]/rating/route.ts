import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import UserModel from "@/mongo/models/user.model";
import EventModel from "@/mongo/models/event.model";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { requireCandidate } from "@/mongo/middleware/authenticate";

async function connectDB() {
  try {
    const connect = await apiConnector;
    await connect.connectDB();
    return connect;
  } catch (error: any) {
    return NextResponse.json(
      { message: "Database connection failed", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await requireCandidate(session.user.accessToken);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const eventId = params.id;
    const { rating } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { message: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }
    // Check if the user has already rated this event
    const userEvent = await UserModel.findOne(
      {
      _id: user._id,
      "registeredEvents.event": eventId,
      "registeredEvents.rating": { $exists: true },
      },
      { "registeredEvents.$": 1 }
    );

    if (userEvent) {
      return NextResponse.json({ message: "You have already rated this event" }, { status: 400 });
    }

    // Update the event's rating data
    const event = await EventModel.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const newRatingsNumber = (event.ratingsNumber || 0) + rating;
    const newRatingsUsers = (event.ratingsUsers || 0) + 1;

    event.ratingsNumber = newRatingsNumber;
    event.ratingsUsers = newRatingsUsers; // Corrected typo: 'newRatingsUsers' -> 'ratingsUsers'
    await event.save();

    console.log("Event updated:", event);

    // Update the user's past or registered event rating
    const userUpdateResult = await UserModel.findOneAndUpdate(
      {
        _id: user._id,
        "registeredEvents.event": eventId,
      },
      {
        $set: { "registeredEvents.$.rating": rating },
      },
      { new: true }
    );

    if (!userUpdateResult) {
      return NextResponse.json({ message: "Failed to update user rating" }, { status: 500 });
    }

    console.log("User updated:", userUpdateResult);

    return NextResponse.json({ message: "Rating updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { message: "Failed to update rating", error: error.message },
      { status: 500 }
    );
  }
}
