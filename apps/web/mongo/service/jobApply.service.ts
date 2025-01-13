

import { sendNotificationEmail } from '../utils/nodeMailer';

import JobApplyModel from '../models/jobApply.model'
// const ObjectId = require('mongodb').ObjectID
// import { ObjectId } from 'mongodb'
import { Types } from 'mongoose'
import { uploadImageToCloudinary } from '../utils/cloudinary';
const ObjectId = Types.ObjectId

// create a job service
export async function createJobApplyService(input: any, cvFile: any) {
  try {
    let applyInput
    if (cvFile) {
      // Upload image to cloudinary
      const cvFileData = await uploadImageToCloudinary(cvFile)
      applyInput = {
        ...input,
        cvFile: cvFileData.secure_url,
        cvFileCloudinary_id: cvFileData.public_id,
      }
    } else {
      applyInput = {
        ...input,
        avatar: null,
        iconUrl: null,
      }
    }

    const jobApplication = await JobApplyModel.create(applyInput)
    return jobApplication
  } catch (e) {
    throw e
  }
}

// find all application of a candidate service
export async function findApplications(query: any) {
  try {
    const applications = await JobApplyModel.find(query)
      .populate('jobItem', ['jobTitle'])
      .lean(true)
    return applications
  } catch (e) {
    throw e
  }
}

// count all application of a candidate service
export async function countApplications(query: any) {
  try {
    const applications = await JobApplyModel.countDocuments(query)
    return applications
  } catch (e) {
    throw e
  }
}

// find all application of a job service
export async function getJobApplicationsService(jobId: any) {
  try {
    const applications = await JobApplyModel.find({
      jobItem: new ObjectId(jobId),
    }).lean(true)
    const applyCount = await JobApplyModel.countDocuments({
      jobItem: new ObjectId(jobId),
    })

    return { applications, applyCount }
  } catch (e) {
    throw e
  }
}

// update job application status service
export async function updateApplyStatusService(applyID: string, update: any) {
  try {
    const application = await JobApplyModel.findByIdAndUpdate(applyID, update, {
      new: true,
    })
    return application
  } catch (e) {
    throw e
  }
}
