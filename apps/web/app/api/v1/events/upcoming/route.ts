import { apiProvider as apiConnector } from "@/mongo/index";
import {  NextResponse } from "next/server";

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

export async function GET(){
    try {
        
        const connect = await connectDB();
        if (!connect || connect instanceof NextResponse) return connect;
        
        const events = await connect.getUpcomingEvent();
        console.log("events fetched", events)
        return NextResponse.json({
            message: "Successfully fetched all upcoming events",
            data: events
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            {
                message: "Failed to fetch public events",
                error: error,
            },
            { status: 500 }
        );
    }
}