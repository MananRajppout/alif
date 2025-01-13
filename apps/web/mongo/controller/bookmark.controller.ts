

import { requireUser } from '../middleware/authenticate'
import {
  checkBookmarkService,
  createBookmarkService,
  deleteBookmarkService,
  findBookmarks,
} from '../service/bookmark.service'

export async function createBookmark(reqQuery: any) {
  try {
    const { accessToken, body } = reqQuery

    const user = await requireUser(accessToken)
    const userID = user._id

    const input = {
      user: userID,
      bookmarks: {
        ...body,
      },
    }
    const bookmark = await createBookmarkService(input)
    return bookmark
  } catch (e) {
    throw e
  }
}

// check a bookmark by job-id
export async function checkBookmark(reqQuery: any) {
  try {
    const { accessToken, bookmarkId } = reqQuery
    const user = await requireUser(accessToken)
    const userID = user._id
    const query = {
      user: userID,
      bookmarkId,
    }

    const bookmark = await checkBookmarkService(query)

    if (bookmark.length == 0) {
      const bookmarkData = {
        isBookmark: false,
      }
      return bookmarkData
    }

    const bookmarkData = {
      isBookmark: true,
    }
    return bookmarkData
  } catch (e) {
    throw e
  }
}

/**
 *  find all private bookmarks
 * @param query
 * @returns
 */
export async function getBookmarks(accessToken: string) {
  try {
    const user = await requireUser(accessToken)
    const userID = user?._id
    user?._id
    const bookmarks = await findBookmarks(userID)
    return bookmarks
  } catch (e) {
    throw e
  }
}

// delete a bookmark handller
export async function deleteBookmark(reqQuery: any) {
  try {
    const { accessToken, bookmarkId } = reqQuery

    const user = await requireUser(accessToken)
    const userId = user?._id

    const query = {
      user: userId,
      bookmarkId: bookmarkId,
    }

    const bookmark = await deleteBookmarkService(query)
    return bookmark
  } catch (e: any) {
    throw e
  }
}
