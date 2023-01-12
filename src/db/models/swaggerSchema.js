import m2s from 'mongoose-to-swagger';
import { Article } from './article/article.js';
import { Auth } from './auth/auth.js';
import { Class } from './class/class.js';
import { Message } from './message/message.js';
import { Student, Subject } from './student/student.js';
import { Teacher } from './teacher/teacher.js';

export const swaggerSchema = {
  article: m2s(Article),
  auth: m2s(Auth),
  class: m2s(Class),
  message: m2s(Message),
  student: m2s(Student),
  subject: m2s(Subject),
  teacher: m2s(Teacher),
};

/**
 * @swagger
 * components:
 *  securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

/**
 * @swagger
 * components:
 *   responses:
 *     NotFound:
 *       description: The specified resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *            code: 404
 *            message: The specified resource was not found
 *     Unauthorized:
 *       description: Unauthorized
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *            code: 401
 *            message: Unauthorized
 *     Forbidden:
 *       description: Forbidden
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Error'
 *           example:
 *            code: 403
 *            message: You don't have permission to access this resource
 *     NotAcceptable:
 *       description: NotAcceptable
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorWithForm'
 *           example:
 *            code: 406
 *            message: That email is already in use
 *            form:
 *              email: string
 *              password: string
 *              name: string
 *              isTeacher: boolean
 *              refreshToken: string
 *              _id: string
 *   schemas:
 *     # Schema for error response body
 *     Error:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *       required:
 *         - code
 *         - message
 *     ErrorWithForm:
 *       type: object
 *       properties:
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         form:
 *           type: any
 *
 *       required:
 *         - code
 *         - message
 *         - form
 */
