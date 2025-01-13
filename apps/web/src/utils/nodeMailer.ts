// const nodemailer = require('nodemailer')

import { sendNotification } from "@/mongo/service/notification.service";
import nodemailer from "nodemailer";
import ConfirmMailTemplate from "@/src/lib/mailTemplate/ConfirmMailTemplate";
import JobDeleteMailTemplate from "@/src/lib/mailTemplate/JobDeleteMailTemplate";
import JobAlertMailTemplate from "@/src/lib/mailTemplate/JobAlertMailTemplate";
import DefaultMailTemplate from "@/src/lib/mailTemplate/DefaultMailTemplate";

// const endpoint = config.get('endpoint')
// const endPointFrontend = config.get('endPointFrontend')
const endpoint = process.env.endpoint;
const endPointFrontend = process.env.endPointFrontend;

export async function sendNotificationEmail(input: {
  emailData: {
    emailType: string;
    senderAddress: string;
    subject: string;
    message: string;
  };
  userEmail: string;
  userId: string;
  emailType: string;
  accessToken?: string;
  forgetPassToken?: string;
  jobInfo?: {
    jobTitle: string;
    category: string;
  };
}) {
  try {
    // const confirmUrl = `${endpoint}/api/v1/user/confirmation/${input?.accessToken}`
    const confirmUrl = `${endPointFrontend}/verify-email/${input?.accessToken}`;
    // const forgetPass = `${endpoint}/api/v1/user/authentication/reset/${input?.forgetPassToken}`
    const forgetPass = `${endPointFrontend}/lost-password/${input?.forgetPassToken}`;

    const DateFormate = new Date();
    const date = DateFormate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    let transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST as string,
      port: process.env.NODEMAILER_PORT as any,
      secure: process.env.NODEMAILER_SECURE === "true" ? true : false,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    switch (input.emailData.emailType) {
      case "CONFIRMATION_EMAIL":
        const mailOptions1 = {
          from: `${input.emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: input.userEmail,
          subject: input.emailData.subject,
          html: ConfirmMailTemplate(input?.emailData.message, confirmUrl),
        };
        const info1 = await transporter
          .sendMail(mailOptions1)
          .then((info: any) => {
            const userId = input?.userId;
            const notificationInput = {
              user: input?.userId,
              notification: [
                {
                  message: `${input.emailData.subject}`,
                  timestamp: new Date().toISOString(),
                  event: input?.emailType,
                  status: "UNREAD",
                },
              ],
            };
            if (input.userId && input.emailType) {
              sendNotification(userId, notificationInput);
            }
          });
        break;
      case "JOB_PUBLISHED":
        const mailOptions2 = {
          from: `${input.emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: input.userEmail,
          subject: input.emailData.subject,
          html: ConfirmMailTemplate(input?.emailData.message, confirmUrl),
        };

        const info2 = await transporter
          .sendMail(mailOptions2)
          .then((info: any) => {
            const userId = input?.userId;
            const notificationInput = {
              user: input?.userId,
              notification: [
                {
                  message: `${input.emailData.subject}`,
                  timestamp: new Date().toISOString(),
                  event: input?.emailType,
                  status: "UNREAD",
                },
              ],
            };
            if (input.userId && input.emailType) {
              sendNotification(userId, notificationInput);
            }
          });
        return info2;
      case "JOB_DELETED":
        const mailOptions3 = {
          from: `${input.emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: input.userEmail,
          subject: input.emailData.subject,
          html: JobDeleteMailTemplate(
            input?.emailData?.message,
            input?.jobInfo
          ),
        };
        const info3 = await transporter
          .sendMail(mailOptions3)
          .then((info: any) => {
            const userId = input?.userId;
            const notificationInput = {
              user: input?.userId,
              notification: [
                {
                  message: `${input.emailData.subject}`,
                  timestamp: new Date().toISOString(),
                  event: input?.emailType,
                  status: "UNREAD",
                },
              ],
            };
            if (input.userId && input.emailType) {
              sendNotification(userId, notificationInput);
            }
          })
          .catch((err: any) => {
            //console.log('Error sending JOB_DELETED: %s', err)
          });

        break;
      case "FORGET_PASSWORD":
        const mailOptions4 = {
          from: `${input.emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: input.userEmail,
          subject: input.emailData.subject,
          html: ConfirmMailTemplate(input?.emailData.message, forgetPass),
        };
        const info4 = await transporter
          .sendMail(mailOptions4)
          .then((info: any) => {
            const userId = input?.userId;
            const notificationInput = {
              user: input?.userId,
              notification: [
                {
                  message: `${input.emailData.subject}`,
                  timestamp: new Date().toISOString(),
                  event: input?.emailType,
                  status: "UNREAD",
                },
              ],
            };
            if (input.userId && input.emailType) {
              sendNotification(userId, notificationInput);
            }
          });
        break;

      case "JOB_ALERT":
        const mailOptions5 = {
          from: `${input.emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: input.userEmail,
          subject: input.emailData.subject,
          html: JobAlertMailTemplate(input?.emailData.message),
        };
        const info5 = await transporter
          .sendMail(mailOptions5)
          .then((info: any) => {
            const userId = input?.userId;
            const notificationInput = {
              user: input?.userId,
              notification: [
                {
                  message: `${input.emailData.subject}`,
                  timestamp: new Date().toISOString(),
                  event: input?.emailType,
                  status: "UNREAD",
                },
              ],
            };
            if (input.userId && input.emailType) {
              sendNotification(userId, notificationInput);
            }
          });
        break;
      default:
        const mailOptions = {
          from: `${input.emailData.senderAddress} <${process.env.NODEMAILER_EMAIL}>`,
          to: input.userEmail,
          subject: input.emailData.subject,
          html: DefaultMailTemplate(input?.emailData.message),
        };
        const info = await transporter
          .sendMail(mailOptions)
          .then((info: any) => {
            const userId = input?.userId;
            const notificationInput = {
              user: input?.userId,
              notification: [
                {
                  message: `${input.emailData.subject}`,
                  timestamp: new Date().toISOString(),
                  event: input?.emailType,
                  status: "UNREAD",
                },
              ],
            };
            if (input.userId && input.emailType) {
              sendNotification(userId, notificationInput);
            }
          });
    }
  } catch (e) {
    throw e;
  }
}
