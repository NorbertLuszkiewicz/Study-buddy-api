import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import { validateEmail } from '../../validators.js';

export const authSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email jest wymagany'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validateEmail, 'Email jest niepoprawny'],
  },
  password: {
    type: String,
    required: true,
    minlength: [5, 'Hasło musi składać się z min. 5 znaków'],
  },
  name: {
    type: String,
    required: true,
  },
  isTeacher: {
    type: Boolean,
    default: false,
  },
  refreshToken: {
    type: String,
    default: null,
  },
});

authSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync(10);
  user.password = bcrypt.hashSync(user.password, salt);

  next();
});

authSchema.post('save', (err, doc, next) => {
  const error = err;
  if (err.code === 11000) {
    error.errors = { email: { message: 'Email jest już zajęty' } };
  }
  next(error);
});

export const Auth = model('auth', authSchema);
