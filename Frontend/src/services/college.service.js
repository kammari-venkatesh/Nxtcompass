import api from './api';

/**
 * Get all colleges with optional filters
 * @param {Object} filters - { type, state, branch, page, limit }
 */
export const getAllColleges = async (filters = {}) => {
  try {
    const response = await api.get('/colleges', { params: filters });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch colleges';
    throw new Error(message);
  }
};

/**
 * Get single college by ID
 */
export const getCollegeById = async (collegeId) => {
  try {
    const response = await api.get(`/colleges/${collegeId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch college details';
    throw new Error(message);
  }
};

/**
 * Search colleges
 */
export const searchColleges = async (query) => {
  try {
    const response = await api.get('/colleges/search', { params: { q: query } });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Search failed';
    throw new Error(message);
  }
};

/**
 * Get list of states
 */
export const getStates = async () => {
  try {
    const response = await api.get('/colleges/states');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch states';
    throw new Error(message);
  }
};

/**
 * Compare colleges
 * @param {Array} ids - Array of college IDs
 */
export const compareColleges = async (ids) => {
  try {
    const response = await api.post('/colleges/compare', { ids });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Comparison failed';
    throw new Error(message);
  }
};

export const collegeService = {
  getAllColleges,
  getCollegeById,
  searchColleges,
  getStates,
  compareColleges,
};

export default collegeService;
