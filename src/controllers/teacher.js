import { Teacher } from '../db/models/teacher/teacher.js';

/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: The teacher managing API
 */

/**
 * @swagger
 * /teacher:
 *   get:
 *     summary: Return teacher
 *     tags: [Teachers]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *        name: email
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: teacher details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/teacher'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const getTeacher = async (req, res) => {
  const { email } = req.params;
  try {
    const teacher = await Teacher.find({ email });

    res.status(200).send({
      teacher,
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /teacher:
 *   post:
 *     summary: Add student
 *     tags: [Teachers]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/teacher'
 *     responses:
 *       201:
 *         description: The teacher was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/teacher'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const addTeacher = async (req, res) => {
  const { name, email, classes } = req.body;

  try {
    const teacher = new Teacher({
      name,
      email,
      classes,
    });

    await teacher.save();
    res.status(201).send(teacher);
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};
