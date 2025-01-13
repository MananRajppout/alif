

import {
  createJobAlertService,
  deleteJobAlertService,
  getJobAlertsService,
  getSingleJobAlertService,
  updateJobAlertStatusService,
} from '../service/jobAlert.service'
import { requireCandidate } from '../middleware/authenticate'

/**
 * create job alert
 * @param reqData  (req body, acessToken)
 * @returns  (jobAlert)
 */
export async function createJobAlerts(reqData: any) {
  try {
    const user = await requireCandidate(reqData.accessToken)
    const userID = user?._id
    const input = {
      ...reqData.body,
      user: userID,
    }
    const jobAlert = await createJobAlertService(input)

    return jobAlert
  } catch (e) {
    throw e
  }
}

/**
 * find job alert of a candidate (private)
 * @param accessToken
 * @returns jobAlerts
 */
export async function getJobAlerts(accessToken: string) {
  try {
    const user = await requireCandidate(accessToken)
    const userID = user?._id

    const jobAlerts = await getJobAlertsService({ user: userID })

    return jobAlerts
  } catch (e) {
    throw e
  }
}

/**
 * get job alert by ID
 * @param accessToken  (acessToken)
 * @returns jobAlerts
 */
export async function getSingleJobAlert(reqData: any) {
  try {
    const user = await requireCandidate(reqData.accessToken)
    const alertID = reqData?.alertId

    const jobAlerts = await getSingleJobAlertService(alertID)

    return jobAlerts
  } catch (e) {
    throw e
  }
}

/**
 * create job alert
 * @param reqData  (req body, alertId, acessToken)
 * @returns  (jobAlert)
 */
export async function updateJobAlert(reqQuery: any) {
  try {
    await requireCandidate(reqQuery.accessToken)
    const alertID = reqQuery.alertId
    const alertData = {
      ...reqQuery.body,
    }

    // update a job
    const jobAlert = await updateJobAlertStatusService(alertID, alertData)

    if (!jobAlert) {
      throw new Error('Job Alert Not Found')
    }
    return jobAlert
  } catch (e) {
    throw e
  }
}

/**
 * update job alert status
 * @param reqQuery (accessToken, alertId, active)
 * @returns  jobAlert
 */
export async function updateJobAlertStatus(reqQuery: any) {
  try {
    await requireCandidate(reqQuery.accessToken)
    const alertID = reqQuery.alertId
    const alertData = {
      active: reqQuery.active,
    }

    // update a job
    const jobAlert = await updateJobAlertStatusService(alertID, alertData)

    if (!jobAlert) {
      throw new Error('Job Alert Not Found')
    }
    return jobAlert
  } catch (e) {
    throw e
  }
}

/**
 * delete job alert
 * @param reqQuery (accessToken, alertId)
 * @returns  jobAlert
 */
export async function deleteJobAlert(reqQuery: any) {
  try {
    await requireCandidate(reqQuery.accessToken)
    const alertID = reqQuery.alertId

    const jobAlert = await deleteJobAlertService(alertID)
    return jobAlert
  } catch (e) {
    throw e
  }
}
