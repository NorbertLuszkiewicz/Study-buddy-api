import { Schema, model } from 'mongoose';

export const subjectSchema = new Schema({
  name: String,
  teacher: String,
  class: String,
  grades: [
    {
      name: String,
      value: Number,
    },
  ],
});

export const studentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  classes: {
    type: [String],
    default: [],
  },
  subjects: { type: [subjectSchema], default: [], unique: false },
  notes: { type: [{ title: String, content: String }], default: [] },
  exams: {
    type: [
      {
        name: String,
        class: String,
        subject: String,
        teacher: String,
        date: Date,
      },
    ],
    default: [],
  },
});

export const Subject = model('subject', subjectSchema);
export const Student = model('student', studentSchema);
