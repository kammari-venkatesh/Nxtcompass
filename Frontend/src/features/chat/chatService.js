import api from '../../services/api';

export const sendMessage = async (message) => {
  try {
    const response = await api.post('/chat/send', { message });
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getMessages = async (conversationId) => {
  try {
    const response = await api.get(`/chat/messages/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
