// Universal Exam Configuration for Adaptive Forms

export const EXAM_STREAMS = {
  ENGINEERING: 'Engineering',
  MEDICAL: 'Medical',
  MANAGEMENT: 'Management',
  LAW: 'Law',
  DESIGN: 'Design'
}

export const EXAMS_BY_STREAM = {
  [EXAM_STREAMS.ENGINEERING]: [
    {
      id: 'jee-main',
      name: 'JEE Main',
      icon: '⚙️',
      scope: 'National',
      totalCandidates: 1100000,
      requiresFields: ['rank', 'category', 'homeState', 'gender']
    },
    {
      id: 'jee-advanced',
      name: 'JEE Advanced',
      icon: '🎓',
      scope: 'National',
      totalCandidates: 250000,
      requiresFields: ['rank', 'category', 'gender']
    },
    {
      id: 'ts-eamcet',
      name: 'TS EAMCET',
      icon: '🏛️',
      scope: 'State',
      totalCandidates: 300000,
      requiresFields: ['rank', 'category', 'localRegion', 'gender']
    },
    {
      id: 'ap-eamcet',
      name: 'AP EAMCET',
      icon: '🏛️',
      scope: 'State',
      totalCandidates: 300000,
      requiresFields: ['rank', 'category', 'localRegion', 'gender']
    },
    {
      id: 'bitsat',
      name: 'BITSAT',
      icon: '🔬',
      scope: 'Institute',
      totalCandidates: 300000,
      requiresFields: ['score', 'category']
    },
    {
      id: 'viteee',
      name: 'VITEEE',
      icon: '🎯',
      scope: 'Institute',
      totalCandidates: 250000,
      requiresFields: ['rank', 'category']
    },
    {
      id: 'comedk',
      name: 'COMEDK',
      icon: '📐',
      scope: 'State',
      totalCandidates: 80000,
      requiresFields: ['rank', 'category', 'homeState']
    },
    {
      id: 'mht-cet',
      name: 'MHT-CET',
      icon: '🏗️',
      scope: 'State',
      totalCandidates: 450000,
      requiresFields: ['rank', 'category', 'homeState']
    }
  ],
  [EXAM_STREAMS.MEDICAL]: [
    {
      id: 'neet-ug',
      name: 'NEET UG',
      icon: '⚕️',
      scope: 'Hybrid',
      totalCandidates: 1800000,
      requiresFields: ['rank', 'category', 'quotaType', 'homeState']
    },
    {
      id: 'neet-pg',
      name: 'NEET PG',
      icon: '🩺',
      scope: 'National',
      totalCandidates: 200000,
      requiresFields: ['rank', 'category', 'quotaType']
    }
  ],
  [EXAM_STREAMS.MANAGEMENT]: [
    {
      id: 'cat',
      name: 'CAT',
      icon: '💼',
      scope: 'National',
      totalCandidates: 250000,
      requiresFields: ['percentile', 'category', 'academicProfile', 'workExperience']
    },
    {
      id: 'xat',
      name: 'XAT',
      icon: '📊',
      scope: 'National',
      totalCandidates: 90000,
      requiresFields: ['percentile', 'category', 'workExperience']
    },
    {
      id: 'mat',
      name: 'MAT',
      icon: '📈',
      scope: 'National',
      totalCandidates: 150000,
      requiresFields: ['percentile', 'category']
    },
    {
      id: 'cmat',
      name: 'CMAT',
      icon: '💹',
      scope: 'National',
      totalCandidates: 90000,
      requiresFields: ['percentile', 'category']
    }
  ],
  [EXAM_STREAMS.LAW]: [
    {
      id: 'clat',
      name: 'CLAT',
      icon: '⚖️',
      scope: 'National',
      totalCandidates: 60000,
      requiresFields: ['rank', 'category', 'homeState']
    },
    {
      id: 'ailet',
      name: 'AILET',
      icon: '🏛️',
      scope: 'Institute',
      totalCandidates: 25000,
      requiresFields: ['rank', 'category']
    }
  ],
  [EXAM_STREAMS.DESIGN]: [
    {
      id: 'nift',
      name: 'NIFT',
      icon: '🎨',
      scope: 'National',
      totalCandidates: 15000,
      requiresFields: ['rank', 'category']
    },
    {
      id: 'uceed',
      name: 'UCEED',
      icon: '✏️',
      scope: 'National',
      totalCandidates: 10000,
      requiresFields: ['rank', 'category']
    },
    {
      id: 'ceed',
      name: 'CEED',
      icon: '🖌️',
      scope: 'National',
      totalCandidates: 12000,
      requiresFields: ['rank', 'category']
    }
  ]
}

// Local Region options for EAMCET exams
export const LOCAL_REGIONS = {
  'TS': [
    { value: 'OU', label: 'OU - Osmania University Region' },
    { value: 'NU', label: 'NU - Kakatiya University Region' },
    { value: 'SVU', label: 'SVU - Sri Venkateswara University Region' },
    { value: 'NL', label: 'NL - Non-Local' }
  ],
  'AP': [
    { value: 'AU', label: 'AU - Andhra University Region' },
    { value: 'SVU', label: 'SVU - Sri Venkateswara University Region' },
    { value: 'OU', label: 'OU - Osmania University Region' },
    { value: 'NL', label: 'NL - Non-Local' }
  ]
}

// Quota types for NEET
export const QUOTA_TYPES = [
  { value: 'AIQ', label: 'All India Quota (15%)', description: 'Open to candidates from all states' },
  { value: 'STATE', label: 'State Quota (85%)', description: 'Reserved for state domicile holders' }
]

// Categories
export const CATEGORIES = [
  { value: 'GENERAL', label: 'General' },
  { value: 'EWS', label: 'EWS - Economically Weaker Section' },
  { value: 'OBC-NCL', label: 'OBC-NCL - Other Backward Classes' },
  { value: 'SC', label: 'SC - Scheduled Caste' },
  { value: 'ST', label: 'ST - Scheduled Tribe' },
  { value: 'PWD', label: 'PwD - Persons with Disabilities' }
]

// Gender options
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' }
]

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir'
]

// Engineering Branches
export const ENGINEERING_BRANCHES = [
  { value: 'CSE', label: 'Computer Science & Engineering', icon: '💻' },
  { value: 'IT', label: 'Information Technology', icon: '🖥️' },
  { value: 'ECE', label: 'Electronics & Communication', icon: '📡' },
  { value: 'EEE', label: 'Electrical & Electronics', icon: '⚡' },
  { value: 'MECH', label: 'Mechanical Engineering', icon: '⚙️' },
  { value: 'CIVIL', label: 'Civil Engineering', icon: '🏗️' },
  { value: 'CHEM', label: 'Chemical Engineering', icon: '🧪' },
  { value: 'AERO', label: 'Aerospace Engineering', icon: '✈️' },
  { value: 'BIO', label: 'Biotechnology', icon: '🧬' },
  { value: 'AI-ML', label: 'Artificial Intelligence & ML', icon: '🤖' }
]

// Get exam configuration by ID
export const getExamConfig = (examId) => {
  for (const stream of Object.values(EXAMS_BY_STREAM)) {
    const exam = stream.find(e => e.id === examId)
    if (exam) return exam
  }
  return null
}

// Check if exam requires specific field
export const examRequiresField = (examId, fieldName) => {
  const exam = getExamConfig(examId)
  return exam?.requiresFields?.includes(fieldName) || false
}
