// app/api/send-email/route.ts
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { apiProvider as apiConnector } from "@/mongo/index";
import { emailTemplates } from "@/src/config/email";
import { sendNotificationEmail } from "@/src/utils/nodeMailer"; // Import from server utility
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

// Connect to the database
async function connectDB() {
  const connect = await apiConnector;
  await connect.connectDB();
}

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Job Portal";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get the session and access token
    const session = await getServerSession(authOptions);
    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.substring(7) || session?.user.accessToken;

    if (!accessToken && !session?.user.accessToken) {
      return NextResponse.json(
        { message: "User not authenticated", error: "Server Error" },
        { status: 401 }
      );
    }

    const connect = await apiConnector;
    const data = await connect.requireUser(accessToken);

    // Extract emailType from request body
    const { emailType } = await req.json();

    if (!emailType) {
      return NextResponse.json(
        { message: "emailType is required in the request body" },
        { status: 400 }
      );
    }

    const templateInput = emailTemplates[emailType];

    if (!templateInput) {
      return NextResponse.json(
        { message: "Invalid emailType" },
        { status: 400 }
      );
    }

    const site_name = siteName;
    // Create email data
    const emailData = {
      senderAddress: site_name,
      subject: templateInput.subject,
      message: templateInput.message,
      emailType,
    };

    const inputEmailData = {
      userEmail: data.email,
      emailData,
      userId: data?._id,
      emailType,
    };

    // Send email
    await sendNotificationEmail(inputEmailData); // Now calling the server-side utility

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { message: "Email not sent", error: e.message },
      { status: 500 }
    );
  }
}
