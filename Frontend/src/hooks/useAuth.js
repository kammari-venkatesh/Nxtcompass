import { useContext } from 'react';

export const useAuth = () => {
  // Implementation for auth hook
  return {
    user: null,
    isAuthenticated: false,
    login: () => {},
    logout: () => {},
    register: () => {}
  };
};
