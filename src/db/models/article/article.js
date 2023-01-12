import { Schema, model } from 'mongoose';

export const articleSchema = new Schema(
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
    img: {
      type: String,
      default: null,
    },
    author: {
      type: String,
      default: 'school journal',
    },
  },
  { timestamps: true }
);

export const Article = model('article', articleSchema);
