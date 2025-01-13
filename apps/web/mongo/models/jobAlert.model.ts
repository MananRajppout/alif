import mongoose from 'mongoose'
import { UserDocument } from './user.model'

export interface JobAlertDocument extends mongoose.Document {
    user: UserDocument['_id']
    name: string
    active: boolean
    keyword: string
    region: string
    category: string
    tags: [string]
    type: [string]
    emailFrequency: string

}

const jobAlertSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    keyword: {
        type: String,
    },
    region: {
        type: String,
    },
    category: {
        type: String,
    },
    tags: [
        {
            type: String,
        },
    ],
    type: [
        {
            type: String,
        },
    ],
    emailFrequency: {
        type: String,
    }
})

const JobAlertModel = mongoose.models.JobAlert || mongoose.model<JobAlertDocument>('JobAlert', jobAlertSchema)

export default JobAlertModel
