// Generate and manage session ID (resets when browser session ends)
export function getSessionId() {
  let sessionId = sessionStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = `session_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    sessionStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

// Generate and manage user ID (persists across browser sessions)
export function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Math.random().toString(36).substring(2)}_${Date.now()}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// Format view count for display (e.g., 1234 -> "1.2k")
export function formatViewCount(count) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
}

// Check if user has viewed article in current session
export function hasViewedInSession(articleId) {
  const viewedArticles = getViewedArticlesInSession();
  return viewedArticles.includes(articleId.toString());
}

// Mark article as viewed in current session
export function markAsViewedInSession(articleId) {
  const viewedArticles = getViewedArticlesInSession();
  if (!viewedArticles.includes(articleId.toString())) {
    viewedArticles.push(articleId.toString());
    sessionStorage.setItem('viewedArticles', viewedArticles.join(','));
  }
}

// Get list of articles viewed in current session
function getViewedArticlesInSession() {
  const viewed = sessionStorage.getItem('viewedArticles') || '';
  return viewed.split(',').filter(Boolean);
}
