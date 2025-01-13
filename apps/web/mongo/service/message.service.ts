

import { requireUser } from '../middleware/authenticate'
import MessageModel from '../models/message.model'
import UserModel from '../models/user.model'

// create createMessageRoom service
export async function createMessageRoom(input: any) {
  try {
    // get candidate by id
    const candidate = await UserModel.findOne({
      _id: input.members.candidate,
    })

    if (!candidate) {
      throw new Error('This candidate does not exist')
    }

    const messageRoom = await MessageModel.create(input)
    return messageRoom
  } catch (e) {
    throw e
  }
}

// find the user message services
export async function findMessageRoom(accessToken: string) {
  try {
    const user = await requireUser(accessToken)
    const userID = user?._id

    const messageRoom = await MessageModel.find({
      $or: [
        {
          'members.candidate': `${userID}`,
        },
        {
          'members.employer': `${userID}`,
        },
      ],
    })
      .populate('job', ['jobTitle', '_id'])
      .populate('members.candidate', ['fullName', 'avatar', '_id'])
      .populate('members.employer', ['fullName', '_id', 'avatar'])
      .lean(true)

    return messageRoom
  } catch (e) {
    throw e
  }
}

// get message room by id services
export async function getMessageRoom(roomId: string) {
  try {
    const messageRoom = await MessageModel.findById(roomId)
      .populate('job', ['jobTitle', '_id'])
      .populate('members.candidate', ['avatar', '_id'])
      .populate('members.employer', ['avatar', '_id'])
      .lean(true)
    return messageRoom
  } catch (e) {
    throw e
  }
}

// update message room services
export async function updateMessageRoom(roomId: string, input: any) {
  try {
    // push the new message to message array
    const messageRoom = await MessageModel.findByIdAndUpdate(
      roomId,
      {
        $push: {
          messages: input,
        },
      },
      {
        new: true,
      }
    )
    return messageRoom
  } catch (e) {
    throw e
  }
}
