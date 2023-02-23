import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const interviewSchema = new Schema(
  {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    name: { type: String, required: true },
    description: { type: String, required: false },
    interviewers: [{ type: String, required: true }],
    interviewees: [{ type: String, required: true }],
    isDeleted: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const InterviewModel = mongoose.model('Interview', interviewSchema, 'Interviews');
