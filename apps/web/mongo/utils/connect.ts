import mongoose from 'mongoose'

const DATABASE_URI = process.env.MONGODB_URL as string

if (!DATABASE_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env file'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */

// declare global
// @ts-ignore
let cached = global.mongoose
if (!cached) {
  // @ts-ignore
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {

  console.log('Connecting to DB')
  if (!mongoose.connection.readyState) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(DATABASE_URI, opts).then((mongoose) => {
      console.log('New Connection')
      return mongoose
    })
  }

  if (mongoose.connection.readyState === 1) {
    console.log('Cache Connection')
    return mongoose
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
