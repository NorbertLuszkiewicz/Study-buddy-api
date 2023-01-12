import { Schema, model } from 'mongoose';

export const messageSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    class: {
      type: String,
      default: null,
    },
    student: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: 'teacher',
    },
  },
  { timestamps: true }
);

export const Message = model('message', messageSchema);
