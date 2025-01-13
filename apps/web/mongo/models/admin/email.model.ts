import mongoose from 'mongoose'

export interface EmailDocument extends mongoose.Document {
  senderAddress: string
  senderEmail: string
  subject: string
  message: string
  emailType: string
}

const emailSchema = new mongoose.Schema({
  senderAddress: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  emailType: {
    type: String,
    required: true,
    unique: true,
  },
})

const EmailModel = mongoose.models.Email || mongoose.model<EmailDocument>('Email', emailSchema)

export default EmailModel
