

import connectDB from '../utils/connect'
import { requireAdmin } from '../middleware/authenticate'
import {
  createPackageService,
  deletePackageService,
  getPackagesService,
  getSinglePackageService,
  updatePackageService,
} from '../service/package.service'

// create package handller
export async function createPackage(reqQuery: any) {
  try {
    await requireAdmin(reqQuery.accessToken)
    const packageData = {
      ...reqQuery.body,
    }
    const packageResult = await createPackageService(packageData)
    return packageResult
  } catch (e: any) {
    if (e === 11000) {
      throw new Error('Package already exist')
    } else {
      throw new Error('Server error')
    }
  }
}

// get package handller
export async function getSinglePackage(reqQuery: any) {
  try {
    await requireAdmin(reqQuery.accessToken)

    const packageID = reqQuery.packageId
    const packageResult = await getSinglePackageService(packageID)

    if (!packageResult) {
      throw new Error('Package Not Found')
    }

    return packageResult
  } catch (e) {
    throw e
  }
}

// find all packages handller
export async function getPackages() {
  try {
    const packages = await getPackagesService()
    return packages
  } catch (e) {
    throw e
  }
}

// update package handller
export async function updatePackage(reqQuery: any) {
  try {
    await requireAdmin(reqQuery.accessToken)
    const packageID = reqQuery.packageId
    const packageUpdate = {
      ...reqQuery.body,
    }
    const packageResult = await updatePackageService(packageID, packageUpdate)

    if (!packageResult) {
      throw new Error('Package Not Found')
    }
    return packageResult
  } catch (e) {
    throw e
  }
}

// delete package handller
export async function deletePackage(reqQuery: any) {
  try {
    await requireAdmin(reqQuery.accessToken)

    const packageID = reqQuery.packageId
    const packageResult = await deletePackageService(packageID)

    if (!packageResult) {
      throw new Error('Package Not Found')
    }
    return packageResult
  } catch (e) {
    throw e
  }
}
