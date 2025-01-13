import mongoose from 'mongoose'

export interface FilterDocument extends mongoose.Document {
  jobTypes: [string]
  jobExperience: [string]
  companySize: [string]
  avarageSalary: [string]
  revenue: [string]
  region: [string]
  tags: [string]
  skills: [string]
}

const filterSchema = new mongoose.Schema({
  jobTypes: {
    type: [String],
  },
  jobExperience: {
    type: [String],
  },
  companySize: {
    type: [String],
  },
  avarageSalary: {
    type: [String],
  },
  revenue: {
    type: [String],
  },
  region: {
    type: [String],
  },
  tags: {
    type: [String],
  },
  skills: {
    type: [String],
  },
})

const FilterModel = mongoose.models.Filter || mongoose.model<FilterDocument>('Filter', filterSchema)

export default FilterModel
