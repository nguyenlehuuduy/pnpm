import mongoose, { Schema, Document } from 'mongoose'

export interface UserDocument extends Document {
  name: string
  email: string
  password?: string
  birth?: string
  gender?: string
  messageCount: number
}

const userSchema: Schema<UserDocument> = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String
    },
    birth: {
      type: String
    },
    gender: {
      type: String
    },
    messageCount: {
      type: Number
    }
  },
  { timestamps: true }
)

const User =
  mongoose.models.User || mongoose.model<UserDocument>('User', userSchema)
export default User
