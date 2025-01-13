

import { sendNotificationEmail } from '../utils/nodeMailer';
import cloudinary from '../utils/cloudinary';
// Internal Import
import UserModel, { UserDocument } from '../models/user.model'
import JobModel from '../models/job.model'
import ResumeModel from '../models/resume.model'
import { FilterQuery } from 'mongoose'
import { requireUser } from '../middleware/authenticate'
import { countApplications } from './jobApply.service'

// External Import
// import crypto from 'crypto'
// import connectDB from '../utils/connect'
// const bcrypt = require('bcrypt')
import _ from 'lodash'
import { countPubishedCompany } from './company.service'
import { findBookmarks } from './bookmark.service'
import { hashPassword } from '../utils/hashPassword'
import { userPasswordValidate } from '../middleware/validateUser'
import { signJwt } from '../utils/jwt.utils'
import { uploadImageToCloudinary } from '../utils/cloudinary';

// create user service
export async function createUserService(input: any) {
  try {
    const { password } = input
    const hash = await hashPassword(password)

    const inputData = {
      ...input,
      password: hash,
    }
    const user = await UserModel.create(inputData)
    return user
  } catch (e) {
    throw e
  }
}

// user login service
export async function loginUserService(input: any) {
  try {
    const { password, email } = input

    const user = await userPasswordValidate({ email, password })
    if (!user) {
      throw new Error('Invalid Authentication')
    }

    const userId = user._id
    const accessToken = signJwt({ _id: userId })
    return { accessToken }
  } catch (e) {
    throw e
  }
}

// get user service
export async function getUserService(userID: string) {
  try {
    // populates package
    const user = await UserModel.findOne({ _id: userID })
      // .populate('package', ['validity', 'totalJobs', 'featuredJobs'])
      .lean(true)
    return _.omit(user, ['password', '__v', 'createdAt', 'updatedAt'])
  } catch (e) {
    throw e
  }
}

// get user by query service
export async function getUserByQueryService(query: any) {
  try {
    return await UserModel.findOne(query).lean()
  } catch (e) {
    throw e
  }
}

// get user dashboard statistics handller
export async function getDashboardStat(accessToken: string) {
  try {
    const user = (await requireUser(accessToken)) as any
    const userID = user?._id
    const query = { user: userID }

    // total job count for Employees
    const totalJobCount = await JobModel.countDocuments({
      ...query,
    })
    // count the total isFeatured jobs for Employee
    const featuredJobCount = await JobModel.countDocuments({
      ...query,
      'status.isFeatured': true,
    })
    // count total isPublished jobs for admin from job  model
    const totalPublishedJobCount = await JobModel.countDocuments({
      'status.isPublished': true,
    })
    // count total isApproved jobs from job  model
    const approvedJobCount = await JobModel.countDocuments({
      ...query,
      'status.isApproved': true,
    })
    // total employer count for admin
    const totalEmployerCount = await UserModel.countDocuments({
      'role.isEmployer': true,
    })
    //total resume count for a candidate
    const totalResumeCount = await ResumeModel.countDocuments({
      ...query,
    })
    //total isApproved resume count for a candidate
    const approvedResumeCount = await ResumeModel.countDocuments({
      ...query,
      'role.isApproved': true,
    })
    //total published resume count for admin
    const totalPublishedResumeCount = await ResumeModel.countDocuments({
      'status.isPublished': true,
    })
    //total resume count
    const activeResumeCount = await ResumeModel.countDocuments({
      ...query,
      'status.isActive': true,
    })

    const appliedJobCount = await countApplications(query)
    const publishedCompanyCount = await countPubishedCompany()
    const bookmarkData = await findBookmarks(userID)
    const bookmarkCount = bookmarkData[0]?.bookmarks.length || 0

    // response based on user role
    if (user.role.isAdmin) {
      return [
        {
          title: 'Total Jobs',
          count: totalPublishedJobCount,
        },
        {
          title: 'Total Resumes',
          count: totalPublishedResumeCount,
        },
        {
          title: 'Total Employees',
          count: totalEmployerCount,
        },
        {
          title: 'Total Companies',
          count: publishedCompanyCount,
        },
      ]
    } else if (user.role.isEmployer) {
      return [
        {
          title: 'Total Jobs',
          count: totalJobCount,
        },
        {
          title: 'Featured Jobs',
          count: featuredJobCount,
        },
        {
          title: 'Approved Jobs',
          count: approvedJobCount,
        },
        {
          title: 'Bookmarked',
          count: bookmarkCount,
        },
      ]
    } else if (user.role.isCandidate) {
      return [
        {
          title: 'Total Resumes',
          count: totalResumeCount,
        },
        {
          title: 'Approved Resumes',
          count: approvedResumeCount,
        },
        {
          title: 'Bookmarked',
          count: bookmarkCount,
        },
        {
          title: 'Applied Jobs',
          count: appliedJobCount,
        },
      ]
    } else {
      throw new Error('You are not authorized to access this page')
    }
  } catch (e) {
    throw e
  }
}

// Get user with package service
export async function getUserWithPackage(userId: FilterQuery<UserDocument>) {
  const query = {
    _id: userId,
  }

  try {
    // populates package
    const user = await UserModel.findOne(
      query,
      // only retrive package
      { package: 1 }
    )
      .populate('package', ['validity', 'totalJobs', 'featuredJobs'])
      .lean(true)
    return user
  } catch (e) {
    throw e
  }
}

// update user service
export async function updateUserService(
  userId: any,
  update: any,
  imageData: any
) {
  try {
    let userUpdate = null
    if (imageData ) {
      const userPreviousData = (await UserModel.findById(userId)) as any

      if (userPreviousData?.cloudinary_id) {
        await cloudinary.uploader.destroy(userPreviousData.cloudinary_id)
      }
      // Upload image to cloudinary
      const result = await uploadImageToCloudinary(imageData)
      const imageInput = {
        avatar: result.secure_url,
        cloudinary_id: result.public_id,
      }
      userUpdate = {
        ...update,
        ...imageInput,
      }
    } else {
      userUpdate = {
        ...update,
        avatar: null,
        iconUrl: null,
      }
    }
    const user = await UserModel.findByIdAndUpdate(userId, userUpdate, {
      new: true,
    })
    return user
  } catch (e: any) {
    throw e
  }
}

export async function confirmUserEmailService(id: string) {
  try {
    
    const user = await UserModel.findByIdAndUpdate({
      _id: id,
    }, {
      isConfirmed: true,
    }, {
      new: true,
    })

  } catch (error) {
    console.log(error)
  }
}


// reset password service
export async function updatePasswordService(userId: string, input: any) {
  try {
    const inputPassword = input.newPassword
    const hash = await hashPassword(inputPassword)

    const userPassword = await UserModel.findByIdAndUpdate(
      { _id: userId },
      { password: hash },
      { new: true }
    )
    return userPassword
  } catch (e: any) {
    throw e
  }
}

// forget password email reset link
export async function updateResetLinkService(userId: any, query: any) {
  try {
    const user = await UserModel.findByIdAndUpdate({ _id: userId }, query, {
      new: true,
    })
    return user
  } catch (e) {
    throw e
  }
}

// Update the user pckage service
export async function updateUserPackageService(userId: string, update: any) {
  try {
    const user = await UserModel.findByIdAndUpdate({ _id: userId }, update, {
      new: true,
    })
    return user
  } catch (e) {
    throw e
  }
}
