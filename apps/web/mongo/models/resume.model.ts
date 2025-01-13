import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface ResumeDocument extends mongoose.Document {
  user: UserDocument['_id']
  status: {
    isPublished: boolean
    isApproved: boolean
    isActive: boolean
  }
  name: string
  email: string
  region: string
  professionalTitle: string
  location: string
  photo: string
  photoCloudinary_id: string
  file: string
  fileCloudinary_id: string
  video: string
  category: string
  industry: string
  workingRate: number
  education: [
    {
      schoolName: string
      qualifications: string
      startDate: string
      endDate: string
      notes: string
    }
  ]
  resumeContent: string
  skills: [string]
  url: [
    {
      name: string
      url: string
    }
  ]
  experience: [
    {
      employerName: string
      jobTitle: string
      startDate: string
      endDate: string
      notes: string
    }
  ]
  createdAt: Date
  updatedAt: Date
}

const resumeSchema = new mongoose.Schema(
  {
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
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    region: {
      type: String,
    },
    professionalTitle: {
      type: String,
    },
    location: {
      type: String,
    },
    photo: {
      type: String,
    },
    photoCloudinary_id: {
      type: String,
    },
    file: {
      type: String,
    },
    fileCloudinary_id: {
      type: String,
    },
    video: {
      type: String,
    },
    category: {
      type: String,
    },
    industry: {
      type: String,
    },
    workingRate: {
      type: Number,
    },
    education: {
      type: [
        {
          schoolName: String,
          qualifications: String,
          startDate: String,
          endDate: String,
          notes: String,
        },
      ],
    },
    resumeContent: {
      type: String,
    },
    skills: {
      type: [String],
    },
    url: {
      type: [
        {
          name: String,
          url: String,
        },
      ],
    },
    experience: {
      type: [
        {
          employerName: String,
          jobTitle: String,
          startDate: String,
          endDate: String,
          notes: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
)

const ResumeModel = mongoose.models.Resume || mongoose.model<ResumeDocument>('Resume', resumeSchema)

export default ResumeModel
