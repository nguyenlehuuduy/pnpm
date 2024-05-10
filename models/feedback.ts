import mongoose, { Schema, Document } from 'mongoose';

export interface FeedbackDocument extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  content: string;
}

const feedbackSchema: Schema<FeedbackDocument> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const Feedback = mongoose.models.Feedback || mongoose.model<FeedbackDocument>('Feedback', feedbackSchema);
export default Feedback;
