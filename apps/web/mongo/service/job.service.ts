

// let sendNotificationEmail: any;
// let cloudinary: any;

// // Check if we're in a Node.js (server-side) environment
// if (typeof window === 'undefined') {
//   sendNotificationEmail = require('../utils/nodeMailer').sendNotificationEmail;
//   cloudinary = require('../utils/cloudinary').default;
// }

import { sendNotificationEmail } from '../utils/nodeMailer';

// Internal Modules ------------------------------------------------------
import _ from 'lodash'
import { CompanyModel } from '../models/company.model'
import JobModel, { JobDocument } from '../models/job.model'
import ResumeModel from '../models/resume.model'
import { findEmailByEmailType, createEmail } from './admin/email.service'
import { getUserWithPackage } from './user.service'
// const ObjectId = require('mongodb').ObjectID
import mongoose from 'mongoose'
//import { ObjectId } from 'mongodb'
import { Types } from 'mongoose'
import { uploadImageToCloudinary } from '../utils/cloudinary';
import cloudinary from '../utils/cloudinary';
const ObjectId = Types.ObjectId

// create a job service
export async function createJobSeivice(input: any, headerImage: any) {
  try {
    let jobInput
    if (headerImage ) {
      // Upload image to cloudinary
      const headerImageData = await uploadImageToCloudinary(headerImage)
      jobInput = {
        ...input,
        avatar: headerImageData.secure_url,
        avatarCloudinary_id: headerImageData.public_id,
      }
    } else {
      jobInput = {
        ...input,
        avatar: null,
        iconUrl: null,
      }

    }

    const job = await JobModel.create(jobInput)
    return job
  } catch (e) {
    throw e
  }
}

/**
 * @description - This function is used to get all public jobs
 * @param {Object} query - The query to get the jobs
 * @returns {Promise<JobDocument>} - Returns the jobs
 * @memberof JobService
 * @public - true
 */
export async function getJobsService() {
  try {
    // const jobs = await JobModel.find(arg).lean(true)
    const jobs = await JobModel.find({
      'status.isApproved': true,
      'status.isPublished': true,
      'status.isFeatured': true,
      'status.isActive': true,
    })
      .populate('company', [
        'companyName',
        'companyTagline',
        'logo',
        'companyEmail',
        'phoneNumber',
        'companyWebsite',
        'socialLink',
      ])
      .lean(true)

    return jobs
  } catch (e) {
    throw e
  }
}

/**
 * @description get a job by id service
 * @param jobID
 * @returns job, relaated jobs
 */
export async function getSingleJobService(jobID: string) {
  try {
    const job = await JobModel.findById(jobID).populate('company').lean(true)

    // pick category from job
    const jobCategory = _.pick(job, ['category'])

    const relatedJobs = await JobModel.find({
      category: jobCategory.category,
      _id: { $ne: jobID },
    })
      .populate('company')
      .limit(4)
      .lean(true)

    return { job, relatedJobs }
  } catch (e) {
    throw e
  }
}

// find total job, total company, total resume in public api route
export async function getTotalCountService() {
  try {
    // Use countDocuments() instead of count()
    const totalJobs = await JobModel.find({
      'status.isApproved': true,
      'status.isPublished': true,
      'status.isActive': true,
    }).countDocuments(); // Use countDocuments here

    const totalCompanies = await CompanyModel.find({
      'status.isPublished': true,
      'status.isApproved': true,
      'status.isActive': true,
    }).countDocuments(); // Use countDocuments here

    const totalResumes = await ResumeModel.find({
      'status.isPublished': true,
      'status.isApproved': true,
      'status.isActive': true,
    }).countDocuments(); // Use countDocuments here

    const total = {
      totalJobs,
      totalCompanies,
      totalResumes,
    };
    
    return total;
  } catch (e: any) {
    throw e;
  }
}

/**
 * @description - This function is used to count total jobs
 * @returns {Promise<JobDocument>} - Returns tital jobs
 * @memberof JobService
 * @public - true
 */
// export async function getCountJobs(): Promise<any> {
//   try {
//     const totalJobs = await JobModel.find({
//       'status.isApproved': true,
//       'status.isPublished': true,
//       'status.isActive': true,
//     }).count()
//     if (!totalJobs) {
//       // return 0
//       throw new Error('No jobs found')
//     }

