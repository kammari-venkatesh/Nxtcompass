// Fixed MongoDB ObjectIds for mock data (these stay consistent across sessions)
// Each college-branch combination is a unique entry with a unique ObjectId
export const collegeData = [
  // IIT Bombay - Multiple Branches
  { name: 'IIT Bombay', state: 'Maharashtra', city: 'Mumbai', id: '507f1f77bcf86cd799439011', branch: 'CSE' },
  { name: 'IIT Bombay', state: 'Maharashtra', city: 'Mumbai', id: '507f1f77bcf86cd799439111', branch: 'ECE' },
  { name: 'IIT Bombay', state: 'Maharashtra', city: 'Mumbai', id: '507f1f77bcf86cd799439211', branch: 'Mechanical' },

  // IIT Delhi - Multiple Branches
  { name: 'IIT Delhi', state: 'Delhi', city: 'New Delhi', id: '507f1f77bcf86cd799439012', branch: 'CSE' },
  { name: 'IIT Delhi', state: 'Delhi', city: 'New Delhi', id: '507f1f77bcf86cd799439112', branch: 'ECE' },
  { name: 'IIT Delhi', state: 'Delhi', city: 'New Delhi', id: '507f1f77bcf86cd799439212', branch: 'EEE' },

  // IIT Madras - Multiple Branches
  { name: 'IIT Madras', state: 'Tamil Nadu', city: 'Chennai', id: '507f1f77bcf86cd799439013', branch: 'CSE' },
  { name: 'IIT Madras', state: 'Tamil Nadu', city: 'Chennai', id: '507f1f77bcf86cd799439113', branch: 'ECE' },
  { name: 'IIT Madras', state: 'Tamil Nadu', city: 'Chennai', id: '507f1f77bcf86cd799439213', branch: 'Mechanical' },

  // IIT Kanpur - Multiple Branches
  { name: 'IIT Kanpur', state: 'Uttar Pradesh', city: 'Kanpur', id: '507f1f77bcf86cd799439014', branch: 'CSE' },
  { name: 'IIT Kanpur', state: 'Uttar Pradesh', city: 'Kanpur', id: '507f1f77bcf86cd799439114', branch: 'Mechanical' },
  { name: 'IIT Kanpur', state: 'Uttar Pradesh', city: 'Kanpur', id: '507f1f77bcf86cd799439214', branch: 'ECE' },

  // IIT Kharagpur
  { name: 'IIT Kharagpur', state: 'West Bengal', city: 'Kharagpur', id: '507f1f77bcf86cd799439015', branch: 'CSE' },
  { name: 'IIT Kharagpur', state: 'West Bengal', city: 'Kharagpur', id: '507f1f77bcf86cd799439115', branch: 'EEE' },

  // IIT Roorkee
  { name: 'IIT Roorkee', state: 'Uttarakhand', city: 'Roorkee', id: '507f1f77bcf86cd799439016', branch: 'CSE' },
  { name: 'IIT Roorkee', state: 'Uttarakhand', city: 'Roorkee', id: '507f1f77bcf86cd799439116', branch: 'Civil' },

  // IIT Guwahati
  { name: 'IIT Guwahati', state: 'Assam', city: 'Guwahati', id: '507f1f77bcf86cd799439017', branch: 'CSE' },
  { name: 'IIT Guwahati', state: 'Assam', city: 'Guwahati', id: '507f1f77bcf86cd799439117', branch: 'ECE' },

  // IIT Hyderabad
  { name: 'IIT Hyderabad', state: 'Telangana', city: 'Hyderabad', id: '507f1f77bcf86cd799439018', branch: 'CSE' },
  { name: 'IIT Hyderabad', state: 'Telangana', city: 'Hyderabad', id: '507f1f77bcf86cd799439118', branch: 'ECE' },

  // BITS Pilani
  { name: 'BITS Pilani', state: 'Rajasthan', city: 'Pilani', id: '507f1f77bcf86cd799439019', branch: 'CSE' },
  { name: 'BITS Pilani', state: 'Rajasthan', city: 'Pilani', id: '507f1f77bcf86cd799439119', branch: 'ECE' },
  { name: 'BITS Pilani', state: 'Rajasthan', city: 'Pilani', id: '507f1f77bcf86cd799439219', branch: 'EEE' },

  // BITS Goa
  { name: 'BITS Goa', state: 'Goa', city: 'Goa', id: '507f1f77bcf86cd79943901a', branch: 'CSE' },
  { name: 'BITS Goa', state: 'Goa', city: 'Goa', id: '507f1f77bcf86cd79943911a', branch: 'ECE' },

  // NIT Trichy
  { name: 'NIT Trichy', state: 'Tamil Nadu', city: 'Tiruchirappalli', id: '507f1f77bcf86cd79943901c', branch: 'CSE' },
  { name: 'NIT Trichy', state: 'Tamil Nadu', city: 'Tiruchirappalli', id: '507f1f77bcf86cd79943911c', branch: 'ECE' },
  { name: 'NIT Trichy', state: 'Tamil Nadu', city: 'Tiruchirappalli', id: '507f1f77bcf86cd79943921c', branch: 'Mechanical' },

  // NIT Warangal
  { name: 'NIT Warangal', state: 'Telangana', city: 'Warangal', id: '507f1f77bcf86cd79943901d', branch: 'CSE' },
  { name: 'NIT Warangal', state: 'Telangana', city: 'Warangal', id: '507f1f77bcf86cd79943911d', branch: 'ECE' },

  // NIT Surathkal
  { name: 'NIT Surathkal', state: 'Karnataka', city: 'Surathkal', id: '507f1f77bcf86cd79943901e', branch: 'CSE' },
  { name: 'NIT Surathkal', state: 'Karnataka', city: 'Surathkal', id: '507f1f77bcf86cd79943911e', branch: 'ECE' },

  // IIIT Hyderabad
  { name: 'IIIT Hyderabad', state: 'Telangana', city: 'Hyderabad', id: '507f1f77bcf86cd799439021', branch: 'CSE' },
  { name: 'IIIT Hyderabad', state: 'Telangana', city: 'Hyderabad', id: '507f1f77bcf86cd799439121', branch: 'ECE' },

  // IIIT Bangalore
  { name: 'IIIT Bangalore', state: 'Karnataka', city: 'Bangalore', id: '507f1f77bcf86cd799439022', branch: 'CSE' },
  { name: 'IIIT Bangalore', state: 'Karnataka', city: 'Bangalore', id: '507f1f77bcf86cd799439122', branch: 'IT' },

  // IIIT Delhi
  { name: 'IIIT Delhi', state: 'Delhi', city: 'New Delhi', id: '507f1f77bcf86cd799439023', branch: 'CSE' },
  { name: 'IIIT Delhi', state: 'Delhi', city: 'New Delhi', id: '507f1f77bcf86cd799439123', branch: 'ECE' },

  // DTU Delhi
  { name: 'DTU Delhi', state: 'Delhi', city: 'New Delhi', id: '507f1f77bcf86cd799439025', branch: 'CSE' },
  { name: 'DTU Delhi', state: 'Delhi', city: 'New Delhi', id: '507f1f77bcf86cd799439125', branch: 'ECE' },
  { name: 'DTU Delhi', state: 'Delhi', city: 'New Delhi', id: '507f1f77bcf86cd799439225', branch: 'IT' },

  // VIT Vellore
  { name: 'VIT Vellore', state: 'Tamil Nadu', city: 'Vellore', id: '507f1f77bcf86cd799439028', branch: 'CSE' },
  { name: 'VIT Vellore', state: 'Tamil Nadu', city: 'Vellore', id: '507f1f77bcf86cd799439128', branch: 'ECE' },
  { name: 'VIT Vellore', state: 'Tamil Nadu', city: 'Vellore', id: '507f1f77bcf86cd799439228', branch: 'Mechanical' }
];

// Generate mock results with unique college-branch combinations (45 unique entries)
export const mockResults = collegeData.map((college, i) => ({
  college: {
    _id: college.id,
    name: college.name,
    state: college.state,
    city: college.city,
    fees: { general: 80000 + (i * 15000) },
    logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${college.id}`
  },
  branch: college.branch,
  probability: Math.max(20, 100 - (i * 2)),
  cutoffRank: 1000 + (i * 500),
  yourRank: 5000
}));

// Helper to get college details by ID
export const getCollegeById = (collegeId) => {
  return mockResults.find(result => result.college._id === collegeId);
};

// Helper to get multiple colleges by IDs (returns unique colleges only)
export const getCollegesByIds = (collegeIds) => {
  if (!Array.isArray(collegeIds)) return [];

  // Use a Map to ensure we only get one result per unique college ID
  const uniqueColleges = new Map();

  mockResults.forEach(result => {
    if (collegeIds.includes(result.college._id) && !uniqueColleges.has(result.college._id)) {
      uniqueColleges.set(result.college._id, result);
    }
  });

  return Array.from(uniqueColleges.values());
};
