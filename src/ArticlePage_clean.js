import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, 
  Eye, 
  MessageCircle, 
  User, 
  Calendar, 
  ArrowLeft,
  Send,
  Mail,
  CheckCircle
} from 'lucide-react';

const ArticlePage = () => {
  const { slug } = useParams();
  const [currentArticle, setCurrentArticle] = useState(null);
  const [stats, setStats] = useState({
    views: 0,
    likes: 0,
    comments: 0
  });
  const [totalStats, setTotalStats] = useState({
    totalArticles: 0,
    totalComments: 0
  });
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch article and stats on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch articles
        const articlesResponse = await fetch('/api/articles');
        const articlesData = await articlesResponse.json();
        
        // Find current article by slug
        const article = articlesData.find(a => a.slug === slug);
        setCurrentArticle(article);
        
        if (article) {
          // Fetch article stats
          const statsResponse = await fetch(`/api/articles/${article.id}/stats`);
          const statsData = await statsResponse.json();
          setStats(statsData);
          
          // Fetch comments
          const commentsResponse = await fetch(`/api/articles/${article.id}/comments`);
          const commentsData = await commentsResponse.json();
          setComments(commentsData);
          
          // Increment view count
          await fetch(`/api/articles/${article.id}/view`, { method: 'POST' });
        }
        
        // Fetch total stats
        const totalStatsResponse = await fetch('/api/stats/total');
        const totalStatsData = await totalStatsResponse.json();
        setTotalStats(totalStatsData);
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [slug]);

  const handleLike = async () => {
    if (!currentArticle) return;
    
    try {
      const response = await fetch(`/api/articles/${currentArticle.id}/like`, {
        method: 'POST'
      });
      const data = await response.json();
      setStats(prevStats => ({ ...prevStats, likes: data.likes }));
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !newCommentAuthor.trim() || !currentArticle) return;

    try {
      const response = await fetch(`/api/articles/${currentArticle.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: newComment,
          author: newCommentAuthor
        })
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments(prevComments => [...prevComments, updatedComment]);
        setNewComment('');
        setNewCommentAuthor('');
        
        // Update comment count
        setStats(prevStats => ({ 
          ...prevStats, 
          comments: prevStats.comments + 1 
        }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
    }
  };

  const renderStructuredContent = (content) => {
    return (
      <div className="space-y-8 text-white/90 leading-relaxed">
        {content.map((section, index) => {
          switch (section.type) {
            case 'paragraph':
              return (
                <p key={index} className="text-lg" dangerouslySetInnerHTML={{ __html: section.content }} />
              );
            case 'heading':
              return (
                <h2 key={index} className="text-3xl font-bold mt-12 mb-6">
                  {section.content}
                </h2>
              );
            case 'quote':
              return (
                <blockquote key={index} className="border-l-4 border-primary-500 pl-6 italic text-xl text-primary-200 my-8">
                  "{section.content}"
                  {section.author && (
                    <footer className="text-sm text-white/60 mt-2">— {section.author}</footer>
                  )}
                </blockquote>
              );
            case 'divider':
              return (
                <div key={index} className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  };

  const renderArticleContent = () => {
    // Check if current article has structured content
    if (currentArticle && currentArticle.content) {
      return renderStructuredContent(currentArticle.content);
    }

    // Fallback for legacy articles without structured content
    return (
      <div className="space-y-8 text-white/90 leading-relaxed">
        <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>
        <p className="text-lg">Legacy article content would go here...</p>
      </div>
    );
  };

  // Render 404 page if article doesn't exist
  if (!currentArticle && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-xl mb-8">Article not found</p>
          <Link to="/" className="text-primary-400 hover:text-primary-300">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-600/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto px-4 relative">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            {currentArticle?.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/70 mb-8">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>{currentArticle?.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{currentArticle?.date}</span>
            </div>
          </div>

          <p className="text-xl text-white/80 leading-relaxed max-w-3xl">
            {currentArticle?.excerpt}
          </p>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 pb-20">
        <article className="prose prose-lg prose-invert max-w-none">
          {renderArticleContent()}
        </article>

        {/* Article Actions */}
        <div className="flex items-center gap-6 my-12 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              liked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/10 text-white/80 hover:bg-white/20'
            }`}
          >
            <Heart size={18} fill={liked ? 'white' : 'none'} />
            <span>{stats.likes}</span>
          </button>
          
          <div className="flex items-center gap-2 text-white/70">
            <Eye size={18} />
            <span>{stats.views}</span>
          </div>
          
          <div className="flex items-center gap-2 text-white/70">
            <MessageCircle size={18} />
            <span>{stats.comments}</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-white mb-8">
            Discussion ({stats.comments})
          </h3>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="mb-12">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Your name"
                value={newCommentAuthor}
                onChange={(e) => setNewCommentAuthor(e.target.value)}
                className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>
            <textarea
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 mb-4"
              required
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
            >
              <Send size={18} />
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment._id} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{comment.author}</p>
                    <p className="text-white/60 text-sm">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-primary-600/20 to-secondary-600/20 backdrop-blur-sm border border-white/10">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-white/80 mb-6">
              Subscribe to our newsletter for the latest articles and insights.
            </p>
            
            {subscribed ? (
              <div className="flex items-center justify-center gap-2 text-green-400">
                <CheckCircle size={20} />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSignup} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors whitespace-nowrap"
                >
                  <Mail size={18} />
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Editorial Letter */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-slate-800/50 to-purple-800/50 backdrop-blur-sm border border-white/10">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              A Letter from the Editorial Team
            </h3>
            <div className="space-y-4 text-white/90 leading-relaxed">
              <p>
                Welcome to our growing community of {totalStats.totalArticles} articles and {totalStats.totalComments} discussions. 
                We're building something special here - a place where ideas flourish and conversations matter.
              </p>
              <p>
                Every article represents hours of research, reflection, and passion. Every comment adds 
                to our collective understanding. You're not just reading; you're participating in a 
                living, breathing intellectual ecosystem.
              </p>
              <p className="italic">
                Thank you for being part of our journey. Your voice matters here.
              </p>
              <p className="text-primary-300 font-medium">
                — The STEM Forum Editorial Team
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;
