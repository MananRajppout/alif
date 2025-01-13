import mongoose from 'mongoose'
import { JobDocument } from './job.model'
import { UserDocument } from './user.model'

export interface JobApplyDocument extends mongoose.Document {
    user: UserDocument['_id']
    status: string
    fullName: string
    email: string
    coverLetter: string
    cvFile: string
    cvFileCloudinary_id: string
    jobItem: JobDocument['_id']
}

const jobApplySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        default: 'Pending'
    },
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    coverLetter: {
        type: String,
    },
    cvFile: {
        type: String,
    },
    cvFileCloudinary_id: {
        type: String,
    },
    jobItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
    }
})

const JobApplyModel = mongoose.models.JobApply || mongoose.model<JobApplyDocument>('JobApply', jobApplySchema)

export default JobApplyModel
