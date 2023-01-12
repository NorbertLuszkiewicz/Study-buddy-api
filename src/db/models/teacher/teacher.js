import { Schema, model } from 'mongoose';

export const teacherSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  classes: {
    type: [String],
    default: [],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  subjects: { type: [{ name: String, class: String }], default: [] },
  notes: { type: [{ title: String, content: String }], default: [] },
});

export const Teacher = model('teacher', teacherSchema);
