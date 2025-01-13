

import { requireAdmin } from '../../middleware/authenticate'
import {
  createEmail,
  findEmailByEmailType,
  updateEmail,
} from '../../service/admin/email.service'

// get a email by emailType
export async function getEmailSettings(reqQuery: any) {
  try {
    await requireAdmin(reqQuery.accessToken)
    const emailType = reqQuery.emailType
    const email = await findEmailByEmailType(emailType)
    if (!email) {
      throw new Error('Email Not Found')
    }
    return email
  } catch (e) {
    throw e
  }
}

// update a email by emailType
export async function updateEmailSettings(reqQuery: any) {
  try {
    await requireAdmin(reqQuery.accessToken)
    const emailQuery = {
      emailType: reqQuery.emailType,
    }
    const input = {
      ...reqQuery.body,
    }

    const email = await updateEmail(emailQuery, input)
    if (!email) {
      throw new Error('Email Not Found')
    }
    return email
  } catch (e) {
    throw e
  }
}

// update a email by emailType
export async function createEmailSettings(reqQuery: any) {
  try {
    const { accessToken, emailType, body } = reqQuery
    await requireAdmin(accessToken)

    const email = await findEmailByEmailType(emailType)
    if (email) {
      throw new Error('Email type already exists')
    }

    const input = {
      ...body,
    }

    const emailData = await createEmail(input)
    return emailData
  } catch (e) {
    throw e
  }
}