//     return totalJobs
//   } catch (e: any) {
//     throw e
//   }
// }

/**
 * @description - This function is used to count total totalCompanies
 * @param
 * @returns {Promise<JobDocument>} - Returns tital jobs
 * @memberof JobService
 * @public - true
 */

// export async function getCountCompanies(): Promise<any> {
//   try {
//     const totalCompanies = await CompanyModel.find({
//       'status.isApproved': true,
//       'status.isPublished': true,
//       'status.isActive': true,
//     }).count()
//     if (!totalCompanies) {
//       // return 0
//       throw new Error('No company found')
//     }
//     return totalCompanies
//   } catch (e: any) {
//     throw e
//   }
// }

/**
 * @description - This function is used to count total totalCompanies
 * @param
 * @returns {Promise<JobDocument>} - Returns tital jobs
 * @memberof JobService
 * @public - true
 */

// export async function getCountResumes(): Promise<any> {
//   try {
//     const totalResumes = await ResumeModel.find({
//       'status.isPublished': true,
//       'status.isApproved': true,
//       'status.isActive': true,
//     }).count()
//     if (!totalResumes) {
//       // return 0
//       throw new Error('No resumes found')
//     }
//     return totalResumes
//   } catch (e: any) {
//     throw e
//   }
// }

// Search and Filter job service

export async function getSearchJobsService(query: any) {
  const page = query.page
  const limit = 9
  // sortby
  const sortBy = query.sortby

  let featuredQuery: any
  if (sortBy === 'featured') {
    featuredQuery = {
      'status.isFeatured': true,
    }
  }
  if (sortBy === 'ascending') {
    // 1.0 means ascending order
    var sortValue = 1.0
  }
  if (sortBy === 'descending') {
    // -1.0 means descending order
    var sortValue = -1.0
  } else {
    var sortValue = 1.0
  }

  //this will be used at production
  const statusQuery = {
    'status.isPublished': true,
    'status.isApproved': true,
    'status.isActive': true,
  }

  try {
    let qJobTitle = null
    let qLocation = null
    let qCategory = null
    let qSkills = null
    let qJobExperience = null
    let qJobTypes = null
    let qSalaryMin = null
    let qSalaryMax = null

    if (query.jobTitle) {
      qJobTitle = new RegExp(query.jobTitle.split(','), 'i')
    }
    if (query.location) {
      qLocation = new RegExp(query.location.split(','), 'i')
    }
    if (query.category) {
      qCategory = new RegExp(query.category, 'i')
    }
    if (query.skills) {
      qSkills = query.skills.split(',')
    }
    if (query.jobExperience) {
      qJobExperience = query.jobExperience.split(',')
    }
    if (query.jobTypes) {
      qJobTypes = query.jobTypes.split(',')
    }
    if (query.salaryMin) {
      qSalaryMin = query.salaryMin
    }
    if (query.salaryMax) {
      qSalaryMax = query.salaryMax
    }

    if (
      qJobTitle ||
      qLocation ||
      qCategory ||
      qSkills ||
      qJobExperience ||
      qJobTypes ||
      qSalaryMin ||
      qSalaryMax ||
      featuredQuery
    ) {
      let salaryQuery: any

      if (qSalaryMin && !qSalaryMax) {
        salaryQuery = {
          'salary.minimum': { $gte: qSalaryMin },
        }
      }
      if (qSalaryMax && !qSalaryMin) {
        salaryQuery = {
          'salary.maximum': { $lte: qSalaryMax },
        }
      }
      if (qSalaryMin && qSalaryMax) {
        salaryQuery = {
          'salary.minimum': { $gte: qSalaryMin },
          'salary.maximum': { $lte: qSalaryMax },
        }
      }

      let filterQuery: any = {
        ...salaryQuery,
        ...statusQuery,
        ...featuredQuery,
      }

      if (qJobTitle) filterQuery.jobTitle = { $in: qJobTitle }
      if (qLocation) filterQuery.location = { $in: qLocation }
      if (qCategory) filterQuery.category = { $in: qCategory }
      if (qSkills) filterQuery.skills = { $in: qSkills }
      if (qJobExperience) filterQuery.jobExperience = { $in: qJobExperience }
      if (qJobTypes) filterQuery.jobTypes = { $in: qJobTypes }

      const jobs = await JobModel.find(filterQuery)
        .populate('company', ['logo'])
        .lean(true)
        .skip(page * limit)
        .limit(limit)
        .sort({
          jobTitle: sortValue || (1.0 as any),
        })

      const jobCount = await JobModel.countDocuments(filterQuery)

      return { jobs, jobCount }
    } else {
      const jobs = await JobModel.find(statusQuery)
        .populate('company', ['logo'])
        .skip(page * limit)
        .limit(limit)
        .sort({
          jobTitle: sortValue as any,
        })
      const jobCount = await JobModel.countDocuments(statusQuery)

      // return jobs
      return { jobs, jobCount }
    }
  } catch (e) {
    throw e
  }
}

