

import jwt from 'jsonwebtoken'

const privateKey = process.env.JWT_SECRET || 'jstemplate'

export async function signJwt(object: object, options?: jwt.SignOptions) {
  return jwt.sign(object, privateKey)
}

export async function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, privateKey)
    return decoded
  } catch (e) {
    throw e
  }
}
