import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
  AlertCircle
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
  const [articleViews, setArticleViews] = useState(() => {
    // Try to load view counts from localStorage, or initialize with default values
    const savedViews = localStorage.getItem('articleViews');
    return savedViews ? JSON.parse(savedViews) : {};
  });
  const [articleLikes, setArticleLikes] = useState(() => {
    // Try to load like counts from localStorage, or initialize with default values
    const savedLikes = localStorage.getItem('articleLikes');
    return savedLikes ? JSON.parse(savedLikes) : {};
  });

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
      views: "2.4k",
      likes: "127",
      featured: true,
      color: "accent-purple"
    },
    {
      id: 2,
      title: "Navigating Academic Pressure: A Student's Perspective on Excellence vs. Well-being",
      excerpt: "An honest and vulnerable exploration of the modern student experience, examining the delicate balance between academic achievement and mental health. This piece offers practical strategies for maintaining authenticity while pursuing excellence.",
      author: "Ahmed Hassan",
      date: "July 22, 2025",
      readTime: "6 min read",
      category: "Student Life",
      views: "3.1k",
      likes: "203",
      featured: true,
      color: "accent-teal"
    },
    {
      id: 3,
      title: "The Ethics of Artificial Intelligence in Education: Promise and Peril",
      excerpt: "As AI becomes increasingly integrated into educational systems, we examine the ethical implications, potential benefits, and risks. How can students maintain academic integrity while leveraging these powerful tools responsibly?",
      author: "Omar Mansour",
      date: "July 20, 2025",
      readTime: "10 min read",
      category: "Technology",
      views: "1.8k",
      likes: "156",
      featured: false,
      color: "accent-orange"
    },
    {
      id: 4,
      title: "The Philosophy of Failure: Redefining Success in Academic Environments",
      excerpt: "A thought-provoking analysis of how educational institutions and society at large conceptualize failure, and why reframing our relationship with setbacks might be the key to genuine learning and growth.",
      author: "Yasmin El-Rashid",
      date: "July 18, 2025",
      readTime: "7 min read",
      category: "Philosophy",
      views: "2.7k",
      likes: "189",
      featured: false,
      color: "accent-purple"
    },
    {
      id: 5,
      title: "Climate Change and Young Activism: The Power of Student Voices",
      excerpt: "Exploring the role of young people in environmental advocacy, this piece examines how students can effectively contribute to climate solutions while balancing their academic responsibilities and personal development.",
      author: "Nour Abdallah",
      date: "July 15, 2025",
      readTime: "9 min read",
      category: "Environment",
      views: "4.2k",
      likes: "312",
      featured: false,
      color: "accent-teal"
    },
    {
      id: 6,
      title: "The Digital Divide: Technology Access and Educational Equity",
      excerpt: "An investigation into how technology access affects educational opportunities, examining both the challenges and innovative solutions emerging in our increasingly digital learning landscape.",
      author: "Karim Mahmoud",
      date: "July 12, 2025",
      readTime: "8 min read",
      category: "Social Issues",
      views: "1.9k",
      likes: "143",
      featured: false,
      color: "accent-orange"
    }
  ];

  // Function to calculate total views and format it
  const calculateTotalViews = () => {
    // Start with the base view count
    let baseViews = 12400; // 12.4k
    
    // Add dynamic views from localStorage
    const totalAdditionalViews = Object.values(articleViews).reduce((sum, views) => sum + views, 0);
    const total = baseViews + totalAdditionalViews;
    
    // Format as kilo format if >= 1000
    if (total >= 1000) {
      return (total / 1000).toFixed(1) + 'k';
    }
    return total.toString();
  };

  const forumStats = [
    { label: "Articles Published", value: "47", icon: BookOpen },
    { label: "Student Contributors", value: "23", icon: Users },
    { label: "Monthly Readers", value: calculateTotalViews(), icon: Eye },
    { label: "Discussion Topics", value: "156", icon: MessageCircle }
  ];

  useEffect(() => {
    // Timer for live clock
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    // Load views and likes from localStorage when component mounts
    const savedViews = localStorage.getItem('articleViews');
    const savedLikes = localStorage.getItem('articleLikes');
    
    if (savedViews) {
      setArticleViews(JSON.parse(savedViews));
    }
    
    if (savedLikes) {
      setArticleLikes(JSON.parse(savedLikes));
    }

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

    // Simple scroll-triggered animations
    gsap.utils.toArray('.animate-section').forEach((section) => {
      gsap.fromTo(section, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power1.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Simple card animations
    gsap.utils.toArray('.stagger-item').forEach((item, index) => {
      gsap.fromTo(item,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: index * 0.1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    // Text animations
    gsap.utils.toArray('.text-reveal').forEach((text) => {
      gsap.fromTo(text,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power1.out",
          scrollTrigger: {
            trigger: text,
            start: "top 85%",
            toggleActions: "play none none none"
          }
        }
      );
    });

    return () => {
      clearInterval(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
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
  
  // Function to handle article view count
  const handleArticleView = (articleId) => {
    setArticleViews(prevViews => {
      const newViews = { 
        ...prevViews, 
        [articleId]: (prevViews[articleId] || 0) + 1 
      };
      // Store updated views in localStorage
      localStorage.setItem('articleViews', JSON.stringify(newViews));
      return newViews;
    });
  };
  
  // Function to handle article like/unlike
  const handleArticleLike = (articleId) => {
    setArticleLikes(prevLikes => {
      const isLiked = prevLikes[articleId];
      const newLikes = { 
        ...prevLikes, 
        [articleId]: !isLiked 
      };
      // Store updated likes in localStorage
      localStorage.setItem('articleLikes', JSON.stringify(newLikes));
      return newLikes;
    });
  };
  
  // Function to get display view count (combining initial with dynamic counts)
  const getViewCount = (article) => {
    const baseViews = parseInt(article.views.replace(/[^0-9]/g, '')) || 0;
    const additionalViews = articleViews[article.id] || 0;
    const totalViews = baseViews + additionalViews;
    
    // Format view count similar to original format (e.g., "2.4k")
    if (totalViews >= 1000) {
      return (totalViews / 1000).toFixed(1) + 'k';
    }
    return totalViews.toString();
  };
  
  // Function to get display like count (combining initial with dynamic counts)
  const getLikeCount = (article) => {
    const baseLikes = parseInt(article.likes) || 0;
    const isLiked = articleLikes[article.id];
    const additionalLikes = isLiked ? 1 : 0;
    return (baseLikes + additionalLikes).toString();
  };
  
  // Function to check if an article is liked
  const isArticleLiked = (articleId) => {
    return !!articleLikes[articleId];
  };

  return (
    <div className="min-h-screen bg-background-dark text-text-light overflow-x-hidden relative">
      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-br from-gradient-dark-purple-start to-gradient-dark-purple-end backdrop-blur-md py-4 px-6 lg:px-16 shadow-dark border-b border-gradient-purple-end/20">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-wide cursor-pointer flex items-center"
                onClick={() => scrollToSection('home')}>
              <Sparkles className="mr-2 text-gradient-light-pink-end" size={28} />
              <span className="bg-gradient-purple bg-clip-text text-transparent">STEM</span>{' '}
              <span className="text-text-light">October</span>{' '}
              <span className="bg-gradient-blue bg-clip-text text-transparent">Forum</span>
            </h1>
            <div className="hidden lg:block text-xs text-gradient-blue-start">
              <div>{formatDate(currentTime)}</div>
              <div className="font-mono">{formatTime(currentTime)}</div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-lg text-text-light hover:text-gradient-blue-start transition-all duration-300 font-medium relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-purple-end transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('articles')}
              className="text-lg text-text-light hover:text-gradient-light-pink-end transition-all duration-300 font-medium relative group"
            >
              Articles
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-light-pink-end transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contribute')}
              className="text-lg text-text-light hover:text-gradient-blue-start transition-all duration-300 font-medium relative group"
            >
              Contribute
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-blue-start transition-all duration-300 group-hover:w-full"></span>
            </button>
            <button className="bg-gradient-to-r from-gradient-light-pink-end to-gradient-purple-end text-text-light text-sm px-6 py-2 rounded-lg hover:from-gradient-purple-end hover:to-gradient-light-pink-end transition-all duration-300 shadow-dark">
              Join Community
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gradient-blue-start hover:text-gradient-light-pink-end transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-gradient-dark-purple-mid/80 backdrop-blur-md border-t border-gradient-purple-end/30 py-4">
            <div className="flex flex-col space-y-4 px-6">
              <button onClick={() => scrollToSection('about')} className="text-left text-text-light hover:text-gradient-light-pink-end transition-colors">About</button>
              <button onClick={() => scrollToSection('articles')} className="text-left text-text-light hover:text-gradient-purple-end transition-colors">Articles</button>
              <button onClick={() => scrollToSection('contribute')} className="text-left text-text-light hover:text-gradient-blue-start transition-colors">Contribute</button>
              <button className="bg-gradient-to-r from-gradient-light-pink-end to-gradient-purple-end text-text-light text-sm px-6 py-2 rounded-lg hover:from-gradient-purple-end hover:to-gradient-light-pink-end transition-all duration-300 shadow-lg self-start">Join Community</button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section 
        id="home" 
        ref={heroRef}
        className="relative mt-16 min-h-screen flex items-center justify-center text-center bg-background-dark overflow-hidden"
      >
        {/* Background Gradients using the defined palette from tailwind config */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-light-pink-end opacity-10 blur-[120px] rounded-full animate-pulse-gradient"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-purple-end opacity-10 blur-[120px] rounded-full animate-breathe"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-blue-start opacity-5 blur-[100px] rounded-full animate-gentle-float"></div>
        </div>
        
        {/* Simple Grid Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-8">
          {/* Hero Content */}
          <div className="mb-8">
            <h1 
              ref={titleRef}
              className="text-6xl lg:text-8xl xl:text-9xl font-bold tracking-tighter leading-none mb-6 relative"
            >
              <span className="bg-gradient-purple bg-clip-text text-transparent">STEM</span>{' '}
              <span className="text-text-light">October</span>{' '}
              <span className="bg-gradient-blue bg-clip-text text-transparent">Forum</span>
            </h1>
            
            <p 
              ref={taglineRef}
              className="text-2xl lg:text-4xl xl:text-5xl bg-gradient-pink bg-clip-text text-transparent font-bold mb-6"
            >
              Igniting Minds, Shaping Futures, Building Community
            </p>
            
            <p 
              ref={introRef}
              className="text-xl lg:text-2xl text-white max-w-4xl mx-auto leading-relaxed mb-8 font-light"
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
              className="bg-gradient-purple text-text-light text-xl px-10 py-4 rounded-lg hover:opacity-90 transition-opacity duration-300 shadow-lg flex items-center gap-3"
            >
              <BookOpen size={24} />
              <span>Explore Articles</span>
              <ChevronDown size={20} />
            </button>
            <button 
              onClick={() => scrollToSection('contribute')}
              className="px-10 py-4 bg-transparent border-2 border-gradient-purple-end text-gradient-light-pink-end hover:bg-gradient-purple hover:text-text-light text-xl font-bold rounded-lg transition-all duration-300 flex items-center gap-3"
            >
              <Feather size={24} />
              <span>Submit Article</span>
            </button>
          </div>

          {/* Statistics */}
          <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {forumStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="flex justify-center mb-2">
                  <stat.icon className="text-gradient-light-pink-end" size={32} />
                </div>
                <div className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-sm text-gradient-blue-start">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-8 lg:px-16 bg-gradient-to-br from-gradient-dark-purple-start via-gradient-dark-purple-mid to-gradient-dark-purple-end relative">
        <div className="animate-section max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl lg:text-7xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-8 text-reveal">
              Our Vision & Mission
            </h2>
            <p className="text-2xl text-white max-w-4xl mx-auto leading-relaxed">
              Fostering intellectual growth through thoughtful discourse and authentic student voices
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
            {/* Vision Card */}
            <div className="stagger-item p-8 bg-gradient-dark-purple-mid rounded-lg border border-gradient-purple-end/30 shadow-dark hover:bg-gradient-to-tr hover:from-gradient-purple-mid hover:to-gradient-dark-purple-mid transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="p-4 bg-gradient-to-r from-gradient-light-pink-end to-gradient-purple-end rounded-lg mr-6 shadow-lg">
                  <Sparkles className="text-text-light" size={40} />
                </div>
                <h3 className="text-4xl font-bold text-gradient-purple-end">Vision</h3>
              </div>
              <p className="text-white text-xl leading-relaxed mb-6">
                To foster a vibrant intellectual community where the voices of STEM High School students 
                ignite thoughtful discourse, illuminate shared experiences, and inspire personal and 
                collective growth through authentic dialogue and critical thinking.
              </p>
              <div className="flex items-center text-gradient-blue-start font-semibold">
                <Eye className="mr-2" size={20} />
                Inspiring Future Leaders
              </div>
            </div>

            {/* Mission Card */}
            <div className="stagger-item p-8 bg-gradient-dark-purple-mid rounded-lg border border-gradient-purple-end/30 shadow-dark hover:bg-gradient-to-tr hover:from-gradient-purple-mid hover:to-gradient-dark-purple-mid transition-all duration-300">
              <div className="flex items-center mb-8">
                <div className="p-4 bg-gradient-to-r from-gradient-blue-start to-gradient-light-pink-end rounded-lg mr-6 shadow-lg">
                  <Award className="text-text-light" size={40} />
                </div>
                <h3 className="text-4xl font-bold text-gradient-blue-start">Mission</h3>
              </div>
              <div className="space-y-6">
                {[
                  {
                    icon: MessageCircle,
                    text: "Provide a dynamic platform for students to engage in constructive philosophical debates on relevant topics",
                    color: "text-gradient-blue-start"
                  },
                  {
                    icon: Users,
                    text: "Create a safe and supportive space for students to candidly share their school-life experiences, including challenges and triumphs",
                    color: "text-gradient-light-pink-end"
                  },
                  {
                    icon: Lightbulb,
                    text: "Celebrate student achievements and foster a culture of open communication, empathy, and critical thinking within the school community",
                    color: "text-gradient-purple-end"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start group/item">
                    <item.icon className={`mr-4 mt-1 ${item.color} flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`} size={24} />
                    <p className="text-white text-lg leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className="animate-section">
            <h3 className="text-4xl font-bold text-center text-white mb-16">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Intellectual Curiosity",
                  description: "Encouraging deep thinking and questioning of established norms",
                  color: "bg-accent-purple"
                },
                {
                  icon: Heart,
                  title: "Authentic Expression",
                  description: "Valuing genuine voices and personal experiences",
                  color: "bg-accent-orange"
                },
                {
                  icon: Globe,
                  title: "Global Perspective",
                  description: "Embracing diverse viewpoints and cross-cultural understanding",
                  color: "bg-accent-teal"
                }
              ].map((value, index) => (
                <div key={index} className="stagger-item text-center p-6 bg-gradient-dark-purple-end rounded-lg border border-gradient-purple-end/30 shadow-dark">
                  <div className={`inline-flex p-6 bg-gradient-purple rounded-lg mb-6 shadow-lg`}>
                    <value.icon className="text-text-light" size={48} />
                  </div>
                  <h4 className="text-2xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-4">{value.title}</h4>
                  <p className="text-white text-lg leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section id="articles" className="py-32 px-8 lg:px-16 bg-gradient-dark-purple-end relative">
        <div className="animate-section max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl lg:text-7xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-8 text-reveal">
              Latest Insights & Perspectives
            </h2>
            <p className="text-2xl text-white max-w-4xl mx-auto leading-relaxed">
              Thought-provoking articles that challenge perspectives and inspire meaningful dialogue
            </p>
          </div>

          {/* Featured Article Spotlight */}
          <div className="mb-20">
            <h3 className="text-3xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-8 flex items-center">
              <Star className="mr-3 text-gradient-light-pink-end" size={32} />
              Featured Spotlight
            </h3>
            <div className="stagger-item p-8 bg-gradient-dark-purple-mid border border-gradient-purple-end/30 rounded-lg group cursor-pointer hover:border-gradient-purple-end transition-all duration-300 shadow-dark">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center mb-4">
                    <span className="px-3 py-1 bg-gradient-purple text-text-light text-sm font-bold rounded-full mr-4 shadow-lg">
                      {featuredArticles[0].category}
                    </span>
                    <span className="text-gradient-blue-start text-sm">Featured Article</span>
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-6 group-hover:text-gradient-light-pink-end transition-colors duration-300">
                    {featuredArticles[0].title}
                  </h3>
                  <p className="text-white text-lg leading-relaxed mb-6">
                    {featuredArticles[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between text-white text-sm">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <User className="mr-2 text-gradient-light-pink-end" size={16} />
                        {featuredArticles[0].author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-2 text-gradient-purple-end" size={16} />
                        {featuredArticles[0].date}
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="mr-2 text-gradient-light-pink-end" size={16} />
                        {featuredArticles[0].readTime}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-1 flex items-center">
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-white">
                        <Eye className="mr-2 text-gradient-light-pink-end" size={16} />
                        {getViewCount(featuredArticles[0])} views
                      </div>
                      <div 
                        className={`flex items-center ${isArticleLiked(featuredArticles[0].id) ? 'text-pink-500' : 'text-white'} cursor-pointer hover:text-pink-400 transition-colors`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleArticleLike(featuredArticles[0].id);
                        }}
                      >
                        <Heart className="mr-2 text-gradient-light-pink-end" size={16} fill={isArticleLiked(featuredArticles[0].id) ? "currentColor" : "none"} />
                        {getLikeCount(featuredArticles[0])} likes
                      </div>
                    </div>
                    <a 
                      href="/article/1" 
                      className="w-full bg-gradient-to-r from-gradient-light-pink-end to-gradient-purple-end text-text-light text-lg py-3 rounded-lg hover:from-gradient-purple-end hover:to-gradient-light-pink-end transition-all duration-300 shadow-lg flex items-center justify-center"
                      onClick={(e) => {
                        // Prevent navigating away in this demo
                        e.preventDefault();
                        handleArticleView(featuredArticles[0].id);
                        alert(`Viewed article: ${featuredArticles[0].title}`);
                      }}
                    >
                      Read Full Article
                      <ExternalLink className="ml-3" size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredArticles.slice(1).map((article, index) => (
              <div key={article.id} className="stagger-item card-enhanced group cursor-pointer h-full flex flex-col bg-gradient-dark-purple-mid p-6 rounded-lg border border-gradient-purple-end/30 hover:bg-gradient-to-tr hover:from-gradient-purple-mid hover:to-gradient-dark-purple-mid hover:border-gradient-blue-start/50 transition-all duration-300 shadow-dark">
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-gradient-light-pink-end to-gradient-purple-end text-text-light text-sm font-bold rounded-full shadow-lg">
                      {article.category}
                    </span>
                    {article.featured && (
                      <Star className="text-gradient-light-pink-end" size={20} />
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-4 group-hover:text-text-light transition-all duration-300 line-clamp-3">
                    {article.title}
                  </h3>
                  
                  <p className="text-white text-base leading-relaxed mb-6 line-clamp-4">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center justify-between text-white text-sm mb-4">
                    <div className="flex items-center">
                      <User className="mr-1 text-gradient-light-pink-end" size={14} />
                      <span className="mr-4">{article.author}</span>
                      <Calendar className="mr-1 text-gradient-light-pink-end" size={14} />
                      <span>{article.date}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-white text-sm mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Eye className="mr-1 text-gradient-blue-start" size={14} />
                        {getViewCount(article)}
                      </div>
                      <div 
                        className={`flex items-center ${isArticleLiked(article.id) ? 'text-pink-500' : 'text-white'} cursor-pointer hover:text-pink-400 transition-colors`}
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
                        <BookOpen className="mr-1 text-gradient-blue-start" size={14} />
                        {article.readTime}
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href={`/article/${article.id}`} 
                    className="w-full px-6 py-3 bg-accent-purple text-white text-md font-medium rounded-lg hover:bg-opacity-80 transition-colors duration-300 flex items-center justify-center"
                    onClick={(e) => {
                      // Prevent navigating away in this demo
                      e.preventDefault();
                      handleArticleView(article.id);
                      alert(`Viewed article: ${article.title}`);
                    }}
                  >
                    Read Article
                    <ExternalLink className="ml-2" size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-16">
            <button className="px-12 py-4 bg-transparent border-2 border-gradient-blue-start text-gradient-blue-start hover:bg-gradient-blue hover:text-text-light text-xl font-bold rounded-xl transition-all duration-300 ease-in-out flex items-center mx-auto shadow-lg">
              <TrendingUp className="mr-3" size={24} />
              Load More Articles
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Contribute Section */}
      <section id="contribute" className="py-32 px-8 lg:px-16 bg-gradient-to-br from-gradient-dark-purple-start via-gradient-dark-purple-mid to-gradient-dark-purple-end relative">
        <div className="animate-section max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl lg:text-7xl font-extrabold bg-gradient-blue bg-clip-text text-transparent mb-8 text-reveal">
              <span>Share</span> <span>Your</span> <span>Voice</span>
            </h2>
            <p className="text-2xl text-white max-w-4xl mx-auto leading-relaxed mb-8">
              We invite all STEM High School students to share their unique perspectives and insights. 
              Your voice is what makes our forum thrive, fostering deeper understanding and richer discussions.
            </p>
            <div className="inline-flex items-center px-6 py-3 bg-gradient-dark-purple-mid rounded-full border border-gradient-purple-end/30 shadow-dark">
              <Rocket className="mr-3 text-gradient-light-pink-end" size={24} />
              <span className="text-gradient-purple-end font-semibold">Now accepting submissions for August issue</span>
            </div>
          </div>
          
          {/* Enhanced Submission Guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
            {[
              {
                icon: Lightbulb,
                title: "Spark Philosophical Discussion",
                description: "Present thought-provoking ideas that challenge conventional thinking and encourage deep reflection",
                color: "from-amber-600 to-orange-700"
              },
              {
                icon: Users,
                title: "Focus on Ideas, Not Individuals",
                description: "Keep discussions respectful, constructive, and centered on concepts rather than personal attacks",
                color: "from-teal-600 to-emerald-700"
              },
              {
                icon: Feather,
                title: "Original & Well-Reasoned",
                description: "Provide unique insights backed by solid reasoning, evidence, and personal reflection",
                color: "from-purple-600 to-indigo-700"
              }
            ].map((guideline, index) => (
              <div key={index} className="stagger-item card-enhanced text-center group">
                <div className={`inline-flex p-6 bg-gradient-purple rounded-3xl mb-8 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <guideline.icon className="text-text-light" size={48} />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-4">{guideline.title}</h3>
                <p className="text-white text-lg leading-relaxed">{guideline.description}</p>
              </div>
            ))}
          </div>

          {/* Article Categories We're Looking For */}
          <div className="mb-20">
            <h3 className="text-4xl font-bold text-center text-gradient mb-12">Topics We're Exploring</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { name: "Philosophy & Ethics", icon: Brain, count: 12 },
                { name: "Student Life", icon: Users, count: 8 },
                { name: "Technology & AI", icon: Microscope, count: 15 },
                { name: "Environment", icon: Globe, count: 6 },
                { name: "Social Issues", icon: MessageCircle, count: 9 },
                { name: "Mental Health", icon: Heart, count: 7 },
                { name: "Innovation", icon: Rocket, count: 11 },
                { name: "Leadership", icon: Award, count: 5 }
              ].map((category, index) => (
                <div key={index} className="stagger-item text-center p-6 bg-gradient-dark-purple-mid rounded-xl border border-gradient-purple-end/30 hover:border-gradient-light-pink-end/50 transition-all duration-300 group shadow-dark">
                  <category.icon className="text-gradient-light-pink-end mx-auto mb-3 group-hover:text-gradient-blue-start transition-colors duration-300" size={32} />
                  <h4 className="text-lg font-semibold bg-gradient-blue bg-clip-text text-transparent mb-1">{category.name}</h4>
                  <p className="text-sm text-gradient-purple-end">{category.count} articles</p>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-2xl text-white mb-12 max-w-3xl mx-auto">
              Ready to contribute an article that sparks thought and conversation?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="mailto:contribute@stemoctoberforum.org"
                className="bg-gradient-purple text-text-light text-xl px-12 py-4 rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center space-x-3 shadow-lg"
              >
                <Feather size={24} />
                <span>Submit Your Article</span>
              </a>
              <button className="px-12 py-4 bg-transparent border-2 border-gradient-blue-start text-gradient-blue-start hover:bg-gradient-blue hover:text-text-light text-xl font-bold rounded-xl transition-all duration-300 ease-in-out flex items-center space-x-3">
                <MessageCircle size={24} />
                <span>Join Discussion</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-16 px-8 lg:px-16 bg-gradient-dark-purple-end border-t border-gradient-purple-end/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold mb-4 flex items-center">
                <Sparkles className="mr-3 text-gradient-light-pink-end" size={28} />
                <span className="bg-gradient-purple bg-clip-text text-transparent">STEM</span>{' '}
                <span className="text-text-light">October</span>{' '}
                <span className="bg-gradient-blue bg-clip-text text-transparent">Forum</span>
              </h3>
              <p className="text-white text-lg leading-relaxed mb-6 max-w-lg">
                Empowering the next generation of critical thinkers through thoughtful discourse 
                and authentic student voices.
              </p>
              <div className="flex space-x-4">
                <Facebook className="text-gradient-blue-start hover:text-gradient-light-pink-end transition-colors duration-200 cursor-pointer" size={28} />
                <Instagram className="text-gradient-blue-start hover:text-gradient-purple-end transition-colors duration-200 cursor-pointer" size={28} />
                <Linkedin className="text-gradient-blue-start hover:text-gradient-light-pink-end transition-colors duration-200 cursor-pointer" size={28} />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-6">Quick Links</h4>
              <div className="space-y-3">
                {['About Us', 'Latest Articles', 'Submit Article', 'Guidelines', 'Contact'].map((link, index) => (
                  <button key={index} className="block text-gradient-blue-start hover:text-gradient-light-pink-end transition-colors duration-200">
                    {link}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-6">Get in Touch</h4>
              <div className="space-y-3 text-white">
                <p>contribute@stemoctoberforum.org</p>
                <p>STEM High School for Boys</p>
                <p>6th of October City</p>
                <p>Giza, Egypt</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gradient-purple-end/20 flex flex-col md:flex-row items-center justify-between">
            <div className="flex flex-col">
              <p className="text-gradient-blue-start text-sm mb-2">
                &copy; 2025 STEM October Forum. All rights reserved. A Publication of STEM High School for Boys - 6th of October.
              </p>
              <p className="text-sm text-white flex items-center font-medium">
                <AlertCircle size={14} className="mr-2 text-gradient-light-pink-end" />
                <span>Currently at <span className="text-gradient-light-pink-end">stemoctobermagazine.org</span> • Moving to <span className="text-gradient-blue-start">octforum.new</span> soon</span>
              </p>
            </div>
            <div className="flex items-center space-x-4 text-white text-sm">
              <span>Made with</span>
              <Heart className="text-gradient-light-pink-end" size={16} />
              <span>by students, for students</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
