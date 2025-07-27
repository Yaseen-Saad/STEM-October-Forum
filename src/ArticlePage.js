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
  AlertCircle,
  Linkedin,
  Instagram
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
    },
    2: {
      title: "Navigating Academic Pressure: A Student's Perspective on Excellence vs. Well-being",
      author: "Ahmed Hassan",
      date: "July 22, 2025",
      readTime: "6 min read",
      category: "Student Life",
      excerpt: "In the relentless pursuit of academic excellence, many students find themselves caught between the desire to succeed and the need to maintain their mental and physical well-being. This personal reflection explores the delicate balance between high achievement and sustainable living as a student."
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

  // State for newsletter signup
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(''); // '', 'loading', 'success', 'error'

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

        // Refresh article stats to get updated comment count
        try {
          const stats = await getArticleStats(articleId);
          setViewCount(stats.views);
          setLikeCount(stats.likes);
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

  // Function to render article content based on article ID
  const renderArticleContent = () => {
    if (articleId === 2) {
      return (
        <div className="space-y-8 text-white/90 leading-relaxed">
          <p className="text-xl font-medium text-white leading-relaxed">
            {currentArticle.excerpt}
          </p>

          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>

          <p className="text-lg">
            As I sit in my dorm room at 2 AM, surrounded by textbooks, empty coffee cups, and the soft glow of my laptop screen, I can't help but reflect on the journey that brought me here. Like many students, I entered university with grand ambitions and an unwavering determination to excel in every aspect of my academic life. What I didn't anticipate was how this pursuit of excellence would challenge not just my intellectual capacity, but my entire well-being.
          </p>

          <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
            The Weight of Expectations
          </h2>

          <p className="text-lg">
            The pressure to excel academically comes from multiple sources: parents who have sacrificed for our education, professors who set high standards, peers who seem to effortlessly navigate complex concepts, and perhaps most critically, ourselves. We set benchmarks that often seem impossible to reach, yet we pursue them relentlessly.
          </p>

          <p className="text-lg">
            In my first year, I believed that success meant achieving perfect grades, participating in every extracurricular activity, maintaining an active social life, and still finding time for personal interests. The reality hit hard when I realized that this was not just challenging—it was unsustainable.
          </p>

          <div className="bg-gradient-to-r from-primary-900/50 to-secondary-900/50 rounded-2xl p-8 border border-white/10 my-12">
            <div className="border-l-4 border-primary-400 pl-6">
              <p className="text-xl italic text-white mb-4">
                "Excellence is not about being perfect; it's about being the best version of yourself while maintaining your humanity and well-being."
              </p>
              <cite className="text-primary-400 font-semibold">— Dr. Sarah Chen, Student Wellness Advisor</cite>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
            The Physical and Mental Toll
          </h2>

          <p className="text-lg">
            The symptoms crept in gradually. First, it was just occasional fatigue—easily dismissed as the natural result of late-night studying. Then came the headaches, the difficulty concentrating during lectures I was once passionate about, and the growing sense of anxiety that accompanied every assignment deadline.
          </p>

          <p className="text-lg">
            Sleep became a luxury I convinced myself I couldn't afford. Meals turned into hurried affairs, often consisting of whatever was quickest to grab between classes. Exercise, which had once been a source of joy and stress relief, disappeared entirely from my routine. I was achieving my academic goals, but at what cost?
          </p>

          <div className="bg-gradient-to-r from-accent-900/30 to-primary-900/30 rounded-2xl p-8 border border-white/10 my-8">
            <h3 className="text-xl font-bold text-white mb-4">Warning Signs I Wish I Had Recognized Earlier:</h3>
            <ul className="space-y-3 text-white">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                Chronic fatigue despite getting "enough" sleep
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                Increased irritability and mood swings
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-secondary-400 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                Loss of interest in activities I once enjoyed
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-accent-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                Physical symptoms like headaches and stomach issues
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-4 flex-shrink-0"></span>
                Feeling overwhelmed by tasks that previously felt manageable
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
            Finding Balance: A Personal Revolution
          </h2>

          <p className="text-lg">
            The turning point came during midterm season of my second year. After pulling three consecutive all-nighters, I found myself crying in the library—not from sadness, but from sheer exhaustion and the realization that I had lost sight of why I was pursuing education in the first place.
          </p>

          <p className="text-lg">
            That moment of vulnerability led me to seek help from the student counseling center. Speaking with a counselor helped me understand that my worth as a person wasn't tied to my GPA, and that sustainable success required a fundamental shift in how I approached my academic life.
          </p>

          <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
            Strategies That Actually Work
          </h2>

          <p className="text-lg">
            Recovery wasn't instant, but implementing these strategies gradually transformed my academic experience:
          </p>

          <div className="bg-gradient-to-r from-secondary-900/30 to-accent-900/30 rounded-2xl p-8 border border-white/10 my-8">
            <h3 className="text-xl font-bold text-white mb-6">My Well-being Toolkit:</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-primary-400 mb-2">Time Blocking</h4>
                <p className="text-white/90">Instead of studying until tasks were "perfect," I allocated specific time blocks for each subject. When time was up, I moved on.</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-secondary-400 mb-2">Non-negotiable Self-care</h4>
                <p className="text-white/90">I scheduled sleep, meals, and exercise like any other important appointment. These became non-negotiable commitments to myself.</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-accent-400 mb-2">Progress Over Perfection</h4>
                <p className="text-white/90">I learned to celebrate small wins and view mistakes as learning opportunities rather than failures.</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-primary-500 mb-2">Community Support</h4>
                <p className="text-white/90">I built a support network of friends who understood the importance of balance and could offer perspective during stressful times.</p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
            Redefining Success
          </h2>

          <p className="text-lg">
            Today, I define success differently. It's not just about the grades on my transcript—though I still strive for academic excellence. Success is waking up feeling rested, approaching challenges with curiosity rather than dread, maintaining meaningful relationships, and feeling confident that I'm developing both intellectually and personally.
          </p>

          <p className="text-lg">
            My GPA might not be the perfect 4.0 I once obsessed over, but my learning is deeper, my relationships are stronger, and my mental health is substantially better. I've discovered that when I take care of my well-being, my academic performance actually improves because I can think more clearly and approach problems with greater creativity.
          </p>

          <h2 className="text-3xl font-bold text-gradient mt-12 mb-6">
            A Message to Fellow Students
          </h2>

          <p className="text-lg">
            If you're reading this while feeling overwhelmed by academic pressure, please know that you're not alone. The culture of academic perfectionism affects countless students, and recognizing this struggle is the first step toward creating positive change.
          </p>

          <p className="text-lg mb-12">
            Excellence and well-being are not mutually exclusive. In fact, they complement each other in ways that make both more achievable and sustainable. Your education is important, but you—your health, happiness, and humanity—are irreplaceable.
          </p>

          <div className="glass rounded-2xl p-8 border border-white/10 mt-12">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-icon-consistent rounded-full flex items-center justify-center mr-4">
                <User className="text-white" size={24} />
              </div>
              <div>
                <p className="font-bold text-white text-lg">{currentArticle.author}</p>
                <p className="text-white/70">Third-year Psychology Student</p>
              </div>
            </div>
            <p className="text-white/90 italic">
              "Through sharing my story, I hope to contribute to a conversation about creating healthier academic environments where students can thrive without sacrificing their well-being."
            </p>
          </div>
        </div>
      );
    }

    // Default content for article 1 (Leadership article)
    return (
      <div className="space-y-8 text-white/90 leading-relaxed">
        <p className="text-xl font-medium text-white leading-relaxed">
          In the tapestry of human ambition, the pursuit of leadership positions has been both glorified and scrutinized. Within educational institutions especially, the race for student leadership roles often reveals deeper psychological and social dynamics that extend beyond the simple desire to serve.
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
    );
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
            {renderArticleContent()}
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