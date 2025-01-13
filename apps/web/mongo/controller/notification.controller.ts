

import { requireUser } from '../middleware/authenticate'
import { updateNotificationService } from '../service/notification.service'
import connectDB from '../utils/connect'

// update notification status
export async function updateNotification(reqQuery: any) {
  const { accessToken, notificationId, status } = reqQuery

  const user = await requireUser(accessToken)

  const userId = user._id as string
  const notificationID = notificationId
  const notificationStatus = status

  try {
    const updatedNotification = await updateNotificationService(
      userId,
      notificationID,
      notificationStatus
    )
    return updatedNotification
  } catch (e) {
    throw e
  }
}
