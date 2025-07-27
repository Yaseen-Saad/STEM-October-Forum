const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://admindatabase:KU2v7fmJRsWEjrGY@cluster0.swr83xe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Article Schema (same as in server.js)
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

// Comment Schema (same as in server.js)
const commentSchema = new mongoose.Schema({
  articleId: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
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

const Article = mongoose.model('Article', articleSchema);
const Comment = mongoose.model('Comment', commentSchema);

// Reset function
const resetAllData = async () => {
  try {
    console.log('Starting data reset...');
    
    // Delete all articles stats
    const articlesDeleted = await Article.deleteMany({});
    console.log(`Deleted ${articlesDeleted.deletedCount} article records`);
    
    // Delete all comments
    const commentsDeleted = await Comment.deleteMany({});
    console.log(`Deleted ${commentsDeleted.deletedCount} comment records`);
    
    console.log('✅ All data reset successfully!');
    console.log('- All article views reset to 0');
    console.log('- All article likes reset to 0');
    console.log('- All comments deleted');
    
    process.exit(0);
  } catch (error) {
    console.error('Error resetting data:', error);
    process.exit(1);
  }
};

// Run the reset
const runReset = async () => {
  await connectDB();
  await resetAllData();
};

runReset();
