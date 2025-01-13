import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { getServerSession } from "next-auth/next";
import crypto from "crypto";
import TransactionModel from "@/mongo/models/transaction.model";
import UserModel from "@/mongo/models/user.model";
import EventModel from "@/mongo/models/event.model";
import { requireUser } from "@/mongo/middleware/authenticate";

async function connectToDatabase() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}

export async function POST(request: Request) {
  try {
    const connect = await connectToDatabase();
    const body = await request.json();
    console.log("Request body:", body);
    const { response, order, eventId, selectedResume } = body;
    const session = await getServerSession(authOptions);

    const accessToken = request.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    const access_token = session?.user.accessToken || accessToken;

    // Authenticate and fetch user
    const user = await requireUser(access_token);

    // Verify payment signature using Razorpay logic
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(order.id + "|" + response.razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== response.razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed. Invalid signature." },
        { status: 400 }
      );
    }

    // Check and update transaction status
    const transaction = await TransactionModel.findOne({ orderId: order.id });
    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found. Cannot update status." },
        { status: 404 }
      );
    }

    if (transaction.status === "SUCCESS") {
      return NextResponse.json(
        { message: "Transaction already processed" },
        { status: 200 }
      );
    }

    transaction.status = "SUCCESS";
    transaction.paymentId = response.razorpay_payment_id;
    await transaction.save();

    const event = await EventModel.findById({
      _id:eventId
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    // Update user details with the registered event
    await UserModel.updateOne(
      { _id: user._id },
      {
        $push: {
          registeredEvents: {
            event: eventId,
            date: event.date,
            status: "success",
            transactionId: transaction._id,
          },
        },
      }
    );

    // Update the event with the new registration
    

    event.usersRegistered.push({
      user: user._id,
      resume: selectedResume,
    });

    await event.save();

    console.log("Event updated:", event);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
