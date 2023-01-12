import { Student, Subject } from '../db/models/student/student.js';
import { Teacher } from '../db/models/teacher/teacher.js';

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: The subjects managing API
 */

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Return user subjects
 *     tags: [Subjects]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: email
 *        in: query
 *        required: true
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: List of user subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/subject'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const getSubjects = async (req, res) => {
  const { email } = req.params;
  try {
    const student = await Student.find({ email });

    res.status(200).send({
      student,
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /subject:
 *   post:
 *     summary: Create subject
 *     tags: [Subjects]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               teacher:
 *                 type: string
 *               className:
 *                 type: string
 *             required:
 *               - name
 *               - teacher
 *               - className
 *     responses:
 *       200:
 *         description: Subject created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const createSubject = async (req, res) => {
  const { name, teacher, className } = req.body;

  try {
    if (!teacher || !className || !name) {
      return res.status(404).send({
        error: 'name or class or teacher name not provided',
      });
    }
    const newSubject = new Subject({
      name,
      teacher,
      class: className,
      grades: [],
    });

    await Teacher.findOneAndUpdate(
      { name: teacher },
      { $push: { subjects: { name, class: className } } }
    );

    const updatedStudent = await Student.updateMany(
      { classes: className },
      { $push: { subjects: newSubject } }
    );

    return res.status(200).send({
      updatedStudent,
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /subject:
 *   put:
 *     summary: Remove subject
 *     tags: [Subjects]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               teacher:
 *                 type: string
 *               className:
 *                 type: string
 *             required:
 *               - name
 *               - teacher
 *               - className
 *     responses:
 *       200:
 *         description: Subject removed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/student'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const removeSubject = async (req, res) => {
  const { subject, teacher, className } = req.body;

  try {
    if (!teacher || !className || !subject) {
      return res.status(404).send({
        error: 'subject or class or teacher name not provided',
      });
    }

    await Teacher.findOneAndUpdate(
      { name: teacher },
      { $pull: { subjects: { name: subject, class: className } } }
    );

    const updatedStudent = await Student.updateMany(
      { classes: className },
      { $pull: { subjects: { name: subject } } }
    );

    return res.status(200).send({
      updatedStudent,
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /exam:
 *   put:
 *     summary: Add exam
 *     tags: [Subjects]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               className:
 *                 type: string
 *               subject:
 *                 type: string
 *               teacher:
 *                 type: string
 *               date:
 *                 type: Date
 *             required:
 *               - name
 *               - class
 *               - subject
 *               - date
 *               - teacher
 *     responses:
 *       200:
 *         description: Exam added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                name:
 *                 type: string
 *                className:
 *                 type: string
 *                subject:
 *                 type: string
 *                teacher:
 *                 type: string
 *                date:
 *                 type: Date
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const addExam = async (req, res) => {
  const { name, className, subject, teacher, date } = req.body;

  try {
    if (!name || !className || !subject || !teacher || !date) {
      return res
        .status(404)
        .send({ errors: ['Do not get all the required data'] });
    }

    const isFuture = new Date(date) > new Date();
    if (!isFuture) {
      return res.status(404).send({ errors: ['Past date not allowed'] });
    }

    const exam = {
      name,
      class: className,
      subject,
      teacher,
      date,
    };
    const updatedStudent = await Student.updateMany(
      { classes: { $all: [className] } },
      { $push: { exams: exam } }
    );

    return res.status(201).send(updatedStudent);
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
      body: req.body,
    });
  }
};

/**
 * @swagger
 * /grade:
 *   post:
 *     summary: Add grade
 *     tags: [Subjects]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               subjectName:
 *                 type: string
 *               value:
 *                 type: number
 *             required:
 *               - name
 *               - email
 *               - subjectName
 *               - value
 *     responses:
 *       200:
 *         description: Grade added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 value:
 *                   type: number
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const addGrade = async (req, res) => {
  const { email, subjectName, name, value } = req.body;

  try {
    if (!name || !email || !subjectName || !value) {
      return res
        .status(404)
        .send({ errors: ['Do not get all the required data'] });
    }
    const grade = {
      name,
      value,
    };
    const student = await Student.findOne({ email });

    student.subjects.forEach((subject) => {
      if (subject.name.toLowerCase() === subjectName.toLowerCase()) {
        subject.grades.push(grade);
      }
    });

    await student.save();
    res.status(201).send(student);
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
      body: req.body,
    });
  }
};
