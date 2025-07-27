const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://stemoctobermagazine.org',
    'https://www.stemoctobermagazine.org',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// MongoDB Connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB already connected');
      return;
    }
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/stem-forum';
    if (!mongoUri.includes('mongodb')) {
      throw new Error('Invalid MongoDB URI');
    }
    
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error; // Don't exit process in serverless environment
  }
};

// Article Schema
const articleSchema = new mongoose.Schema({
  articleId: {
    type: Number,
    required: true,
    unique: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    userId: String, // This could be IP address or user ID
    likedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

const Article = mongoose.model('Article', articleSchema);

// Comment Schema
const commentSchema = new mongoose.Schema({
  articleId: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  author: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

// Newsletter Schema
const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  source: {
    type: String,
    default: 'unknown'
  },
  articleId: {
    type: Number,
    required: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

// Initialize articles with base data
const initializeArticles = async () => {
  const articlesData = [
    { articleId: 1 }
  ];

  for (const articleData of articlesData) {
    try {
      await Article.findOneAndUpdate(
        { articleId: articleData.articleId },
        articleData,
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error(`Error initializing article ${articleData.articleId}:`, error);
    }
  }
};

// Routes

// Root route for testing
app.get('/', (req, res) => {
  res.json({ 
    message: 'STEM October Forum API', 
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    database: isDbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Get all articles data
app.get('/api/articles', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const articlesPath = path.join(__dirname, 'data', 'articles.json');
    
    if (fs.existsSync(articlesPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
      res.json(articlesData);
    } else {
      // Fallback data if file doesn't exist
      res.json([
        {
          id: 1,
          title: "Why Does Hisoka Morow Love Power So Much?",
          excerpt: "In any community, especially our own at STEM High School for Boys – 6th of October, leadership is a powerful force. This philosophical exploration delves into the complex psychology behind leadership aspirations, examining how personal insecurities, societal expectations, and the desire for validation can transform genuine leadership into a performative pursuit of power.",
          author: "Yaseen Mohamed-Abdelal",
          date: "July 27, 2025",
          readTime: "15 min read",
          category: "Leadership", 
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop&crop=faces",
          featured: true,
          views: 0,
          likes: 0,
          color: "accent-purple"
        }
      ]);
    }
  } catch (error) {
    console.error('Error reading articles:', error);
    res.status(500).json({ error: 'Failed to load articles' });
  }
});

// Get single article data
app.get('/api/articles/:id', (req, res) => {
  try {
    const fs = require('fs');
    const path = require('path');
    const articlesPath = path.join(__dirname, 'data', 'articles.json');
    const articleId = parseInt(req.params.id);
    
    if (fs.existsSync(articlesPath)) {
      const articlesData = JSON.parse(fs.readFileSync(articlesPath, 'utf8'));
      const article = articlesData.find(a => a.id === articleId);
      
      if (article) {
        res.json(article);
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    } else {
      // Fallback for article 1
      if (articleId === 1) {
        res.json({
          id: 1,
          title: "Why Does Hisoka Morow Love Power So Much?",
          excerpt: "In any community, especially our own at STEM High School for Boys – 6th of October, leadership is a powerful force. This philosophical exploration delves into the complex psychology behind leadership aspirations, examining how personal insecurities, societal expectations, and the desire for validation can transform genuine leadership into a performative pursuit of power.",
          author: "Yaseen Mohamed-Abdelal",
          date: "July 27, 2025",
          readTime: "15 min read",
          category: "Leadership", 
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=400&fit=crop&crop=faces",
          featured: true,
          views: 0,
          likes: 0,
          color: "accent-purple"
        });
      } else {
        res.status(404).json({ error: 'Article not found' });
      }
    }
  } catch (error) {
    console.error('Error reading article:', error);
    res.status(500).json({ error: 'Failed to load article' });
  }
});

// Middleware to ensure database is connected
const ensureDbConnection = async (req, res, next) => {
  try {
    if (!isDbConnected) {
      await initializeApp();
    }
    // Always continue to the route handler, which will handle DB unavailability
    req.dbAvailable = isDbConnected;
    next();
  } catch (error) {
    console.error('Database connection check failed:', error);
    // Continue with DB unavailable flag
    req.dbAvailable = false;
    next();
  }
};

// Get article stats
app.get('/api/article/:id/stats', ensureDbConnection, async (req, res) => {
  try {
    if (!req.dbAvailable) {
      // Return empty stats when database is not available
      console.log('Database not connected, returning empty stats');
      return res.json({
        views: 0,
        likes: 0,
        comments: 0,
        hasLiked: false
      });
    }

    const articleId = parseInt(req.params.id);
    let article = await Article.findOne({ articleId });
    
    if (!article) {
      // Initialize article if it doesn't exist
      article = new Article({ 
        articleId
      });
      await article.save();
    }

    const totalViews = article.views;
    const totalLikes = article.likes.length;
    const commentCount = await Comment.countDocuments({ articleId });

    res.json({
      views: totalViews,
      likes: totalLikes,
      comments: commentCount,
      hasLiked: false // We'll determine this on the frontend based on localStorage
    });
  } catch (error) {
    console.error('Error fetching article stats:', error);
    res.json({
      views: 0,
      likes: 0,
      comments: 0,
      hasLiked: false
    });
  }
});

// Increment article views (once per session)
app.post('/api/article/:id/view', ensureDbConnection, async (req, res) => {
  try {
    if (!req.dbAvailable) {
      // Return mock response when database is not available
      console.log('Database not connected, returning mock view response');
      return res.json({
        views: 1,
        message: 'View recorded successfully'
      });
    }

    const articleId = parseInt(req.params.id);
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    let article = await Article.findOne({ articleId });
    
    if (!article) {
      article = new Article({ 
        articleId
      });
    }

    // For now, we'll trust the frontend to only send one view per session
    // In a production app, you'd want to track session IDs on the backend
    article.views += 1;
    await article.save();

    const totalViews = article.views;

    res.json({
      views: totalViews,
      message: 'View recorded successfully'
    });
  } catch (error) {
    console.error('Error recording view:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle article like
app.post('/api/article/:id/like', ensureDbConnection, async (req, res) => {
  try {
    if (!req.dbAvailable) {
      // Return mock response when database is not available
      console.log('Database not connected, returning mock like response');
      return res.json({
        likes: 1,
        hasLiked: req.body.action === 'like',
        message: `Article ${req.body.action}d successfully`
      });
    }

    const articleId = parseInt(req.params.id);
    const { userId, action } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    let article = await Article.findOne({ articleId });
    
    if (!article) {
      article = new Article({ 
        articleId
      });
    }

    const existingLikeIndex = article.likes.findIndex(like => like.userId === userId);

    if (action === 'like' && existingLikeIndex === -1) {
      // Add like
      article.likes.push({ userId });
    } else if (action === 'unlike' && existingLikeIndex !== -1) {
      // Remove like
      article.likes.splice(existingLikeIndex, 1);
    }

    await article.save();

    const totalLikes = article.likes.length;

    res.json({
      likes: totalLikes,
      hasLiked: action === 'like',
      message: `Article ${action}d successfully`
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    // Return a mock response on error
    res.json({
      likes: 1,
      hasLiked: req.body.action === 'like',
      message: `Article ${req.body.action}d successfully (offline mode)`
    });
  }
});

// Get all articles stats (for homepage)
app.get('/api/articles/stats', ensureDbConnection, async (req, res) => {
  try {
    if (!req.dbAvailable) {
      // Return empty stats when database is not available
      console.log('Database not connected, returning empty stats');
      return res.json({});
    }
    
    const articles = await Article.find({});
    const stats = {};

    // Get comment counts for all articles
    for (const article of articles) {
      const commentCount = await Comment.countDocuments({ articleId: article.articleId });
      stats[article.articleId] = {
        views: article.views,
        likes: article.likes.length,
        comments: commentCount
      };
    }

    // Add total counts for summary stats
    const totalArticles = articles.length;
    const totalComments = await Comment.countDocuments({});
    const totalViews = articles.reduce((sum, article) => sum + article.views, 0);
    const totalLikes = articles.reduce((sum, article) => sum + article.likes.length, 0);

    stats._totals = {
      articles: totalArticles,
      comments: totalComments,
      views: totalViews,
      likes: totalLikes
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching articles stats:', error);
    // Return empty stats on error
    res.json({});
  }
});

// Get comments for an article
app.get('/api/articles/:id/comments', ensureDbConnection, async (req, res) => {
  try {
    if (!req.dbAvailable) {
      // Return empty comments when database is not available
      console.log('Database not connected, returning empty comments');
      return res.json([]);
    }

    const articleId = parseInt(req.params.id);
    const comments = await Comment.find({ articleId })
      .sort({ createdAt: -1 }); // Most recent first

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.json([]);
  }
});

// Add a comment to an article
app.post('/api/articles/:id/comments', ensureDbConnection, async (req, res) => {
  try {
    if (!req.dbAvailable) {
      // Return mock response when database is not available
      console.log('Database not connected, returning mock comment response');
      return res.status(201).json({
        _id: 'mock-id-' + Date.now(),
        articleId: parseInt(req.params.id),
        content: req.body.content.trim(),
        author: req.body.author || `User ${req.body.userId.slice(0, 8)}`,
        userId: req.body.userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    const articleId = parseInt(req.params.id);
    const { content, author, userId } = req.body;

    // Validate input
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Comment is too long' });
    }

    // Create new comment
    const comment = new Comment({
      articleId,
      content: content.trim(),
      author: author || `User ${userId.slice(0, 8)}`,
      userId
    });

    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', ensureDbConnection, async (req, res) => {
  try {
    const { email, source, articleId } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check if email already exists
    const existingSubscription = await Newsletter.findOne({ 
      email: email.trim().toLowerCase() 
    });

    if (existingSubscription) {
      if (existingSubscription.isActive) {
        return res.status(409).json({ error: 'Email already subscribed' });
      } else {
        // Reactivate subscription
        existingSubscription.isActive = true;
        existingSubscription.source = source || 'resubscribe';
        existingSubscription.articleId = articleId;
        await existingSubscription.save();
        return res.status(200).json({ 
          message: 'Successfully resubscribed to newsletter',
          subscription: existingSubscription 
        });
      }
    }

    // Create new subscription
    const subscription = new Newsletter({
      email: email.trim().toLowerCase(),
      source: source || 'unknown',
      articleId: articleId || null
    });

    await subscription.save();
    res.status(201).json({ 
      message: 'Successfully subscribed to newsletter',
      subscription: subscription 
    });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get newsletter subscriptions (admin endpoint)
app.get('/api/newsletter/subscriptions', ensureDbConnection, async (req, res) => {
  try {
    const { active } = req.query;
    const filter = active !== undefined ? { isActive: active === 'true' } : {};
    
    const subscriptions = await Newsletter.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.json({ 
      subscriptions,
      count: subscriptions.length,
      totalActive: await Newsletter.countDocuments({ isActive: true }),
      totalInactive: await Newsletter.countDocuments({ isActive: false })
    });
  } catch (error) {
    console.error('Error fetching newsletter subscriptions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not found',
    path: req.path,
    method: req.method,
    message: 'The requested endpoint does not exist'
  });
});

// Initialize database connection and data
let isDbConnected = false;
let dbConnectionPromise = null;

const initializeApp = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = (async () => {
      try {
        await connectDB();
        await initializeArticles();
        isDbConnected = true;
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Database initialization failed:', error);
        isDbConnected = false;
      }
    })();
  }
  return dbConnectionPromise;
};

// Initialize the app
initializeApp().catch(console.error);

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel
module.exports = app;
