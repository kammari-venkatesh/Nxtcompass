import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem('nxt_token');
  return token || null;
};

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: `${API_URL}/predictor-results`,
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
 * Get all predictor results for the current user
 * @returns {Promise<Array>} Array of predictor result objects
 */
export const getPredictorResults = async () => {
  try {
    const response = await apiClient.get('/');
    return response.data.data || [];
  } catch (error) {
    console.error('Get predictor results error:', error);
    throw error;
  }
};

/**
 * Save a predictor result
 * @param {Object} data - Result data to save
 * @returns {Promise<Object>} Saved result object
 */
export const savePredictorResult = async (data) => {
  try {
    const response = await apiClient.post('/', data);
    return response.data.data;
  } catch (error) {
    console.error('Save predictor result error:', error);
    throw error;
  }
};

/**
 * Delete a predictor result
 * @param {string} resultId - Result ID to delete
 * @returns {Promise<Object>} Response with resultId
 */
export const deletePredictorResult = async (resultId) => {
  try {
    const response = await apiClient.delete(`/${resultId}`);
    return response.data.data;
  } catch (error) {
    console.error('Delete predictor result error:', error);
    throw error;
  }
};
