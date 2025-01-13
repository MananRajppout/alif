// const bcrypt = require('bcrypt')
// import bcrypt from 'bcryptjs'


import bcrypt from 'bcryptjs'

export const hashPassword = async (inputPassword: string) => {
  try {
    const SALT_NUMBER = 10
    const salt = await bcrypt.genSalt(SALT_NUMBER)
    const hash = await bcrypt.hashSync(inputPassword, salt)
    return hash
  } catch (e) {
    throw e
  }
}
