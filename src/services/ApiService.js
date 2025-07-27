// API service for communicating with backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  // Generate a unique user ID for like tracking
  static getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
      userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', userId);
    }
    return userId;
  }

  // Generate session ID for view tracking
  static getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  // Get article statistics
  static async getArticleStats(articleId) {
    try {
      const response = await fetch(`${API_BASE_URL}/article/${articleId}/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch article stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching article stats:', error);
      // Return fallback data
      return { views: 0, likes: 0, hasLiked: false };
    }
  }

  // Record a view for an article
  static async recordView(articleId) {
    try {
      const sessionId = this.getSessionId();
      const viewedArticles = sessionStorage.getItem('viewedArticles') || '';
      const viewedList = viewedArticles.split(',').filter(Boolean);

      // Only record view if not already viewed in this session
      if (!viewedList.includes(articleId.toString())) {
        const response = await fetch(`${API_BASE_URL}/article/${articleId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId }),
        });

        if (response.ok) {
          // Mark as viewed in session
          const newViewedList = [...viewedList, articleId.toString()];
          sessionStorage.setItem('viewedArticles', newViewedList.join(','));
          return await response.json();
        }
      }
      return null;
    } catch (error) {
      console.error('Error recording view:', error);
      return null;
    }
  }

  // Toggle like for an article
  static async toggleLike(articleId, currentLikeStatus) {
    try {
      const userId = this.getUserId();
      const action = currentLikeStatus ? 'unlike' : 'like';

      const response = await fetch(`${API_BASE_URL}/article/${articleId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, action }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const result = await response.json();
      
      // Update localStorage to track user's like status
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
      likedArticles[articleId] = action === 'like';
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles));

      return result;
    } catch (error) {
      console.error('Error toggling like:', error);
      return null;
    }
  }

  // Get all articles stats (for homepage)
  static async getAllArticlesStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/stats`);
      if (!response.ok) {
        throw new Error('Failed to fetch articles stats');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching articles stats:', error);
      return {};
    }
  }

  // Check if user has liked an article (from localStorage)
  static hasUserLikedArticle(articleId) {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
    return !!likedArticles[articleId];
  }

  // Format view count for display
  static formatCount(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  }
}

export default ApiService;
