import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('nxt_token');
  console.log('🔐 Token retrieved:', token ? `${token.substring(0, 20)}...` : 'null');
  return token || null;
};

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: `${API_URL}/saved-colleges`,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Get all saved colleges for the current user
 * @returns {Promise<Array>} Array of saved college objects
 */
export const getSavedColleges = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data.data || [];
  } catch (error) {
    console.error('Get saved colleges error:', error);
    throw error;
  }
};

/**
 * Toggle save/unsave a college
 * @param {string} collegeId - College ID to toggle
 * @returns {Promise<Object>} Response with saved status
 */
export const toggleSaveCollege = async (collegeId) => {
  try {
    const response = await apiClient.post('/toggle', { collegeId });
    return response.data.data;
  } catch (error) {
    console.error('Toggle save college error:', error);
    throw error;
  }
};

/**
 * Remove a saved college
 * @param {string} collegeId - College ID to remove
 * @returns {Promise<Object>} Response with collegeId
 */
export const removeSavedCollege = async (collegeId) => {
  try {
    const response = await apiClient.delete(`/${collegeId}`);
    return response.data.data;
  } catch (error) {
    console.error('Remove saved college error:', error);
    throw error;
  }
};

/**
 * Clear all saved colleges for the current user
 * @returns {Promise<Object>} Response with count of cleared colleges
 */
export const clearAllSavedColleges = async () => {
  try {
    const response = await apiClient.delete('/clear-all');
    return response.data.data;
  } catch (error) {
    console.error('Clear all saved colleges error:', error);
    throw error;
  }
};
