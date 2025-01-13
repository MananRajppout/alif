

// let sendNotificationEmail: any;
// let cloudinary: any;

// // Check if we're in a Node.js (server-side) environment
// if (typeof window === 'undefined') {
//   sendNotificationEmail = require('../utils/nodeMailer').sendNotificationEmail;
//   cloudinary = require('../utils/cloudinary').default;
// }

import {uploadImageToCloudinary} from "../utils/cloudinary";
import cloudinary from "../utils/cloudinary";
import { sendNotificationEmail } from "../utils/nodeMailer";

import { CompanyModel } from "../models/company.model"
import JobModel from '../models/job.model'
import { createEmail, findEmailByEmailType } from "./admin/email.service"

// create a company profile service
export async function createCompanyService(input: any, images: any) {
    try {
        let companyInput
        if (images) {
            let logoImageInput = null
            let headerImageInput = null
            if (images.logoImage) {
                // Upload image to cloudinary
                const logoImageData = await uploadImageToCloudinary(images.logoImage)
                logoImageInput = {
                    logo: logoImageData?.secure_url,
                    logoCloudinary_id: logoImageData?.public_id,
                }
            }
            if (images.headerImage) {
                // Upload image to cloudinary
                const headerImageData = await uploadImageToCloudinary(images.logoImage)
                headerImageInput = {
                    thumb: headerImageData?.secure_url,
                    thumbCloudinary_id: headerImageData?.public_id,
                }
            }
            companyInput = {
                ...input,
                ...logoImageInput,
                ...headerImageInput,
            }
        } else {
            companyInput = {
                ...input,
            }
        }
        const company = await CompanyModel.create(companyInput)
        return company
    } catch (e) {
        throw e
    }
}

/**
 * @description get a company profile service
 * @param companyID 
 * @returns  company and company jobs
 */
export async function getSingleCompanyService(companyID: string) {
    try {
        const company = await CompanyModel.findById(companyID).lean(true)
        if (!company) {
            throw new Error('Company Profile Not Found')
        }
        // find the all job based company id
        const jobs = await JobModel.find({
            company: companyID,
            'status.isApproved': true,
            'status.isPublished': true,
            'status.isActive': true,
        }).lean(true)
        return { company, jobs }
    } catch (e) {
        throw e
    }
}

// Search and Filter company profile service public
export async function getSearchCompanyService(query: any) {
    const page = query.page
    const limit = 9
    try {
        let qCompanyName = null
        let qCategory = null
        let qCompanySize = null
        let qAvarageSalary = null
        let qRevenue = null

        if (query.companyName) {
            qCompanyName = new RegExp(query.companyName.split(','), 'i')
        }
        if (query.category) {
            qCategory = query.category.split(',')
        }
        if (query.companySize) {
            qCompanySize = query.companySize.split(',')
        }
        if (query.avarageSalary) {
            qAvarageSalary = query.avarageSalary.split(',')
        }
        if (query.revenue) {
            qRevenue = query.revenue.split(',')
        }

        if (
            qCompanyName ||
            qCategory ||
            qCompanySize ||
            qAvarageSalary ||
            qRevenue
        ) {
            interface filterQueryType {
                companyName?: any
                category?: any
                companySize?: any
                avarageSalary?: any
                revenue?: any
            }

            let filterQuery: filterQueryType = {}

            if (qCompanyName) filterQuery.companyName = { $in: qCompanyName }
            if (qCategory) filterQuery.category = { $in: qCategory }
            if (qCompanySize) filterQuery.companySize = { $in: qCompanySize }
            if (qAvarageSalary) filterQuery.avarageSalary = { $in: qAvarageSalary }
            if (qRevenue) filterQuery.revenue = { $in: qRevenue }

            const companies = await CompanyModel.find({
                ...filterQuery,
                'status.isApproved': true,
                'status.isPublished': true,
                'status.isActive': true,
            })
                .skip(page * limit)
                .limit(limit)
            const companyCount = await CompanyModel.find({
                ...filterQuery,
                'status.isApproved': true,
                'status.isPublished': true,
                'status.isActive': true,
            }).countDocuments()

            return { companies, companyCount }
        } else {
            const companies = await CompanyModel.find({
                'status.isApproved': true,
                'status.isPublished': true,
                'status.isActive': true,
            })
                .skip(page * limit)
                .limit(limit)

            const companyCount = await CompanyModel.find({
                'status.isApproved': true,
                'status.isPublished': true,
                'status.isActive': true,
            }).countDocuments()

            return { companies, companyCount }
        }
    } catch (e) {
        throw e
    }
}

// find all company profile service by property(used in private,..)
export async function findCompanyService(query: any) {
    try {
        const companies = await CompanyModel.find(query).lean(true)
        return companies
    } catch (e) {
        throw e
    }
}

