import api from './api';

/**
 * Send message to AI Counselor (Agentic RAG)
 *
 * @param {string|null} message - Single message (legacy mode) or null for history mode
 * @param {Object} context - Optional context (rank, category, branch, homeState)
 * @param {Array} history - Optional conversation history for Agentic RAG
 *                          Format: [{ role: 'user'|'assistant', content: string }]
 */
export const sendChatMessage = async (message, context = {}, history = null) => {
  try {
    // Build request payload
    const payload = { context };

    // Use history-based Agentic RAG if history is provided
    if (history && Array.isArray(history) && history.length > 0) {
      payload.history = history;
    } else if (message) {
      // Legacy single message mode
      payload.message = message;
    } else {
      throw new Error('Either message or history is required');
    }

    const response = await api.post('/chat', payload);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to send message';
    const e = new Error(errorMessage);
    e.response = error.response; // preserve so useMentor can distinguish network vs 4xx/5xx
    throw e;
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
