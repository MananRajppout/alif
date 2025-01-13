

import bcrypt from 'bcryptjs'
import { getUserByQueryService } from '../service/user.service'

/**
 * You can get user by `email` address with this function. It's an `async` function
 * @param email
 * @type string
 * @example
 * const MyComponent = async () => {
 *  const user = await userExistValidate('example@example.com')
 *  return (
 *    ...
 *  )
 * }
 */
export const userExistValidate = async (email: string) => {
  try {
    if (email) {
      const user = await getUserByQueryService({ email })
      return user
    }
  } catch (e) {
    throw e
  }
}

export const userPasswordValidate = async ({
  email,
  password,
}: {
  email: string
  password: string
}) => {
  try {
    const user = await getUserByQueryService({ email })
    if (!user) return false

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return false
    return user
  } catch (e) {
    throw e
  }
}
