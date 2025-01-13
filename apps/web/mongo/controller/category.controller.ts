

import { requireAdmin } from '../middleware/authenticate'
import {
  createCategoryService,
  deleteCategoryService,
  getSingleCategoryService,
  updateCategoryService,
} from '../service/category.service'

// create category handler
export async function createCategory(reqData: any) {
  console.log('reqData', reqData.accessToken)
  try {
    const user = await requireAdmin(reqData.accessToken)

    const categoryData = {
      // replace forward slash and (* ), comma with dash to create slug
      categoryTitle: reqData.categoryTitle,
      subCategory: reqData.subCategory,
    }

    const imagePath = reqData.categoryIcon || null

    // const imagePath = null
    const category = await createCategoryService(categoryData, imagePath)
    return category
  } catch (e) {
    throw e
  }
}

// delete category handler
export async function deleteCategory(reqQuery: any) {
  try {
    await requireAdmin(reqQuery.accessToken)
    const categoryID = reqQuery.categoryId
    const category = await deleteCategoryService(categoryID)

    if (!category) {
      throw new Error('Category Not Found')
    }
    return category
  } catch (e) {
    throw e
  }
}
// get a category by id handler
export async function getSingleCategory(reqQuery: any) {
  try {
    const { categoryID } = reqQuery
    const category = await getSingleCategoryService(categoryID)
    return category
  } catch (e) {
    throw e
  }
}

// update a category y id handler
export async function updateCategory(
  accessToken: string,
  categoryData: any,
  imagePath: File | null,
  categoryId: string
) {
  try {
    const user = await requireAdmin(accessToken)

    const category = await updateCategoryService(
      categoryId,
      categoryData,
      imagePath
    )

    return category
  } catch (e) {
    throw e
  }
}
