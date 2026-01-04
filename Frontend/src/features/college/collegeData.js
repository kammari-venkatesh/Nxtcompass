// Comprehensive college data for dynamic loading
export const collegesDatabase = {
  'iit-bombay': {
    _id: 'iit-bombay',
    name: 'Indian Institute of Technology, Bombay',
    slug: 'iit-bombay',
    type: 'Engineering',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=iit-bombay',
    backgroundImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920',

    hero_stats: {
      nirf_rank: 3,
      accreditation: 'NAAC A++',
      est_year: 1958,
      campus_area: '550 Acres',
      location: {
        city: 'Mumbai',
        state: 'Maharashtra',
        coordinates: { lat: 19.1334, lng: 72.9133 }
      }
    },

    placements: {
      avg_package: 2350000,
      highest_package: 36700000,
      placement_rate: 98,
      top_recruiters: ['Google', 'Microsoft', 'Amazon', 'Goldman Sachs', 'Meta', 'Apple', 'Adobe', 'Samsung'],
      trend_graph: [
        { year: '2020', avg: 16 },
        { year: '2021', avg: 17.5 },
        { year: '2022', avg: 21 },
        { year: '2023', avg: 23.5 },
        { year: '2024', avg: 23.5 }
      ]
    },

    courses: [
      {
        name: 'B.Tech Computer Science',
        duration: '4 Years',
        fees: { total: 800000, per_year: 200000 },
        seats: 120,
        cutoff: { exam: 'JEE Advanced', closing_rank: 67 }
      },
      {
        name: 'B.Tech Electrical Engineering',
        duration: '4 Years',
        fees: { total: 800000, per_year: 200000 },
        seats: 110,
        cutoff: { exam: 'JEE Advanced', closing_rank: 250 }
      },
      {
        name: 'B.Tech Mechanical Engineering',
        duration: '4 Years',
        fees: { total: 800000, per_year: 200000 },
        seats: 100,
        cutoff: { exam: 'JEE Advanced', closing_rank: 450 }
      }
    ],

    reviews: {
      rating: 4.8,
      sentiment_summary: 'Excellent faculty and research opportunities. Students praise the coding culture and placement support.',
      positive_percentage: 92,
      featured_reviews: [
        {
          user: 'Rohan Das',
          batch: 2023,
          text: 'The coding culture here is unmatched. Placements are guaranteed if you study. Faculty is world-class.',
          verified_student: true
        },
        {
          user: 'Priya Sharma',
          batch: 2022,
          text: 'Amazing campus life and exposure to cutting-edge research. The alumni network is incredibly strong.',
          verified_student: true
        }
      ]
    },

    pros_cons: {
      pros: [
        'World-class faculty with PhD from top universities',
        'Highest ROI among all engineering colleges in India',
        'Mumbai city exposure and networking opportunities',
        'Strong alumni network in tech giants worldwide',
        'State-of-the-art research facilities'
      ],
      cons: [
        'Extremely competitive environment',
        'Old hostel infrastructure needs renovation',
        'High academic pressure and workload',
        'Limited campus greenery in some areas'
      ]
    },

    facilities: [
      { name: 'WiFi Campus', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400' },
      { name: 'Gym', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
      { name: 'Library', icon: 'Library', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400' },
      { name: 'Computer Labs', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
      { name: 'Cafeteria', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
      { name: 'Hostel', icon: 'Building2', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' }
    ],

    alumni: [
      { name: 'Sundar Pichai', achievement: 'CEO of Google & Alphabet', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sundar' },
      { name: 'Parag Agrawal', achievement: 'Former CEO of Twitter', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parag' },
      { name: 'Nandan Nilekani', achievement: 'Co-founder of Infosys', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nandan' }
    ],

    admissions: {
      status: 'Open',
      apply_link: 'https://jeeadv.ac.in/',
      official_website: 'https://www.iitb.ac.in/',
      brochure_link: '#',
      deadline: '2024-06-15',
      process_steps: [
        {
          step: 1,
          title: 'JEE Advanced Registration',
          description: 'Register for JEE Advanced exam at jeeadv.ac.in. Enter personal and academic information, upload scanned photograph and signature. Pay application fee via debit/credit card, net banking, UPI, or PayTM.'
        },
        {
          step: 2,
          title: 'Appear for JEE Advanced',
          description: 'Attempt the JEE Advanced examination. Aim to secure a rank within the cutoff for your desired branch at IIT Bombay (top 100 for CSE).'
        },
        {
          step: 3,
          title: 'Meet Cutoff Requirements',
          description: 'Obtain minimum qualifying marks (75% in Class 12 with PCM for General category, 65% for SC/ST). Check if your JEE Advanced rank meets the branch-specific cutoff.'
        },
        {
          step: 4,
          title: 'JoSAA Counselling',
          description: 'Register for JoSAA counselling at josaa.nic.in. Fill choice filling form with branch preferences in decreasing order of priority. Lock your choices before deadline. Participate in multiple rounds if needed.'
        },
        {
          step: 5,
          title: 'Document Verification & Fee Payment',
          description: 'After seat allotment, visit IIT Bombay campus in Mumbai for document verification. Submit original documents (12th marksheet, JEE scorecard, category certificate if applicable) and pay admission fees to confirm your seat.'
        }
      ]
    },

    overview: 'IIT Bombay is the premier engineering institution in India, known for its rigorous academic programs and world-class research facilities. Founded in 1958, it has consistently ranked among the top engineering colleges globally. With 1,204 seats across various BTech programs, it attracts the brightest minds in India.',

    admission_probability: 75
  },

  'iit-delhi': {
    _id: 'iit-delhi',
    name: 'Indian Institute of Technology, Delhi',
    slug: 'iit-delhi',
    type: 'Engineering',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=iit-delhi',
    backgroundImage: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=1920',

    hero_stats: {
      nirf_rank: 2,
      accreditation: 'NAAC A++',
      est_year: 1961,
      campus_area: '320 Acres',
      location: {
        city: 'New Delhi',
        state: 'Delhi',
        coordinates: { lat: 28.5449, lng: 77.1926 }
      }
    },

    placements: {
      avg_package: 2500000,
      highest_package: 40000000,
      placement_rate: 99,
      top_recruiters: ['Microsoft', 'Google', 'Amazon', 'McKinsey', 'BCG', 'Uber', 'Oracle', 'Qualcomm'],
      trend_graph: [
        { year: '2020', avg: 18 },
        { year: '2021', avg: 19.5 },
        { year: '2022', avg: 22 },
        { year: '2023', avg: 24 },
        { year: '2024', avg: 25 }
      ]
    },

    courses: [
      {
        name: 'B.Tech Computer Science',
        duration: '4 Years',
        fees: { total: 800000, per_year: 200000 },
        seats: 110,
        cutoff: { exam: 'JEE Advanced', closing_rank: 55 }
      },
      {
        name: 'B.Tech Electrical Engineering',
        duration: '4 Years',
        fees: { total: 800000, per_year: 200000 },
        seats: 105,
        cutoff: { exam: 'JEE Advanced', closing_rank: 180 }
      }
    ],

    reviews: {
      rating: 4.9,
      sentiment_summary: 'Outstanding academics and placement opportunities. Students appreciate the vibrant campus culture and excellent infrastructure.',
      positive_percentage: 94,
      featured_reviews: [
        {
          user: 'Ankit Kumar',
          batch: 2023,
          text: 'Best decision of my life. Amazing faculty, incredible peers, and endless opportunities.',
          verified_student: true
        },
        {
          user: 'Sneha Verma',
          batch: 2024,
          text: 'The research facilities are top-notch. Campus life is vibrant with numerous clubs and activities.',
          verified_student: true
        }
      ]
    },

    pros_cons: {
      pros: [
        'Highest average package among IITs',
        'Located in the capital city with excellent connectivity',
        'World-class infrastructure and facilities',
        'Strong industry connections and research opportunities',
        'Active startup ecosystem and incubation center'
      ],
      cons: [
        'Extremely high competition for admission',
        'Heavy academic workload',
        'Delhi pollution can be challenging',
        'Limited on-campus housing for all students'
      ]
    },

    facilities: [
      { name: 'WiFi Campus', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400' },
      { name: 'Gym', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
      { name: 'Library', icon: 'Library', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400' },
      { name: 'Computer Labs', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
      { name: 'Cafeteria', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
      { name: 'Hostel', icon: 'Building2', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' }
    ],

    alumni: [
      { name: 'Vinod Khosla', achievement: 'Co-founder of Sun Microsystems', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=vinod' },
      { name: 'Arvind Kejriwal', achievement: 'Chief Minister of Delhi', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arvind' }
    ],

    admissions: {
      status: 'Open',
      apply_link: 'https://jeeadv.ac.in/',
      official_website: 'https://home.iitd.ac.in/',
      brochure_link: '#',
      deadline: '2024-06-15',
      process_steps: [
        {
          step: 1,
          title: 'Qualify JEE Main & Advanced',
          description: 'Appear and qualify for both JEE Main and JEE Advanced examinations. JEE Main qualification is mandatory to attempt JEE Advanced. Secure a top rank (top 55 for CSE).'
        },
        {
          step: 2,
          title: 'Register for JoSAA',
          description: 'Visit josaa.nic.in and register using your JEE Advanced credentials. There is no separate application portal for IIT Delhi admission.'
        },
        {
          step: 3,
          title: 'Choice Filling',
          description: 'Select IIT Delhi as your preferred institute. Fill your branch preferences in order of priority. You can modify choices during the choice filling period.'
        },
        {
          step: 4,
          title: 'Seat Allotment',
          description: 'Seats are allotted based on JEE Advanced rank, choice preferences, seat availability, and category. Multiple rounds of counselling are conducted.'
        },
        {
          step: 5,
          title: 'Report to IIT Delhi',
          description: 'After seat allotment, report to IIT Delhi campus in New Delhi for document verification (12th certificate, JEE scorecard, ID proof). Pay admission fees and confirm provisional admission.'
        }
      ]
    },

    overview: 'IIT Delhi stands as one of the premier engineering institutions in India, consistently ranked among the top 2 IITs. With a legacy of excellence in education and research since 1961, it offers world-class facilities and opportunities. Located in the capital city, it provides excellent connectivity and industry exposure.',

    admission_probability: 72
  },

  'bits-pilani': {
    _id: 'bits-pilani',
    name: 'Birla Institute of Technology and Science, Pilani',
    slug: 'bits-pilani',
    type: 'Engineering',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=bits-pilani',
    backgroundImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920',

    hero_stats: {
      nirf_rank: 25,
      accreditation: 'NAAC A',
      est_year: 1964,
      campus_area: '328 Acres',
      location: {
        city: 'Pilani',
        state: 'Rajasthan',
        coordinates: { lat: 28.3636, lng: 75.5857 }
      }
    },

    placements: {
      avg_package: 1800000,
      highest_package: 28000000,
      placement_rate: 96,
      top_recruiters: ['Microsoft', 'Amazon', 'Google', 'DE Shaw', 'Morgan Stanley', 'Flipkart', 'Adobe', 'Cisco'],
      trend_graph: [
        { year: '2020', avg: 12 },
        { year: '2021', avg: 14 },
        { year: '2022', avg: 16 },
        { year: '2023', avg: 17 },
        { year: '2024', avg: 18 }
      ]
    },

    courses: [
      {
        name: 'B.E. Computer Science',
        duration: '4 Years',
        fees: { total: 1800000, per_year: 450000 },
        seats: 150,
        cutoff: { exam: 'BITSAT', closing_rank: 120 }
      },
      {
        name: 'B.E. Electronics & Communication',
        duration: '4 Years',
        fees: { total: 1800000, per_year: 450000 },
        seats: 140,
        cutoff: { exam: 'BITSAT', closing_rank: 200 }
      }
    ],

    reviews: {
      rating: 4.6,
      sentiment_summary: 'Great academic flexibility with no attendance policy. Students love the campus culture and placement opportunities.',
      positive_percentage: 88,
      featured_reviews: [
        {
          user: 'Rahul Mehta',
          batch: 2023,
          text: 'The no attendance policy gives great freedom. Excellent coding culture and placement opportunities.',
          verified_student: true
        },
        {
          user: 'Divya Singh',
          batch: 2022,
          text: 'Beautiful campus with excellent facilities. The dual degree program is very flexible and rewarding.',
          verified_student: true
        }
      ]
    },

    pros_cons: {
      pros: [
        'No mandatory attendance policy - academic freedom',
        'Excellent dual degree programs',
        'Strong alumni network in tech and finance',
        'Beautiful sprawling campus',
        'Practice School program for real industry exposure'
      ],
      cons: [
        'High fees compared to IITs',
        'Remote location with limited city amenities',
        'Extreme weather conditions (very hot summers)',
        'Grading system can be challenging'
      ]
    },

    facilities: [
      { name: 'WiFi Campus', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400' },
      { name: 'Gym', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
      { name: 'Library', icon: 'Library', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400' },
      { name: 'Computer Labs', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
      { name: 'Cafeteria', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
      { name: 'Hostel', icon: 'Building2', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' }
    ],

    alumni: [
      { name: 'Kumar Mangalam Birla', achievement: 'Chairman of Aditya Birla Group', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kumar' },
      { name: 'Shantanu Narayen', achievement: 'CEO of Adobe', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shantanu' }
    ],

    admissions: {
      status: 'Open',
      apply_link: 'https://www.bitsadmission.com/',
      official_website: 'https://www.bits-pilani.ac.in/',
      brochure_link: '#',
      deadline: '2024-07-30',
      process_steps: [
        {
          step: 1,
          title: 'BITSAT Registration',
          description: 'Visit admissions.bits-pilani.ac.in and register with valid Email-ID and Mobile Number. System will generate a unique 9-digit Application Number and Password.'
        },
        {
          step: 2,
          title: 'Fill Application Form',
          description: 'Complete the online application form with accurate personal and academic details. Upload scanned photograph (50-100 KB) and signature (10-100 KB) in JPG/JPEG format. Select exam cities.'
        },
        {
          step: 3,
          title: 'Pay Application Fee',
          description: 'Pay Rs. 1,350/- application fee via net banking, credit card, or debit card. Submit the form after careful verification.'
        },
        {
          step: 4,
          title: 'Appear for BITSAT',
          description: 'Take the Computer Based Test (CBT) at your chosen test center. BITSAT is conducted in multiple sessions (Session-1 and Session-2).'
        },
        {
          step: 5,
          title: 'Preference Filling & Admission',
          description: 'Fill FD Preference Form after BITSAT results. Accept iteration offer by paying fees. Attend counselling if selected based on BITSAT score and preferences.'
        }
      ]
    },

    overview: 'BITS Pilani is a premier private engineering institution known for its academic excellence, flexible curriculum, and no attendance policy. The Practice School program provides unmatched industry exposure. With campuses across India, BITS offers world-class education with emphasis on innovation and entrepreneurship.',

    admission_probability: 80
  },

  'nit-trichy': {
    _id: 'nit-trichy',
    name: 'National Institute of Technology, Tiruchirappalli',
    slug: 'nit-trichy',
    type: 'Engineering',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=nit-trichy',
    backgroundImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1920',

    hero_stats: {
      nirf_rank: 9,
      accreditation: 'NAAC A++',
      est_year: 1964,
      campus_area: '800 Acres',
      location: {
        city: 'Tiruchirappalli',
        state: 'Tamil Nadu',
        coordinates: { lat: 10.7596, lng: 78.8149 }
      }
    },

    placements: {
      avg_package: 1500000,
      highest_package: 25000000,
      placement_rate: 95,
      top_recruiters: ['Microsoft', 'Google', 'Amazon', 'Goldman Sachs', 'Oracle', 'Qualcomm', 'TCS', 'Infosys'],
      trend_graph: [
        { year: '2020', avg: 10 },
        { year: '2021', avg: 11.5 },
        { year: '2022', avg: 13 },
        { year: '2023', avg: 14 },
        { year: '2024', avg: 15 }
      ]
    },

    courses: [
      {
        name: 'B.Tech Computer Science',
        duration: '4 Years',
        fees: { total: 600000, per_year: 150000 },
        seats: 108,
        cutoff: { exam: 'JEE Main', closing_rank: 1500 }
      },
      {
        name: 'B.Tech Electronics & Communication',
        duration: '4 Years',
        fees: { total: 600000, per_year: 150000 },
        seats: 102,
        cutoff: { exam: 'JEE Main', closing_rank: 2800 }
      }
    ],

    reviews: {
      rating: 4.5,
      sentiment_summary: 'Top NIT with excellent infrastructure and placement record. Students appreciate the campus beauty and academic rigor.',
      positive_percentage: 87,
      featured_reviews: [
        {
          user: 'Karthik Raj',
          batch: 2023,
          text: 'Best NIT in India! Amazing campus, great faculty, and excellent placement opportunities.',
          verified_student: true
        },
        {
          user: 'Lakshmi Priya',
          batch: 2024,
          text: 'The campus is beautiful with a rock fort view. Good mix of academics and extracurriculars.',
          verified_student: true
        }
      ]
    },

    pros_cons: {
      pros: [
        'Top-ranked NIT with excellent reputation',
        'Beautiful 800-acre campus with rock fort view',
        'Affordable fees compared to private colleges',
        'Strong placement record across all branches',
        'Active cultural and technical fest scene'
      ],
      cons: [
        'Hot and humid weather year-round',
        'Language barrier for non-Tamil speakers initially',
        'Limited metro city exposure',
        'Hostel facilities need modernization'
      ]
    },

    facilities: [
      { name: 'WiFi Campus', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400' },
      { name: 'Gym', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
      { name: 'Library', icon: 'Library', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400' },
      { name: 'Computer Labs', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
      { name: 'Cafeteria', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
      { name: 'Hostel', icon: 'Building2', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' }
    ],

    alumni: [
      { name: 'R. Madhavan', achievement: 'ISRO Chairman', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=madhavan' },
      { name: 'Kris Gopalakrishnan', achievement: 'Co-founder of Infosys', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kris' }
    ],

    admissions: {
      status: 'Open',
      apply_link: 'https://josaa.nic.in/',
      official_website: 'https://www.nitt.edu/',
      brochure_link: '#',
      deadline: '2024-07-15',
      process_steps: [
        {
          step: 1,
          title: 'Qualify JEE Main',
          description: 'Register and appear for JEE (Joint Entrance Examination) Main. Secure a valid score to qualify for NIT Trichy admission (general cutoff around rank 1500 for CSE).'
        },
        {
          step: 2,
          title: 'JoSAA Registration',
          description: 'Visit josaa.nic.in and register using your JEE Main credentials. Eligible candidates must register during the specified counselling dates.'
        },
        {
          step: 3,
          title: 'Choice Filling',
          description: 'Select NIT Trichy as your first choice during JoSAA counselling. Fill branch preferences in order of priority. You can update choices multiple times before locking.'
        },
        {
          step: 4,
          title: 'Seat Allotment',
          description: 'Merit list is prepared based on JEE Main rank. Seats allocated per rank, category, availability and preferences. Multiple rounds of counselling conducted (CSAB if seats remain).'
        },
        {
          step: 5,
          title: 'Document Verification & Fee Payment',
          description: 'After seat allotment, visit NIT Trichy campus in Tiruchirappalli for document verification. Submit 12th marksheet, JEE scorecard, category certificate, and pay admission fees.'
        }
      ]
    },

    overview: 'NIT Trichy is one of the premier NITs in India, known for its excellent academic programs, beautiful 800-acre campus with rock fort view, and strong placement record. It offers quality technical education at affordable fees with a vibrant fest culture.',

    admission_probability: 85
  },

  'iiit-hyderabad': {
    _id: 'iiit-hyderabad',
    name: 'International Institute of Information Technology, Hyderabad',
    slug: 'iiit-hyderabad',
    type: 'Engineering',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=iiit-hyderabad',
    backgroundImage: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1920',

    hero_stats: {
      nirf_rank: 62,
      accreditation: 'NAAC A',
      est_year: 1998,
      campus_area: '62 Acres',
      location: {
        city: 'Hyderabad',
        state: 'Telangana',
        coordinates: { lat: 17.4453, lng: 78.3490 }
      }
    },

    placements: {
      avg_package: 2800000,
      highest_package: 45000000,
      placement_rate: 100,
      top_recruiters: ['Google', 'Microsoft', 'Amazon', 'Facebook', 'Uber', 'Bloomberg', 'Goldman Sachs', 'Adobe'],
      trend_graph: [
        { year: '2020', avg: 20 },
        { year: '2021', avg: 22 },
        { year: '2022', avg: 25 },
        { year: '2023', avg: 27 },
        { year: '2024', avg: 28 }
      ]
    },

    courses: [
      {
        name: 'B.Tech Computer Science',
        duration: '4 Years',
        fees: { total: 1400000, per_year: 350000 },
        seats: 120,
        cutoff: { exam: 'JEE Main', closing_rank: 850 }
      },
      {
        name: 'B.Tech Electronics & Communication',
        duration: '4 Years',
        fees: { total: 1400000, per_year: 350000 },
        seats: 60,
        cutoff: { exam: 'JEE Main', closing_rank: 1800 }
      }
    ],

    reviews: {
      rating: 4.7,
      sentiment_summary: 'Focused CS education with intense academics. Students love the research culture and coding environment.',
      positive_percentage: 90,
      featured_reviews: [
        {
          user: 'Aditya Sharma',
          batch: 2023,
          text: 'Best place for CS in India! Intense academics but worth it. Amazing placement opportunities.',
          verified_student: true
        },
        {
          user: 'Neha Reddy',
          batch: 2024,
          text: 'Research-oriented curriculum with excellent faculty. The coding culture is phenomenal.',
          verified_student: true
        }
      ]
    },

    pros_cons: {
      pros: [
        'Highest average package for CS students',
        'Focused on Computer Science and AI',
        'Strong research culture and publications',
        '100% placement rate',
        'Located in IT hub of India'
      ],
      cons: [
        'Very intense academic pressure',
        'Limited non-CS opportunities',
        'Small campus with fewer sports facilities',
        'Strict grading system'
      ]
    },

    facilities: [
      { name: 'WiFi Campus', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400' },
      { name: 'Gym', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
      { name: 'Library', icon: 'Library', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400' },
      { name: 'Computer Labs', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
      { name: 'Cafeteria', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
      { name: 'Hostel', icon: 'Building2', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' }
    ],

    alumni: [
      { name: 'Jayant Sinha', achievement: 'Former Minister of State', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jayant' },
      { name: 'Several Tech Leads', achievement: 'at FAANG Companies', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech' }
    ],

    admissions: {
      status: 'Open',
      apply_link: 'https://ugadmissions.iiit.ac.in/',
      official_website: 'https://www.iiit.ac.in/',
      brochure_link: '#',
      deadline: '2024-07-20',
      process_steps: [
        {
          step: 1,
          title: 'Choose Admission Mode',
          description: 'IIIT Hyderabad offers multiple admission modes: UGEE (Undergraduate Entrance Exam) for Dual-degree, JEE Main for Single-degree, SPEC for special channel, LEEE for Lateral Entry, Olympiad quota, and DASA for students abroad.'
        },
        {
          step: 2,
          title: 'Register Online',
          description: 'Visit ugadmissions.iiit.ac.in and navigate to admissions tab. Fill online application form with required information including academic scores and personal details.'
        },
        {
          step: 3,
          title: 'Pay Application Fee',
          description: 'Submit application fee through debit/credit card or net banking. Fee varies based on program and category.'
        },
        {
          step: 4,
          title: 'Appear for Entrance/Submit Scores',
          description: 'For UGEE mode, appear for IIITH entrance exam. For JEE Main mode, submit your JEE Main scorecard. For Olympiad, submit medals/certificates.'
        },
        {
          step: 5,
          title: 'Counselling & Interview',
          description: 'Shortlisted candidates called for counselling based on entrance exam rank/academic scores. Some programs require interviews. Final selection based on comprehensive evaluation.'
        }
      ]
    },

    overview: 'IIIT Hyderabad is renowned for its focused Computer Science education and research. With the highest average packages (₹28L) and 100% placements, it is a dream destination for CS aspirants. The institute emphasizes research publications and has strong ties with tech giants.',

    admission_probability: 78
  },

  'vit-vellore': {
    _id: 'vit-vellore',
    name: 'Vellore Institute of Technology',
    slug: 'vit-vellore',
    type: 'Engineering',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=vit-vellore',
    backgroundImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920',

    hero_stats: {
      nirf_rank: 11,
      accreditation: 'NAAC A++',
      est_year: 1984,
      campus_area: '350 Acres',
      location: {
        city: 'Vellore',
        state: 'Tamil Nadu',
        coordinates: { lat: 12.9688, lng: 79.1558 }
      }
    },

    placements: {
      avg_package: 900000,
      highest_package: 18000000,
      placement_rate: 85,
      top_recruiters: ['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Amazon', 'Microsoft', 'PayPal', 'Cisco'],
      trend_graph: [
        { year: '2020', avg: 6 },
        { year: '2021', avg: 7 },
        { year: '2022', avg: 8 },
        { year: '2023', avg: 8.5 },
        { year: '2024', avg: 9 }
      ]
    },

    courses: [
      {
        name: 'B.Tech Computer Science',
        duration: '4 Years',
        fees: { total: 780000, per_year: 195000 },
        seats: 600,
        cutoff: { exam: 'VITEEE', closing_rank: 5000 }
      },
      {
        name: 'B.Tech Electronics & Communication',
        duration: '4 Years',
        fees: { total: 780000, per_year: 195000 },
        seats: 400,
        cutoff: { exam: 'VITEEE', closing_rank: 8000 }
      }
    ],

    reviews: {
      rating: 4.3,
      sentiment_summary: 'Good infrastructure and diverse student community. Students appreciate the international exposure and campus facilities.',
      positive_percentage: 82,
      featured_reviews: [
        {
          user: 'Vivek Kumar',
          batch: 2023,
          text: 'Great campus with excellent facilities. Good exposure to international students and exchange programs.',
          verified_student: true
        },
        {
          user: 'Anjali Nair',
          batch: 2024,
          text: 'Modern infrastructure and diverse crowd. Multiple clubs and activities to participate in.',
          verified_student: true
        }
      ]
    },

    pros_cons: {
      pros: [
        'Modern infrastructure and facilities',
        'International student exchange programs',
        'Large diverse student community',
        'Multiple campus locations across India',
        'Active club culture and fests'
      ],
      cons: [
        'Strict attendance and dress code policies',
        'High fees with additional charges',
        'Mass placements with lower packages for many',
        'Limited individual attention in large batches'
      ]
    },

    facilities: [
      { name: 'WiFi Campus', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400' },
      { name: 'Gym', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
      { name: 'Library', icon: 'Library', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400' },
      { name: 'Computer Labs', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
      { name: 'Cafeteria', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
      { name: 'Hostel', icon: 'Building2', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' }
    ],

    alumni: [
      { name: 'Suresh Raina', achievement: 'Indian Cricketer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=suresh' },
      { name: 'Many Tech Professionals', achievement: 'at Top Companies', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tech2' }
    ],

    admissions: {
      status: 'Open',
      apply_link: 'https://viteee.vit.ac.in/',
      official_website: 'https://vit.ac.in/',
      brochure_link: '#',
      deadline: '2024-06-30',
      process_steps: [
        {
          step: 1,
          title: 'VITEEE Registration',
          description: 'Visit viteee.vit.ac.in (official website) and register for VITEEE exam. Registration typically opens in November. Application fee is Rs. 1,350/-. Beware of fake websites.'
        },
        {
          step: 2,
          title: 'Fill Application Form',
          description: 'Complete online application with personal and academic details. Upload photograph and signature. Application available both online and offline. Last date typically in early April.'
        },
        {
          step: 3,
          title: 'Appear for VITEEE',
          description: 'Take Computer Based Test (CBT) conducted from mid-April to end-April. Must have 60% aggregate in Physics, Chemistry, Maths/Biology in Class 12 (50% for SC/ST).'
        },
        {
          step: 4,
          title: 'Check Results',
          description: 'VITEEE results announced after exam completion. Check your score and rank on the official website. Cutoff varies by campus (Vellore/Chennai/AP/Bhopal).'
        },
        {
          step: 5,
          title: 'Counselling & Admission',
          description: 'Attend online/offline counselling based on VITEEE rank. Choose preferred campus and branch. Pay fees to confirm admission. VIT has 4 campuses under VIT Group.'
        }
      ]
    },

    overview: 'VIT Vellore is a leading private engineering institution known for its modern infrastructure, international collaborations, and diverse student community from across the globe. With strict attendance policies but excellent facilities, VIT offers quality education with strong industry connections.',

    admission_probability: 88
  },

  'manipal-institute': {
    _id: 'manipal-institute',
    name: 'Manipal Institute of Technology',
    slug: 'manipal-institute',
    type: 'Engineering',
    logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=manipal-institute',
    backgroundImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1920',

    hero_stats: {
      nirf_rank: 45,
      accreditation: 'NAAC A',
      est_year: 1957,
      campus_area: '313 Acres',
      location: {
        city: 'Manipal',
        state: 'Karnataka',
        coordinates: { lat: 13.3495, lng: 74.7869 }
      }
    },

    placements: {
      avg_package: 750000,
      highest_package: 15000000,
      placement_rate: 82,
      top_recruiters: ['Microsoft', 'Amazon', 'Infosys', 'Wipro', 'TCS', 'Cognizant', 'Accenture', 'Tech Mahindra'],
      trend_graph: [
        { year: '2020', avg: 5 },
        { year: '2021', avg: 6 },
        { year: '2022', avg: 6.5 },
        { year: '2023', avg: 7 },
        { year: '2024', avg: 7.5 }
      ]
    },

    courses: [
      {
        name: 'B.Tech Computer Science',
        duration: '4 Years',
        fees: { total: 1600000, per_year: 400000 },
        seats: 240,
        cutoff: { exam: 'MET', closing_rank: 8000 }
      },
      {
        name: 'B.Tech Information Technology',
        duration: '4 Years',
        fees: { total: 1600000, per_year: 400000 },
        seats: 180,
        cutoff: { exam: 'MET', closing_rank: 12000 }
      }
    ],

    reviews: {
      rating: 4.2,
      sentiment_summary: 'Beautiful hill-station campus with good facilities. Students enjoy the scenic environment and active campus life.',
      positive_percentage: 80,
      featured_reviews: [
        {
          user: 'Arjun Patel',
          batch: 2023,
          text: 'Amazing campus in a beautiful location. Great campus life with lots of activities and events.',
          verified_student: true
        },
        {
          user: 'Meera Iyer',
          batch: 2024,
          text: 'Good infrastructure and facilities. The hill-station setting makes it a unique college experience.',
          verified_student: true
        }
      ]
    },

    pros_cons: {
      pros: [
        'Beautiful hill-station campus',
        'Part of established Manipal University',
        'Good hospital and medical facilities nearby',
        'Active cultural and technical fests',
        'Pleasant weather year-round'
      ],
      cons: [
        'High fees compared to government colleges',
        'Remote location away from major cities',
        'Limited public transport connectivity',
        'Placements vary significantly by branch'
      ]
    },

    facilities: [
      { name: 'WiFi Campus', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400' },
      { name: 'Gym', icon: 'Dumbbell', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400' },
      { name: 'Library', icon: 'Library', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400' },
      { name: 'Computer Labs', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
      { name: 'Cafeteria', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' },
      { name: 'Hostel', icon: 'Building2', image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400' }
    ],

    alumni: [
      { name: 'Rajeev Suri', achievement: 'Former CEO of Nokia', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajeev' },
      { name: 'Satya Nadella', achievement: 'CEO of Microsoft (Studied here)', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=satya' }
    ],

    admissions: {
      status: 'Open',
      apply_link: 'https://www.manipal.edu/entranceexam',
      official_website: 'https://www.manipal.edu/',
      brochure_link: '#',
      deadline: '2024-07-10',
      process_steps: [
        {
          step: 1,
          title: 'MET Registration',
          description: 'Visit manipal.edu (official website) and register for Manipal Entrance Test (MET). MET is conducted for admission to various UG and PG courses in engineering, management, pharmacy, and commerce.'
        },
        {
          step: 2,
          title: 'Fill Application Form',
          description: 'Complete MET application form available at manipal.edu. Fill personal details, upload documents. Submit application before deadline (typically mid-March). Check MET schedule at manipal.edu/metschedule.'
        },
        {
          step: 3,
          title: 'Pay Registration Fee',
          description: 'Pay MET registration fee online through the application portal. Fee varies based on program category.'
        },
        {
          step: 4,
          title: 'Appear for MET',
          description: 'MET conducted in two phases (April and June). Take the online entrance test. MET scores used for admission to MIT Manipal BTech programs.'
        },
        {
          step: 5,
          title: 'MET Counselling',
          description: 'Based on MET scores, participate in counselling. Seats allocated based on MET rank, category, seat availability, and preferences. Pay fees to confirm admission.'
        }
      ]
    },

    overview: 'Manipal Institute of Technology is part of the prestigious Manipal Academy of Higher Education (MAHE). Located in a scenic hill station with pleasant weather year-round, it offers quality education with modern facilities. Part of a larger university system with medical and other professional colleges nearby.',

    admission_probability: 90
  }
};

// Helper function to get college data by ID
export const getCollegeById = (id) => {
  return collegesDatabase[id] || null;
};

// Helper function to get all college IDs
export const getAllCollegeIds = () => {
  return Object.keys(collegesDatabase);
};