// find all jobs types and counts public
export async function jobTypescountService() {
  try {
    //  sort by count exhibits aggregation
    const jobTypeCount = await JobModel.aggregate([
      //only allow isPublished and isApproved
      {
        $match: {
          'status.isPublished': true,
          'status.isApproved': true,
          'status.isActive': true,
        },
      },
      // sort
      { $unwind: '$jobTypes' },
      { $sortByCount: '$jobTypes' },
    ])
    return jobTypeCount
  } catch (e) {
    throw e
  }
}

// find all jobs types and counts public
export async function jobExperinceCountService() {
  try {
    //  sort by count exhibits aggregation
    const jobExpCount = await JobModel.aggregate([
      //only allow isActive, isPublished and isApproved
      {
        $match: {
          'status.isPublished': true,
          'status.isApproved': true,
          'status.isActive': true,
        },
      },
      // sort
      { $unwind: '$jobExperience' },
      { $sortByCount: '$jobExperience' },
    ])
    return jobExpCount
  } catch (e) {
    throw e
  }
}

// find all admin job service
export async function findAdminJob() {
  // check mongoose connection
  if (!mongoose.connection.readyState) {
    //console.log('Mongoose is not connected')
  }
  if (mongoose.connection.readyState) {
    // console.log('Mongoose is connected')
  }

  try {
    // const jobs = await JobModel.find().lean(true)
    const jobs = await JobModel.aggregate([
      {
        $lookup: {
          from: 'jobapplies',
          localField: '_id',
          foreignField: 'jobItem',
          as: 'applications',
        },
      },
    ])
    return jobs
  } catch (e) {
    throw e
  }
}

// find all private job service
export async function findJob(query: any) {
  try {
    // find all jobs and count application from applies collection using aggregation
    const jobs = await JobModel.aggregate([
      {
        $lookup: {
          from: 'jobapplies',
          localField: '_id',
          foreignField: 'jobItem',
          as: 'applications',
        },
      },
      {
        $match: {
          user: new ObjectId(query),
        },
      },
    ])
    return jobs
  } catch (e) {
    throw e
  }
}

// find total private job count based on user
export async function getCountJobPrivateService(query: any) {
  try {
    const totalJob = await JobModel.find(query).countDocuments()
    return totalJob
  } catch (e) {
    throw e
  }
}

// find total user total featured jobs
export async function findTotalFeaturedJob(input: any) {
  const query = {
    user: input,
    'status.isFeatured': true,
  }
  try {
    const totalJob = await JobModel.find(query).countDocuments()
    return totalJob
  } catch (e) {
    throw e
  }
}

