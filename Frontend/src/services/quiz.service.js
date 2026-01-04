import api from './api';

/**
 * Get quiz questions
 */
export const getQuizQuestions = async () => {
  try {
    const response = await api.get('/quiz/questions');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch quiz questions';
    throw new Error(message);
  }
};

/**
 * Submit quiz answers
 * @param {Array} answers - Array of {questionId, selectedOption}
 */
export const submitQuiz = async (answers) => {
  try {
    const response = await api.post('/quiz/submit', { answers });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to submit quiz';
    throw new Error(message);
  }
};

export const quizService = {
  getQuizQuestions,
  submitQuiz,
};

export default quizService;
