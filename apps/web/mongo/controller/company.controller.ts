

import {
  findAdminCompanyService,
  findCompanyService,
  getSearchCompanyService,
  industryCountService,
  companySizeCountService,
  avarageSalaryCountService,
  revenueCountService,
  getSingleCompanyService,
  updateCompanyStatusService,
  deleteCompanyService,
  createCompanyService,
  updateCompanyService,
} from '../service/company.service'
import { requireEmployer, requireUser } from '../middleware/authenticate'
import {
  createEmail,
  findEmailByEmailType,
} from '../service/admin/email.service'
import { sendNotificationEmail } from '../utils/nodeMailer'
import connectDB from '../utils/connect'

// create company profile handller
export async function createCompany(reqQuery: any) {
  try {
    const { accessToken, companyInput, images } = reqQuery
    const userInfo = await requireEmployer(accessToken)
    const userId = userInfo._id
    const userEmail = userInfo.email

    const companyInputData = {
      ...companyInput,
      user: userId,
    }
    const company = await createCompanyService(companyInputData, images)

   // TODO: [x] need to remove this code after successfully migration
    // const emailType = 'COMPANY_PUBLISHED'
    // let emails
    // emails = await findEmailByEmailType(emailType)
    // if (emails.length === 0) {
    //   const templateInput = {
    //     senderAddress: 'Meta-Jobs',
    //     subject: 'Company is published',
    //     message: 'Congrats..!! Your company is published',
    //     emailType: 'COMPANY_PUBLISHED',
    //   }
    //   await createEmail(templateInput)
    //   emails = await findEmailByEmailType('COMPANY_PUBLISHED')
    // }
    // const emailData = emails[0]

    // const inputEmailData = {
    //   userEmail: userEmail,
    //   emailData,
    //   userId,
    //   emailType,
    // }
    // await sendNotificationEmail(inputEmailData)
    return company
  } catch (e) {
    throw e
  }
}

export async function getSingleCompany(companyID: string) {
  try {
    const companyResult = await getSingleCompanyService(companyID)
    return companyResult
  } catch (e) {
    throw e
  }
}

// find all company profile  private
export async function findCompanyPrivate(accessToken: string) {
  try {
    const user = await requireEmployer(accessToken)
    const userID = user._id
    const adminRole = user.role.isAdmin

    if (adminRole === true) {
      const company = await findAdminCompanyService()
      return company
    }
    const company = await findCompanyService({ user: userID })
    return company
  } catch (e) {
    throw e
  }
}

// Search and Filter company profile handller public
export async function getSearchCompany(reqQueries: any) {
  await connectDB();
  try {
    const companyResult = await getSearchCompanyService(reqQueries)
    const industryCountResult = await industryCountService()
    const companyCountResult = await companySizeCountService()
    const averageSalaryCountResult = await avarageSalaryCountService()
    const revenueCountResult = await revenueCountService()
    const companyFilter = {
      industry: industryCountResult,
      companySize: companyCountResult,
      averageSalary: averageSalaryCountResult,
      revenue: revenueCountResult,
    }

    const data = {
      companies: companyResult.companies,
      totalCompanyCount: companyResult.companyCount,
      companyFilter,
    }
    return data
  } catch (e) {
    throw e
  }
}

// comapny status update
export async function updateCompanyStatus(rewQuery: any) {
  try {
    const user = (await requireUser(rewQuery.accessToken)) as any

    const query = {
      userId: user._id,
      adminRole: user.role.isAdmin,
      companyId: rewQuery.companyId,
      companyStatus: rewQuery.companyStatus,
    }

    const company = await updateCompanyStatusService(query)
    return company
  } catch (e) {
    throw e
  }
}

// update company profile handller
export async function updateCompany(reqQuery: any) {
  try {
    const { accessToken, companyId, companyInput, images } = reqQuery
    const userInfo = await requireEmployer(accessToken)
    const userId = userInfo._id
    const userEmail = userInfo.email

    // update a company profile
    const company = await updateCompanyService(companyId, companyInput, images)
    return company
  } catch (e) {
    throw e
  }
}

// delete company profile
export async function deleteCompany(reqQuery: any) {
  try {
    await requireEmployer(reqQuery.accessToken)
    const companyID = reqQuery.companyId

    const company = await deleteCompanyService(companyID)
    return company
  } catch (e) {
    throw e
  }
}