// job status update service
export async function jobstatusUpdate(query: any) {
  try {
    const { userId, adminRole, jobId, jobStatus } = query

    // find the job based on id
    const job = await JobModel.findById(jobId).populate('user', ['email'])
    if (!job) {
      throw new Error('Job Not Found')
    }

    if (adminRole === true) {
      switch (jobStatus) {
        case 'approved':
          job.status.isApproved = true
          job.save()

          // let emails
          // emails = await findEmailByEmailType('JOB_APPROVED')

          // if (emails.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta Jobs',
          //     subject: 'Your Job is Approved',
          //     message: 'Congrats..!! Your Job is Approved',
          //     emailType: 'JOB_APPROVED',
          //   }
          //   await createEmail(templateInput)
          //   emails = await findEmailByEmailType('JOB_APPROVED')
          // }
          // const emailData = emails[0]

          // const approvalInput = {
          //   userEmail: job.user.email,
          //   emailData,
          //   userId,
          //   emailType: 'JOB_APPROVED',
          // }
          // await sendNotificationEmail(approvalInput)
          return 'Job approved successfully'

        case 'rejected':
          job.status.isApproved = false
          job.save()

          // let rejectedEmails
          // rejectedEmails = await findEmailByEmailType('JOB_REJECTED')
          // if (rejectedEmails.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Job is Rejected',
          //     message: 'Sorry..!! Your Job is Rejected',
          //     emailType: 'JOB_REJECTED',
          //   }
          //   await createEmail(templateInput)
          //   rejectedEmails = await findEmailByEmailType('JOB_REJECTED')
          // }
          // const rejectedEmailData = rejectedEmails[0]

          // const rejectlInput = {
          //   userEmail: job.user.email,
          //   emailData: rejectedEmailData,
          //   userId,
          //   emailType: 'JOB_REJECTED',
          // }
          // await sendNotificationEmail(rejectlInput)
          return 'Job rejected by Admin'

        case 'featured':
          const user = (await getUserWithPackage(userId)) as any
          const { featuredJobs } = user?.package
          // find the user total job
          const featuredJobsCount = await findTotalFeaturedJob(userId)
          if (featuredJobsCount >= featuredJobs) {
            throw new Error('You have reached your job limit')
          }

          job.status.isFeatured = true
          job.save()

          // let featureJobResult
          // featureJobResult = await findEmailByEmailType('JOB_FEATURED')
          // if (featureJobResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta Jobs',
          //     subject: 'Your Job is Featured',
          //     message: 'Congrats..!! Your Job is Featured',
          //     emailType: 'JOB_FEATURED',
          //   }
          //   await createEmail(templateInput)
          //   featureJobResult = await findEmailByEmailType('JOB_FEATURED')
          // }
          // const feaureJobData = featureJobResult[0]

          // const featurelInput = {
          //   userEmail: job.user.email,
          //   emailData: feaureJobData,
          //   userId,
          //   emailType: 'JOB_FEATURED',
          // }

          // await sendNotificationEmail(featurelInput)

          return 'Job featured successfully'

          break
        case 'nonFeatured':
          job.status.isFeatured = false
          job.save()

           // TODO : [x] need to remove this code after successfully migration
          // let nonFeaturedEmails
          // nonFeaturedEmails = await findEmailByEmailType('JOB_NON-FEATURED')
          // if (nonFeaturedEmails.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Job is Non-Featured',
          //     message: 'Sorry..!! Your Job is Non-Featured',
          //     emailType: 'JOB_NON-FEATURED',
          //   }
          //   await createEmail(templateInput)
          //   nonFeaturedEmails = await findEmailByEmailType('JOB_NON-FEATURED')
          // }
          // const nonFeaturedEmailData = nonFeaturedEmails[0]

          // const nonFeaturedlInput = {
          //   userEmail: job.user.email,
          //   emailData: nonFeaturedEmailData,
          //   userId,
          //   emailType: 'JOB_NON-FEATURED',
          // }

          // await sendNotificationEmail(nonFeaturedlInput)
          return 'Job is non-featured'

        case 'expired':
          job.status.isActive = false
          job.save()
          
           // TODO : [x] need to remove this code after successfully migration
          // const expiredJobResult = await findEmailByEmailType('JOB_EXPIRED')
          // let expiredJobResult
          // expiredJobResult = await findEmailByEmailType('JOB_EXPIRED')
          // if (expiredJobResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta Jobs',
          //     subject: 'Your Job is Expired',
          //     message: 'Sorry..!! Your Job is Expired',
          //     emailType: 'JOB_EXPIRED',
          //   }
          //   await createEmail(templateInput)
          //   expiredJobResult = await findEmailByEmailType('JOB_EXPIRED')
          // }
          // const expiredJobData = expiredJobResult[0]

          // const expiredInput = {
          //   userEmail: job.user.email,
          //   emailData: expiredJobData,
          //   userId,
          //   emailType: 'JOB_EXPIRED',
          // }

          // await sendNotificationEmail(expiredInput)
          return 'Job is expired'

        case 'active':
          job.status.isActive = true
          job.save()

          // let activatedJobResult
          // activatedJobResult = await findEmailByEmailType('JOB_ACTIVATED')
          // if (activatedJobResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta Jobs',
          //     subject: 'Your Job is Activated',
          //     message: 'Congrats..!! Your Job is Activated',
          //     emailType: 'JOB_ACTIVATED',
          //   }
          //   await createEmail(templateInput)
          //   activatedJobResult = await findEmailByEmailType('JOB_ACTIVATED')
          // }
          // const activatedJobData = activatedJobResult[0]

          // const activatedInput = {
          //   userEmail: job.user.email,
          //   emailData: activatedJobData,
          //   userId,
          //   emailType: 'JOB_ACTIVATED',
          // }

          // await sendNotificationEmail(activatedInput)

          return 'Job activated successfully'
        case 'draft':
          job.status.isPublished = false
          job.save()

          // let draftJobResult
          // draftJobResult = await findEmailByEmailType('JOB_DRAFTED')
          // if (draftJobResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Job is in Draft',
          //     message: 'Congrats..!! Your Job is in Draft',
          //     emailType: 'JOB_DRAFTED',
          //   }
          //   await createEmail(templateInput)
          //   draftJobResult = await findEmailByEmailType('JOB_DRAFTED')
          // }
          // const draftJobData = draftJobResult[0]

          // const draftInput = {
          //   userEmail: job.user.email,
          //   emailData: draftJobData,
          //   userId,
          //   emailType: 'JOB_DRAFTED',
          // }
          // await sendNotificationEmail(draftInput)

          return 'Job draft successfully'

        case 'published':
          job.status.isPublished = true
          job.save()

          // let publishedJobResult
          // publishedJobResult = await findEmailByEmailType('JOB_PUBLISHED')
          // if (publishedJobResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Job is in Published',
          //     message: 'Congrats..!! Your Job is Published',
          //     emailType: 'JOB_PUBLISHED',
          //   }
          //   await createEmail(templateInput)
          //   publishedJobResult = await findEmailByEmailType('JOB_PUBLISHED')
          // }
          // const publishedJobData = publishedJobResult[0]

          // const publishedInput = {
          //   userEmail: job.user.email,
          //   emailData: publishedJobData,
          //   userId,
          //   emailType: 'JOB_PUBLISHED',
          // }
          // await sendNotificationEmail(publishedInput)

          return 'Job published successfully'
        default:
          throw new Error('Invalid status')
      }
    }

    switch (jobStatus) {
      case 'featured':
        const user = (await getUserWithPackage(userId)) as any
        const { featuredJobs } = user?.package
        // find the user total job
        const featuredJobsCount = await findTotalFeaturedJob(userId)
        if (featuredJobsCount >= featuredJobs) {
          throw new Error('You have reached your job limit')
        }

        job.status.isFeatured = true
        job.save()
        
        // TODO : [x] need to remove this code after successfully migration
        // let featureJobResult
        // featureJobResult = await findEmailByEmailType('JOB_FEATURED')
        // if (featureJobResult.length === 0) {
        //   const templateInput = {
        //     senderAddress: 'Meta Jobs',
        //     subject: 'Your Job is Featured',
        //     message: 'Congrats..!! Your Job is Featured',
        //     emailType: 'JOB_FEATURED',
        //   }
        //   await createEmail(templateInput)
        //   featureJobResult = await findEmailByEmailType('JOB_FEATURED')
        // }
        // const feaureJobData = featureJobResult[0]

        // const featurelInput = {
        //   userEmail: job.user.email,
        //   emailData: feaureJobData,
        //   userId,
        //   emailType: 'JOB_FEATURED',
        // }

        // await sendNotificationEmail(featurelInput)

        return 'Job featured successfully'
        break
      case 'nonFeatured':
        job.status.isFeatured = false
        job.save()
          // TODO : [x] need to remove this code after successfully migration
        // let nonFeaturedEmails
        // nonFeaturedEmails = await findEmailByEmailType('JOB_NON-FEATURED')
        // if (nonFeaturedEmails.length === 0) {
        //   const templateInput = {
        //     senderAddress: 'Meta-Jobs',
        //     subject: 'Your Job is Non-Featured',
        //     message: 'Sorry..!! Your Job is Non-Featured',
        //     emailType: 'JOB_NON-FEATURED',
        //   }
        //   await createEmail(templateInput)
        //   nonFeaturedEmails = await findEmailByEmailType('JOB_NON-FEATURED')
        // }
        // const nonFeaturedEmailData = nonFeaturedEmails[0]

        // const nonFeaturedlInput = {
        //   userEmail: job.user.email,
        //   emailData: nonFeaturedEmailData,
        //   userId,
        //   emailType: 'JOB_NON-FEATURED',
        // }

        // await sendNotificationEmail(nonFeaturedlInput)

        return 'Job is non-featured'

      case 'draft':
        job.status.isPublished = false
        job.save()

        let draftJobResult
        draftJobResult = await findEmailByEmailType('JOB_DRAFTED')
        if (draftJobResult.length === 0) {
          const templateInput = {
            senderAddress: 'Meta-Jobs',
            subject: 'Your Job is in Draft',
            message: 'Congrats..!! Your Job is in Draft',
            emailType: 'JOB_DRAFTED',
          }
          await createEmail(templateInput)
          draftJobResult = await findEmailByEmailType('JOB_DRAFTED')
        }
        const draftJobData = draftJobResult[0]

        const draftInput = {
          userEmail: job.user.email,
          emailData: draftJobData,
          userId,
          emailType: 'JOB_DRAFTED',
        }
        await sendNotificationEmail(draftInput)

        return 'Job draft successfully'

      case 'published':
        job.status.isPublished = true
        job.save()

        // TODO : [x] need to remove this code after successfully migration
        // let publishedJobResult
        // publishedJobResult = await findEmailByEmailType('JOB_PUBLISHED')
        // if (publishedJobResult.length === 0) {
        //   const templateInput = {
        //     senderAddress: 'Meta-Jobs',
        //     subject: 'Your Job is in Published',
        //     message: 'Congrats..!! Your Job is Published',
        //     emailType: 'JOB_PUBLISHED',
        //   }
        //   await createEmail(templateInput)
        //   publishedJobResult = await findEmailByEmailType('JOB_PUBLISHED')
        // }
        // const publishedJobData = publishedJobResult[0]

        // const publishedInput = {
        //   userEmail: job.user.email,
        //   emailData: publishedJobData,
        //   userId,
        //   emailType: 'JOB_PUBLISHED',
        // }
        // await sendNotificationEmail(publishedInput)

        return 'Job published successfully'

      default:
        throw new Error('Invalid status')
    }
  } catch (e) {
    throw e
  }
}

