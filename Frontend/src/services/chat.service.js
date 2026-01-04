import api from './api';

/**
 * Send message to AI Counselor
 * @param {string} message - User message
 * @param {Object} context - Optional context (rank, category, branch, collegeIds)
 */
export const sendChatMessage = async (message, context = {}) => {
  try {
    const response = await api.post('/chat', { message, context });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to send message';
    throw new Error(errorMessage);
  }
};

/**
 * Get chat history (requires auth)
 */
export const getChatHistory = async () => {
  try {
    const response = await api.get('/chat/history');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to fetch chat history';
    throw new Error(errorMessage);
  }
};

/**
 * Clear chat history (requires auth)
 */
export const clearChatHistory = async () => {
  try {
    const response = await api.delete('/chat/history');
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to clear chat history';
    throw new Error(errorMessage);
  }
};

export const chatService = {
  sendChatMessage,
  getChatHistory,
  clearChatHistory,
};

export default chatService;
