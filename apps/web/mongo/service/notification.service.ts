

import { requireUser } from '../middleware/authenticate'
import NotificationModel from '../models/notification.model'

// create notification service
export async function createNotification(input: any) {
  const notification = await NotificationModel.create(input)
  return notification
}

export async function getNotification(accessToken: string) {
  try {
    const user = await requireUser(accessToken)
    const userID = user?._id

    // short by recent array elemnt within notification object
    const notifications = await NotificationModel.findOne(
      {
        user: userID,
      },
      // limit to 8 notifications
      {
        notification: {
          $slice: 8.0,
        },
      }
    )
    return notifications
  } catch (e) {
    throw e
  }
}

// sent notification to user
export async function sendNotification(query: string, input: any) {
  try {
    // check if Notifiction Collection model is exist in databaseName
    const notificationResult = await NotificationModel.findOne({ user: query })

    if (!notificationResult) {
      const newNotification = await createNotification(input)
      return newNotification
    }
    // if notification is exist
    const newNotification = await NotificationModel.findOneAndUpdate(
      { user: query },
      {
        $push: {
          notification: {
            $each: input.notification,
            $position: 0,
          },
        },
      },
      { new: true }
    )
    return newNotification
  } catch (error: any) {
    throw error
  }
}

export async function updateNotificationService(
  userId: string,
  notificationId: string,
  notificationStatus: string
) {
  try {
    const notification = await NotificationModel.findOneAndUpdate(
      {
        user: userId,
        'notification._id': notificationId,
      },
      {
        $set: {
          //  change status of notification array
          'notification.$.status': notificationStatus,
        },
      },
      { new: true }
    )
    return notification
  } catch (e) {
    throw e
  }
}
