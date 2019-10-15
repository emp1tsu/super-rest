import mongoose from 'mongoose'

const MONGODB_URL = process.env.MONGODB_URL

try {
  if (!MONGODB_URL) throw new Error('uris is not defined')

  mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
} catch (error) {
  console.error(error)
}
