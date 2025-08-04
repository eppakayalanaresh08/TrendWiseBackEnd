const Article = require('../models/Article');
const Comment = require('../models/Comment');

// Get all published articles with pagination
exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [articles, total] = await Promise.all([
      Article.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Article.countDocuments()
    ]);

    res.json({
      articles,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
};

// Get single article with comments
exports.getArticleBySlug = async (req, res) => {
  try {
    const [article, comments] = await Promise.all([
      Article.findOne({ slug: req.params.slug }),
      Comment.find({ articleSlug: req.params.slug })
        .populate('userId', 'displayName')
        .sort({ createdAt: -1 })
    ]);

    if (!article) return res.status(404).json({ error: 'Article not found' });
    const articleData = article.toObject();
    if (req.user) {
      articleData.isLiked = article.likes.includes(req.user._id);
    }
    
    articleData.likesCount = article.likes.length;

    res.json({
      ...article.toObject(),
      comments
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
};

// Get trending articles (most viewed/commented)
exports.getTrendingArticles = async (req, res) => {
  try {
    const articles = await Article.aggregate([
      {
        $lookup: {
          from: 'comments',
          localField: 'slug',
          foreignField: 'articleSlug',
          as: 'comments'
        }
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' }
        }
      },
      { $sort: { commentCount: -1 } },
      { $limit: 5 }
    ]);
    
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trending articles' });
  }
};

// Search articles by keyword
exports.searchArticles = async (req, res) => {
  try {
    const articles = await Article.find({
      $or: [
        { title: { $regex: req.params.query, $options: 'i' } },
        { 'meta.keywords': { $regex: req.params.query, $options: 'i' } },
        { content: { $regex: req.params.query, $options: 'i' } }
      ]
    });
    
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
};


