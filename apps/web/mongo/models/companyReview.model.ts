import mongoose from 'mongoose'
import { CompanyDocument } from './company.model'
import { UserDocument } from './user.model'

export interface CompanyReviewDocument extends mongoose.Document {
  user: UserDocument['_id']
  status: {
    isPublished: boolean
    isApproved: boolean
    isActive: boolean
  }
  ratingNumber: number
  review: string
  company: CompanyDocument['_id']
}

const companyReviewSchema = new mongoose.Schema({
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
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
})

const CompanyReviewModel = mongoose.models.CompanyReview || mongoose.model<CompanyReviewDocument>(
  'CompanyReview',
  companyReviewSchema
)

export default CompanyReviewModel
