const Article = require('../models/Article');
const { generateSEOContent } = require('../services/contentGenerator');
const { scrapeTrendingTopics } = require('../services/scraper');


const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-');
};


// Generate and save new articles
exports.generateArticles = async (req, res) => {
  try {
    // 1. Get trending topics
    const topics = await scrapeTrendingTopics();
    
    // 2. Generate articles for each topic
    const generationPromises = topics.map(async topic => {
      const content = await generateSEOContent(topic);
      
      // 3. Create slug from title
      const slug = content.title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      
      // 4. Save to database
      return Article.create({
        title: content.title,
        slug,
        meta: {
          description: content.metaDescription,
          keywords: content.keywords
        },
        content: content.body,
        media: {
          images: content.images || [],
          videos: content.videos || []
        }
      });
    });

    // 5. Wait for all articles to be generated
    const newArticles = await Promise.all(generationPromises);
    
    res.status(201).json({
      success: true,
      count: newArticles.length,
      articles: newArticles.map(a => a.slug)
    });
  } catch (err) {
    console.error('Generation error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Article generation failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};



exports.createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, tags, imageUrl, trending } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const slug = generateSlug(title);
    
    const article = new Article({
      title,
      slug,
      meta: {
        description: excerpt || content.substring(0, 160),
        keywords: tags || ['General']
      },
      content,
      media: {
        images: imageUrl ? [imageUrl] : [],
        videos: []
      },
      trending: !!trending,
      author: {
        name: 'Admin',
        avatar: ''
      }
    });

    await article.save();
    
    res.status(201).json({
      success: true,
      article: {
        ...article.toObject(),
        commentCount: 0
      }
    });
  } catch (err) {
    console.error('Create article error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Article creation failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Admin-only article management
// exports.getAllArticles = async (req, res) => {
//   try {
//     const articles = await Article.find().sort({ createdAt: -1 });
//     res.json(articles);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch articles' });
//   }
// };


// Admin-only article management with comment counts
exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Get articles with comment counts
    const articlesWithCounts = await Article.aggregate([
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
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $project: { comments: 0 } } // Exclude the actual comments array
    ]);

    const total = await Article.countDocuments();

console.log(articlesWithCounts,'articlesWithCounts')
    res.json({
      articles: articlesWithCounts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalArticles: total
    });
  } catch (err) {
    res.status(500).json({ 
      error: 'Failed to fetch articles',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(400).json({ error: 'Update failed' });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ message: 'Article deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
};