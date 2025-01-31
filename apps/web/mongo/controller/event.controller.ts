import mongoose from "mongoose";
import { requireAdmin, requireCandidate, requireEmployer } from "../middleware/authenticate";
import EventModel from "../models/event.model";
import OpportunityModel from "../models/opportunity.model";
import RoundModel from "../models/round.model";
import {
  generateAccessToken,
  getAdminEventsService,
  getPublicEventsService,
  getUpcomingEventsService,
} from "../service/event.service";
import { uploadImageToCloudinary } from "../utils/cloudinary";
import UserModel from "../models/user.model";
import { sendTakeInterviewInvitaionMail } from "../utils/nodeMailer";
import { generateMail } from "@/utils/generateEmail";

export async function getEventsPrivate(accessToken: string) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;

    if (adminRole === true) {
      const events = await getAdminEventsService();
      return events;
    }
    return "User is not an admin";
  } catch (e) {
    throw e;
  }
}

export async function getEventsPublic() {
  try {
    const events = await getPublicEventsService();
    return events;
  } catch (e) {
    throw e;
  }
}

export async function verifyInterview(acccessToken: string, room_id: string) {

  const round = await RoundModel.findOne({
    "rooms._id": new mongoose.Types.ObjectId(room_id)
  }).select("+rooms.accessToken");

  const room = round?.rooms?.find((room: any) => room.accessToken == acccessToken);


  return room ? {
    status: 'varified',
    name: room?.interviewerName,
    email: room?.interviewerEmail
  } : {
    status: 'unverified'
  };
}

export async function getUpcomingEvent() {
  try {
    const events = await getUpcomingEventsService();
    return events;
  } catch (e) {
    throw e;
  }
}

export async function postEvent(
  accessToken: string,
  eventData: any,
  images: any
) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;
    const userId = user._id;

    if (adminRole === false) {
      return "User is not an admin";
    }

    let coverImage;
    let displayImage;

    if (images.coverImage) {
      const coverImageURL = await uploadImageToCloudinary(images.coverImage);
      coverImage = coverImageURL?.secure_url;
    } else {
      coverImage = null;
    }

    if (images.displayImage) {
      const coverImageURL = await uploadImageToCloudinary(images.displayImage);
      displayImage = coverImageURL?.secure_url;
    } else {
      displayImage = null;
    }

    const eventDataInput = {
      ...eventData,
      user: userId,
      coverImage,
      displayImage,
    };

    const event = await EventModel.create(eventDataInput);
    return event;
  } catch (e) {
    throw e;
  }
}


export async function registerOnEvent(
  accessToken: string,
  eventData: any
) {
  try {
    const user = await requireEmployer(accessToken);
    const isEmployer = user.role.isEmployer;
    const userId = user._id;

    if (isEmployer === false) {
      return "User is not an employer";
    }

    const opportunity = await OpportunityModel.create({
      user: userId,
      event_id: eventData.event_id,
      name: eventData.name,
      description: eventData.description,
      role: eventData.role,
    });


    for (let i = 0; i < eventData.rounds.length; i++) {
      const round = eventData.rounds[i];

      //generate acccess token for each room
      for (let index = 0; index < round.rooms.length; index++) {
        round.rooms[index].accessToken = generateAccessToken();
      }



      const roundData = {
        event_id: eventData.event_id,
        opportunity_id: opportunity._id,
        name: round.name,
        description: round.description,
        roundType: round.roundType,
        index: round.index,
        rooms: round.rooms,
      };
      const roundDb = await RoundModel.create(roundData);
      opportunity.rounds.push(roundDb._id);
    }
    await opportunity.save();

    const event = await EventModel.findById(eventData.event_id);
    event.opportunities.push(opportunity._id);
    await event.save();


    const updatedOpportunity = await OpportunityModel.findById(opportunity._id).populate({
      path: 'rounds',
      select: 'rooms name description roundType index opportunity_id event_id',
      populate: {
        path: 'rooms',
        select: 'interviewerName interviewerEmail accessToken',
      },
    })
      .exec();

    // Send emails in parallel (doesn't block the response)
    const emailPromises = updatedOpportunity.rounds.flatMap((round:any) =>
      round.rooms.map((room:any) =>
        sendTakeInterviewInvitaionMail(
          room.interviewerEmail,
          `Interview Invitation for ${updatedOpportunity.name}`,
          generateMail(`Dear ${room.interviewerName},

            You have been invited to conduct an interview for the opportunity: [Opportunity Name].

            Interview Details:
            Event Date: ${new Date(event.date).toDateString()}
            Round: ${round.name}
            Room Link: ${process.env.endPointFrontend}/interview-room/${room._id}?accessToken=${room.acccessToken}
            Please make sure to join the room on time to conduct the interview. If you face any issues or have questions, feel free to reach out to us.

            Thank you for your time, and we look forward to your participation!`)
        )
      )
    );
    // Wait for all email promises to resolve
    Promise.all(emailPromises).then(() => {
      console.log("Emails sent successfully");
    }).catch(err => {
      console.error("Error sending emails:", err);
    });

    return updatedOpportunity;
  } catch (e) {
    throw e;
  }
}


