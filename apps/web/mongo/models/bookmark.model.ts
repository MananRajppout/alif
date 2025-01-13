import mongoose from 'mongoose'
import { CompanyDocument } from './company.model'
import { JobDocument } from './job.model'
import { ResumeDocument } from './resume.model'
import { UserDocument } from './user.model'

export interface BookmarkDocument extends mongoose.Document {
  user: UserDocument['_id']
  bookmarks: [
    {
      job: JobDocument['_id']
      company: CompanyDocument['_id']
      resume: ResumeDocument['_id']
      note: string
    }
  ]
}

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  bookmarks: [
    {
      job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
      company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
      resume: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resume',
      },
      note: {
        type: String,
        default: '',
      },
    },
  ],
})

const BookmarkModel = mongoose.models.Bookmark || mongoose.model<BookmarkDocument>(
  'Bookmark',
  bookmarkSchema
)

export default BookmarkModel
