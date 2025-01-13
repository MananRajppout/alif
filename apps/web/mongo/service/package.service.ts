

import PackageModel from "../models/package.model"

// create a package service
export async function createPackageService(packageData: any) {
    try {
        const packageResult = await PackageModel.create(packageData)
        return packageResult
    } catch (e) {
        throw e
    }
}

// get a package service
export async function getSinglePackageService(packageID: string) {
    try {
        const packageResult = await PackageModel.findById(packageID).lean(true)
        return packageResult
    } catch (e) {
        throw e
    }
}

// find all packages service
export async function getPackagesService() {
    try {
        const packageResult = await PackageModel.find().lean(true)
        return packageResult
    } catch (e) {
        throw e
    }
}

// update a category service
export async function updatePackageService(packageID: string, update: any) {
    try {
        const packageResult = await PackageModel.findByIdAndUpdate(packageID, update, {
            new: true,
        })
        return packageResult
    } catch (e) {
        throw e
    }
}


// delete a category service
export async function deletePackageService(packageID: string) {
    try {
        const packageResult = await PackageModel.findByIdAndDelete(packageID)
        return packageResult
    } catch (e) {
        throw e
    }
}