export async function registerOnOppotunity(
  opportunity_id: string,
  status: string,
  userId: string
) {
  try {




    const opportunity = await OpportunityModel.findById(opportunity_id);
    const isExistInList = opportunity.participants.findIndex((participant: any) => participant.user.toString() == userId.toString());

    if (isExistInList != -1) {
      opportunity.participants[isExistInList].status = status;
    } else {
      const newParticipant = {
        user: userId,
        status
      }
      opportunity.participants.push(newParticipant);
    }


    await opportunity.save();


    //send mail to user
    const user = await UserModel.findById(userId);
    const subject = "Interview Registration Successful";
    const html = `
      Dear ${user?.fullName?.firstName} ${user?.fullName?.lastName},

      Congratulations! You have successfully registered for an interview with us. We’re excited to take the next steps in the hiring process with you.

      Next Steps:
      Stay Online: Please stay online on the website to be available for your scheduled interview. You will be notified when it is your turn to join.
      Keep Your Session Active: Make sure your session remains active and that you don't leave the page during the interview process.
      Notifications: You will receive real-time notifications on the website when it’s your turn for the interview. If, for any reason, you don't receive the notification here, we'll also send you an email with the necessary details.
      Please ensure you are ready and online at your scheduled time. If you have any questions or need further assistance, feel free to reach out to us.

      We look forward to meeting with you!

      Best regards,
    `
    const email = user.email;
    await sendTakeInterviewInvitaionMail(subject, generateMail(html), email);



    return opportunity;
  } catch (e) {
    throw e;
  }
}


export async function getOpportunities(event_id: string, accessToken: string) {
  try {
    const user = await requireEmployer(accessToken);
    const isEmployer = user.role.isEmployer;
    const userId = user._id;

    if (isEmployer === false) {
      return "User is not an employer";
    }
    const opportunities = await OpportunityModel.find({ event_id, user: userId }).populate({
      path: 'rounds',
      select: 'rooms name description roundType index opportunity_id event_id',
      populate:
      {
        path: 'rooms',
        select: 'interviewerName interviewerEmail accessToken',
      }
    }).populate({
      path: 'participants',
      select: 'status',
      populate:
      {
        path: 'user',
        select: 'email fullName avatar',
      }
    })
      .exec();
    return opportunities;
  } catch (e) {
    throw e;
  }

}



export async function getMyAllOpportunities(accessToken: string) {
  try {
    const user = await requireEmployer(accessToken);
    const isEmployer = user.role.isEmployer;
    const userId = user._id;

    if (isEmployer === false) {
      return "User is not an employer";
    }
    const opportunities = await OpportunityModel.find({ user: userId }).populate({
      path: 'rounds',
      select: 'rooms name description roundType index opportunity_id event_id',
      populate:
      {
        path: 'rooms',
        select: 'interviewerName interviewerEmail accessToken',
      }
    }).populate({
      path: 'participants',
      select: 'status',
      populate:
      {
        path: 'user',
        select: 'email fullName avatar',
      }
    }).populate('event_id')
      .sort({ createdAt: -1 })
      .limit(5)
      .exec();

    let participants = [];
    for (let opportunity of opportunities) {
      participants.push(...opportunity.participants);  // Concatenate participants into the array
    }


    return { opportunities, participants };
  } catch (e) {
    throw e;
  }
}


export async function getEmployers() {
  try {
    const employerCount = await UserModel.find({ 'role.isEmployer': true }).countDocuments();
    const activeEvent = await EventModel.findOne().sort({ createdAt: -1 });
    const activeEmployerCount = activeEvent.opportunities.length;
    const inActiveEmployeCount = Number(employerCount || 0) - Number(activeEmployerCount || 0);
    return { inActiveEmployeCount, employerCount, activeEmployerCount };
  } catch (e) {
    throw e;
  }
}


export async function getLatestEvent() {
  try {
    const event = await EventModel.findOne().sort({ createdAt: -1 }).populate({
      path: 'opportunities',
      select: 'participants name role rounds',
      populate:
      {
        path: 'user',
        select: 'fullName',
      }
    });

    return event
  } catch (e) {
    throw e;
  }
}



export async function getAllOpportunitiesByEventId(event_id: string) {
  try {
    const opportunities = await OpportunityModel.find({ event_id }).populate('rounds').populate('event_id');
    return opportunities;
  } catch (e) {
    throw e;
  }
}

export async function getOpportunitiesById(id: string) {
  try {
    const opportunity = await OpportunityModel.findById(id).populate('rounds');
    return opportunity;
  } catch (e) {
    throw e;
  }
}

export async function getRoundById(id: string) {
  try {
    const round = await RoundModel.findById(id);
    return round;
  } catch (e) {
    throw e;
  }
}

export async function getRoundByRoomId(id: string) {
  try {
    const round = await RoundModel.findOne({
      "rooms._id": new mongoose.Types.ObjectId(id)
    });

    const nextRound = await RoundModel.findOne({
      opportunity_id: round.opportunity_id,
      index: round.index + 1
    });



    return { round, nextRound };
  } catch (e) {
    throw e;
  }
}


export async function disableEvent(accessToken: string, eventId: string) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;

    if (adminRole === false) {
      return "User is not an admin";
    }

    const event = await EventModel.findOne({ _id: eventId });

    if (!event) {
      return "Event not found";
    }

    event.status.isActive = false;
    event.status.isPublished = false;
    event.status.isApproved = false;

    event.save();


    return event;
  } catch (e) {
    throw e;
  }
}

export async function enableEvent(accessToken: string, eventId: string) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;

    if (adminRole === false) {
      return "User is not an admin";
    }

    const event = await EventModel.findOne({ _id: eventId });

    if (!event) {
      return "Event not found";
    }

    event.status.isActive = true;
    event.status.isPublished = true;
    event.status.isApproved = true;

    event.save();

    return event;
  } catch (e) {
    throw e;
  }
}

export async function deleteEvent(accessToken: string, eventId: string) {
  try {
    const user = await requireAdmin(accessToken);
    const adminRole = user.role.isAdmin;

    if (adminRole === false) {
      return "User is not an admin";
    }

    const event = await EventModel.findByIdAndDelete({ _id: eventId });

    if (!event) {
      return "Event not found";
    }


    return event;
  } catch (e) {
    throw e;
  }
}