

import {
  createResumeService,
  deleteResumeService,
  findAdminResumeService,
  findResumeService,
  getSearchResumeService,
  getSingleResumeService,
  resumeStatusUpdateService,
  updateResumeService,
} from '../service/resume.service'
import { requireCandidate, requireUser } from '../middleware/authenticate'
import {
  createEmail,
  findEmailByEmailType,
} from '../service/admin/email.service'
import { sendNotificationEmail } from '../utils/nodeMailer'
import ResumeModel from '../models/resume.model'

// create resume controller
export async function createResume(reqQuery: any) {
  try {
    const { accessToken, resumeInput, inputFiles } = reqQuery
    const user = await requireCandidate(accessToken)
    const userId = user._id

    const resumeInputData = {
      user: userId,
      ...resumeInput,
    }
    const resume = await createResumeService(resumeInputData, inputFiles)
   
    // TODO : [x] need to remove this code after successfully migration
    // const emailType = 'RESUME_PUBLISHED'
    // let emails
    // emails = await findEmailByEmailType(emailType)
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: 'Meta-Jobs',
    //     subject: 'Your Resume is Live',
    //     message: 'Congrats..!! Your Resume is published',
    //     emailType: 'RESUME_PUBLISHED',
    //   }
    //   await createEmail(templateInput)
    //   emails = await findEmailByEmailType('RESUME_PUBLISHED')
    // }
    // const emailData = emails[0]

    // const inputEmailData = {
    //   userEmail: user.email,
    //   emailData,
    //   emailType,
    //   userId,
    // }
    // const mailInfo = sendNotificationEmail(inputEmailData)

    return resume
  } catch (e) {
    throw e
  }
}

export async function getSingleResume(resumeId: string) {
  try {
    const resume = await getSingleResumeService(resumeId)
    return resume
  } catch (e) {
    throw e
  }
}

// find all resume handller private
export async function getResumePrivate(accessToken: string) {
  try {
    const user = await requireCandidate(accessToken)
    const jsonUser = await JSON.parse(JSON.stringify(user))
    const adminRole = jsonUser.role.isAdmin

    if (adminRole === true) {
      const resumes = await findAdminResumeService()
      return resumes
    }

    const resumes = await findResumeService({ user: jsonUser._id })

    return resumes
  } catch (e) {
    throw e
  }
}


export async function getResumeById(user_id: string) {
  try {

    const resume = await ResumeModel.findOne({user: user_id});

    return resume
  } catch (e) {
    throw e
  }
}

// Search and Filter resume handller public
export async function getSearchResume(reqQueries: any) {
  try {
    const resumeResult = await getSearchResumeService(reqQueries)
    return resumeResult
  } catch (e) {
    throw e
  }
}

// resume status update
export async function updateResumeStatus(rewQuery: any) {
  try {
    const user = await requireUser(rewQuery.accessToken)

    const query = {
      userId: user._id,
      adminRole: user.role.isAdmin,
      resumeId: rewQuery.resumeId,
      resumeStatus: rewQuery.resumeStatus,
    }

    const resume = await resumeStatusUpdateService(query)
    return resume
  } catch (e) {
    throw e
  }
}

// update resume image and file controller
export async function updateResume(reqQuery: any) {
  try {
    const { accessToken, resumeInput, inputFiles, resumeId } = reqQuery

    await requireCandidate(accessToken)

    const resume = await updateResumeService(resumeId, resumeInput, inputFiles)
    return resume
  } catch (e: any) {
    throw e
  }
}

// delete resume controller
export async function deleteResume(reqQuery: any) {
  try {
    const user = await requireCandidate(reqQuery.accessToken)
    const userId = user._id
    const resumeId = reqQuery.resumeId

    const resume = await deleteResumeService(resumeId)

     // TODO : [x] need to remove this code after successfully migration
    // const emailType = 'RESUME_DELETED'
    // let emails
    // emails = await findEmailByEmailType(emailType)
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: 'Meta-Jobs',
    //     subject: 'Your Resume is Deleted',
    //     message: 'You have deleted a resume',
    //     emailType: 'RESUME_DELETED',
    //   }
    //   await createEmail(templateInput)
    //   emails = await findEmailByEmailType('RESUME_DELETED')
    // }
    // const emailData = emails[0]

    // const inputEmailData = {
    //   userEmail: user.email,
    //   emailData,
    //   emailType,
    //   userId,
    // }
    // const mailInfo = sendNotificationEmail(inputEmailData)

    return resume
  } catch (e) {
    throw e
  }
}