// update a job service
export async function updateJobService(
  jobID: string,
  update: any,
  headerImage: any
) {
  try {
    if (headerImage ) {
      const jobPreviousData = (await JobModel.findById(jobID)) as any
      if (jobPreviousData?.avatarCloudinary_id) {
        await cloudinary.uploader.destroy(jobPreviousData.avatarCloudinary_id)
      }
      // Upload image to cloudinary
      const headerImageData = await uploadImageToCloudinary(headerImage)
      const updatedInput = {
        ...update,
        avatar: headerImageData.secure_url,
        avatarCloudinary_id: headerImageData.public_id,
      }
      const job = await JobModel.findByIdAndUpdate(jobID, updatedInput, {
        new: true,
      })
      return job
    } else {
      const job = await JobModel.findByIdAndUpdate(jobID, update, {
        new: true,
      })
      return job
    }
  } catch (e) {
    throw e
  }
}

// delete a job service
export async function deleteJobService(jobID: string) {
  try {
    // Delete image from cloudinary
    const jobPreviousData = (await JobModel.findById(jobID)) as any

    if (jobPreviousData?.avatarCloudinary_id) {
      await cloudinary.uploader.destroy(jobPreviousData.avatarCloudinary_id)
    }

    const job = await JobModel.findByIdAndDelete(jobID)

    return job
  } catch (e) {
    throw e
  }
}
