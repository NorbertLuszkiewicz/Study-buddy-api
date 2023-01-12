import { Student } from '../db/models/student/student.js';

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: The students managing API
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Return all students
 *     tags: [Students]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/student'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find({});

    res.status(200).send({
      students,
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /student:
 *   get:
 *     summary: Return student
 *     tags: [Students]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: email
 *        in: query
 *        schema:
 *          type: string
 *      - name: class
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: Return details of a specific student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const getStudent = async (req, res) => {
  const { email, class: className } = req.query;
  try {
    if (!email && !className) {
      return res
        .status(400)
        .send({ errors: 'No email and class name provided' });
    }

    const source = email || { classes: { $all: [className] } };
    const students = await Student.find(source);
    res.status(200).send({
      students,
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /student:
 *   put:
 *     summary: Remove student from class
 *     tags: [Students]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               className:
 *                 type: string
 *             required:
 *               - email
 *               - className
 *     responses:
 *       201:
 *         description: Return details of a specific student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const removeStudentClass = async (req, res) => {
  const { email, className } = req.body;

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { email },
      { $pull: { classes: className } }
    );

    res.status(201).send(updatedStudent);
  } catch (e) {
    res.status(400).send({
      errors: e.errors,
      body: req.body,
    });
  }
};

/**
 * @swagger
 * /student:
 *   post:
 *     summary: Return student
 *     tags: [Students]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/student'
 *     responses:
 *       201:
 *         description: Return details of a specific student
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const addStudent = async (req, res) => {
  const { name, email, classes, subjects, exams } = req.body;

  try {
    const student = new Student({
      name,
      email,
      classes,
      exams,
      subjects,
    });

    await student.save();
    res.status(201).send(student);
  } catch (e) {
    res.status(400).send({
      errors: e.errors,
      body: req.body,
    });
  }
};
