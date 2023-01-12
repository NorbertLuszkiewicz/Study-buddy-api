import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Auth } from '../db/models/auth/auth.js';
import { Student } from '../db/models/student/student.js';
import { Teacher } from '../db/models/teacher/teacher.js';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth API
 */

/**
 * @swagger
 * /login:
 *   put:
 *     summary: Return user data
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: You are logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userAuth = await Auth.findOne({ email });
    const userDetails = userAuth.isTeacher
      ? await Teacher.findOne({ email })
      : await Student.findOne({ email });
    if (!userAuth || !userDetails) throw new Error('user not found');

    const isValidPassword = await bcrypt.compare(password, userAuth.password);
    if (!isValidPassword) throw new Error('password not valid');

    const payload = {
      id: userAuth._id,
      email: userAuth.email,
      name: userAuth.name,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET_REFRESH);
    userAuth.refreshToken = refreshToken;

    res.status(200).send({
      user: {
        ...userDetails._doc,
        isTeacher: userAuth.isTeacher,
        refreshToken: userAuth.refreshToken,
      },
      token,
    });
  } catch (e) {
    res.status(403).send({
      form: req.body,
      errors: {
        message: e.message,
      },
    });
  }
};
/**
 * @swagger
 * /me:
 *   put:
 *     summary: Return user data and refresh token
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Get user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

const getUser = async (req, res) => {
  const { email } = req.body;
  if (!email) return;
  try {
    const userAuth = await Auth.findOne({ email });
    const userDetails = userAuth.isTeacher
      ? await Teacher.findOne({ email })
      : await Student.findOne({ email });
    if (!userAuth || !userDetails) throw new Error('user not found');
    const payload = {
      id: userAuth._id,
      email: userAuth.email,
      name: userAuth.name,
    };

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET_REFRESH);
    userAuth.refreshToken = refreshToken;

    res.status(200).send({
      user: {
        ...userDetails._doc,
        isTeacher: userAuth.isTeacher,
        refreshToken: userAuth.refreshToken,
      },
      token,
    });
  } catch (e) {
    res.status(403).send({
      form: req.body,
      errors: {
        message: e.message,
      },
    });
  }
};

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Create user
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               isTeacher:
 *                 type: boolean
 *             required:
 *               - email
 *               - password
 *               - name
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/auth'
 *       406:
 *         $ref: '#/components/responses/NotAcceptable'
 */

const register = async (req, res) => {
  const { email, password, name, isTeacher } = req.body;

  const userData = {
    name,
    email,
  };

  try {
    const user = new Auth({
      email,
      password,
      name,
      isTeacher,
    });

    if (isTeacher) {
      const teacher = new Teacher(userData);
      await teacher.save();
    } else {
      const student = new Student(userData);
      await student.save();
    }

    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(406).send({
      errors: e.errors,
      form: req.body,
    });
  }
};

export default { login, register, getUser };
