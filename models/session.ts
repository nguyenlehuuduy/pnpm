import mongoose, { Schema, Document } from 'mongoose'
import { type Message } from 'ai'
export interface ChatMessage {
  role: {
    type: String
    enum: ['user', 'assistant', 'system']
  }
  message: Message[]
  createdAt: Date
}

export interface SessionDocument extends Document {
  userId: Schema.Types.ObjectId
  title: string
  chat: ChatMessage[]
  summary: string
}

const SessionSchema: Schema<SessionDocument> = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    summary: String,
    chat: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant', 'system']
        },
        content: String,
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
)
const Session =
  // mongoose.model('Session') || mongoose.model('Session', SessionSchema)
  mongoose.models.Session || mongoose.model('Session', SessionSchema)
export default Session
