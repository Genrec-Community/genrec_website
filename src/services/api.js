// API service for Genrec AI backend communication

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making HTTP requests
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Conversation API methods
  async createConversation(conversationData) {
    return this.request('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
  }

  async addMessage(messageData) {
    return this.request('/api/conversations/message', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getConversation(sessionId) {
    return this.request(`/api/conversations/${sessionId}`);
  }

  async getConversationMessages(sessionId) {
    return this.request(`/api/conversations/${sessionId}/messages`);
  }

  async endConversation(sessionId) {
    return this.request(`/api/conversations/${sessionId}/end`, {
      method: 'PUT',
    });
  }

  // Contact API methods
  async submitContact(contactData) {
    return this.request('/api/contacts', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }

  async getContact(id) {
    return this.request(`/api/contacts/${id}`);
  }

  async updateContactStatus(id, status, notes) {
    return this.request(`/api/contacts/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  }

  // Feedback API methods
  async submitFeedback(feedbackData) {
    return this.request('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  }

  async getFeedback(id) {
    return this.request(`/api/feedback/${id}`);
  }

  async getConversationFeedback(sessionId) {
    return this.request(`/api/feedback/conversation/${sessionId}`);
  }

  // Admin API methods
  async getDashboard() {
    return this.request('/api/admin/dashboard');
  }

  async getConversations(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/api/admin/conversations?${params}`);
  }

  async getContacts(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/api/admin/contacts?${params}`);
  }

  async getAllFeedback(page = 1, limit = 20, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    return this.request(`/api/admin/feedback?${params}`);
  }

  async getUsers(page = 1, limit = 20) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    return this.request(`/api/admin/users?${params}`);
  }

  // Analytics API methods
  async getAnalyticsOverview() {
    return this.request('/api/analytics/overview');
  }

  async getFeedbackAnalytics() {
    return this.request('/api/analytics/feedback');
  }

  async getContactAnalytics() {
    return this.request('/api/analytics/contacts');
  }

  async exportData(type = 'all', format = 'json') {
    const params = new URLSearchParams({ type, format });
    return this.request(`/api/analytics/export?${params}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Utility methods
  isOnline() {
    return navigator.onLine;
  }

  async testConnection() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.warn('Backend connection test failed:', error);
      return false;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

// Fallback storage for offline functionality
class OfflineStorage {
  static saveToLocal(key, data) {
    try {
      const existingData = JSON.parse(localStorage.getItem(key) || '[]');
      existingData.push({
        ...data,
        timestamp: new Date().toISOString(),
        synced: false
      });
      localStorage.setItem(key, JSON.stringify(existingData));
      return true;
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
      return false;
    }
  }

  static getFromLocal(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return [];
    }
  }

  static clearLocal(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      return false;
    }
  }
}

// Enhanced API service with immediate storage
class EnhancedApiService extends ApiService {

  // Track user interactions
  async trackInteraction(interactionData) {
    return this.request('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify(interactionData),
    });
  }

  // Save email interactions
  async saveEmailInteraction(email, source) {
    return this.request('/api/interactions/email', {
      method: 'POST',
      body: JSON.stringify({ email, source, timestamp: new Date() }),
    });
  }

  // Save download interactions
  async saveDownloadInteraction(downloadType, userInfo) {
    return this.request('/api/interactions/download', {
      method: 'POST',
      body: JSON.stringify({ downloadType, userInfo, timestamp: new Date() }),
    });
  }
}

export default new EnhancedApiService();
