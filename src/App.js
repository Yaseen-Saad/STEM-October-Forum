import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getAllArticlesStats, toggleArticleLike } from './api';
import { getUserId, formatViewCount } from './utils/session';
import {
  Lightbulb,
  Users,
  Feather,
  Sparkles,
  MessageCircle,
  Award,
  Facebook,
  Instagram,
  Linkedin,
  ExternalLink,
  BookOpen,
  TrendingUp,
  Globe,
  Brain,
  Microscope,
  Rocket,
  Star,
  Heart,
  Eye,
  Calendar,
  User,
  ChevronDown,
  Menu,
  X,
  AlertCircle,
  ArrowRight,
  Zap
} from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const taglineRef = useRef(null);
  const introRef = useRef(null);
  const buttonRef = useRef(null);
  const statsRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [articleStats, setArticleStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Newsletter state
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(''); // '', 'loading', 'success', 'error'

  // Articles data
  const featuredArticles = [
    {
      id: 1,
      title: "The Allure of the Crown: When Leadership Becomes a Misunderstood Pursuit",
      excerpt: "This philosophical exploration delves into the complex psychology behind leadership aspirations, examining how personal insecurities, societal expectations, and the desire for validation can transform genuine leadership into a performative pursuit of power.",
      author: "The Editorial Team",
      date: "July 25, 2025",
      readTime: "8 min read",
      category: "Philosophy",
      views: "0",
      likes: "0",
      featured: true,
      color: "accent-purple"
    },
    // {
    //   id: 2,
    //   title: "Navigating Academic Pressure: A Student's Perspective on Excellence vs. Well-being",
    //   excerpt: "In the relentless pursuit of academic excellence, many students find themselves caught between the desire to succeed and the need to maintain their mental and physical well-being. This personal reflection explores the delicate balance between high achievement and sustainable living as a student.",
    //   author: "Ahmed Hassan",
    //   date: "July 22, 2025",
    //   readTime: "6 min read",
    //   category: "Student Life",
    //   views: "0",
    //   likes: "0",
    //   featured: false,
    //   color: "primary-blue"
    // }
  ];

  // Function to load article stats from MongoDB
  const loadArticleStats = async () => {
    try {
      setLoading(true);
      const stats = await getAllArticlesStats();
      setArticleStats(stats);
      setError(null);
    } catch (err) {
      console.error('Failed to load article stats:', err);
      setError('Failed to load article data');
      // Fallback to static data if API fails
      setArticleStats({});
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate total views from all articles
  const calculateTotalViews = () => {
    if (loading || Object.keys(articleStats).length === 0) {
      return "0" // Fallback value
    }

    const totalViews = Object.values(articleStats).reduce((sum, stats) => sum + (stats.views || 0), 0);
    return formatViewCount(totalViews);
  };

  // Function to calculate total comments from all articles
  const calculateTotalComments = () => {
    if (loading || Object.keys(articleStats).length === 0) {
      return "0"; // Fallback value
    }

    // Use totals from backend if available
    if (articleStats._totals) {
      return articleStats._totals.comments.toString();
    }

    const totalComments = Object.values(articleStats).reduce((sum, stats) => sum + (stats.comments || 0), 0);
    return totalComments.toString();
  };

  // Function to get dynamic article count
  const getArticleCount = () => {
    if (loading || Object.keys(articleStats).length === 0) {
      return "6"; // Fallback value
    }

    // Use totals from backend if available
    if (articleStats._totals) {
      return articleStats._totals.articles.toString();
    }

    // Count the articles from stats (excluding _totals)
    const articleCount = Object.keys(articleStats).filter(key => key !== '_totals').length;
    return articleCount.toString();
  };

  const forumStats = [
    { label: "Articles", value: getArticleCount(), icon: BookOpen },
    { label: "Contributors", value: "5", icon: Users },
    { label: "Views", value: calculateTotalViews(), icon: Eye },
    { label: "Discussions", value: calculateTotalComments(), icon: MessageCircle }
  ];

  // Function to initialize scroll observers for animation
  const initScrollAnimations = () => {
    // Create an Intersection Observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    // Observe all elements with animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);

      // Set stagger indexes for child items
      el.querySelectorAll('.stagger-item').forEach((item, index) => {
        item.style.setProperty('--item-index', index);
      });
    });

    return observer;
  };

  useEffect(() => {
    // Timer for live clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Load article stats from MongoDB
    loadArticleStats();

    // Add page visibility listener to refresh stats when user returns
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadArticleStats();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Initialize scroll animations
    const scrollObserver = initScrollAnimations();

    // Simple fade-in animations
    const tl = gsap.timeline();

    tl.fromTo(titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" }
    )
      .fromTo(taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" },
        "-=0.5"
      )
      .fromTo(introRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" },
        "-=0.5"
      )
      .fromTo(buttonRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" },
        "-=0.5"
      )
      .fromTo(statsRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power1.out" },
        "-=0.5"
      );

    // Animation for on-scroll elements is now handled by Intersection Observer

    // Card animations are now handled by CSS and Intersection Observer

    // Text animations are now handled by CSS and Intersection Observer
    document.querySelectorAll('.text-reveal').forEach(text => {
      text.classList.add('stagger-item');
    });

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      if (scrollObserver) {
        scrollObserver.disconnect();
      }
    };
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to handle article like/unlike using MongoDB
  const handleArticleLike = async (articleId) => {
    try {
      const userId = getUserId();
      const currentLikeStatus = isArticleLiked(articleId);
      const action = currentLikeStatus ? 'unlike' : 'like';

      const result = await toggleArticleLike(articleId, userId, action);

      // Update local state
      setArticleStats(prev => ({
        ...prev,
        [articleId]: {
          ...prev[articleId],
          likes: result.likes
        }
      }));

      // Update localStorage for immediate UI feedback
      const savedLikes = localStorage.getItem('userLikes') || '{}';
      const userLikes = JSON.parse(savedLikes);
      userLikes[articleId] = !currentLikeStatus;
      localStorage.setItem('userLikes', JSON.stringify(userLikes));

    } catch (error) {
      console.error('Failed to toggle like:', error);
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
          source: 'homepage',
          articleId: null
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

  // Function to get display view count from MongoDB
  const getViewCount = (article) => {
    const stats = articleStats[article.id];
    if (stats && stats.views !== undefined) {
      return formatViewCount(stats.views);
    }
    // Fallback to article's static view count
    return article.views;
  };

  // Function to get display like count from MongoDB
  const getLikeCount = (article) => {
    const stats = articleStats[article.id];
    if (stats && stats.likes !== undefined) {
      return stats.likes.toString();
    }
    // Fallback to article's static like count
    return article.likes;
  };

  // Function to get comment count from MongoDB
  const getCommentCount = (article) => {
    const stats = articleStats[article.id];
    if (stats && stats.comments !== undefined) {
      return stats.comments.toString();
    }
    // Fallback to 0 if no data available
    return "0";
  };

  // Function to check if an article is liked
  const isArticleLiked = (articleId) => {
    const savedLikes = localStorage.getItem('userLikes') || '{}';
    const userLikes = JSON.parse(savedLikes);
    return !!userLikes[articleId];
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-light overflow-x-hidden relative">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 glass-dark">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <div className="p-2 bg-gradient-icon-consistent rounded-lg mr-3 shadow-glow">
                <BookOpen className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-white">
                STEM October Forum
              </h1>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('about')}
              className="text-lg text-white hover:text-primary-400 transition-all duration-300 font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection('articles')}
              className="text-lg text-white hover:text-primary-400 transition-all duration-300 font-medium relative group"
            >
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button
              onClick={() => scrollToSection('contribute')}
              className="text-lg text-white hover:text-primary-400 transition-all duration-300 font-medium relative group"
            >
              Contribute
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button onClick={() => scrollToSection('newsletter')} className="btn-primary text-sm">
              Join Community
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-secondary-400 hover:text-primary-400 transition-colors p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full glass-dark border-t border-white/10 py-4">
            <div className="flex flex-col space-y-4 px-6">
              <button onClick={() => scrollToSection('about')} className="text-left text-white hover:text-primary-400 transition-colors py-2">About</button>
              <button onClick={() => scrollToSection('articles')} className="text-left text-white hover:text-primary-400 transition-colors py-2">Articles</button>
              <button onClick={() => scrollToSection('contribute')} className="text-left text-white hover:text-primary-400 transition-colors py-2">Contribute</button>
              <button onClick={() => scrollToSection('newsletter')} className="btn-primary text-sm">Join Community</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section
        id="home"
        ref={heroRef}
        className="relative mt-16 min-h-screen flex items-center justify-center text-center bg-gradient-hero overflow-hidden"
      >
        {/* Modern Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500 opacity-20 blur-3xl rounded-full animate-float"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent-500 opacity-20 blur-3xl rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-500 opacity-10 blur-3xl rounded-full animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        {/* Modern Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8">
          {/* Hero Content */}
          <div className="mb-8">
            <h1
              ref={titleRef}
              className="text-6xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none mb-8 relative"
            >
              <span className="text-gradient">STEM</span>{' '}
              <span className="text-white">October</span>{' '}
              <span className="text-gradient-secondary">Forum</span>
            </h1>

            <p
              ref={taglineRef}
              className="text-2xl lg:text-4xl xl:text-5xl font-bold mb-8"
            >
              <span className="text-gradient">Igniting Minds</span>{', '}
              <span className="text-gradient-secondary">Shaping Futures</span>{', '}
              <span className="text-gradient-blue">Building Community</span>
            </p>

            <p
              ref={introRef}
              className="text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12 font-light"
            >
              A sophisticated intellectual sanctuary where curiosity meets discourse,
              empowering the next generation of critical thinkers and changemakers through
              thoughtful dialogue and shared wisdom.
            </p>
          </div>

          {/* Call-to-Action */}
          <div ref={buttonRef} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <button
              onClick={() => scrollToSection('articles')}
              className="btn-primary text-xl px-12 py-4 flex items-center gap-3 group"
            >
              <BookOpen size={24} />
              <span>Explore Articles</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollToSection('contribute')}
              className="btn-secondary text-xl px-12 py-4 flex items-center gap-3 group"
            >
              <Feather size={24} />
              <span>Submit Article</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Statistics */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-20">
            {forumStats.map((stat, index) => (
              <div key={index} className="text-center group card-modern">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-gradient-icon-consistent rounded-xl shadow-glow">
                    <stat.icon className="text-white" size={28} />
                  </div>
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-padding bg-gradient-reverse-flow relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-100 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-500 opacity-20 blur-3xl rounded-full"></div>

        <div className="animate-on-scroll max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2
              ref={titleRef}
              className="text-6xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-none mb-8 relative"
            >
              <span className="text-white">Our Vission &  Mission</span>{' '}
            </h2>

            <p className="text-xl text-primary-200 max-w-4xl mx-auto leading-relaxed">
              Fostering intellectual growth through thoughtful discourse and authentic student voices
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Vision Card */}
            <div className="card-modern p-8 group hover:border-white/30 hover:shadow-lg hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center mb-8">
                <div className="p-4 bg-gradient-icon-consistent rounded-2xl mr-6 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                  <Sparkles className="text-white" size={40} />
                </div>
                <h3 className="text-4xl font-bold text-white">Vision</h3>
              </div>
              <p className="text-white text-lg leading-relaxed mb-6">
                To foster a vibrant intellectual community where the voices of STEM High School students
                ignite thoughtful discourse, illuminate shared experiences, and inspire personal and
                collective growth through authentic dialogue and critical thinking.
              </p>
            </div>

            {/* Mission Card */}
            <div className="card-modern p-8 group hover:border-white/30 hover:shadow-lg hover:bg-white/10 transition-all duration-500">
              <div className="flex items-center mb-8">
                <div className="p-4 bg-gradient-icon-consistent rounded-2xl mr-6 shadow-glow group-hover:shadow-glow-lg transition-all duration-300">
                  <Award className="text-white" size={40} />
                </div>
                <h3 className="text-4xl font-bold text-white">Mission</h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    icon: MessageCircle,
                    text: "Provide a dynamic platform for students to engage in constructive philosophical debates on relevant topics",
                    color: "text-primary-200"
                  },
                  {
                    icon: Users,
                    text: "Create a safe and supportive space for students to candidly share their school-life experiences, including challenges and triumphs",
                    color: "text-primary-200"
                  },
                  {
                    icon: Lightbulb,
                    text: "Celebrate student achievements and foster a culture of open communication, empathy, and critical thinking within the school community",
                    color: "text-primary-200"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start group/item">
                    <item.icon className={`mr-4 mt-1 ${item.color} flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`} size={20} />
                    <p className="text-purple">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="animate-on-scroll">
            <h3 className="text-4xl font-bold text-center text-gradient mb-16">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Intellectual Curiosity",
                  description: "Encouraging deep thinking and questioning of established norms",
                  gradient: "bg-gradient-icon-consistent"
                },
                {
                  icon: Heart,
                  title: "Authentic Expression",
                  description: "Valuing genuine voices and personal experiences",
                  gradient: "bg-gradient-icon-consistent"
                },
                {
                  icon: Globe,
                  title: "Global Perspective",
                  description: "Embracing diverse viewpoints and cross-cultural understanding",
                  gradient: "bg-gradient-icon-consistent"
                }
              ].map((value, index) => (
                <div key={index} className="card-modern text-center group hover:border-white/30 hover:shadow-lg hover:bg-white/10 transition-all duration-500">
                  <div className={`inline-flex p-6 ${value.gradient} rounded-2xl mb-6 shadow-glow group-hover:shadow-glow-lg transition-all duration-300`}>
                    <value.icon className="text-white" size={48} />
                  </div>
                  <h4 className="text-2xl font-bold text-gradient mb-4">{value.title}</h4>
                  <p className="text-primary-100 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="section-padding bg-gradient-surface relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-accent-500 opacity-10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-primary-500 opacity-10 blur-3xl rounded-full"></div>

        <div className="animate-on-scroll max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-gradient mb-8">
              Latest Insights & Perspectives
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed">
              Thought-provoking articles that challenge perspectives and inspire meaningful dialogue
            </p>
          </div>

          {/* Featured Article Spotlight */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold text-gradient mb-8 flex items-center">
              <div className="p-2 bg-gradient-icon-consistent rounded-xl mr-3 shadow-glow">
                <Star className="text-white" size={24} />
              </div>
              Featured Spotlight
            </h3>
            <div className="card-modern p-8 group cursor-pointer hover:scale-[1.02] transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center mb-4">
                    <span className="px-4 py-2 bg-gradient-primary text-white text-sm font-semibold rounded-full mr-4 shadow-glow">
                      {featuredArticles[0].category}
                    </span>
                    <span className="text-secondary-400 text-sm font-medium">Featured Article</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold text-gradient mb-6 group-hover:text-primary-400 transition-colors duration-300">
                    {featuredArticles[0].title}
                  </h3>
                  <p className="text-white/90 text-lg leading-relaxed mb-6">
                    {featuredArticles[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between text-white/70 text-sm">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <User className="mr-2 text-primary-400" size={16} />
                        {featuredArticles[0].author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 text-secondary-400" size={16} />
                        {featuredArticles[0].date}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="mr-2 text-accent-400" size={16} />
                        {featuredArticles[0].readTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1 flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center text-white/70">
                        <Eye className="mr-2 text-primary-400" size={16} />
                        {getViewCount(featuredArticles[0])} views
                      </div>
                      <div
                        className={`flex items-center ${isArticleLiked(featuredArticles[0].id) ? 'text-primary-500' : 'text-white/70'} cursor-pointer hover:text-primary-400 transition-colors`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleArticleLike(featuredArticles[0].id);
                        }}
                      >
                        <Heart className="mr-2" size={16} fill={isArticleLiked(featuredArticles[0].id) ? "currentColor" : "none"} />
                        {getLikeCount(featuredArticles[0])} likes
                      </div>
                      <div className="flex items-center text-white/70">
                        <MessageCircle className="mr-2 text-accent-400" size={16} />
                        {getCommentCount(featuredArticles[0])} comments
                      </div>
                    </div>
                    <a
                      href={`/article/${featuredArticles[0].id}`}
                      className="w-full btn-primary text-lg py-4 flex items-center justify-center group/btn"
                    >
                      Read Full Article
                      <ArrowRight className="ml-3 group-hover/btn:translate-x-1 transition-transform" size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredArticles.slice(1).map((article, index) => (
              <div key={article.id} className="card-modern group cursor-pointer h-full flex flex-col hover:scale-105 transition-all duration-500">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gradient-primary text-white text-sm font-semibold rounded-full shadow-glow">
                      {article.category}
                    </span>
                    {article.featured && (
                      <Star className="text-primary-400" size={20} />
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-white  mb-4 group-hover:text-white transition-all duration-300 line-clamp-3">
                    {article.title}
                  </h3>

                  <p className="text-white/80 text-base leading-relaxed mb-6 line-clamp-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between text-white/70 text-sm mb-4">
                    <div className="flex items-center">
                      <User className="mr-1 text-primary-400" size={14} />
                      <span className="mr-4">{article.author}</span>
                      <Calendar className="mr-1 text-secondary-400" size={14} />
                      <span>{article.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-white/70 text-sm mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="mr-1 text-secondary-400" size={14} />
                        {getViewCount(article)}
                      </div>
                      <div
                        className={`flex items-center ${isArticleLiked(article.id) ? 'text-primary-500' : 'text-white/70'} cursor-pointer hover:text-primary-400 transition-colors`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleArticleLike(article.id);
                        }}
                      >
                        <Heart
                          className="mr-1"
                          size={14}
                          fill={isArticleLiked(article.id) ? "currentColor" : "none"}
                        />
                        {getLikeCount(article)}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="mr-1 text-accent-400" size={14} />
                        {getCommentCount(article)}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="mr-1 text-accent-400" size={14} />
                        {article.readTime}
                      </div>
                    </div>
                  </div>

                  <a
                    href={`/article/${article.id}`}
                    className="w-full btn-secondary text-md py-3 flex items-center justify-center group/btn"
                  >
                    Read Article
                    <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform" size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-16">
            <button className="btn-secondary text-xl px-12 py-4 flex items-center mx-auto group">
              <TrendingUp className="mr-3" size={24} />
              Load More Articles
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Contribute Section */}
      <section id="contribute" className="section-padding bg-gradient-smooth-flow relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-100 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500 opacity-20 blur-3xl rounded-full"></div>

        <div className="animate-on-scroll max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl lg:text-6xl font-black text-white mb-8">
              <span>Share</span> <span>Your</span> <span>Voice</span>
            </h2>
            <p className="text-xl text-white/80 max-w-4xl mx-auto leading-relaxed mb-8">
              We invite all STEM High School students to share their unique perspectives and insights.
              Your voice is what makes our forum thrive, fostering deeper understanding and richer discussions.
            </p>
            <div className="inline-flex items-center px-6 py-3 glass rounded-full">
              <Rocket className="mr-3 text-primary-400" size={24} />
              <span className="text-white font-semibold">Now accepting submissions for August issue</span>
            </div>
          </div>

          {/* Enhanced Submission Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {[
              {
                icon: Lightbulb,
                title: "Spark Philosophical Discussion",
                description: "Present thought-provoking ideas that challenge conventional thinking and encourage deep reflection",
                gradient: "bg-gradient-dark"
              },
              {
                icon: Users,
                title: "Focus on Ideas, Not Individuals",
                description: "Keep discussions respectful, constructive, and centered on concepts rather than personal attacks",
                gradient: "bg-gradient-dark"
              },
              {
                icon: Feather,
                title: "Original & Well-Reasoned",
                description: "Provide unique insights backed by solid reasoning, evidence, and personal reflection",
                gradient: "bg-gradient-dark"
              }
            ].map((guideline, index) => (
              <div key={index} className="card-modern text-center group hover:border-white/30 hover:shadow-lg hover:bg-white/10 transition-all duration-500">
                <div className={`inline-flex p-6 ${guideline.gradient} rounded-3xl mb-8 group-hover:shadow-glow-lg transition-all duration-300 shadow-glow`}>
                  <guideline.icon className="text-white" size={48} />
                </div>
                <h3 className="text-2xl font-bold text-white   mb-4">{guideline.title}</h3>
                <p className="text-white/80 leading-relaxed">{guideline.description}</p>
              </div>
            ))}
          </div>

          {/* Article Categories We're Looking For */}
          <div className="mb-20">
            <h3 className="text-4xl font-bold text-center text-white mb-12">Topics We're Exploring</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Philosophy & Ethics", icon: Brain, count: 0 },
                { name: "Student Life", icon: Users, count: 0 },
                // { name: "Technology & AI", icon: Microscope, count: 15 },
                { name: "Environment", icon: Globe, count: 0 },
                { name: "Social Issues", icon: MessageCircle, count: 0 },
                { name: "Mental Health", icon: Heart, count: 0 },
                // { name: "Innovation", icon: Rocket, count: 11 },
                { name: "Leadership", icon: Award, count: 1 }
              ].map((category, index) => (
                <div key={index} className="card-modern text-center group hover:scale-105 transition-all duration-300">
                  <category.icon className="text-primary-400 mx-auto mb-3 group-hover:text-secondary-400 transition-colors duration-300" size={32} />
                  <h4 className="text-lg font-semibold text-white mb-1">{category.name}</h4>
                  <p className="text-sm text-white/60">{category.count} articles</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              Ready to contribute an article that sparks thought and conversation?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="https://forms.gle/5qPToJ2XDLptFFTx8"
                className="btn-primary text-xl px-12 py-4 flex items-center space-x-3 group"
              >
                <Feather size={24} />
                <span>Submit Your Article</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
            {/* Newsletter Signup Section */}
      <section id="newsletter" className="py-16 px-8 lg:px-16 from-primary-900/30 to-secondary-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <div id='subscribe' className="glass rounded-2xl p-8 border border-white/10">
            <h3 className="text-3xl font-bold text-gradient mb-6">Stay Updated</h3>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Get the latest insights on leadership, education, and personal development delivered to your inbox.
            </p>

            {newsletterStatus === 'success' ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6 text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-green-400" size={32} />
                </div>
                <p className="text-green-400 font-semibold text-lg">Thank you for subscribing!</p>
                <p className="text-green-300 text-sm mt-2">You'll receive our latest articles in your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-primary-400 transition-colors duration-300 text-lg"
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
                  className="w-full bg-gradient-icon-consistent hover:shadow-glow text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {newsletterStatus === 'loading' ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Subscribing...
                    </>
                  ) : (
                    'Subscribe to Newsletter'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

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

export default App;