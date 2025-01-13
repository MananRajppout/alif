import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface CompanyDocument extends mongoose.Document {
  user: UserDocument['_id']
  status: {
    isPublished: boolean
    isApproved: boolean
    isActive: boolean
  }
  companyName: string
  companyTagline: string
  category: string
  videoLink: string
  companyEmail: string
  phoneNumber: string
  eatablishedDate: string
  companyWebsite: string
  avarageSalary: string
  revenue: string
  socialLink: {
    linkedin: string
    facebook: string
    twitter: string
  }
  companySize: string
  description: string
  location: string
  locationMap: {
    latitude: string
    longitude: string
  }
  logo: string
  logoCloudinary_id: string
  thumb: string
  thumbCloudinary_id: string
}

export const companySchema = new mongoose.Schema(
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
    companyName: {
      type: String,
      required: true,
    },
    companyTagline: String,
    category: String,
    videoLink: String,
    companyEmail: String,
    phoneNumber: String,
    eatablishedDate: String,
    companyWebsite: String,
    avarageSalary: String,
    revenue: String,
    socialLink: {
      linkedin: String,
      facebook: String,
      twitter: String,
    },
    companySize: String,
    description: {
      type: String,
      required: true,
    },
    location: String,
    locationMap: {
      latitude: String,
      longitude: String,
    },
    logo: String,
    logoCloudinary_id: String,
    thumb: String,
    thumbCloudinary_id: String,
  },
  {
    timestamps: true,
  }
)

export const CompanyModel = mongoose.models.Company || mongoose.model<CompanyDocument>(
  'Company',
  companySchema
)
