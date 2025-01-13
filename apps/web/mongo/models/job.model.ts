import mongoose from 'mongoose'
import { CompanyDocument } from './company.model'
import { UserDocument } from './user.model'

export interface JobDocument extends mongoose.Document {
  user: UserDocument['_id']
  company: CompanyDocument['_id']
  status: {
    isApproved: boolean
    isPublished: boolean
    isFeatured: boolean
    isActive: boolean
  }
  jobTitle: string
  location: string
  region: string
  jobTypes: [string]
  category: string
  specialTags: [string]
  jobDescription: string
  email: string
  jobExperience: string
  applyDeadline: string
  hourlyrate: {
    minimum: number
    maximum: number
  }
  salary: {
    minimum: number
    maximum: number
  }
  applyLink: string
  avatar: string
  avatarCloudinary_id: string
  createdAt: Date
  updatedAt: Date
  expireAt: Date
}

const jobSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
    },
    status: {
      isApproved: {
        type: Boolean,
        default: true,
      },
      isPublished: {
        type: Boolean,
        default: true,
      },
      isFeatured: {
        type: Boolean,
        default: false,
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    jobTitle: {
      type: String,
      required: true,
    },
    location: {
      type: String,
    },
    region: {
      type: String,
    },
    jobTypes: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
    },
    specialTags: [
      {
        type: String,
      },
    ],
    jobDescription: {
      type: String,
    },
    email: String,
    jobExperience: String,

    applyDeadline: {
      type: String,
    },
    hourlyrate: {
      minimum: {
        type: Number,
      },
      maximum: {
        type: Number,
      },
    },
    salary: {
      minimum: {
        type: Number,
      },
      maximum: {
        type: Number,
      },
    },
    applyLink: {
      type: String,
    },
    avatar: {
      type: String,
    },
    avatarCloudinary_id: {
      type: String,
    },
    expireAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

const JobModel = mongoose.models.Job || mongoose.model<JobDocument>('Job', jobSchema);


export default JobModel
