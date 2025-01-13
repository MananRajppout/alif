



import ResumeModel from '../models/resume.model'
import { createEmail, findEmailByEmailType } from './admin/email.service'
import { uploadImageToCloudinary } from '../utils/cloudinary';
import  cloudinary from '../utils/cloudinary';

// create resume service
export async function createResumeService(input: any, inputFiles: any) {
  try {
    console.log(inputFiles)
    let imageInput = null
    let fileInput = null
    if (inputFiles.image ) {
      const imageData = await uploadImageToCloudinary(inputFiles.image)
      imageInput = {
        photo: imageData?.secure_url,
        photoCloudinary_id: imageData?.public_id,
      }
    }
    if (inputFiles.resumeFile ) {
      const fileData = await uploadImageToCloudinary(inputFiles.resumeFile)
      fileInput = {
        file: fileData?.secure_url,
        fileCloudinary_id: fileData?.public_id,
      }
    }
    const resumeTotalInput = {
      ...input,
      ...imageInput,
      ...fileInput,
    }
    const resume = await ResumeModel.create(resumeTotalInput)
    return resume
  } catch (e) {
    throw e
  }
}

/**
 * @description get resume service
 * @param resumeId
 * @returns single-resume
 */
export async function getSingleResumeService(resumeId: string) {
  try {
    const resume = await ResumeModel.findById(resumeId)
    return resume
  } catch (e) {
    throw e
  }
}

// find all resumes service by property (used in private, ..)
export async function findResumeService(query: any) {
  try {
    const resumes = await ResumeModel.find(query).lean(true)
    return resumes
  } catch (e) {
    throw e
  }
}

// find all resumes for the adminRole
export async function findAdminResumeService() {
  try {
    const resumes = await ResumeModel.find({}).lean(true)
    return resumes
  } catch (e) {
    throw e
  }
}

// Search and Filter resume profile service public
export async function getSearchResumeService(query: any) {
  const page = query.page
  const limit = 9
  try {
    let qProfessionalTitle = null
    let qIndustry = null
    let qCategory = null
    let qSkills = null
    let qWorkingRateMin = null
    let qWorkingRateMax = null

    if (query.professionalTitle) {
      qProfessionalTitle = new RegExp(query.professionalTitle.split(','), 'i')
    }
    if (query.industry) {
      qIndustry = query.industry.split(',')
    }
    if (query.category) {
      qCategory = query.category.split(',')
    }
    if (query.skills) {
      qSkills = query.skills.split(',')
    }
    if (query.workingRateMin) {
      qWorkingRateMin = query.workingRateMin
    }
    if (query.workingRateMax) {
      qWorkingRateMax = query.workingRateMax
    }

    if (
      qProfessionalTitle ||
      qIndustry ||
      qCategory ||
      qSkills ||
      qWorkingRateMin
    ) {
      interface filterQueryType {
        professionalTitle?: any
        industry?: any
        category?: any
        skills?: any
        workingRate?: any
      }

      let filterQuery: filterQueryType = {}

      if (qProfessionalTitle)
        filterQuery.professionalTitle = { $in: qProfessionalTitle }
      if (qIndustry) filterQuery.industry = { $in: qIndustry }
      if (qCategory) filterQuery.category = { $in: qCategory }
      if (qSkills) filterQuery.skills = { $in: qSkills }
      if (qWorkingRateMin)
        filterQuery.workingRate = {
          $gte: qWorkingRateMin,
          $lte: qWorkingRateMax,
        }

      const resumes = await ResumeModel.find(filterQuery)
        .skip(page * limit)
        .limit(limit)
      const resumeCount = await ResumeModel.countDocuments(filterQuery)
      return { resumes, resumeCount }
    } else {
      const resumes = await ResumeModel.find()
        .lean(true)
        .skip(page * limit)
        .limit(limit)
      const resumeCount = await ResumeModel.countDocuments()
      return { resumes, resumeCount }
    }
  } catch (e) {
    throw e
  }
}

