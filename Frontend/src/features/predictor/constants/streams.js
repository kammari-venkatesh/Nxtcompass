// Stream/Course Definitions for College Predictor

export const STREAMS = [
  {
    id: 'btech',
    name: 'B.Tech / B.E',
    icon: '⚙️',
    description: 'Bachelor of Technology / Engineering',
    color: 'cyan',
    exams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'EAMCET', 'COMEDK', 'MHT-CET']
  },
  {
    id: 'mbbs',
    name: 'MBBS',
    icon: '⚕️',
    description: 'Bachelor of Medicine and Bachelor of Surgery',
    color: 'green',
    exams: ['NEET UG']
  },
  {
    id: 'bds',
    name: 'BDS',
    icon: '🦷',
    description: 'Bachelor of Dental Surgery',
    color: 'blue',
    exams: ['NEET UG']
  },
  {
    id: 'bsc',
    name: 'B.Sc',
    icon: '🔬',
    description: 'Bachelor of Science',
    color: 'purple',
    exams: ['CUET', 'University Exams']
  },
  {
    id: 'bba',
    name: 'BBA',
    icon: '💼',
    description: 'Bachelor of Business Administration',
    color: 'orange',
    exams: ['IPMAT', 'CUET', 'University Exams']
  },
  {
    id: 'bcom',
    name: 'B.Com',
    icon: '📊',
    description: 'Bachelor of Commerce',
    color: 'yellow',
    exams: ['CUET', 'University Exams']
  },
  {
    id: 'ba',
    name: 'BA',
    icon: '📚',
    description: 'Bachelor of Arts',
    color: 'pink',
    exams: ['CUET', 'University Exams']
  },
  {
    id: 'bca',
    name: 'BCA',
    icon: '💻',
    description: 'Bachelor of Computer Applications',
    color: 'indigo',
    exams: ['CUET', 'University Exams']
  },
  {
    id: 'barch',
    name: 'B.Arch',
    icon: '🏗️',
    description: 'Bachelor of Architecture',
    color: 'teal',
    exams: ['NATA', 'JEE Main Paper 2']
  },
  {
    id: 'llb',
    name: 'LLB',
    icon: '⚖️',
    description: 'Bachelor of Laws',
    color: 'red',
    exams: ['CLAT', 'AILET']
  },
  {
    id: 'bpharm',
    name: 'B.Pharm',
    icon: '💊',
    description: 'Bachelor of Pharmacy',
    color: 'emerald',
    exams: ['NEET UG', 'State Pharmacy Exams']
  },
  {
    id: 'bhms',
    name: 'BHMS',
    icon: '🌿',
    description: 'Bachelor of Homeopathic Medicine and Surgery',
    color: 'lime',
    exams: ['NEET UG']
  },
  {
    id: 'bams',
    name: 'BAMS',
    icon: '🧘',
    description: 'Bachelor of Ayurvedic Medicine and Surgery',
    color: 'amber',
    exams: ['NEET UG']
  },
  {
    id: 'design',
    name: 'Design',
    icon: '🎨',
    description: 'Bachelor of Design',
    color: 'rose',
    exams: ['NIFT', 'UCEED', 'CEED', 'NID']
  }
]

export const getStreamById = (streamId) => {
  return STREAMS.find(s => s.id === streamId)
}

export const getStreamColor = (streamId) => {
  const stream = getStreamById(streamId)
  return stream?.color || 'cyan'
}
