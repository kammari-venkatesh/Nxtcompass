import { create } from 'zustand';

export const useUserStore = create((set) => ({
  profile: null,
  preferences: {},
  savedColleges: [],
  
  setProfile: (profile) => set({ profile }),
  
  setPreferences: (preferences) => set({ preferences }),
  
  addSavedCollege: (college) => set((state) => ({
    savedColleges: [...state.savedColleges, college]
  })),
  
  removeSavedCollege: (collegeId) => set((state) => ({
    savedColleges: state.savedColleges.filter(c => c.id !== collegeId)
  }))
}));

export default useUserStore;
