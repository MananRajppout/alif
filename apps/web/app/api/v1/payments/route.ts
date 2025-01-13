import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { authOptions } from "../../auth/[...nextauth]/route";
import { connect } from "http2";
import { requireUser } from "@/mongo/middleware/authenticate";
import { apiProvider as apiConnector } from "@/mongo/index";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

async function connectToDatabase() {
  const connect = await apiConnector;
  await connect.connectDB();
  return connect;
}

export async function POST(req: Request) {
  const { ticketPrice, _id } = await req.json();
  try {
    const connect = await connectToDatabase();
    const session = await getServerSession(authOptions);

    const accessToken = req.headers.get("authorization")?.substring(7);

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }

    const access_token = session?.user.accessToken || accessToken;

    const user = await requireUser(access_token);
    if (!user) {
      return NextResponse.json(
        {
          message: "User not authenticated",
          error: "Server Error",
        },
        { status: 401 }
      );
    }
    const receipt = `receipt_${Date.now()}${Math.random()}`
    const options = {
      amount: parseInt(ticketPrice) * 100,
      currency: "INR",
      receipt: receipt,
    };
    
    const order = await razorpay.orders.create(options);

    const data = {
      user: user._id,
      event: _id,
      amount: ticketPrice,
      paymentId: receipt,
      order_id: order.id,
    };

    const res = await connect.createTransaction(data);

    return NextResponse.json({ success: true, order, transaction: res, user });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
