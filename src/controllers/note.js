import { Student } from '../db/models/student/student.js';
import { Teacher } from '../db/models/teacher/teacher.js';

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: The notes managing API
 */

/**
 * @swagger
 * /note:
 *   post:
 *     summary: Add note
 *     tags: [Notes]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               email:
 *                 type: string
 *               content:
 *                 type: string
 *               isTeacher:
 *                 type: string
 *             required:
 *               - title
 *               - email
 *               - content
 *               - isTeacher
 *     responses:
 *       200:
 *         description: Note added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const addNote = async (req, res) => {
  const { email, title, content, isTeacher } = req.body;

  try {
    if (!title || !email || !content) {
      return res
        .status(404)
        .send({ errors: ['Do not get all the required data'] });
    }

    const data = isTeacher
      ? await Teacher.findOneAndUpdate(
          { email },
          { $push: { notes: { title, content } } }
        )
      : await Student.findOneAndUpdate(
          { email },
          { $push: { notes: { title, content } } }
        );

    res.status(201).send(data);
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
      body: req.body,
    });
  }
};

/**
 * @swagger
 * /note:
 *   put:
 *     summary: Remove note
 *     tags: [Notes]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               email:
 *                 type: string
 *               content:
 *                 type: string
 *             required:
 *               - title
 *               - email
 *               - content
 *     responses:
 *       200:
 *         description: Note removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 content:
 *                   type: string
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const removeNote = async (req, res) => {
  const { id, email, isTeacher } = req.body;

  try {
    if (!id || !email) {
      return res
        .status(404)
        .send({ errors: ['Do not get all the required data'] });
    }

    const data = isTeacher
      ? await Teacher.findOneAndUpdate(
          { email },
          { $pull: { notes: { _id: id } } }
        )
      : await Student.findOneAndUpdate(
          { email },
          { $pull: { notes: { _id: id } } }
        );

    res.status(201).send(data);
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
      body: req.body,
    });
  }
};
