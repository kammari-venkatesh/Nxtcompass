import { create } from 'zustand';

export const useQuizStore = create((set) => ({
  quizzes: [],
  currentQuiz: null,
  results: null,
  
  setQuizzes: (quizzes) => set({ quizzes }),
  
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  
  setResults: (results) => set({ results }),
  
  clearCurrentQuiz: () => set({ currentQuiz: null, results: null })
}));

export default useQuizStore;
