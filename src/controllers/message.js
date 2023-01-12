import { Message } from '../db/models/message/message.js';

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: The messages managing API
 */

/**
 * @swagger
 * /messages:
 *   get:
 *     summary: Return user messages
 *     tags: [Messages]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: student
 *        in: query
 *        schema:
 *          type: string
 *      - name: author
 *        schema:
 *          type: string
 *      - name: isTeacher
 *        schema:
 *          type: boolean
 *      - name: className
 *        schema:
 *          type: Array
 *     responses:
 *       200:
 *         description: List of messages by user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/message'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const getMessages = async (req, res) => {
  const { student, author, className, isTeacher } = req.query;

  try {
    const classList = className.split(',');
    const user = isTeacher ? { author } : { student };
    const messages = await Message.find(user);
    const messagesClass = [];

    if (student && className)
      classList.forEach(async (x) => {
        messagesClass.push(await Message.find({ class: { $all: x } }));
      });

    res.status(200).send({
      messages: [...messages, ...messagesClass],
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /message:
 *   post:
 *     summary: Add message
 *     tags: [Messages]
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
 *               description:
 *                 type: string
 *               class:
 *                 type: string
 *               student:
 *                 type: string
 *               author:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: You have successfully added a message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/message'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const addMessage = async (req, res) => {
  const { title, description, class: className, student, author } = req.body;
  try {
    const message = new Message({
      title,
      description,
      class: className,
      student,
      author,
    });

    await message.save();
    res.status(201).send(student);
  } catch (e) {
    res.status(400).send({
      errors: e.errors,
      body: req.body,
    });
  }
};
