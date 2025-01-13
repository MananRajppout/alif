

import mongoose from 'mongoose'
import UserModel from '../models/user.model'
import jwt from 'jsonwebtoken'

export const requireUser = async (token: string) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to access this route')
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jstemplate'
    ) as any
    const userID = decoded?._id

    // check mongoose connection
    if (!mongoose.connection.readyState) {
      // console.log('mongoose connection is not ready')
    }
    if (mongoose.connection.readyState === 1) {
      // console.log('Mongoose connected')
    }

    const user = await UserModel.findOne({ _id: userID })
    if (!user) {
      throw new Error('You must be logged in to access this route')
    }
    return user
  } catch (e) {
    throw e
  }
}

export const requireCandidate = async (token: string) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to access this route')
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jstemplate'
    ) as any
    const userID = decoded?._id
    const user = await UserModel.findById(userID)
    if (!user) {
      throw new Error('You must be logged in to access this route')
    }

    if (user.role.isCandidate || user.role.isAdmin) {
      return user
    } else {
      throw new Error('You must be a candidate to access this route')
    }
  } catch (e) {
    throw e
  }
}

export const requireEmployer = async (token: string) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to access this route')
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jstemplate'
    ) as any
    const userID = decoded?._id
    const user = await UserModel.findOne({ _id: userID })
    if (!user) {
      throw new Error('You must be logged in to access this route')
    }

    if (user.role.isEmployer || user.role.isAdmin) {
      return user
    } else {
      throw new Error('You must be an employer to access this route')
    }
  } catch (e) {
    throw e
  }
}

export const requireAdmin = async (token: string) => {
  try {
    if (!token) {
      throw new Error('You must be logged in to access this route')
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'jstemplate'
    ) as any
    const userID = decoded?._id
    const user = await UserModel.findOne({ _id: userID })
    if (!user) {
      throw new Error('You must be logged in to access this route')
    }

    if (user.role.isAdmin) {
      return user
    } else {
      throw new Error('You must be a admin to access this route')
    }
  } catch (e) {
    throw e
  }
}
