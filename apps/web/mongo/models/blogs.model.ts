import mongoose from 'mongoose'
import { UserDocument } from './user.model'
import { title } from 'process'

export interface BlogsDocument extends mongoose.Document {
    user: UserDocument['_id']
    title: string
    displayImage: string
    content: string
    isActive: boolean
}

const blogsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title:{
        type: String,
        required: true,
    },
    displayImage:{
        type: String,
    },
    content:{
        type: String,
        required: true,
    },
    isActive:{
        type: Boolean,
        default: true,
    }
},{
    timestamps: true
})

const BlogsModel = mongoose.models.Blogs || mongoose.model<BlogsDocument>('Blogs', blogsSchema)

export default BlogsModel
