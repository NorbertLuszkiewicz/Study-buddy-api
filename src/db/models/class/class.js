import { Schema, model } from 'mongoose';

export const classSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  creator: {
    type: String,
    required: true,
  },
});

export const Class = model('class', classSchema);
