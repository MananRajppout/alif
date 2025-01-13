

import {
  createJobApplyService,
  findApplications,
  getJobApplicationsService,
  updateApplyStatusService,
} from '../service/jobApply.service'
import {
  requireCandidate,
  requireUser,
  requireEmployer,
} from '../middleware/authenticate'
import {
  createEmail,
  findEmailByEmailType,
} from '../service/admin/email.service'
import { sendNotificationEmail } from '../utils/nodeMailer'
import connectDB from '../utils/connect'

// create reate job handller
export async function createJobApply(reqQuery: any) {
  try {
    const { accessToken, applyData, cvFile } = reqQuery
    const user = await requireCandidate(accessToken)

    const userId = user._id
    const userEmail = user.email

    const applyDataInput = {
      ...applyData,
      user: userId,
    }

    const jobApply = await createJobApplyService(applyDataInput, cvFile)

    // let emails
    // emails = await findEmailByEmailType('JOB_APPLIED')
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: 'Meta Jobs',
    //     subject: 'Job is Applied',
    //     message: 'Congrats..!! Your have applied a Job',
    //     emailType: 'JOB_APPLIED',
    //   }
    //   await createEmail(templateInput)
    //   emails = await findEmailByEmailType('JOB_APPLIED')
    // }
    // const emailData = emails[0]

    // const approvalInput = {
    //   userEmail: userEmail,
    //   emailData,
    //   userId,
    //   emailType: 'JOB_APPLIED',
    // }
    // await sendNotificationEmail(approvalInput)
    return jobApply
  } catch (e) {
    throw e
  }
}

// find all application of a candidate handller
export async function getUserApplication(accessToken: string) {
  try {
    const user = (await requireUser(accessToken)) as any
    const userID = user._id

    const applications = await findApplications({ user: userID })
    return applications
  } catch (e) {
    throw e
  }
}

// find all application of of a Job handller
export async function getJobApplication(reqQuery: any) {
  try {
    const { accessToken, jobID } = reqQuery
    const user = await requireEmployer(accessToken)

    const applicationResult = await getJobApplicationsService(jobID)

    const data = {
      applications: applicationResult.applications,
      totalApplyCount: applicationResult.applyCount,
    }
    return data
  } catch (e: any) {
    throw e
  }
}

// update job application status handller
export async function updateApplyStatus(reqQuery: any) {
  try {
    const { accessToken, applyData, applyId } = reqQuery
    const user = await requireCandidate(accessToken)

    // update a job
    const application = await updateApplyStatusService(applyId, applyData)
    return application
  } catch (e) {
    throw e
  }
}