// find all company for the adminRole
export async function findAdminCompanyService() {
    try {
        const companies = await CompanyModel.find({}).lean(true)
        return companies
    } catch (e) {
        throw e
    }
}

// find all company industry counts public
export async function industryCountService() {
    try {
        //  sort by count exhibits aggregation
        const industryCount = await CompanyModel.aggregate([
            // sort
            { $unwind: '$category' },
            { $sortByCount: '$category' },
        ])
        return industryCount
    } catch (e) {
        throw e
    }
}

// find all company industry counts public
export async function companySizeCountService() {
    try {
        //  sort by count exhibits aggregation
        const companySizeCount = await CompanyModel.aggregate([
            // sort
            { $unwind: '$companySize' },
            { $sortByCount: '$companySize' },
        ])
        return companySizeCount
    } catch (e) {
        throw e
    }
}

// find all company industry counts public
export async function avarageSalaryCountService() {
    try {
        //  sort by count exhibits aggregation
        const avarageSalaryCount = await CompanyModel.aggregate([
            // sort
            { $unwind: '$avarageSalary' },
            { $sortByCount: '$avarageSalary' },
        ])
        return avarageSalaryCount
    } catch (e) {
        throw e
    }
}

// find all company revenue counts public
export async function revenueCountService() {
    try {
        //  sort by count exhibits aggregation
        const revenueCount = await CompanyModel.aggregate([
            // sort
            { $unwind: '$revenue' },
            { $sortByCount: '$revenue' },
        ])
        return revenueCount
    } catch (e) {
        throw e
    }
}

// count published company profile service
export async function countPubishedCompany() {
    try {
        const companies = await CompanyModel.countDocuments({
            'status.isPublished': true,
        })

        return companies
    } catch (e) {
        throw e
    }
}

