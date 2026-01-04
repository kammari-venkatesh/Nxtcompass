export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const EXAM_TYPES = {
  JEE_MAIN: 'jee-main',
  JEE_ADVANCED: 'jee-advanced',
  NEET: 'neet',
  GATE: 'gate',
  CAT: 'cat'
};

export const CATEGORIES = {
  ENGINEERING: 'engineering',
  MEDICAL: 'medical',
  COMMERCE: 'commerce',
  ARTS: 'arts'
};

export const COLLEGE_TYPES = {
  GOVERNMENT: 'government',
  PRIVATE: 'private',
  DEEMED: 'deemed'
};

export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  MAX_PAGES: 100
};

export const MESSAGES = {
  SUCCESS: 'Operation successful',
  ERROR: 'Something went wrong',
  LOADING: 'Loading...',
  NO_DATA: 'No data available'
};
