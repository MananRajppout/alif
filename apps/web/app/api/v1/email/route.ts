// app/api/send-email/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import ConfirmMailTemplate from '@/src/lib/mailTemplate/ConfirmMailTemplate';
import JobDeleteMailTemplate from '@/src/lib/mailTemplate/JobDeleteMailTemplate';
import JobAlertMailTemplate from '@/src/lib/mailTemplate/JobAlertMailTemplate';
import DefaultMailTemplate from '@/src/lib/mailTemplate/DefaultMailTemplate';
import { sendNotification } from "@/mongo/service/notification.service";

export async function POST(req: Request) {
  try {
    const { emailData, userEmail, userId, emailType, accessToken, forgetPassToken, jobInfo } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST as string,
      port: parseInt(process.env.NODEMAILER_PORT as string, 10),
      secure: process.env.NODEMAILER_SECURE === 'true',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    let mailOptions;
    const confirmUrl = `${process.env.endPointFrontend}/verify-email/${accessToken}`;
    const forgetPassUrl = `${process.env.endPointFrontend}/lost-password/${forgetPassToken}`;
    
    switch (emailData.emailType) {
      case "CONFIRMATION_EMAIL":
        mailOptions = {
          from: `${emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: userEmail,
          subject: emailData.subject,
          html: ConfirmMailTemplate(emailData.message, confirmUrl),
        };
        break;
      case "JOB_DELETED":
        mailOptions = {
          from: `${emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: userEmail,
          subject: emailData.subject,
          html: JobDeleteMailTemplate(emailData.message, jobInfo),
        };
        break;
      case "JOB_ALERT":
        mailOptions = {
          from: `${emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: userEmail,
          subject: emailData.subject,
          html: JobAlertMailTemplate(emailData.message),
        };
        break;
      case "FORGET_PASSWORD":
        mailOptions = {
          from: `${emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: userEmail,
          subject: emailData.subject,
          html: ConfirmMailTemplate(emailData.message, forgetPassUrl),
        };
        break;
      default:
        mailOptions = {
          from: `${emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: userEmail,
          subject: emailData.subject,
          html: DefaultMailTemplate(emailData.message),
        };
        break;
    }

    await transporter.sendMail(mailOptions);
    
    // Optionally, send a notification using your MongoDB service
    if (userId && emailType) {
      const notificationInput = {
        user: userId,
        notification: [{
          message: emailData.subject,
          timestamp: new Date().toISOString(),
          event: emailType,
          status: 'UNREAD',
        }],
      };
      sendNotification(userId, notificationInput);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}
