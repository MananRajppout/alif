import EventModel from "../models/event.model";
import crypto from 'node:crypto';

export async function getAdminEventsService() {
  try {
    const events = await EventModel.find({}).lean(true);
    return events;
  } catch (e) {
    throw e;
  }
}

export async function getPublicEventsService() {
  try {
    let events = await EventModel.find({
      "status.isPublished": true,
      "status.isActive": true,
      "status.isApproved": true,
    }).lean(true);
    //@ts-ignore
    return events;
  } catch (e) {
    throw e;
  }
}




export async function getUpcomingEventsService() {
  try {
    let events = await EventModel.find({
      "status.isPublished": true,
      "status.isActive": true,
      "status.isApproved": true,
      "date": { $gte: new Date() },
    }).sort({ date: 1 }).lean(true).populate("opportunities").populate("opportunities.rounds");

    return events;
  } catch (e) {
    throw e;
  }
}


/**
 * Generate an access token.
 * @param {number} length - Length of the token.
 * @returns {string} - Generated token.
 */
export function generateAccessToken(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}