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

    //send email to user pending
    const updatedOpportunity = await OpportunityModel.findById(opportunity._id).populate({
      path: 'rounds',
      select: 'rooms name description roundType index opportunity_id event_id',
      populate: {
        path: 'rooms',
        select: 'interviewerName interviewerEmail accessToken',
      },
    })
      .exec();
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
    

    return {opportunities,participants};
  } catch (e) {
    throw e;
  }
}


export async function getEmployers() {
  try {
    const employerCount = await UserModel.find({'role.isEmployer': true}).countDocuments();
    const activeEvent = await EventModel.findOne().sort({ createdAt: -1 });
    const activeEmployerCount = activeEvent.opportunities.length;
    const inActiveEmployeCount = Number(employerCount || 0) - Number(activeEmployerCount || 0);
    return {inActiveEmployeCount,employerCount,activeEmployerCount};
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