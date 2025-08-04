const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  // Required fields
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    index: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  
  // SEO metadata
  meta: {
    description: {
      type: String,
      trim: true,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    keywords: [{
      type: String,
      trim: true
    }]
  },
  
  // Media content
  media: {
    images: [{
      type: String, // Store image URLs
      validate: {
        validator: (v) => /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v),
        message: props => `${props.value} is not a valid image URL!`
      }
    }],
    videos: [{
      type: String, // Store video URLs/IDs
      validate: {
        validator: (v) => /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/i.test(v),
        message: props => `${props.value} is not a valid video URL!`
      }
    }]
  },
  
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  
  // SEO optimizations
  ogImage: String,
  canonicalUrl: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for comment count
ArticleSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'article',
  count: true
});

// Slug generation middleware
ArticleSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove non-word chars
      .replace(/[\s_-]+/g, '-') // Replace spaces/dashes with single dash
      .replace(/^-+|-+$/g, ''); // Trim dashes from start/end
  }
  next();
});

// Update timestamp on save
ArticleSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Text index for search
ArticleSchema.index({
  title: 'text',
  content: 'text',
  'meta.keywords': 'text'
});

module.exports = mongoose.model('Article', ArticleSchema);