// company status update service
export async function updateCompanyStatusService(query: any) {
    try {
        const { userId, adminRole, companyId, companyStatus } = query

        // find the job based on id
        const company = await CompanyModel.findById(companyId).populate('user', ['email'])
        if (!company) {
            throw new Error('Company Not Found')
        }

        if (adminRole === true) {
            switch (companyStatus) {
                case 'approved':
                    company.status.isApproved = true
                    company.save()


                    // TODO [remove]: remove this code after test email template form v1/email
                    // let emails
                    // emails = await findEmailByEmailType('COMPANY_APPROVED')

                    // if (emails.length === 0) {
                    //     const templateInput = {
                    //         senderAddress: 'Meta Jobs',
                    //         subject: 'Your Company is Approved',
                    //         message: 'Congrats..!! Your Company is Approved',
                    //         emailType: 'COMPANY_APPROVED',
                    //     }
                    //     await createEmail(templateInput)
                    //     emails = await findEmailByEmailType('COMPANY_APPROVED')
                    // }
                    // const emailData = emails[0]

                    // const approvalInput = {
                    //     userEmail: company.user.email,
                    //     emailData,
                    //     userId,
                    //     emailType: 'COMPANY_APPROVED',
                    // }
                    // await sendNotificationEmail(approvalInput)
                    return 'Company approved successfully'
                case 'rejected':
                    company.status.isApproved = false
                    company.save()

                    // TODO [remove]: remove this code after test email template form v1/email
                    // let rejectedEmails
                    // rejectedEmails = await findEmailByEmailType('COMPANY_REJECTED')
                    // if (rejectedEmails.length === 0) {
                    //     const templateInput = {
                    //         senderAddress: 'Meta-Jobs',
                    //         subject: 'Your Company is Rejected',
                    //         message: 'Sorry..!! Your Company is Rejected',
                    //         emailType: 'COMPANY_REJECTED',
                    //     }
                    //     await createEmail(templateInput)
                    //     rejectedEmails = await findEmailByEmailType('COMPANY_REJECTED')
                    // }
                    // const rejectedEmailData = rejectedEmails[0]

                    // const rejectlInput = {
                    //     userEmail: company.user.email,
                    //     emailData: rejectedEmailData,
                    //     userId,
                    //     emailType: 'COMPANY_REJECTED',
                    // }
                    // await sendNotificationEmail(rejectlInput)
                    return 'Company rejected by Admin'

                case 'expired':
                    company.status.isActive = false
                    company.save()

                    // TODO [remove]: remove this code after test email template form v1/email
                    // let expireCompanyResult
                    // expireCompanyResult = await findEmailByEmailType('COMPANY_EXPIRED')
                    // if (expireCompanyResult.length === 0) {
                    //     const templateInput = {
                    //         senderAddress: 'Meta-Jobs',
                    //         subject: 'Your Company profile is expired',
                    //         message: 'Sorry..!! Your company profile  is expired',
                    //         emailType: 'COMPANY_EXPIRED',
                    //     }
                    //     await createEmail(templateInput)
                    //     expireCompanyResult = await findEmailByEmailType('COMPANY_EXPIRED')
                    // }
                    // const expireCompanyData = expireCompanyResult[0]

                    // const expireInput = {
                    //     userEmail: company.user.email,
                    //     emailData: expireCompanyData,
                    //     userId,
                    //     emailType: 'COMPANY_EXPIRED',
                    // }

                    // await sendNotificationEmail(expireInput)

                    return 'Company expired successfully'

                case 'active':
                    company.status.isActive = true
                    company.save()

                    // TODO [remove]: remove this code after test email template form v1/email
                    // let activatedCompanyResult
                    // activatedCompanyResult = await findEmailByEmailType('COMPANY_ACTIVATED')
                    // if (activatedCompanyResult.length === 0) {
                    //     const templateInput = {
                    //         senderAddress: 'Meta-Jobs',
                    //         subject: 'Your Company is Activated',
                    //         message: 'Congrats..!! Your Company is Activated',
                    //         emailType: 'COMPANY_ACTIVATED',
                    //     }
                    //     await createEmail(templateInput)
                    //     activatedCompanyResult = await findEmailByEmailType(
                    //         'COMPANY_ACTIVATED'
                    //     )
                    // }
                    // const activatedCompanyData = activatedCompanyResult[0]

                    // const activatedInput = {
                    //     userEmail: company.user.email,
                    //     emailData: activatedCompanyData,
                    //     userId,
                    //     emailType: 'COMPANY_ACTIVATED',
                    // }

                    // await sendNotificationEmail(activatedInput)

                    return 'Company activated successfully'

                case 'draft':
                    company.status.isPublished = false
                    company.save()

                    // TODO [remove]: remove this code after test email template form v1/email
                    // let draftCompanyResult
                    // draftCompanyResult = await findEmailByEmailType('COMPANY_DRAFTED')
                    // if (draftCompanyResult.length === 0) {
                    //     const templateInput = {
                    //         senderAddress: 'Meta-Jobs',
                    //         subject: 'Your Company is in Draft',
                    //         message: 'Congrats..!! Your Company is in Draft',
                    //         emailType: 'COMPANY_DRAFTED',
                    //     }
                    //     await createEmail(templateInput)
                    //     draftCompanyResult = await findEmailByEmailType('COMPANY_DRAFTED')
                    // }
                    // const draftCompanyData = draftCompanyResult[0]

                    // const draftInput = {
                    //     userEmail: company.user.email,
                    //     emailData: draftCompanyData,
                    //     userId,
                    //     emailType: 'COMPANY_DRAFTED',
                    // }
                    // await sendNotificationEmail(draftInput)

                    return 'Company draft successfully'
                case 'published':
                    company.status.isPublished = true
                    company.save()

                    // TODO [remove]: remove this code after test email template form v1/email
                    // let publishedCompanyResult
                    // publishedCompanyResult = await findEmailByEmailType('COMPANY_PUBLISHED')
                    // if (publishedCompanyResult.length === 0) {
                    //     const templateInput = {
                    //         senderAddress: 'Meta-Jobs',
                    //         subject: 'Your Company is in Published',
                    //         message: 'Congrats..!! Your Company is Published',
                    //         emailType: 'COMPANY_PUBLISHED',
                    //     }
                    //     await createEmail(templateInput)
                    //     publishedCompanyResult = await findEmailByEmailType(
                    //         'COMPANY_PUBLISHED'
                    //     )
                    // }
                    // const publishedCompanyData = publishedCompanyResult[0]

                    // const publishedCompanyInput = {
                    //     userEmail: company.user.email,
                    //     emailData: publishedCompanyData,
                    //     userId,
                    //     emailType: 'COMPANY_PUBLISHED',
                    // }
                    // await sendNotificationEmail(publishedCompanyInput)

                    return 'Company published successfully'

                default:
                    throw new Error('Invalid status')
            }
        }

        switch (companyStatus) {
            case 'draft':
                company.status.isPublished = false
                company.save()


                // TODO [remove]: remove this code after test email template form v1/email
                // let draftCompanyResult
                // draftCompanyResult = await findEmailByEmailType('COMPANY_DRAFTED')
                // if (draftCompanyResult.length === 0) {
                //     const templateInput = {
                //         senderAddress: 'Meta-Jobs',
                //         subject: 'Your Company is in Draft',
                //         message: 'Congrats..!! Your Company is in Draft',
                //         emailType: 'COMPANY_DRAFTED',
                //     }
                //     await createEmail(templateInput)
                //     draftCompanyResult = await findEmailByEmailType('COMPANY_DRAFTED')
                // }
                // const draftCompanyData = draftCompanyResult[0]

                // const draftInput = {
                //     userEmail: company.user.email,
                //     emailData: draftCompanyData,
                //     userId,
                //     emailType: 'COMPANY_DRAFTED',
                // }
                // await sendNotificationEmail(draftInput)

                return 'Company draft successfully'
            case 'published':
                company.status.isPublished = true
                company.save()

                // TODO [remove]: remove this code after test email template form v1/email
                // let publishedCompanyResult
                // publishedCompanyResult = await findEmailByEmailType('COMPANY_PUBLISHED')
                // if (publishedCompanyResult.length === 0) {
                //     const templateInput = {
                //         senderAddress: 'Meta-Jobs',
                //         subject: 'Your Company is in Published',
                //         message: 'Congrats..!! Your Company is Published',
                //         emailType: 'COMPANY_PUBLISHED',
                //     }
                //     await createEmail(templateInput)
                //     publishedCompanyResult = await findEmailByEmailType(
                //         'COMPANY_PUBLISHED'
                //     )
                // }
                // const publishedCompanyData = publishedCompanyResult[0]

                // const publishedCompanyInput = {
                //     userEmail: company.user.email,
                //     emailData: publishedCompanyData,
                //     userId,
                //     emailType: 'COMPANY_PUBLISHED',
                // }
                // await sendNotificationEmail(publishedCompanyInput)

                return 'Company published successfully'
            default:
                throw new Error('Invalid status')
        }

    } catch (e) {
        throw e
    }
}

