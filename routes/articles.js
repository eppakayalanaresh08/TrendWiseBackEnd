

const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const { isAuthenticated } = require('../middlewares/auth');

const passport = require('passport');
// Get all published articles
router.get('/', articleController.getArticles);

// Get single article by slug
router.get('/:slug', articleController.getArticleBySlug);

// Get trending articles
router.get('/trending', articleController.getTrendingArticles);

// Search articles
router.get('/search/:query', articleController.searchArticles);

router.post(
    '/:slug/like',
    isAuthenticated,
    articleController.toggleLikeArticle
  );

// Like/unlike an article

module.exports = router;