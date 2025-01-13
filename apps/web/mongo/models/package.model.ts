import mongoose from 'mongoose'

export interface PackageDocument extends mongoose.Document {
  packageName: string
  subtitle: string
  subTitleStatus: boolean
  shortDesc: string
  pricing: number
  frequency: string
  buttonText: string
  validity: number
  totalJobs: number
  featuredJobs: number
  services: [
    {
      name: string
      details: string
    }
  ]
  createdAt: Date
  updatedAt: Date
}

const packageSchema = new mongoose.Schema(
  {
    packageName: {
      type: String,
      required: true,
      unique: true,
    },
    subtitle: {
      type: String,
    },
    subTitleStatus: {
      type: Boolean,
      default: true,
    },
    shortDesc: {
      type: String,
    },
    pricing: {
      type: Number,
      required: true,
      unique: true,
    },
    frequency: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    validity: {
      type: Number,
      required: true,
    },
    totalJobs: {
      type: Number,
      required: true,
    },
    featuredJobs: {
      type: Number,
      required: true,
    },
    services: {
      type: [
        {
          name: String,
          details: String,
        },
      ],
    },
  },
  {
    timestamps: true,
  }
)

const PackageModel = mongoose.models.Package || mongoose.model<PackageDocument>('Package', packageSchema)

export default PackageModel
