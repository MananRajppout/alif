import mongoose from 'mongoose'
import { JobDocument } from './job.model'
import { UserDocument } from './user.model'

export interface ReviewDocument extends mongoose.Document {
  user: UserDocument['_id']
  status: {
    isPublished: boolean
    isApproved: boolean
    isActive: boolean
  }
  ratingNumber: number
  review: string
  jobItem: JobDocument['_id']
}

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    isPublished: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  ratingNumber: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
  },
  jobItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
  },
})

const ReviewModel = mongoose.models.Review || mongoose.model<ReviewDocument>('Review', reviewSchema);

export default ReviewModel;