// find all private resume service
export async function resumeStatusUpdateService(query: any) {
  try {
    const { userId, adminRole, resumeId, resumeStatus } = query

    // find the job based on id
    const resume = await ResumeModel.findById(resumeId).populate('user', [
      'email',
    ])
    if (!resume) {
      throw new Error('Resume Not Found')
    }

    if (adminRole === true) {
      switch (resumeStatus) {
        case 'approved':
          resume.status.isApproved = true
          resume.save()

          // let emails
          // emails = await findEmailByEmailType('RESUME_APPROVED')
          // if (emails.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Resume is Approved',
          //     message: 'Congrats..!! Your Resume is Approved',
          //     emailType: 'RESUME_APPROVED',
          //   }
          //   await createEmail(templateInput)
          //   emails = await findEmailByEmailType('RESUME_APPROVED')
          // }
          // const emailData = emails[0]

          // const approvalInput = {
          //   userEmail: resume.user.email,
          //   emailData,
          //   userId,
          //   emailType: 'RESUME_APPROVED',
          // }

          // await sendNotificationEmail(approvalInput)
          return 'Resume approved successfully'

        case 'rejected':
          resume.status.isApproved = false
          resume.save()

          // let rejectedEmails
          // rejectedEmails = await findEmailByEmailType('RESUME_REJECTED')
          // if (rejectedEmails.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Resume is Rejected',
          //     message: 'Sorry..!! Your Resume is Rejected',
          //     emailType: 'RESUME_REJECTED',
          //   }
          //   await createEmail(templateInput)
          //   rejectedEmails = await findEmailByEmailType('RESUME_REJECTED')
          // }
          // const rejectedEmailData = rejectedEmails[0]

          // const rejectlInput = {
          //   userEmail: resume.user.email,
          //   emailData: rejectedEmailData,
          //   userId,
          //   emailType: 'RESUME_REJECTED',
          // }
          // await sendNotificationEmail(rejectlInput)

          return 'Resume rejected by Admin'
        case 'expired':
          resume.status.isActive = false
          resume.save()

          // TODO : [x] need to remove this code after successfully migration
          // let activeResumeResult
          // activeResumeResult = await findEmailByEmailType('RESUME_EXPIRED')
          // if (activeResumeResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Resume is Expired',
          //     message: 'Congrats..!! Your Resume is Expired',
          //     emailType: 'RESUME_EXPIRED',
          //   }
          //   await createEmail(templateInput)
          //   activeResumeResult = await findEmailByEmailType('RESUME_EXPIRED')
          // }
          // const activeJobData = activeResumeResult[0]

          // const activeInput = {
          //   userEmail: resume.user.email,
          //   emailData: activeJobData,
          //   userId,
          //   emailType: 'RESUME_EXPIRED',
          // }

          // await sendNotificationEmail(activeInput)
          return 'Resume expired successfully'
        case 'active':
          resume.status.isActive = true
          resume.save()

          // let activatedJobResult
          // activatedJobResult = await findEmailByEmailType('RESUME_ACTIVATED')
          // if (activatedJobResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Resume is Activated',
          //     message: 'Congrats..!! Your Resume is Activated',
          //     emailType: 'RESUME_ACTIVATED',
          //   }
          //   await createEmail(templateInput)
          //   activatedJobResult = await findEmailByEmailType('RESUME_ACTIVATED')
          // }
          // const activatedResumeData = activatedJobResult[0]

          // const activatedInput = {
          //   userEmail: resume.user.email,
          //   emailData: activatedResumeData,
          //   userId,
          //   emailType: 'RESUME_ACTIVATED',
          // }

          // await sendNotificationEmail(activatedInput)

          return 'Resume activated successfully'
        case 'draft':
          resume.status.isPublished = false
          resume.save()

          // let draftResumeResult
          // draftResumeResult = await findEmailByEmailType('RESUME_DRAFTED')
          // if (draftResumeResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Resume is in Draft',
          //     message: 'Congrats..!! Your Resume is in Draft',
          //     emailType: 'RESUME_DRAFTED',
          //   }
          //   await createEmail(templateInput)
          //   draftResumeResult = await findEmailByEmailType('RESUME_DRAFTED')
          // }
          // const draftResumeData = draftResumeResult[0]

          // const draftInput = {
          //   userEmail: resume.user.email,
          //   emailData: draftResumeData,
          //   userId,
          //   emailType: 'RESUME_DRAFTED',
          // }
          // await sendNotificationEmail(draftInput)

          return 'Resume draft successfully'
        case 'published':
          resume.status.isPublished = true
          resume.save()

            // TODO : [x] need to remove this code after successfully migration
          // let publishedResumeResult
          // publishedResumeResult = await findEmailByEmailType('RESUME_PUBLISHED')
          // if (publishedResumeResult.length === 0) {
          //   const templateInput = {
          //     senderAddress: 'Meta-Jobs',
          //     subject: 'Your Resume is in Published',
          //     message: 'Congrats..!! Your Resume is Published',
          //     emailType: 'RESUME_PUBLISHED',
          //   }
          //   await createEmail(templateInput)
          //   publishedResumeResult = await findEmailByEmailType(
          //     'RESUME_PUBLISHED'
          //   )
          // }
          // const publishedResumeData = publishedResumeResult[0]

          // const publishedInput = {
          //   userEmail: resume.user.email,
          //   emailData: publishedResumeData,
          //   userId,
          //   emailType: 'RESUME_PUBLISHED',
          // }
          // await sendNotificationEmail(publishedInput)

          return 'Resume published successfully'
        default:
          throw new Error('Invalid status')
      }
    }

    switch (resumeStatus) {
      case 'draft':
        resume.status.isPublished = false
        resume.save()

        // TODO : [x] need to remove this code after successfully migration 
        // let draftResumeResult
        // draftResumeResult = await findEmailByEmailType('RESUME_DRAFTED')
        // if (draftResumeResult.length === 0) {
        //   const templateInput = {
        //     senderAddress: 'Meta-Jobs',
        //     subject: 'Your Resume is in Draft',
        //     message: 'Congrats..!! Your Resume is in Draft',
        //     emailType: 'RESUME_DRAFTED',
        //   }
        //   await createEmail(templateInput)
        //   draftResumeResult = await findEmailByEmailType('RESUME_DRAFTED')
        // }
        // const draftResumeData = draftResumeResult[0]

        // const draftInput = {
        //   userEmail: resume.user.email,
        //   emailData: draftResumeData,
        //   userId,
        //   emailType: 'RESUME_DRAFTED',
        // }
        // await sendNotificationEmail(draftInput)

        return 'Resume draft successfully'
      case 'published':
        resume.status.isPublished = true
        resume.save()


// TODO : [x] need to remove this code after successfully migration
        // let publishedResumeResult
        // publishedResumeResult = await findEmailByEmailType('RESUME_PUBLISHED')
        // if (publishedResumeResult.length === 0) {
        //   const templateInput = {
        //     senderAddress: 'Meta-Jobs',
        //     subject: 'Your Resume is in Published',
        //     message: 'Congrats..!! Your Resume is Published',
        //     emailType: 'RESUME_PUBLISHED',
        //   }
        //   await createEmail(templateInput)
        //   publishedResumeResult = await findEmailByEmailType('RESUME_PUBLISHED')
        // }
        // const publishedResumeData = publishedResumeResult[0]

        // const publishedInput = {
        //   userEmail: resume.user.email,
        //   emailData: publishedResumeData,
        //   userId,
        //   emailType: 'RESUME_PUBLISHED',
        // }
        // await sendNotificationEmail(publishedInput)

        return 'Resume published successfully'
      default:
        throw new Error('Invalid status')
    }
  } catch (e) {
    throw e
  }
}