// update a company profile service
export async function updateCompanyService(
    companyID: string,
    update: any,
    images: any
) {
    try {
        let companyUpdate
        if (images) {
            let logoImageInput = null
            let headerImageInput = null
            if (images.logoImage) {
                const companyPrevData = (await CompanyModel.findById(companyID)) as any
                if (companyPrevData.logoCloudinary_id) {
                    await cloudinary.uploader.destroy(companyPrevData.logoCloudinary_id)
                }
                const logoImageData = await cloudinary.uploader.upload(images.logoImage)
                logoImageInput = {
                    logo: logoImageData?.secure_url,
                    logoCloudinary_id: logoImageData?.public_id,
                }
            }
            if (images.headerImage) {
                const companyPrevData = (await CompanyModel.findById(companyID)) as any
                if (companyPrevData.thumbCloudinary_id) {
                    await cloudinary.uploader.destroy(companyPrevData.thumbCloudinary_id)
                }
                const headerImageData = await cloudinary.uploader.upload(
                    images.headerImage
                )
                headerImageInput = {
                    thumb: headerImageData?.secure_url,
                    thumbCloudinary_id: headerImageData?.public_id,
                }
            }
            companyUpdate = {
                ...update,
                ...logoImageInput,
                ...headerImageInput,
            }
        } else {
            companyUpdate = {
                ...update,
            }
        }
        const company = await CompanyModel.findByIdAndUpdate(
            companyID,
            companyUpdate,
            {
                new: true,
            }
        )
        return company
    } catch (e) {
        throw e
    }
}

// delete a company profile service
export async function deleteCompanyService(companyID: string) {
    try {
        // Delete image from cloudinary
        const companyPrevData = (await CompanyModel.findById(companyID)) as any
        if (companyPrevData?.logoCloudinary_id) {
            await cloudinary.uploader.destroy(companyPrevData.logoCloudinary_id)
        }
        if (companyPrevData?.thumbCloudinary_id) {
            await cloudinary.uploader.destroy(companyPrevData.thumbCloudinary_id)
        }

        const company = await CompanyModel.findByIdAndDelete(companyID)
        if (!company) {
            throw new Error('Company Not Found')
        }
        const companyData = await CompanyModel.findById(companyID).populate(
            'user',
            ['email']
        )

        // TODO [remove]: remove this code after test email template form v1/email
        // const emailType = 'COMPANY_DELETED'
        // let emails
        // emails = await findEmailByEmailType(emailType)
        // if (emails.length === 0) {
        //     const templateInput = {
        //         senderAddress: 'Meta-Jobs',
        //         subject: 'Your Company Profile Deleted',
        //         message: 'Your company profile is deleted',
        //         emailType: 'COMPANY_DELETED',
        //     }
        //     await createEmail(templateInput)
        //     emails = await findEmailByEmailType('COMPANY_DELETED')
        // }
        // const emailData = emails[0]

        // const inputEmailData = {
        //     userEmail: companyData?.user.email,
        //     emailData,
        //     userID: companyData?.user._id,
        //     emailType,
        // }
        // sendNotificationEmail(inputEmailData)

        return company
    } catch (e) {
        throw e
    }
}

