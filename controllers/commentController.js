const Comment = require('../models/Comment');
const Article = require('../models/Article');

// Create new comment
exports.createComment = async (req, res) => {
  try {
    // Verify article exists
    const article = await Article.findOne({ slug: req.body.articleSlug });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const comment = await Comment.create({
      articleSlug: req.body.articleSlug,
      userId: req.user._id,
      text: req.body.text
    });

    // Populate user details
    const populatedComment = await Comment.findById(comment._id)
      .populate('userId', 'displayName email');
    
    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(400).json({ 
      error: 'Invalid comment data',
      details: err.message 
    });
  }
};

// Get comments for article
exports.getCommentsByArticle = async (req, res) => {
  try {
    const comments = await Comment.find({ articleSlug: req.params.articleSlug })
      .populate('userId', 'displayName')
      .sort({ createdAt: -1 });
    
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Update comment (owner only)
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!comment) {
      return res.status(404).json({ 
        error: 'Comment not found or not authorized' 
      });
    }

    comment.text = req.body.text;
    await comment.save();
    
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
};

// Delete comment (owner or admin)
exports.deleteComment = async (req, res) => {
  try {
    const query = {
      _id: req.params.id
    };

    // Non-admins can only delete their own comments
    if (!req.user.isAdmin) {
      query.userId = req.user._id;
    }

    const comment = await Comment.findOneAndDelete(query);

    if (!comment) {
      return res.status(404).json({ 
        error: 'Comment not found or not authorized' 
      });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
};