const API_URL = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
};

// Get article stats
export async function getArticleStats(articleId) {
  try {
    const response = await fetch(`${API_URL}/article/${articleId}/stats`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching article stats:', error);
    throw error;
  }
}

// Increment article view (once per session)
export async function incrementArticleView(articleId, sessionId) {
  try {
    const response = await fetch(`${API_URL}/article/${articleId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error incrementing view:', error);
    throw error;
  }
}

// Toggle article like
export async function toggleArticleLike(articleId, userId, action) {
  try {
    const response = await fetch(`${API_URL}/article/${articleId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action })
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

// Get all articles stats (for homepage)
export async function getAllArticlesStats() {
  try {
    const response = await fetch(`${API_URL}/articles/stats`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Error fetching all articles stats:', error);
    throw error;
  }
}

// Health check
export async function checkHealth() {
  try {
    const response = await fetch(`${API_URL}/health`);
    return await handleResponse(response);
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
}
