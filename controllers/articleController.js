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



exports.getArticleBySlug = async (req, res) => {
  try {
    const [article, comments] = await Promise.all([
      Article.findOne({ slug: req.params.slug }),
      Comment.find({ articleSlug: req.params.slug })
        .populate('userId', 'displayName')
        .sort({ createdAt: -1 })
    ]);

    if (!article) return res.status(404).json({ error: 'Article not found' });
    
    // Convert to plain object
    const articleData = article.toObject();
  
    
    // Add likesCount
    articleData.likesCount = article.likes.length;
    
    // Initialize isLiked as false
    articleData.isLiked = false;
    
    // Check if user is authenticated
    if (req.user) {
      // Convert user ID to string for comparison
      const userId = req.user._id.toString();
      
      // Check if user has liked the article
      articleData.isLiked = article.likes.some(likeId => 
        likeId.toString() === userId
      );
    }

 
    res.json({
      ...articleData,
      comments
    });
  } catch (err) {
    console.error('Article fetch error:', err);
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


// controllers/articleController.js

// Like/unlike an article
exports.toggleLikeArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const userId = req.user._id;
    const likeIndex = article.likes.indexOf(userId);

    if (likeIndex === -1) {
      // Add like
      article.likes.push(userId);
    } else {
      // Remove like
      article.likes.splice(likeIndex, 1);
    }

    await article.save();

    res.json({
      success: true,
      likesCount: article.likes.length,
      isLiked: likeIndex === -1
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update like status' });
  }
};





// Get single article with comments
// exports.getArticleBySlug = async (req, res) => {
//   try {
//     const [article, comments] = await Promise.all([
//       Article.findOne({ slug: req.params.slug }),
//       Comment.find({ articleSlug: req.params.slug })
//         .populate('userId', 'displayName')
//         .sort({ createdAt: -1 })
//     ]);

//     if (!article) return res.status(404).json({ error: 'Article not found' });
//     const articleData = article.toObject();
//     if (req.user) {
//       articleData.isLiked = article.likes.includes(req.user._id);
//     }
    
//     articleData.likesCount = article.likes.length;

//     res.json({
//       ...article.toObject(),
//       comments
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch article' });
//   }
// };


// exports.getArticleBySlug = async (req, res) => {
//   try {
//     const [article, comments] = await Promise.all([
//       Article.findOne({ slug: req.params.slug }),
//       Comment.find({ articleSlug: req.params.slug })
//         .populate('userId', 'displayName')
//         .sort({ createdAt: -1 })
//     ]);

//     if (!article) return res.status(404).json({ error: 'Article not found' });
    
//     // Convert to plain JavaScript object
//     const articleData = article.toObject();
    
//     // Add likesCount
//     articleData.likesCount = article.likes.length;
    
//     // Initialize isLiked as false by default
//     articleData.isLiked = false;
    
//     // Check if user is authenticated and if they've liked the article
//     if (req.user) {
//       // Convert both IDs to strings for reliable comparison
//       const userId = req.user._id.toString();
//       const likes = article.likes.map(id => id.toString());
      
//       articleData.isLiked = likes.includes(userId);
//     }

//     res.json({
//       ...articleData,
//       comments
//     });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch article' });
//   }
// };
