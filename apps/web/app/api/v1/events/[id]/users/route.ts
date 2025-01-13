import { NextRequest, NextResponse } from "next/server";
import EventModel from "@/mongo/models/event.model";
import UserModel from "@/mongo/models/user.model";
import ResumeModel from "@/mongo/models/resume.model";
import { apiProvider as apiConnector } from "@/mongo/index";

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connect = await connectDB();
    if (!connect || connect instanceof NextResponse) return connect;

    const eventId = params.id;

    // Fetch the event
    const event = await EventModel.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Extract usersRegistered array
    let usersRegistered = event.usersRegistered || [];
    const userIds = usersRegistered.map((entry: any) => entry.user);
    const resumeIds = usersRegistered.map((entry: any) => entry.resume);

    // Fetch user and resume details
    const users = await UserModel.find({ _id: { $in: userIds } });
    const resumes = await ResumeModel.find({ _id: { $in: resumeIds } });

    // Augment each entry with user and resume details
    const enrichedUsersRegistered = await usersRegistered.map((entry: any) => {
      const user = users.find(
        (u: any) => u._id.toString() === entry.user.toString()
      );
      const resume = resumes.find(
        (r: any) => r._id.toString() === entry.resume.toString()
      );

      return {
        ...entry,
        userDetails: user || null, // Full user details
        resumeDetails: resume || null, // Resume details
      };
    });

    return NextResponse.json(
      {
        message: "User and resume details fetched successfully",
        usersRegistered: enrichedUsersRegistered,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch details", error: error.message },
      { status: 500 }
    );
  }
}
