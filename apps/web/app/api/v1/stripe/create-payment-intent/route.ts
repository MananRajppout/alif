import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie } from "cookies-next";
import Stripe from "stripe";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-09-30.acacia", // Use your preferred API version
});

// Helper: Retrieve or create payment intent
async function handlePaymentIntent(
  req: NextRequest,
  totalCartPrice: number
) {
  const paymentIntentID_Old = getCookie("paymentIntent_id", {
    req: (req as any),
  });

  if (paymentIntentID_Old) {
    // Update existing PaymentIntent
    const paymentIntentUpdated = await stripe.paymentIntents.update(
      paymentIntentID_Old.toString(),
      { amount: totalCartPrice }
    );
    return {
      clientSecret: paymentIntentUpdated.client_secret,
      paymentIntentID: paymentIntentUpdated.id,
    };
  } else {
    const body = await req.json();
    const { userDetails } = body;

    // Create a new Stripe customer
    const customer = await stripe.customers.create({
      description: "Metajobs Customer",
      name: `${userDetails?.name?.firstName} ${userDetails?.name?.lastName}`,
      email: userDetails?.email,
      phone: userDetails?.phone,
    });

    // Create a new PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCartPrice,
      currency: "usd",
      customer: customer.id,
      setup_future_usage: "off_session",
      automatic_payment_methods: { enabled: true },
    });

    // Store PaymentIntent ID in cookies
    setCookie("paymentIntent_id", paymentIntent.id, { req: (req as any) });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentID: paymentIntent.id,
    };
  }
}

// POST: Handle payment intent creation or update
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { price } = body;

    const totalCartPriceCalc = price ? price * 100 : 0;
    const totalCartPrice = Math.round((totalCartPriceCalc + Number.EPSILON) * 100) / 100;

    const result = await handlePaymentIntent(req, totalCartPrice);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
