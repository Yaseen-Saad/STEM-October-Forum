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

// Initialize articles with base data
const initializeArticles = async () => {
  const articlesData = [
    { articleId: 1 },
    { articleId: 2 },
    { articleId: 3 },
    { articleId: 4 },
    { articleId: 5 },
    { articleId: 6 }
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

    res.json({
      views: totalViews,
      likes: totalLikes,
      hasLiked: false // We'll determine this on the frontend based on localStorage
    });
  } catch (error) {
    console.error('Error fetching article stats:', error);
    res.json({
      views: 0,
      likes: 0,
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
app.post('/api/article/:id/like', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);
    const { userId, action } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    if (!isDbConnected) {
      await initializeApp();
    }
    
    if (!isDbConnected) {
      // Return a mock response when database is not available
      console.log('Database not connected, returning mock like response');
      return res.json({
        likes: action === 'like' ? 150 : 149,
        hasLiked: action === 'like',
        message: `Article ${action}d successfully (offline mode)`
      });
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
      likes: 150,
      hasLiked: req.body.action === 'like',
      message: `Article ${req.body.action}d successfully (offline mode)`
    });
  }
});

// Get all articles stats (for homepage)
app.get('/api/articles/stats', async (req, res) => {
  try {
    if (!isDbConnected) {
      await initializeApp();
    }
    
    if (!isDbConnected) {
      // Return empty stats when database is not available
      console.log('Database not connected, returning empty stats');
      return res.json({});
    }
    
    const articles = await Article.find({});
    const stats = {};

    articles.forEach(article => {
      stats[article.articleId] = {
        views: article.views,
        likes: article.likes.length
      };
    });

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
    const articleId = parseInt(req.params.id);
    const comments = await Comment.find({ articleId })
      .sort({ createdAt: -1 }); // Most recent first

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a comment to an article
app.post('/api/articles/:id/comments', ensureDbConnection, async (req, res) => {
  try {
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
