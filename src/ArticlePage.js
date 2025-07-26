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
import { Link } from 'react-router-dom';

function ArticlePage() {
  const articleId = 1; // This would typically come from a route parameter
  
  // State for view and like counts
  const [viewCount, setViewCount] = useState(() => {
    const savedViews = localStorage.getItem('articleViews');
    const parsedViews = savedViews ? JSON.parse(savedViews) : {};
    const baseViews = 2400; // 2.4k base views
    return baseViews + (parsedViews[articleId] || 0);
  });
  
  const [likeCount, setLikeCount] = useState(() => {
    const savedLikes = localStorage.getItem('articleLikes');
    const parsedLikes = savedLikes ? JSON.parse(savedLikes) : {};
    const baseLikes = 127;
    return baseLikes + (parsedLikes[articleId] ? 1 : 0);
  });
  
  const [isLiked, setIsLiked] = useState(() => {
    const savedLikes = localStorage.getItem('articleLikes');
    const parsedLikes = savedLikes ? JSON.parse(savedLikes) : {};
    return !!parsedLikes[articleId];
  });
  
  // Handle article view when page loads
  useEffect(() => {
    const savedViews = localStorage.getItem('articleViews');
    const parsedViews = savedViews ? JSON.parse(savedViews) : {};
    
    // Increment view count for this article
    const updatedViews = {
      ...parsedViews,
      [articleId]: (parsedViews[articleId] || 0) + 1
    };
    
    // Update localStorage
    localStorage.setItem('articleViews', JSON.stringify(updatedViews));
    
    // Update state
    setViewCount(prevCount => prevCount + 1);
  }, [articleId]);
  
  // Function to handle article like/unlike
  const handleLikeArticle = () => {
    const savedLikes = localStorage.getItem('articleLikes');
    const parsedLikes = savedLikes ? JSON.parse(savedLikes) : {};
    
    // Toggle like status for this article
    const newLikeStatus = !isLiked;
    const updatedLikes = {
      ...parsedLikes,
      [articleId]: newLikeStatus
    };
    
    // Update localStorage
    localStorage.setItem('articleLikes', JSON.stringify(updatedLikes));
    
    // Update state
    setIsLiked(newLikeStatus);
    setLikeCount(prevCount => newLikeStatus ? prevCount + 1 : prevCount - 1);
  };
  
  // Format view count (e.g., "2.4k")
  const formatViewCount = (count) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };
  
  return (
    <div className="min-h-screen bg-background-dark text-text-light relative">
      {/* Background Gradients using the defined palette from tailwind config */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-gradient-light-pink-end opacity-10 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full animate-pulse-gradient"></div>
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] md:w-[500px] md:h-[500px] bg-gradient-purple-end opacity-10 blur-[80px] sm:blur-[100px] md:blur-[120px] rounded-full animate-breathe"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] md:w-[800px] md:h-[800px] bg-gradient-blue-start opacity-5 blur-[60px] sm:blur-[80px] md:blur-[100px] rounded-full animate-gentle-float"></div>
      </div>
      
      {/* Article Header */}
      <header className="pt-24 sm:pt-28 md:pt-32 pb-10 sm:pb-14 md:pb-16 px-4 sm:px-8 lg:px-16 bg-transparent relative z-10">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-gradient-light-pink-end mb-6 sm:mb-8 group">
            <ArrowLeft className="mr-2 group-hover:text-gradient-light-pink-end transition-colors duration-300" size={18} />
            <span className="group-hover:bg-gradient-purple bg-clip-text text-transparent">Back to Articles</span>
          </Link>
          
          <div className="mb-4 sm:mb-6 flex flex-wrap items-center gap-2 sm:gap-0">
            <span className="px-3 py-1 bg-gradient-purple text-text-light text-sm font-bold rounded-full sm:mr-4 shadow-lg">
              Philosophy
            </span>
            <span className="text-gradient-blue-start text-sm">July 25, 2025</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight">
            The Allure of the Crown: When Leadership Becomes a Misunderstood Pursuit
          </h1>
          
          <div className="flex items-center mb-6 sm:mb-8">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-purple flex items-center justify-center text-text-light mr-3 sm:mr-4 shadow-lg">
              <User size={16} className="sm:hidden" />
              <User size={20} className="hidden sm:block" />
            </div>
            <div>
              <p className="font-bold text-text-light text-sm sm:text-base">The Editorial Team</p>
              <p className="text-xs sm:text-sm bg-gradient-dark bg-clip-text text-transparent">STEM October Forum</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between text-gradient-blue-start text-sm border-t border-b border-gradient-purple-end py-4 gap-4 sm:gap-0">
            <div className="flex flex-wrap gap-4 sm:gap-0 sm:items-center sm:space-x-6">
              <div className="flex items-center">
                <Calendar className="mr-2 text-gradient-light-pink-end" size={16} />
                July 25, 2025
              </div>
              <div className="flex items-center">
                <BookOpen className="mr-2 text-gradient-light-pink-end" size={16} />
                8 min read
              </div>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-0 sm:items-center sm:space-x-4">
              <div className="flex items-center">
                <Eye className="mr-2 text-gradient-purple-end" size={16} />
                {formatViewCount(viewCount)} views
              </div>
              <div 
                className={`flex items-center cursor-pointer ${isLiked ? 'text-pink-500' : ''}`}
                onClick={handleLikeArticle}
              >
                <Heart 
                  className="mr-2 text-gradient-light-pink-end" 
                  size={16} 
                  fill={isLiked ? "currentColor" : "none"}
                />
                {likeCount} likes
              </div>
              <div className="flex items-center">
                <MessageCircle className="mr-2 text-gradient-purple-end" size={16} />
                34 comments
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Article Content */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-8 lg:px-16 bg-transparent relative z-10">
        <div className="max-w-4xl mx-auto relative pl-5 sm:pl-8 before:absolute before:top-0 before:left-0 before:w-1 before:h-full before:bg-gradient-purple before:rounded-full before:opacity-50">
          {/* Introduction */}
          <p className="text-base sm:text-lg md:text-xl text-gradient-light-pink-start mb-6 sm:mb-8 leading-relaxed">
            In the tapestry of human ambition, the pursuit of leadership positions has been both glorified and scrutinized. Within educational institutions especially, the race for student leadership roles often reveals deeper psychological and social dynamics that extend beyond the simple desire to serve.
          </p>
          
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-4 sm:mb-6 mt-8 sm:mt-12">Understanding the Pursuit of Leadership</h2>
          
          <p className="text-base sm:text-lg text-gradient-light-pink-start mb-4 sm:mb-6 leading-relaxed">
            The crown—whether literal or metaphorical—has long symbolized authority, respect, and influence. In academic environments, student leadership positions like student council president, club leader, or team captain represent microcosmic versions of these societal power structures. These roles offer students the opportunity to develop crucial skills: organization, communication, delegation, and decision-making.
          </p>
          
          <p className="text-base sm:text-lg text-gradient-light-pink-start mb-4 sm:mb-6 leading-relaxed">
            However, beneath this surface-level understanding lies a complex web of motivations. For some students, leadership positions represent a genuine desire to contribute positively to their community. For others, these positions become vehicles for personal validation, resume enhancement, or social status elevation.
          </p>
          
          <h2 className="text-3xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-6 mt-12">The Psychology Behind Leadership Aspirations</h2>
          
          <p className="text-lg text-gradient-light-pink-start mb-6 leading-relaxed">
            Research in educational psychology suggests that leadership aspirations often correlate with identity formation during adolescence and young adulthood. As students navigate the complex process of self-definition, leadership roles can provide external validation and a sense of purpose. The recognition from peers and authority figures satisfies fundamental human needs for belonging and esteem.
          </p>
          
          <p className="text-lg text-gradient-light-pink-start mb-6 leading-relaxed">
            This psychological dimension explains why rejection from leadership positions can feel deeply personal—it's not merely a practical disappointment but can be perceived as a rejection of one's core identity and capabilities.
          </p>
          
          <blockquote className="border-l-4 border-gradient-light-pink-end pl-4 sm:pl-6 italic text-base sm:text-lg text-text-light my-6 sm:my-8 bg-gradient-dark-purple-end py-4 sm:py-6 px-3 sm:px-4 rounded-r-lg shadow-lg">
            "The true test of leadership is not found in the acquisition of titles, but in the impact one makes regardless of position. Leadership is a service, not a status symbol."
            <cite className="block text-xs sm:text-sm bg-gradient-purple bg-clip-text text-transparent mt-3 sm:mt-4">— Dr. Maya Richards, Educational Psychologist</cite>
          </blockquote>
          
          <h2 className="text-3xl font-bold bg-gradient-dark bg-clip-text text-transparent mb-6 mt-12">When the Pursuit Becomes Problematic</h2>
          
          <p className="text-lg text-gradient-light-pink-start mb-6 leading-relaxed">
            Leadership aspirations become concerning when the focus shifts entirely to the acquisition of the position rather than the responsibilities it entails. Signs of this shift include:
          </p>
          
          <ul className="list-disc pl-6 text-lg text-gradient-light-pink-start mb-6 leading-relaxed">
            <li className="mb-3">Viewing leadership positions primarily as resume credentials rather than opportunities for community impact</li>
            <li className="mb-3">Experiencing disproportionate emotional distress when not selected for roles</li>
            <li className="mb-3">Pursuing positions in areas where one lacks genuine interest or expertise</li>
            <li className="mb-3">Measuring self-worth predominantly through acquired titles and positions</li>
          </ul>
          
          <p className="text-lg text-gradient-light-pink-start mb-6 leading-relaxed">
            This misalignment between motivation and purpose often results in ineffective leadership and personal frustration. Leaders driven purely by status may find the actual work unfulfilling, while their constituents experience the disconnect between promise and performance.
          </p>
          
          <h2 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-6 mt-12">Reframing Our Understanding of Leadership</h2>
          
          <p className="text-lg text-gradient-light-pink-start mb-6 leading-relaxed">
            Authentic leadership transcends titles and positions. It manifests in daily actions, ethical choices, and genuine interactions. Educational institutions have a responsibility to promote this broader understanding of leadership—one that values impact over recognition and service over status.
          </p>
          
          <p className="text-lg text-gradient-light-pink-start mb-6 leading-relaxed">
            Students would benefit from opportunities to develop leadership skills outside the confines of traditional positions. Collaborative projects, community service initiatives, and peer mentoring programs can foster leadership qualities without the competitive element that often accompanies formal leadership roles.
          </p>
          
          <h2 className="text-3xl font-bold bg-gradient-blue bg-clip-text text-transparent mb-6 mt-12">Conclusion: Beyond the Crown</h2>
          
          <p className="text-lg text-gradient-light-pink-start mb-8 leading-relaxed">
            The allure of the crown—of leadership positions and titles—is understandable in our achievement-oriented society. However, true leadership transcends these external markers. As students and educators, we must work to cultivate an environment where leadership is recognized in its many forms, where contribution is valued over position, and where service becomes its own reward.
          </p>
          
          <p className="text-lg text-gradient-light-pink-start mb-12 leading-relaxed">
            By shifting our focus from acquiring leadership titles to developing leadership qualities, we create space for more authentic expressions of leadership to emerge—ones that benefit both the individual and the community they serve.
          </p>
        </div>
      </section>
      
      {/* Article Footer - Share, Comments, etc. */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-8 lg:px-16 bg-gradient-dark-purple-end bg-opacity-50 backdrop-blur-sm relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gradient-purple-end pt-6 sm:pt-8">
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-3 sm:mb-4">Share this article</h3>
              <div className="flex space-x-3 sm:space-x-4">
                <button className="p-2 sm:p-3 bg-gradient-dark-purple-mid text-gradient-light-pink-end rounded-full hover:bg-gradient-purple hover:text-text-light transition-all duration-300 shadow-lg">
                  <Facebook size={18} className="sm:hidden" />
                  <Facebook size={20} className="hidden sm:block" />
                </button>
                <button className="p-2 sm:p-3 bg-gradient-dark-purple-mid text-gradient-purple-end rounded-full hover:bg-gradient-blue hover:text-text-light transition-all duration-300 shadow-lg">
                  <Twitter size={18} className="sm:hidden" />
                  <Twitter size={20} className="hidden sm:block" />
                </button>
                <button className="p-2 sm:p-3 bg-gradient-dark-purple-mid text-gradient-light-pink-end rounded-full hover:bg-gradient-purple hover:text-text-light transition-all duration-300 shadow-lg">
                  <Linkedin size={18} className="sm:hidden" />
                  <Linkedin size={20} className="hidden sm:block" />
                </button>
                <button className="p-2 sm:p-3 bg-gradient-dark-purple-mid text-gradient-blue-start rounded-full hover:bg-gradient-dark hover:text-text-light transition-all duration-300 shadow-lg">
                  <Share2 size={18} className="sm:hidden" />
                  <Share2 size={20} className="hidden sm:block" />
                </button>
              </div>
            </div>
            
            <div>
              <button className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-purple text-text-light rounded-lg hover:opacity-90 transition-opacity duration-300 flex items-center shadow-lg text-sm sm:text-base">
                <MessageCircle className="mr-2" size={18} />
                Join the Discussion
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ArticlePage;