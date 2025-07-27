import React, { useState, useEffect } from 'react';
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
  Linkedin
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { getArticleStats, incrementArticleView, toggleArticleLike } from './api';
import { getSessionId, getUserId, hasViewedInSession, markAsViewedInSession, formatViewCount } from './utils/session';

function ArticlePage() {
  const { id } = useParams();
  const articleId = parseInt(id) || 1;

  // Articles data - this would typically come from a database or API
  const articles = {
    1: {
      title: "The Allure of the Crown: When Leadership Becomes a Misunderstood Pursuit",
      author: "The Editorial Team",
      date: "July 25, 2025",
      readTime: "8 min read",
      category: "Philosophy"
    }
  };

  const currentArticle = articles[articleId] || articles[1];

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

  // Load article stats from MongoDB and handle view counting
  useEffect(() => {
    const loadArticleData = async () => {
      try {
        setLoading(true);

        // First, get current stats
        const stats = await getArticleStats(articleId);
        setViewCount(stats.views);
        setLikeCount(stats.likes);

        // Check if user has liked this article
        const savedLikes = localStorage.getItem('userLikes') || '{}';
        const userLikes = JSON.parse(savedLikes);
        setIsLiked(!!userLikes[articleId]);

        // Increment view count if not viewed in this session
        if (!hasViewedInSession(articleId)) {
          const sessionId = getSessionId();
          const viewResult = await incrementArticleView(articleId, sessionId);
          setViewCount(viewResult.views);
          markAsViewedInSession(articleId);
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
      } else {
        console.error('Failed to post comment:', response.status);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero text-white relative overflow-x-hidden">
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
                    {loading ? "..." : formatViewCount(viewCount)} views
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
                    {loading ? "..." : likeCount} likes
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
        <article className="lg:col-span-8">
          <div className="prose prose-lg prose-invert max-w-none">
            {/* Hero Image */}
            <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={currentArticle.image}
                alt={currentArticle.title}
                className="w-full h-64 lg:h-80 object-cover"
              />
            </div>

            {/* Content */}
            <div className="space-y-8 text-white/90 leading-relaxed">
              <p className="text-xl font-medium text-white leading-relaxed">
                {currentArticle.excerpt}
              </p>

              <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>

              <p className="text-lg">
                In the tapestry of human ambition, the pursuit of leadership positions has been both glorified and scrutinized. Within educational institutions especially, the race for student leadership roles often reveals deeper psychological and social dynamics that extend beyond the simple desire to serve.
              </p>

              <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
                Understanding the Pursuit of Leadership
              </h2>

              <p className="text-lg">
                The crown—whether literal or metaphorical—has long symbolized authority, respect, and influence. In academic environments, student leadership positions like student council president, club leader, or team captain represent microcosmic versions of these societal power structures. These roles offer students the opportunity to develop crucial skills: organization, communication, delegation, and decision-making.
              </p>

              <p className="text-lg">
                However, beneath this surface-level understanding lies a complex web of motivations. For some students, leadership positions represent a genuine desire to contribute positively to their community. For others, these positions become vehicles for personal validation, resume enhancement, or social status elevation.
              </p>

              <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
                The Psychology Behind Leadership Aspirations
              </h2>

              <p className="text-lg">
                Research in educational psychology suggests that leadership aspirations often correlate with identity formation during adolescence and young adulthood. As students navigate the complex process of self-definition, leadership roles can provide external validation and a sense of purpose. The recognition from peers and authority figures satisfies fundamental human needs for belonging and esteem.
              </p>

              <p className="text-lg">
                This psychological dimension explains why rejection from leadership positions can feel deeply personal—it's not merely a practical disappointment but can be perceived as a rejection of one's core identity and capabilities.
              </p>

              <div className="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 rounded-2xl p-8 border border-white/10 my-12">
                <div className="border-l-4 border-primary-400 pl-6">
                  <p className="text-xl italic text-white mb-4">
                    "The true test of leadership is not found in the acquisition of titles, but in the impact one makes regardless of position. Leadership is a service, not a status symbol."
                  </p>
                  <cite className="text-primary-400 font-semibold">— Dr. Maya Richards, Educational Psychologist</cite>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
                When the Pursuit Becomes Problematic
              </h2>

              <p className="text-lg">
                Leadership aspirations become concerning when the focus shifts entirely to the acquisition of the position rather than the responsibilities it entails. Signs of this shift include:
              </p>

              <div className="bg-gradient-to-r from-accent-900/30 to-primary-900/30 rounded-2xl p-8 border border-white/10 my-8">
                <ul className="space-y-4 text-white">
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-accent-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    Viewing leadership positions primarily as resume credentials rather than opportunities for community impact
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-primary-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    Experiencing disproportionate emotional distress when not selected for roles
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-secondary-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    Pursuing positions in areas where one lacks genuine interest or expertise
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                    Measuring self-worth predominantly through acquired titles and positions
                  </li>
                </ul>
              </div>

              <p className="text-lg">
                This misalignment between motivation and purpose often results in ineffective leadership and personal frustration. Leaders driven purely by status may find the actual work unfulfilling, while their constituents experience the disconnect between promise and performance.
              </p>

              <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
                Reframing Our Understanding of Leadership
              </h2>

              <p className="text-lg">
                Authentic leadership transcends titles and positions. It manifests in daily actions, ethical choices, and genuine interactions. Educational institutions have a responsibility to promote this broader understanding of leadership—one that values impact over recognition and service over status.
              </p>

              <p className="text-lg">
                Students would benefit from opportunities to develop leadership skills outside the confines of traditional positions. Collaborative projects, community service initiatives, and peer mentoring programs can foster leadership qualities without the competitive element that often accompanies formal leadership roles.
              </p>

              <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
                Conclusion: Beyond the Crown
              </h2>

              <p className="text-lg">
                The allure of the crown—of leadership positions and titles—is understandable in our achievement-oriented society. However, true leadership transcends these external markers. As students and educators, we must work to cultivate an environment where leadership is recognized in its many forms, where contribution is valued over position, and where service becomes its own reward.
              </p>

              <p className="text-lg mb-12">
                By shifting our focus from acquiring leadership titles to developing leadership qualities, we create space for more authentic expressions of leadership to emerge—ones that benefit both the individual and the community they serve.
              </p>

              <div className="glass rounded-2xl p-8 border border-white/10 mt-12">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-icon-consistent rounded-full flex items-center justify-center mr-4">
                    <User className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white text-lg">{currentArticle.author}</p>
                    <p className="text-white/70">Educational Leadership Researcher</p>
                  </div>
                </div>
                <p className="text-white/90 italic">
                  "Through years of research in educational psychology, I've seen how authentic leadership development transforms not just individuals, but entire communities."
                </p>
              </div>
            </div>
          </div>        </article>
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
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-primary-400 transition-colors duration-300"
              />
              <button className="w-full bg-gradient-icon-consistent hover:shadow-glow text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                Subscribe
              </button>
            </div>
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
                  <span className="text-white font-semibold">{loading ? "..." : likeCount} Likes</span>
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
    </div>
  );
}

export default ArticlePage;