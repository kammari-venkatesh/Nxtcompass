import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, MapPin, Calendar, DollarSign, TrendingUp, Users, BookOpen,
  Wifi, Dumbbell, Library, Laptop, Coffee, Building2, CheckCircle,
  XCircle, ThumbsUp, AlertTriangle, ChevronDown, Download, ExternalLink,
  GraduationCap, Star, Send, Target, MessageCircle, Eye, Heart, Award,
  Zap, Globe, Loader, Home
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import MegaFooter from '../../components/footer/MegaFooter';
import './CollegeDetails.css';

// Fallback data for unknown colleges
const fallbackCollegeData = {
  _id: 'iit-bombay',
  name: 'Indian Institute of Technology, Bombay',
  slug: 'iit-bombay',
  type: 'Engineering',
  logo: 'https://api.dicebear.com/7.x/shapes/svg?seed=iit',
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
    },
    {
      name: 'M.Tech Artificial Intelligence',
      duration: '2 Years',
      fees: { total: 400000, per_year: 200000 },
      seats: 40,
      cutoff: { exam: 'GATE', closing_rank: 150 }
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
      },
      {
        user: 'Arjun Mehta',
        batch: 2024,
        text: 'Great academic rigor but can be quite competitive. Hostel facilities could be better but overall excellent experience.',
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
      'State-of-the-art research facilities',
      'Guaranteed placements with top packages'
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
    { name: 'Nandan Nilekani', achievement: 'Co-founder of Infosys', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nandan' },
    { name: 'Arvind Krishna', achievement: 'CEO of IBM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=arvind' }
  ],

  admissions: {
    status: 'Open',
    apply_link: 'https://jeeadv.ac.in/',
    brochure_link: '#',
    deadline: '2024-06-15'
  },

  overview: 'IIT Bombay is the premier engineering institution in India, known for its rigorous academic programs and world-class research facilities. Founded in 1958, it has consistently ranked among the top engineering colleges globally. The institute offers undergraduate, postgraduate, and doctoral programs in various engineering disciplines, sciences, and management.',

  admission_probability: 75
};

const CollegeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [college, setCollege] = useState(null);

  // Fetch college data from API based on ID
  useEffect(() => {
    const fetchCollege = async () => {
      setLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://nxtcompass06.onrender.com/api';
        const response = await fetch(`${API_URL}/colleges/${id}`);
        const data = await response.json();

        if (data.success && data.data) {
          // Transform API data to match component's expected format
          const collegeData = data.data;
          const transformedCollege = {
            _id: collegeData._id,
            name: collegeData.name,
            slug: collegeData.slug || collegeData._id,
            type: collegeData.type || 'Engineering',
            logo: `https://api.dicebear.com/7.x/shapes/svg?seed=${collegeData.name}`,
            backgroundImage: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1920',

            hero_stats: {
              nirf_rank: collegeData.nireRank || collegeData.nirf_rank || 'N/A',
              accreditation: collegeData.accreditation || 'NAAC A',
              est_year: collegeData.establishedYear || collegeData.est_year || 'N/A',
              campus_area: collegeData.campusArea || 'N/A',
              location: {
                city: collegeData.city || 'India',
                state: collegeData.state || '',
                coordinates: { lat: 0, lng: 0 }
              }
            },

            placements: {
              avg_package: collegeData.avgPackage || collegeData.placements?.avg_package || 1000000,
              highest_package: collegeData.highestPackage || collegeData.placements?.highest_package || 5000000,
              placement_rate: collegeData.placementRate || collegeData.placements?.placement_rate || 85,
              top_recruiters: collegeData.topRecruiters || ['TCS', 'Infosys', 'Wipro', 'Cognizant'],
              trend_graph: [
                { year: '2020', avg: 8 },
                { year: '2021', avg: 9 },
                { year: '2022', avg: 10 },
                { year: '2023', avg: 11 },
                { year: '2024', avg: 12 }
              ]
            },

            courses: (collegeData.branches || []).map(branch => ({
              name: branch,
              duration: '4 Years',
              fees: {
                total: collegeData.fees?.general || 400000,
                per_year: (collegeData.fees?.general || 400000) / 4
              },
              seats: collegeData.totalSeats ? Math.floor(collegeData.totalSeats / (collegeData.branches?.length || 1)) : 60,
              cutoff: { exam: 'JEE Main', closing_rank: 10000 }
            })),

            reviews: {
              rating: 4.2,
              sentiment_summary: `${collegeData.name} offers quality education with good placement opportunities.`,
              positive_percentage: 80,
              featured_reviews: [
                {
                  user: 'Student',
                  batch: 2024,
                  text: 'Good college with decent facilities and placements.',
                  verified_student: true
                }
              ]
            },

            pros_cons: {
              pros: [
                'Good academic curriculum',
                'Experienced faculty',
                'Decent placement record',
                'Industry connections'
              ],
              cons: [
                'Infrastructure could be improved',
                'Limited hostel facilities'
              ]
            },

            facilities: [
              { name: 'WiFi Campus', icon: 'Wifi', image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400' },
              { name: 'Library', icon: 'Library', image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400' },
              { name: 'Computer Labs', icon: 'Laptop', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400' },
              { name: 'Cafeteria', icon: 'Coffee', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400' }
            ],

            alumni: [],

            admissions: {
              status: 'Open',
              apply_link: collegeData.website ? `https://${collegeData.website}` : '#',
              official_website: collegeData.website ? `https://${collegeData.website}` : '#',
              brochure_link: '#',
              deadline: '2025-06-15',
              process_steps: [
                { step: 1, title: 'Register for Entrance Exam', description: 'Register for JEE Main or other relevant entrance exams.' },
                { step: 2, title: 'Appear for Exam', description: 'Take the entrance examination and await results.' },
                { step: 3, title: 'Counseling', description: 'Participate in the counseling process for seat allocation.' },
                { step: 4, title: 'Document Verification', description: 'Submit required documents for verification.' }
              ]
            },

            overview: `${collegeData.name} is a ${collegeData.type || 'renowned'} institution located in ${collegeData.city || 'India'}${collegeData.state ? `, ${collegeData.state}` : ''}. The college offers various undergraduate programs and has a strong focus on academic excellence and industry readiness.`,

            admission_probability: 75
          };

          setCollege(transformedCollege);
        } else {
          // If college not found, use fallback data
          setCollege(fallbackCollegeData);
        }
      } catch (error) {
        console.error('Error fetching college:', error);
        setCollege(fallbackCollegeData);
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavSticky(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const formatCurrency = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const getIconComponent = (iconName) => {
    const icons = { Wifi, Dumbbell, Library, Laptop, Coffee, Building2 };
    return icons[iconName] || BookOpen;
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'admissions', label: 'How to Apply' },
    { id: 'courses', label: 'Courses & Fees' },
    { id: 'placements', label: 'Placements' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'alumni', label: 'Notable Alumni' }
  ];

  // Loading state
  if (loading || !college) {
    return (
      <div className="cd-container">
        <div className="cd-background">
          <div className="cd-background-overlay" />
        </div>
        <div className="cd-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div style={{ textAlign: 'center' }}>
            <Loader size={48} className="animate-spin" style={{ color: '#06b6d4', margin: '0 auto 1rem' }} />
            <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>Loading college details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cd-container">
      {/* Background Layer */}
      <div className="cd-background">
        <img
          src={college.backgroundImage}
          alt={college.name}
          className="cd-background-image"
        />
        <div className="cd-background-overlay" />
      </div>

      {/* Content Layer */}
      <div className="cd-content">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="cd-hero"
        >
          <div className="cd-hero-glass">
            <div className="cd-hero-top">
              <div className="cd-logo-container">
                <img src={college.logo} alt={college.name} className="cd-logo" />
              </div>
              <div className="cd-hero-info">
                <h1 className="cd-college-name">{college.name}</h1>
                <p className="cd-college-type">{college.type} Institution</p>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="cd-stats-bar">
              <div className="cd-stat-item">
                <div className="cd-stat-icon">
                  <Trophy size={20} />
                </div>
                <div className="cd-stat-content">
                  <div className="cd-stat-label">NIRF Rank</div>
                  <div className="cd-stat-value">#{college.hero_stats.nirf_rank}</div>
                </div>
              </div>

              <div className="cd-stat-item">
                <div className="cd-stat-icon">
                  <TrendingUp size={20} />
                </div>
                <div className="cd-stat-content">
                  <div className="cd-stat-label">Avg Package</div>
                  <div className="cd-stat-value">{formatCurrency(college.placements.avg_package)}</div>
                </div>
              </div>

              <div className="cd-stat-item">
                <div className="cd-stat-icon">
                  <MapPin size={20} />
                </div>
                <div className="cd-stat-content">
                  <div className="cd-stat-label">Location</div>
                  <div className="cd-stat-value">
                    {college.hero_stats.location.city}, {college.hero_stats.location.state}
                  </div>
                </div>
              </div>

              <div className="cd-stat-item">
                <div className="cd-stat-icon">
                  <Calendar size={20} />
                </div>
                <div className="cd-stat-content">
                  <div className="cd-stat-label">Established</div>
                  <div className="cd-stat-value">{college.hero_stats.est_year}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="cd-actions">
              <a
                href={college.admissions.apply_link}
                target="_blank"
                rel="noopener noreferrer"
                className="cd-btn cd-btn-primary"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={20} />
                Apply Now
              </a>
              <a
                href={college.admissions.official_website}
                target="_blank"
                rel="noopener noreferrer"
                className="cd-btn cd-btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                <Globe size={20} />
                Visit Website
              </a>
            </div>
          </div>
        </motion.div>

        {/* Sticky Navigation */}
        <AnimatePresence>
          {isNavSticky && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="cd-sticky-nav"
            >
              <div className="cd-nav-container">
                <div className="cd-nav-tabs">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => scrollToSection(tab.id)}
                      className={`cd-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content with Sidebar */}
        <div className="cd-layout">
          <div className="cd-main-content">
            {/* Overview Section */}
            <motion.section
              id="overview"
              className="cd-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="cd-section-glass">
                <h2 className="cd-section-title">
                  <div className="cd-section-title-icon">
                    <Eye size={24} />
                  </div>
                  Overview
                </h2>
                <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: '1.8', marginBottom: '2rem' }}>
                  {college.overview}
                </p>

                {/* Pros & Cons */}
                <div className="cd-pros-cons">
                  <div className="cd-pros-glass">
                    <h3 className="cd-pros-title">
                      <ThumbsUp size={20} />
                      Why Join?
                    </h3>
                    <ul className="cd-pros-list">
                      {college.pros_cons.pros.map((pro, i) => (
                        <li key={i} className="cd-pros-item">
                          <CheckCircle size={16} className="cd-pros-icon" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="cd-cons-glass">
                    <h3 className="cd-cons-title">
                      <AlertTriangle size={20} />
                      Considerations
                    </h3>
                    <ul className="cd-cons-list">
                      {college.pros_cons.cons.map((con, i) => (
                        <li key={i} className="cd-cons-item">
                          <XCircle size={16} className="cd-cons-icon" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Admissions Process Section */}
            <motion.section
              id="admissions"
              className="cd-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="cd-section-glass">
                <h2 className="cd-section-title">
                  <div className="cd-section-title-icon">
                    <BookOpen size={24} />
                  </div>
                  How to Get Admission
                </h2>

                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Follow these steps to secure your admission at {college.name}. Application deadline: <strong style={{ color: '#06b6d4' }}>{new Date(college.admissions.deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                </p>

                {/* Process Steps */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {college.admissions.process_steps && college.admissions.process_steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        display: 'flex',
                        gap: '1.5rem',
                        padding: '1.5rem',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '1rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(6, 182, 212, 0.1)';
                        e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                    >
                      {/* Step Number */}
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '1.5rem',
                        color: '#ffffff',
                        flexShrink: 0
                      }}>
                        {step.step}
                      </div>

                      {/* Step Content */}
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontSize: '1.125rem',
                          fontWeight: '700',
                          color: '#ffffff',
                          marginBottom: '0.5rem'
                        }}>
                          {step.title}
                        </h3>
                        <p style={{
                          color: '#cbd5e1',
                          fontSize: '0.9rem',
                          lineHeight: '1.6',
                          margin: 0
                        }}>
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Links */}
                <div style={{
                  marginTop: '2rem',
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  borderRadius: '1rem',
                  border: '1px solid rgba(6, 182, 212, 0.2)'
                }}>
                  <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontWeight: '700' }}>
                    Quick Links
                  </h4>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a
                      href={college.admissions.apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)',
                        color: '#ffffff',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <ExternalLink size={16} />
                      Start Application
                    </a>
                    <a
                      href={college.admissions.official_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        borderRadius: '0.5rem',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Globe size={16} />
                      Official Website
                    </a>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Courses Section */}
            <motion.section
              id="courses"
              className="cd-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="cd-section-glass">
                <h2 className="cd-section-title">
                  <div className="cd-section-title-icon">
                    <GraduationCap size={24} />
                  </div>
                  Courses & Fees
                </h2>

                <div className="cd-courses-grid">
                  {college.courses.map((course, index) => (
                    <motion.div
                      key={index}
                      className={`cd-course-card ${expandedCourse === index ? 'expanded' : ''}`}
                      onClick={() => setExpandedCourse(expandedCourse === index ? null : index)}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="cd-course-header">
                        <div className="cd-course-info">
                          <h3 className="cd-course-name">{course.name}</h3>
                          <p className="cd-course-duration">{course.duration}</p>
                        </div>
                        <ChevronDown
                          size={24}
                          className={`cd-expand-icon ${expandedCourse === index ? 'rotated' : ''}`}
                        />
                      </div>

                      <div className="cd-course-stats">
                        <div className="cd-course-stat">
                          <div className="cd-course-stat-label">Annual Fees</div>
                          <div className="cd-course-stat-value">{formatCurrency(course.fees.per_year)}</div>
                        </div>
                        <div className="cd-course-stat">
                          <div className="cd-course-stat-label">Seats</div>
                          <div className="cd-course-stat-value">{course.seats}</div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedCourse === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="cd-course-details"
                          >
                            <div className="cd-fee-breakdown">
                              <div className="cd-fee-row">
                                <span>Per Year</span>
                                <span>{formatCurrency(course.fees.per_year)}</span>
                              </div>
                              <div className="cd-fee-row">
                                <span>Total ({course.duration})</span>
                                <span>{formatCurrency(course.fees.total)}</span>
                              </div>
                            </div>
                            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(6, 182, 212, 0.1)', borderRadius: '0.5rem' }}>
                              <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                                {course.cutoff.exam} Cutoff
                              </div>
                              <div style={{ color: '#06b6d4', fontSize: '1.125rem', fontWeight: '700' }}>
                                Rank {course.cutoff.closing_rank}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Placements Section */}
            <motion.section
              id="placements"
              className="cd-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="cd-section-glass">
                <h2 className="cd-section-title">
                  <div className="cd-section-title-icon">
                    <TrendingUp size={24} />
                  </div>
                  Placements
                </h2>

                {/* Placement Chart */}
                <div className="cd-placement-chart">
                  <h3 className="cd-chart-title">Average Package Trend (Last 5 Years)</h3>
                  <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={college.placements.trend_graph}>
                      <defs>
                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="year"
                        stroke="#94a3b8"
                        style={{ fontSize: '0.875rem' }}
                      />
                      <YAxis
                        stroke="#94a3b8"
                        style={{ fontSize: '0.875rem' }}
                        tickFormatter={(value) => `${value}L`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#1e293b',
                          borderRadius: '0.5rem',
                          fontSize: '0.875rem'
                        }}
                        itemStyle={{ color: '#22d3ee' }}
                        formatter={(value) => [`${value}L`, 'Avg Package']}
                      />
                      <Area
                        type="monotone"
                        dataKey="avg"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorAvg)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Recruiters */}
                <div className="cd-recruiters-marquee">
                  <h3 className="cd-recruiters-title">Top Recruiters</h3>
                  <div className="cd-recruiters-scroll">
                    {[...college.placements.top_recruiters, ...college.placements.top_recruiters].map((recruiter, i) => (
                      <div key={i} style={{
                        padding: '0.75rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}>
                        {recruiter}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Facilities Section */}
            <motion.section
              id="facilities"
              className="cd-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="cd-section-glass">
                <h2 className="cd-section-title">
                  <div className="cd-section-title-icon">
                    <Building2 size={24} />
                  </div>
                  Facilities
                </h2>

                <div className="cd-facilities-grid">
                  {college.facilities.map((facility, index) => {
                    const IconComponent = getIconComponent(facility.icon);
                    return (
                      <div key={index} className="cd-facility-item">
                        <div className="cd-facility-icon-wrap">
                          <IconComponent size={28} className="cd-facility-icon" />
                        </div>
                        <div className="cd-facility-name">{facility.name}</div>

                        <div className="cd-facility-tooltip">
                          <img
                            src={facility.image}
                            alt={facility.name}
                            className="cd-facility-tooltip-image"
                          />
                          <div className="cd-facility-tooltip-text">
                            {facility.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.section>

            {/* Reviews Section */}
            <motion.section
              id="reviews"
              className="cd-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="cd-section-glass">
                <h2 className="cd-section-title">
                  <div className="cd-section-title-icon">
                    <Star size={24} />
                  </div>
                  Student Reviews
                </h2>

                {/* Sentiment Meter */}
                <div className="cd-sentiment-meter">
                  <div className="cd-sentiment-percentage">
                    {college.reviews.positive_percentage}%
                  </div>
                  <div className="cd-sentiment-label">Overall Positive Sentiment</div>
                  <p style={{ color: '#94a3b8', marginTop: '1rem', fontSize: '0.9rem' }}>
                    {college.reviews.sentiment_summary}
                  </p>
                </div>

                {/* Reviews Grid */}
                <div className="cd-reviews-grid">
                  {college.reviews.featured_reviews.map((review, index) => (
                    <div key={index} className="cd-review-card">
                      <div className="cd-review-header">
                        <div className="cd-review-user">
                          <div className="cd-review-avatar">
                            {review.user.charAt(0)}
                          </div>
                          <div className="cd-review-info">
                            <div className="cd-review-name">{review.user}</div>
                            <div className="cd-review-batch">Batch of {review.batch}</div>
                          </div>
                        </div>
                        {review.verified_student && (
                          <div className="cd-verified-badge">
                            <CheckCircle size={12} />
                            Verified
                          </div>
                        )}
                      </div>
                      <p className="cd-review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.section>

            {/* Alumni Section */}
            <motion.section
              id="alumni"
              className="cd-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="cd-section-glass">
                <h2 className="cd-section-title">
                  <div className="cd-section-title-icon">
                    <Award size={24} />
                  </div>
                  Notable Alumni
                </h2>

                <div className="cd-alumni-constellation">
                  {college.alumni.map((alumnus, index) => (
                    <motion.div
                      key={index}
                      className="cd-alumni-node"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <img
                        src={alumnus.avatar}
                        alt={alumnus.name}
                        className="cd-alumni-avatar"
                      />
                      <div className="cd-alumni-name">{alumnus.name}</div>
                      <div className="cd-alumni-achievement">
                        {alumnus.achievement}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

          {/* Sticky Sidebar */}
          <aside className="cd-sidebar">
            <div className="cd-sidebar-sticky">
              {/* Admission Probability */}
              <div className="cd-sidebar-card">
                <h3 className="cd-sidebar-title">
                  <Target size={20} />
                  Admission Probability
                </h3>
                <div className="cd-probability-gauge">
                  <svg className="cd-gauge-svg" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                    </defs>
                    <circle cx="100" cy="100" r="90" className="cd-gauge-bg" />
                    <circle
                      cx="100"
                      cy="100"
                      r="90"
                      className="cd-gauge-progress"
                      strokeDasharray={2 * Math.PI * 90}
                      strokeDashoffset={2 * Math.PI * 90 * (1 - college.admission_probability / 100)}
                    />
                  </svg>
                  <div className="cd-gauge-text">
                    <div className="cd-gauge-percentage">{college.admission_probability}%</div>
                    <div className="cd-gauge-label">Chance</div>
                  </div>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center' }}>
                  Based on your profile and previous year cutoffs
                </p>
              </div>

              {/* Ask a Senior */}
              <div className="cd-sidebar-card">
                <h3 className="cd-sidebar-title">
                  <MessageCircle size={20} />
                  Ask a Senior
                </h3>
                <div className="cd-chat-input-wrap">
                  <textarea
                    className="cd-chat-input"
                    placeholder="Ask anything about campus life, placements, culture..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                  />
                  <button className="cd-chat-submit">
                    <Send size={16} />
                    Send Question
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Home Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '2rem 0',
            marginTop: '2rem'
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)'
            }}
          >
            <Home size={20} />
            <span>Back to Home</span>
          </motion.button>
        </motion.div>
      </div>

      <MegaFooter />
    </div>
  );
};

export default CollegeDetails;
