import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface NotificationDocument extends mongoose.Document {
  user: UserDocument['_id']
  notification: [
    {
      message: string
      timestamp: string
      event: string
      status: string
    }
  ]
}

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  notification: {
    type: [
      {
        message: String,
        timestamp: String,
        event: String,
        status: String,
      },
    ],
  },
})

const NotificationModel = mongoose.models.Notification || mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema
)

export default NotificationModel
