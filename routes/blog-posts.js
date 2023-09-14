const path = require('path');

const { Op } = require('sequelize');
const router = require('express').Router();
const cryptoRandomString = require('crypto-random-string');
const sharp = require('sharp');
const DOMPurify = require('isomorphic-dompurify');

const { ADMIN_PASSWORD } = require('../config/constants');
const { BlogPost } = require('../models');
const { imageMemoryUploader } = require('../config/multer');

/**
 * @typedef {object} BlogPostCreationData
 * @property {string} title
 * @property {string} titleRus
 * @property {string} textContent
 * @property {string} textContentRus
 * @property {string} imagePath
 */

/**
 * POST /api/property
 * @summary Create BlogPost
 * @tags BlogPosts
 * @param {BlogPostCreationData} request.body.required - BlogPost creation data
 * @return {Property} 200 - Created BlogPost
 */

router.post('/', imageMemoryUploader.array('file', 1), async (req, res) => {
  try {
    const password = req.get('password');

    if (password !== ADMIN_PASSWORD) {
      res.status(403).json({ message: 'Wrong password' });
      return;
    }

    const { title, titleRus, textContent, textContentRus } = req.body;

    let imagePath;

    if (req.files && req.files.length) {
      const { buffer } = req.files[0];
      const fileName = `${cryptoRandomString({ length: 30 })}.webp`;

      await sharp(buffer)
        .webp({ quality: 80 })
        .toFile(
          path.join(__dirname, '..', 'public', 'uploads', 'images', fileName)
        );

      imagePath = `/uploads/images/${fileName}`;
    }

    const blogPost = await BlogPost.create({
      title,
      titleRus,
      textContent: DOMPurify.sanitize(textContent),
      textContentRus: DOMPurify.sanitize(textContentRus),
      imagePath,
    });

    res.json(blogPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/**
 * GET /api/blog-posts
 * @summary Get blog posts list
 * @tags BlogPosts
 * @security JWT
 * @return {Array.<BlogPost>} 200 - Blog posts list
 */

router.get('/', async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(blogPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/**
 * GET /api/blog-posts/most-popular
 * @summary Get list of most popular blog posts
 * @tags BlogPosts
 * @security JWT
 * @return {Array.<BlogPost>} 200 - Most popular blog posts list
 */

router.get('/most-popular', async (req, res) => {
  try {
    const blogPosts = await BlogPost.findAll({
      order: [['readCount', 'DESC']],
      limit: 4,
    });
    res.json(blogPosts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/**
 * GET /api/blog-posts/{id}
 * @summary Get a single blog post
 * @tags Properties
 * @param {integer} id.path.required - blog post id
 * @return {BlogPost} 200 - BlogPost
 */

router.get('/:id', async (req, res) => {
  try {
    const blogPost = await BlogPost.findByPk(req.params.id);

    if (!blogPost) {
      res.status(404).json({ message: 'No post found' });
      return;
    }

    blogPost.increment('readCount', { by: 1 });
    res.json(blogPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/**
 * GET /api/blog-posts/title/{title}
 * @summary Get a single blog post by title
 * @tags Properties
 * @param {integer} id.path.required - blog post id
 * @return {BlogPost} 200 - BlogPost
 */

router.get('/title/:title', async (req, res) => {
  try {
    const blogPost = await BlogPost.findOne({
      where: {
        [Op.or]: [{ title: req.params.title }, { titleRus: req.params.title }],
      },
    });

    if (!blogPost) {
      res.status(404).json({ message: 'No post found' });
      return;
    }

    blogPost.increment('readCount', { by: 1 });
    res.json(blogPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;
