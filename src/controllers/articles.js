import { Article } from '../db/models/article/article.js';

/**
 * @swagger
 * tags:
 *   name: Articles
 *   description: The articles managing API
 */

/**
 * @swagger
 * /articles:
 *   get:
 *     summary: Returns all articles
 *     tags: [Articles]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/article'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

export const getArticles = async (req, res) => {
  try {
    const articles = await Article.find({}).sort({ createdAt: -1 }).limit(3);

    res.status(200).send({
      articles,
    });
  } catch (e) {
    res.status(404).send({
      errors: e.errors,
    });
  }
};

/**
 * @swagger
 * /articles:
 *   post:
 *     summary: Add article
 *     tags: [Articles]
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
 *               img:
 *                 type: string
 *               author:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: The article was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/article'
 *       400:
 *         $ref: '#/components/responses/NotFound'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

export const addArticle = async (req, res) => {
  const { title, description, img, author } = req.body;
  try {
    const article = new Article({
      title,
      description,
      img,
      author,
    });

    await article.save();
    res.status(201).send(article);
  } catch (e) {
    res.status(400).send({
      errors: e.errors,
      body: req.body,
    });
  }
};
