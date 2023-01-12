import { Class } from '../db/models/class/class.js';

/**
 * @swagger
 * tags:
 *   name: Class
 *   description: The classes managing API
 */

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Return all classes
 *     tags: [Class]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all class
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/class'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find({});

    res.status(200).send({
      classes,
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /class:
 *   post:
 *     summary: Create class
 *     tags: [Class]
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
 *               creator:
 *                 type: string
 *             required:
 *               - name
 *               - creator
 *     responses:
 *       200:
 *         description: You have successfully created a class
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/class'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const createClass = async (req, res) => {
  const { name, creator } = req.body;
  try {
    const newClass = new Class({
      name,
      creator,
    });

    await newClass.save();
    res.status(201).send(newClass);
  } catch (e) {
    res.status(400).send({
      errors: e.errors,
      body: req.body,
    });
  }
};

/**
 * @swagger
 * /class:id:
 *   put:
 *     summary: Add class to student or teacher
 *     tags: [Class]
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
 *               creator:
 *                 type: string
 *             required:
 *               - name
 *               - creator
 *     responses:
 *       200:
 *         description: You have successfully added a class to student or teacher
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/class'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const addClass = async (req, res) => {
  const { name, creator } = req.body;
  try {
    const newClass = new Class({
      name,
      creator,
    });

    await newClass.save();
    res.status(201).send(newClass);
  } catch (e) {
    res.status(400).send({
      errors: e.errors,
      body: req.body,
    });
  }
};
