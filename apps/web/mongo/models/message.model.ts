import mongoose from 'mongoose'
import { JobDocument } from './job.model'
import { UserDocument } from './user.model'

export interface MessageDocument extends mongoose.Document {
  job: JobDocument['_id']
  time: string
  members: {
    candidate: UserDocument['_id']
    employer: UserDocument['_id']
  }
  messages: [
    {
      sender: UserDocument['_id']
      reciver: UserDocument['_id']
      message: string
      timestamp: string
    }
  ]
}

// create message schema
const messageSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
  time: {
    type: String,
    required: true,
  },
  members: {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  messages: {
    type: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        reciver: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        message: String,
        timestamp: String,
      },
    ],
    required: true,
  },
})

// create message model
const MessageModel = mongoose.models.Message || mongoose.model<MessageDocument>('Message', messageSchema)

export default MessageModel
