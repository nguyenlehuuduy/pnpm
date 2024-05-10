import mongoose from 'mongoose'

export const connectMongoDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI must be defined')
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    throw error // Re-throw the error to handle it elsewhere if needed
  }
}

// Tự động kết nối tới MongoDB khi file được import
connectMongoDB().catch(error =>
  console.error('MongoDB connection error:', error)
)
