import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const getUserStats = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user stats:', error);
    throw error;
  }
};

export const getRankedUsers = async () => {
  try {
    const response = await api.get('/users/ranked');
    return response.data;
  } catch (error) {
    console.error('Error fetching ranked users:', error);
    throw error;
  }
};

export const getRecentActivity = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/activity`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
};

export const getAiChatExplanation = async (quizTitle, selectedQuestions) => {
  try {
    const response = await api.post('/ai-chat/explanation', {
      quizTitle,
      selectedQuestions,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching AI chat explanation:', error);
    throw error;
  }
};

export const checkUserBadges = async (userId) => {
  try {
    const response = await api.post(`/users/${userId}/badges/check`);
    return response.data;
  } catch (error) {
    console.error('Error checking user badges:', error);
    throw error;
  }
};

export const getUserBadges = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}/badges`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user badges:', error);
    throw error;
  }
};

export default api;
