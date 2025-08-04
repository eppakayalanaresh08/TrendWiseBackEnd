const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

// Trigger article generation (Admin only)
router.post('/generate', adminController.generateArticles);

router.post('/articles', adminController.createArticle);

// Get all articles (Admin view)

// router.get('/articles', isAuthenticated, isAdmin, adminController.getAllArticles);

router.get('/articles',  adminController.getAllArticles);



// router.get('/articles/:id', isAuthenticated, isAdmin, adminController.getArticleById);

// Individual article page by slug (Public access)
// router.get('/article/:slug', articleController.getArticleBySlug); // Add this route

// Update article (Admin only)
router.put('/articles/:id',  adminController.updateArticle);

// Delete article (Admin only)
router.delete('/articles/:id', adminController.deleteArticle);

module.exports = router;