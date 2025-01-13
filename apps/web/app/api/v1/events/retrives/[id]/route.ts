import { apiProvider as apiConnector } from "@/mongo/index";
import {  NextRequest, NextResponse } from "next/server";

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

export async function GET(request: NextRequest,{ params }: { params: { id: string } }){
    try {
        const id = params.id;       
        const connect = await connectDB();
        if (!connect || connect instanceof NextResponse) return connect;
        
        const events = await connect.getEventsPublic();
        
        // console.log(events);

        const filteredEvents = events.filter((event: any) => event._id.toString() === id.toString());

        // console.log(filteredEvents);
        return NextResponse.json({
            message: "Successfully fetched  event",
            data: filteredEvents
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