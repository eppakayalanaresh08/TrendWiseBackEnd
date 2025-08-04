// routes/comments.js
const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { isAuthenticated } = require('../middlewares/auth');

// POST /api/comments - Create a new comment
router.post('/', isAuthenticated, commentController.createComment);

// GET /api/comments/:articleSlug - Get comments for an article
router.get('/:articleSlug', commentController.getCommentsByArticle);

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', isAuthenticated, commentController.deleteComment);

module.exports = router;