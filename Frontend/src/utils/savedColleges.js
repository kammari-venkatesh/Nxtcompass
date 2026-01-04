// Utility for managing saved colleges in localStorage with cross-component sync

const STORAGE_KEY = 'savedColleges';

// Custom event for cross-component synchronization
const SYNC_EVENT = 'savedCollegesSync';

/**
 * Get saved colleges from localStorage
 * @returns {string[]} Array of college IDs
 */
export const getSavedColleges = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load saved colleges:', error);
    return [];
  }
};

/**
 * Save colleges to localStorage and notify other components
 * @param {string[]} collegeIds - Array of college IDs
 */
export const setSavedColleges = (collegeIds) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collegeIds));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: collegeIds }));
  } catch (error) {
    console.error('Failed to save colleges:', error);
  }
};

/**
 * Add a college to saved list
 * @param {string} collegeId - College ID to add
 */
export const addSavedCollege = (collegeId) => {
  const saved = getSavedColleges();
  if (!saved.includes(collegeId)) {
    setSavedColleges([...saved, collegeId]);
  }
};

/**
 * Remove a college from saved list
 * @param {string} collegeId - College ID to remove
 */
export const removeSavedCollege = (collegeId) => {
  const saved = getSavedColleges();
  setSavedColleges(saved.filter(id => id !== collegeId));
};

/**
 * Toggle a college in saved list
 * @param {string} collegeId - College ID to toggle
 * @returns {boolean} True if added, false if removed
 */
export const toggleSavedCollege = (collegeId) => {
  const saved = getSavedColleges();
  const isCurrentlySaved = saved.includes(collegeId);

  if (isCurrentlySaved) {
    removeSavedCollege(collegeId);
    return false;
  } else {
    addSavedCollege(collegeId);
    return true;
  }
};

/**
 * Check if a college is saved
 * @param {string} collegeId - College ID to check
 * @returns {boolean} True if saved
 */
export const isCollegeSaved = (collegeId) => {
  return getSavedColleges().includes(collegeId);
};

/**
 * Subscribe to saved colleges changes
 * @param {Function} callback - Function to call when saved colleges change
 * @returns {Function} Unsubscribe function
 */
export const subscribeSavedColleges = (callback) => {
  const handler = (event) => {
    callback(event.detail);
  };

  window.addEventListener(SYNC_EVENT, handler);

  // Return unsubscribe function
  return () => {
    window.removeEventListener(SYNC_EVENT, handler);
  };
};
