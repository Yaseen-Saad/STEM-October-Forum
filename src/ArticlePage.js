import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Calendar,
  BookOpen,
  ArrowLeft,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Facebook,
  Twitter,
  AlertCircle,
  Linkedin,
  Instagram,
  Feather,
  FileX,
  Home
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getArticleStats, incrementArticleView, toggleArticleLike, getArticle } from './api';
import { getSessionId, getUserId, hasViewedInSession, markAsViewedInSession, formatViewCount } from './utils/session';

function ArticlePage() {
  const { id } = useParams();
  
  // Validate the article ID - must be a valid positive integer
  const parsedId = parseInt(id);
  const isValidId = !isNaN(parsedId) && parsedId > 0 && parsedId.toString() === id;
  const articleId = isValidId ? parsedId : null;

  // Article data - now fetched from API
  const [currentArticle, setCurrentArticle] = useState(null);
  const [articleExists, setArticleExists] = useState(false);
  const [articleLoading, setArticleLoading] = useState(true);

  // State for view and like counts from MongoDB
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  // State for newsletter signup
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(''); // '', 'loading', 'success', 'error'

  // Ref to track if view has been incremented to prevent double counting
  const viewIncrementedRef = useRef(false);

  // Load article and stats from backend
  useEffect(() => {
    const loadArticleData = async () => {
      // First load article data to check if it exists
      if (!articleId) {
        setArticleExists(false);
        setArticleLoading(false);
        setLoading(false);
        return;
      }

      try {
        setArticleLoading(true);
        const articleData = await getArticle(articleId);
        setCurrentArticle(articleData);
        setArticleExists(true);
      } catch (err) {
        console.error('Failed to load article:', err);
        setCurrentArticle(null);
        setArticleExists(false);
        setArticleLoading(false);
        setLoading(false);
        return;
      } finally {
        setArticleLoading(false);
      }

      // If article exists, load stats and comments
      try {
        setLoading(true);

        // First, get current stats
        const stats = await getArticleStats(articleId);
        setLikeCount(stats.likes);

        // Check if user has liked this article
        const savedLikes = localStorage.getItem('userLikes') || '{}';
        const userLikes = JSON.parse(savedLikes);
        setIsLiked(!!userLikes[articleId]);

        // Increment view count if not viewed in this session and not already incremented
        if (!hasViewedInSession(articleId) && !viewIncrementedRef.current) {
          viewIncrementedRef.current = true;
          const sessionId = getSessionId();
          const viewResult = await incrementArticleView(articleId, sessionId);
          setViewCount(viewResult.views);
          markAsViewedInSession(articleId);
        } else {
          // If already viewed in this session, just use the current stats
          setViewCount(stats.views);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to load article data:', err);
        setError('Failed to load article data');
        // Set zero values if can't load from database
        setViewCount(0);
        setLikeCount(0);
      } finally {
        setLoading(false);
      }
    };

    loadArticleData();
    loadComments();
  }, [articleId]);

  // Function to handle article like/unlike using MongoDB
  const handleLikeArticle = async () => {
    try {
      const userId = getUserId();
      const action = isLiked ? 'unlike' : 'like';

      const result = await toggleArticleLike(articleId, userId, action);

      // Update state
      setIsLiked(!isLiked);
      setLikeCount(result.likes);

      // Update localStorage for persistence
      const savedLikes = localStorage.getItem('userLikes') || '{}';
      const userLikes = JSON.parse(savedLikes);
      userLikes[articleId] = !isLiked;
      localStorage.setItem('userLikes', JSON.stringify(userLikes));

    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  // Function to load comments
  const loadComments = async () => {
    try {
      setCommentsLoading(true);
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`);
      if (response.ok) {
        const commentsData = await response.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  // Function to add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const userId = getUserId();
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          userId: userId,
          author: `User ${userId.slice(0, 8)}` // Simple author name
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments(prev => [comment, ...prev]);
        setNewComment('');
        setShowCommentForm(false);

        // Refresh article stats to get updated comment count
        try {
          const stats = await getArticleStats(articleId);
          setLikeCount(stats.likes);
          // Don't update view count when adding comments
        } catch (error) {
          console.error('Failed to refresh stats after comment:', error);
        }
      } else {
        console.error('Failed to post comment:', response.status);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Function to handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setNewsletterStatus('loading');
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          source: 'article-page',
          articleId: articleId
        }),
      });

      if (response.ok) {
        setNewsletterStatus('success');
        setEmail('');
        setTimeout(() => setNewsletterStatus(''), 3000); // Clear status after 3 seconds
      } else {
        setNewsletterStatus('error');
        setTimeout(() => setNewsletterStatus(''), 3000);
      }
    } catch (error) {
      console.error('Failed to subscribe to newsletter:', error);
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(''), 3000);
    }
  };

  // Dynamic content renderer that processes markdown-like text from JSON
  const renderDynamicContent = (content) => {
    if (!content) return null;

    const lines = content.split('\n').filter(line => line.trim() !== '');
    const elements = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      // Handle headers
      if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={index} className="text-3xl font-bold text-gradient mt-12 mb-6">
            {trimmedLine.substring(3)}
          </h2>
        );
      }
      // Handle quoted text (starting and ending with *)
      else if (trimmedLine.startsWith('*"') && trimmedLine.endsWith('"*')) {
        elements.push(
          <div key={index} className="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 rounded-2xl p-8 border border-white/10 my-12">
            <div className="border-l-4 border-primary-400 pl-6">
              <p className="text-xl italic text-white">
                {trimmedLine.substring(2, trimmedLine.length - 2)}
              </p>
            </div>
          </div>
        );
      }
      // Handle regular paragraphs
      else if (trimmedLine.length > 0 && !trimmedLine.startsWith('#')) {
        elements.push(
          <p key={index} className="text-lg" dangerouslySetInnerHTML={{
            __html: formatTextContent(trimmedLine)
          }} />
        );
      }
    });

    return elements;
  };

  // Format text content with markdown-like styling
  const formatTextContent = (text) => {
    return text
      // Bold text **text**
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-400">$1</strong>')
      // Italic text *text*
      .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em class="text-primary-400">$1</em>')
      // Underlined text (for emphasis)
      .replace(/\b([A-Z][A-Z\s]+)\b/g, '<u class="decoration-secondary-400 decoration-2">$1</u>');
  };

  // Function to render article content based on article data
  const renderArticleContent = () => {
    if (!currentArticle) return null;

    // If the article has dynamic content from backend, render it
    if (currentArticle.content) {
      return (
        <div className="space-y-8 text-white/90 leading-relaxed">
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>
          
          <div className="prose prose-lg prose-invert max-w-none">
            {renderDynamicContent(currentArticle.content)}
          </div>
          
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>
        </div>
      );
    }

    // Fallback to static content for articles without structured content
    return (
      <div className="space-y-8 text-white/90 leading-relaxed">
        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>
        
        <p className="text-lg">
          This article is loading content from our backend. If you're seeing this message, 
          the article may not have structured content available yet.
        </p>
        
        {/* Display excerpt if available */}
        {currentArticle.excerpt && (
          <div className="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 rounded-2xl p-8 border border-white/10 my-12">
            <div className="border-l-4 border-primary-400 pl-6">
              <p className="text-xl italic text-white">
                {currentArticle.excerpt}
              </p>
            </div>
          </div>
        )}
        
        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>
      </div>
    );
  };
  // Render 404 page if article doesn't exist
  if (!articleExists) {
    return (
      <div className="min-h-screen bg-gradient-article text-white relative overflow-x-hidden">
        {/* Modern Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500 opacity-20 blur-3xl rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-500 opacity-20 blur-3xl rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-500 opacity-10 blur-3xl rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Modern Grid Background */}
        <div className="absolute inset-0 opacity-10 z-0">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        {/* 404 Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-8">
          <div className="text-center max-w-2xl mx-auto">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center text-white/70 hover:text-primary-400 mb-12 group transition-all duration-300">
              <ArrowLeft className="mr-3 group-hover:text-primary-400 transition-colors duration-300" size={20} />
              <span className="text-lg font-medium group-hover:text-primary-400">Back to Articles</span>
            </Link>

            {/* 404 Icon */}
            <div className="w-32 h-32 bg-gradient-icon-consistent rounded-full flex items-center justify-center mx-auto mb-8 shadow-glow">
              <FileX className="text-white" size={64} />
            </div>

            {/* 404 Message */}
            <h1 className="text-6xl lg:text-8xl font-black text-gradient mb-6">
              404
            </h1>
            
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Article Not Found
            </h2>
            
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Oops! The article you're looking for doesn't exist or may have been moved. 
              Let's get you back to exploring our latest insights and discussions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                to="/" 
                className="bg-gradient-icon-consistent hover:shadow-glow text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center"
              >
                <Home className="mr-2" size={20} />
                Return Home
              </Link>
              
              <Link 
                to="/" 
                className="glass border border-white/20 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300"
              >
                Browse Articles
              </Link>
            </div>

            {/* Help Text */}
            <div className="glass rounded-2xl p-6 border border-white/10 mt-12 max-w-lg mx-auto">
              <h3 className="text-lg font-bold text-gradient mb-3">Looking for something specific?</h3>
              <p className="text-white/70 text-sm">
                Check out our latest articles on leadership, student life, and academic excellence. 
                Our editorial team regularly publishes new insights from the STEM October community.
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <footer className="py-16 px-8 lg:px-16 bg-gradient-contribute-to-footer relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand Section */}
              <div className="md:col-span-2">
                <h3 className="text-3xl font-bold mb-4 flex items-center">
                  <div className="p-2 bg-gradient-icon-consistent rounded-lg mr-3 shadow-glow">
                    <BookOpen className="text-white" size={24} />
                  </div>
                  <span className="text-gradient">STEM</span>{' '}
                  <span className="text-white">October</span>{' '}
                  <span className="text-gradient-secondary">Forum</span>
                </h3>
                <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-lg">
                  Empowering the next generation of critical thinkers through thoughtful discourse
                  and authentic student voices.
                </p>
                <div className="flex space-x-4">
                  <div className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <Facebook className="text-secondary-400 group-hover:text-primary-400 transition-colors" size={20} />
                  </div>
                  <div className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <Instagram className="text-secondary-400 group-hover:text-primary-400 transition-colors" size={20} />
                  </div>
                  <div className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                    <Linkedin className="text-secondary-400 group-hover:text-primary-400 transition-colors" size={20} />
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-xl font-bold text-gradient mb-6">Quick Links</h4>
                <div className="space-y-3">
                  {['About Us', 'Latest Articles', 'Submit Article', 'Guidelines', 'Contact'].map((link, index) => (
                    <button key={index} className="block text-white/70 hover:text-primary-400 transition-colors duration-200">
                      {link}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-xl font-bold text-gradient-secondary mb-6">Get in Touch</h4>
                <div className="space-y-3 text-white/70">
                  <p>stemoctoberforum@gmail.com</p>
                  <p>STEM High School for Boys</p>
                  <p>6th of October,</p>
                  <p>Giza, Egypt</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col">
                <p className="text-white/60 text-sm mb-2">
                  &copy; 2025 STEM October Forum. All rights reserved. A Publication of STEM High School for Boys - 6th of October.
                </p>
                <p className="text-sm text-white/70 flex items-center font-medium">
                  <AlertCircle size={14} className="mr-2 text-primary-400" />
                  <span>Currently at <span className="text-primary-400">stemoctobermagazine.org</span> • Moving to <span className="text-secondary-400">stemoct.forum</span> soon</span>
                </p>
              </div>
              <div className="flex items-center space-x-4 text-white/70 text-sm">
                <span>Made with</span>
                <Heart className="text-primary-400" size={16} />
                <span>by students, for students</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-article text-white relative overflow-x-hidden">
      {/* Modern Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500 opacity-20 blur-3xl rounded-full animate-float"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-500 opacity-20 blur-3xl rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-500 opacity-10 blur-3xl rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Modern Grid Background */}
      <div className="absolute inset-0 opacity-10 z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Article Header */}
      <header className="pt-24 pb-16 px-8 lg:px-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center text-white/70 hover:text-primary-400 mb-8 group transition-all duration-300">
            <ArrowLeft className="mr-3 group-hover:text-primary-400 transition-colors duration-300" size={20} />
            <span className="text-lg font-medium group-hover:text-primary-400">Back to Articles</span>
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-4">
            <span className="px-4 py-2 bg-gradient-icon-consistent text-white text-sm font-semibold rounded-full shadow-glow">
              {currentArticle.category}
            </span>
            <span className="text-secondary-400 text-sm font-medium">Published {currentArticle.date}</span>
          </div>

          <h1 className="text-4xl lg:text-6xl xl:text-7xl font-black text-gradient mb-8 leading-tight">
            {currentArticle.title}
          </h1>

          <div className="flex items-center justify-between flex-wrap gap-6 mb-8">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-icon-consistent flex items-center justify-center text-white mr-4 shadow-glow">
                <User size={24} />
              </div>
              <div>
                <p className="font-bold text-white text-lg">{currentArticle.author}</p>
                <p className="text-sm text-white/70">STEM October Forum Editorial Team</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-white/80">
              <div className="flex items-center">
                <Calendar className="mr-2 text-primary-400" size={18} />
                <span className="text-sm">{currentArticle.date}</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="mr-2 text-secondary-400" size={18} />
                <span className="text-sm">{currentArticle.readTime}</span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="glass rounded-2xl p-6 border border-white/10">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <Eye className="mr-2 text-primary-400" size={20} />
                  <span className="text-white font-semibold">
                    {loading ? "0" : formatViewCount(viewCount)} views
                  </span>
                </div>
                <div
                  className={`flex items-center cursor-pointer transition-all duration-300 ${isLiked ? 'text-primary-500' : 'text-white/70 hover:text-primary-400'}`}
                  onClick={handleLikeArticle}
                >
                  <Heart
                    className="mr-2"
                    size={20}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  <span className="font-semibold">
                    {loading ? "0" : likeCount} likes
                  </span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="mr-2 text-accent-400" size={20} />
                  <span className="font-semibold">{comments.length} comments</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 group">
                  <Facebook className="text-primary-400 group-hover:text-white transition-colors" size={20} />
                </button>
                <button className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 group">
                  <Twitter className="text-secondary-400 group-hover:text-white transition-colors" size={20} />
                </button>
                <button className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 group">
                  <Linkedin className="text-accent-400 group-hover:text-white transition-colors" size={20} />
                </button>
                <button className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 group">
                  <Share2 className="text-white/70 group-hover:text-white transition-colors" size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Article Content */}
      <main className="px-8 lg:px-16 pb-24 relative z-10">
        {/* Main Content */}
        <article className="lg:col-span-8 max-w-6xl mx-auto">
          {/* Editorial Letter */}
          <div className="glass rounded-2xl p-8 border border-white/10 mt-8 mb-8 bg-gradient-to-br from-primary-900/20 to-secondary-900/20">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-icon-consistent rounded-full flex items-center justify-center mr-4 shadow-glow">
                <Feather className="text-white" size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gradient">Letter from the Editorial Team</h3>
                <p className="text-white/70">STEM October Forum</p>
              </div>
            </div>

            <div className="space-y-4 text-white/90 leading-relaxed">
              <p className="text-lg">
                <strong className="text-white">Dear Readers,</strong>
              </p>

              <p>
                Welcome to the a new article from the <span className="font-bold text-primary-400">STEM October Forum !</span>
              </p>
              <p>
                Here at <em>STEM High School for Boys - 6th of October</em>, we're surrounded by opinions, ideas and thoughts. We truly do believe that every voice is worth hearing, and that words have an amazing ability to mold ideas, transform perspectives, and spark growth. That's why the <em>STEM October Forum</em> is more than a collection of essays. It's a place where you can speak your minds freely, debate thoughtfully, and help build a stronger, more thoughtful community. Our hope for these essays is to get us all talking to find new insights here in our community.
              </p>

              <p>
                To keep our discussions respectful and constructive, we will use cartoon, anime, video game, or movie characters to represent certain qualities or traits. We are attempting to promote self-reflection and a positive forum for thinking and growth, not judge people. This Forum is about growing up and heavy thinking, not public criticism.
              </p>
              <p>
                Beyond the mere sharing of ideas, we're dedicated to encourage deeper thinking, boost awareness, and help all students grow in maturity. We wholeheartedly believe that real development takes place when we engage other perspectives, question the world we inhabit, and develop the wisdom to think logically. By exploring multiple points of view, debating matters of significance, and reflecting on the bigger picture, we seek to help shape students who are not just knowledgeable but also thoughtful and open-minded.
              </p>
              <p>
                This Forum truly is for all of us. So, <em>read, reflect, contribute, discuss, debate, respect, learn, and most of all—enjoy!</em></p>

              <div className="border-t border-white/20 pt-4 mt-6">
                <p className="text-white font-semibold">Warmly,</p>
                <p className="text-white/90 font-semibold">The Editorial Team,</p>
                <p className="text-white/70 text-sm">STEM October Forum.</p>
              </div>
            </div>
          </div>
          <div className="prose prose-lg prose-invert max-w-none">

            {/* Hero Image */}
            <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl max-w-md mx-auto border border-white/10">
              <img
                src={currentArticle.image || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"}
                alt={currentArticle.title}
                className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>


            {/* Content */}
            {renderArticleContent()}

          </div>
        </article>
      </main>

      {/* Footer/Comments Section */}
      <section className="bg-gradient-to-t from-black/50 to-transparent px-8 lg:px-16 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Newsletter Signup */}
          <div className="glass rounded-2xl p-6 border mb-4 border-white/10">
            <h3 className="text-xl font-bold text-gradient mb-4">Stay Updated</h3>
            <p className="text-white/70 text-sm mb-4">
              Get the latest insights on leadership, education, and personal development delivered to your inbox.
            </p>

            {newsletterStatus === 'success' ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-center">
                <p className="text-green-400 font-semibold">Thank you for subscribing!</p>
                <p className="text-green-300 text-sm mt-1">You'll receive our latest articles in your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary-400 transition-colors duration-300"
                    required
                    disabled={newsletterStatus === 'loading'}
                  />
                </div>

                {newsletterStatus === 'error' && (
                  <p className="text-red-400 text-sm">Failed to subscribe. Please try again.</p>
                )}

                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading' || !email.trim()}
                  className="w-full bg-gradient-icon-consistent hover:shadow-glow text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {newsletterStatus === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-gradient mb-6">Join the Discussion</h3>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <MessageCircle className="mr-2 text-accent-400" size={20} />
                  <span className="text-white font-semibold">{comments.length} Comments</span>
                </div>
                <div className="flex items-center">
                  <Heart className="mr-2 text-primary-400" size={20} />
                  <span className="text-white font-semibold">{loading ? "0" : likeCount} Likes</span>
                </div>
              </div>

              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="bg-gradient-icon-consistent hover:shadow-glow text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300"
              >
                {showCommentForm ? 'Cancel' : 'Add Comment'}
              </button>
            </div>

            {/* Comment Form */}
            {showCommentForm && (
              <form onSubmit={handleAddComment} className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts about this article..."
                  className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary-400 transition-colors duration-300 resize-none"
                  required
                />
                <div className="flex justify-end mt-3 space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCommentForm(false);
                      setNewComment('');
                    }}
                    className="px-4 py-2 text-white/70 hover:text-white transition-colors duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-gradient-icon-consistent hover:shadow-glow text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post Comment
                  </button>
                </div>
              </form>
            )}

            {/* Comments List */}
            {commentsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400 mx-auto"></div>
                <p className="text-white/70 mt-2">Loading comments...</p>
              </div>
            ) : comments.length > 0 ? (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment._id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-icon-consistent rounded-full flex items-center justify-center text-white font-semibold">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-white">{comment.author}</h4>
                          <span className="text-white/50 text-sm">
                            {new Date(comment.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-white/90 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/70 text-center py-12">
                <MessageCircle className="mx-auto mb-4 text-white/30" size={48} />
                <p className="text-lg">No comments yet</p>
                <p className="text-sm mt-2">Be the first to share your thoughts!</p>
              </div>
            )}

            {/* Share Buttons */}
            <div className="flex justify-center space-x-3 mt-8 pt-8 border-t border-white/10">
              <button className="p-3 glass rounded-lg hover:bg-white/20 transition-all duration-300 group">
                <Facebook className="text-primary-400 group-hover:text-white transition-colors" size={20} />
              </button>
              <button className="p-3 glass rounded-lg hover:bg-white/20 transition-all duration-300 group">
                <Twitter className="text-secondary-400 group-hover:text-white transition-colors" size={20} />
              </button>
              <button className="p-3 glass rounded-lg hover:bg-white/20 transition-all duration-300 group">
                <Linkedin className="text-accent-400 group-hover:text-white transition-colors" size={20} />
              </button>
              <button className="p-3 glass rounded-lg hover:bg-white/20 transition-all duration-300 group">
                <Share2 className="text-white/70 group-hover:text-white transition-colors" size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* Enhanced Footer */}
      <footer className="py-16 px-8 lg:px-16 bg-gradient-contribute-to-footer">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-4 flex items-center">
                <div className="p-2 bg-gradient-icon-consistent rounded-lg mr-3 shadow-glow">
                  <BookOpen className="text-white" size={24} />
                </div>
                <span className="text-gradient">STEM</span>{' '}
                <span className="text-white">October</span>{' '}
                <span className="text-gradient-secondary">Forum</span>
              </h3>
              <p className="text-white/80 text-lg leading-relaxed mb-6 max-w-lg">
                Empowering the next generation of critical thinkers through thoughtful discourse
                and authentic student voices.
              </p>
              <div className="flex space-x-4">
                <div className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <Facebook className="text-secondary-400 group-hover:text-primary-400 transition-colors" size={20} />
                </div>
                <div className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <Instagram className="text-secondary-400 group-hover:text-primary-400 transition-colors" size={20} />
                </div>
                <div className="p-2 glass rounded-lg hover:bg-white/20 transition-all duration-300 cursor-pointer group">
                  <Linkedin className="text-secondary-400 group-hover:text-primary-400 transition-colors" size={20} />
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold text-gradient mb-6">Quick Links</h4>
              <div className="space-y-3">
                {['About Us', 'Latest Articles', 'Submit Article', 'Guidelines', 'Contact'].map((link, index) => (
                  <button key={index} className="block text-white/70 hover:text-primary-400 transition-colors duration-200">
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold text-gradient-secondary mb-6">Get in Touch</h4>
              <div className="space-y-3 text-white/70">
                <p>stemoctoberforum@gmail.com</p>
                <p>STEM High School for Boys</p>
                <p>6th of October,</p>
                <p>Giza, Egypt</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="text-white/60 text-sm mb-2">
                &copy; 2025 STEM October Forum. All rights reserved. A Publication of STEM High School for Boys - 6th of October.
              </p>
              <p className="text-sm text-white/70 flex items-center font-medium">
                <AlertCircle size={14} className="mr-2 text-primary-400" />
                <span>Currently at <span className="text-primary-400">stemoctobermagazine.org</span> • Moving to <span className="text-secondary-400">stemoct.forum</span> soon</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 text-white/70 text-sm">
              <span>Made with</span>
              <Heart className="text-primary-400" size={16} />
              <span>by students, for students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ArticlePage;