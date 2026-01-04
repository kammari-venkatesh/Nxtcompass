import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  logout: () => set({ user: null, isAuthenticated: false }),
  
  login: async (email, password) => {
    // Implementation for login
  }
}));

export default useAuthStore;