// update resume image and files service
export async function updateResumeService(
  resumeId: string,
  input: any,
  inputFiles: any
) {
  try {
    let resumeTotalInput
    if (inputFiles) {
      let imageInput = null
      let fileInput = null
      if (inputFiles?.image ) {
        const resumePrevData = (await ResumeModel.findById(resumeId)) as any
        if (resumePrevData.photoCloudinary_id) {
          await cloudinary.uploader.destroy(resumePrevData.photoCloudinary_id)
        }
        const imageData = await cloudinary.uploader.upload(inputFiles.image)
        imageInput = {
          photo: imageData?.secure_url,
          photoCloudinary_id: imageData?.public_id,
        }
      }
      if (inputFiles?.resumeFile ) {
        const resumePrevData = (await ResumeModel.findById(resumeId)) as any
        if (resumePrevData.fileCloudinary_id) {
          await cloudinary.uploader.destroy(resumePrevData.fileCloudinary_id)
        }
        const fileData = await uploadImageToCloudinary(inputFiles.resumeFile)
        fileInput = {
          file: fileData?.secure_url,
          fileCloudinary_id: fileData?.public_id,
        }
      }
      resumeTotalInput = {
        ...input,
        ...imageInput,
        ...fileInput,
      }
    } else {
      resumeTotalInput = {
        ...input,
      }
    }
    const resume = await ResumeModel.findByIdAndUpdate(
      resumeId,
      resumeTotalInput,
      {
        new: true,
      }
    )
    return resume
  } catch (e) {
    throw e
  }
}

// delete resume service
export async function deleteResumeService(resumeId: string) {
  try {
    // Delete image and files from cloudinary
    const resumePrevData = (await ResumeModel.findById(resumeId)) as any
    if (resumePrevData?.photoCloudinary_id) {
      await cloudinary.uploader.destroy(resumePrevData.photoCloudinary_id)
    }
    if (resumePrevData?.fileCloudinary_id) {
      await cloudinary.uploader.destroy(resumePrevData.fileCloudinary_id)
    }
    const resume = await ResumeModel.findByIdAndDelete(resumeId)

    return resume
  } catch (e) {
    throw e
  }
}
