import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Atom, BookOpen, Calculator, FlaskConical, Heart, Scale,
  Palette, Code, TrendingUp, Users, Dumbbell, Globe,
  Sparkles, Zap, Clock, Target, Award, ArrowRight
} from 'lucide-react';
import './ExamAlchemist.css';

// Subject inventory with icons and colors
const SUBJECTS = [
  { id: 'physics', name: 'Physics', icon: Atom, color: '#06b6d4', category: 'science' },
  { id: 'math', name: 'Mathematics', icon: Calculator, color: '#8b5cf6', category: 'science' },
  { id: 'chemistry', name: 'Chemistry', icon: FlaskConical, color: '#10b981', category: 'science' },
  { id: 'biology', name: 'Biology', icon: Heart, color: '#f43f5e', category: 'science' },
  { id: 'english', name: 'English', icon: BookOpen, color: '#f59e0b', category: 'arts' },
  { id: 'legal', name: 'Legal Studies', icon: Scale, color: '#eab308', category: 'arts' },
  { id: 'accounts', name: 'Accounts', icon: TrendingUp, color: '#14b8a6', category: 'commerce' },
  { id: 'economics', name: 'Economics', icon: Users, color: '#a855f7', category: 'commerce' },
  { id: 'design', name: 'Drawing/Design', icon: Palette, color: '#ec4899', category: 'creative' },
  { id: 'coding', name: 'Coding/Logic', icon: Code, color: '#6366f1', category: 'tech' },
  { id: 'history', name: 'History', icon: Globe, color: '#f97316', category: 'arts' },
  { id: 'fitness', name: 'Physical Fitness', icon: Dumbbell, color: '#22c55e', category: 'sports' },
  { id: 'psychology', name: 'Psychology', icon: Users, color: '#d946ef', category: 'arts' },
  { id: 'statistics', name: 'Statistics', icon: TrendingUp, color: '#0ea5e9', category: 'science' },
  { id: 'computer', name: 'Computer Science', icon: Code, color: '#8b5cf6', category: 'tech' },
  { id: 'agriculture', name: 'Agriculture', icon: FlaskConical, color: '#84cc16', category: 'science' }
];

// Exam database with prediction logic
const EXAM_DATABASE = [
  {
    id: 'jee-advanced',
    name: 'JEE Advanced',
    tags: ['physics', 'math', 'chemistry'],
    requiredTags: ['physics', 'math', 'chemistry'],
    difficulty: 10,
    careers: ['IIT Student', 'Software Engineer', 'Research Scientist', 'AI/ML Engineer'],
    description: 'The gateway to IITs. Requires deep conceptual mastery and problem-solving skills.',
    syllabusCoverage: 95,
    timeline: [
      { year: 2026, event: 'Clear JEE Advanced', icon: '🎯' },
      { year: 2030, event: 'Graduate from IIT', icon: '🎓' },
      { year: 2032, event: 'Senior Software Engineer', icon: '💻' },
      { year: 2035, event: 'Tech Lead at FAANG', icon: '🚀' }
    ],
    color: '#06b6d4'
  },
  {
    id: 'jee-main',
    name: 'JEE Mains',
    tags: ['physics', 'math', 'chemistry'],
    requiredTags: ['physics', 'math'],
    difficulty: 8,
    careers: ['NIT Student', 'Civil Engineer', 'Mechanical Engineer', 'IT Professional'],
    description: 'Gateway to NITs, IIITs, and GFTIs. Foundation for engineering careers.',
    syllabusCoverage: 90,
    timeline: [
      { year: 2026, event: 'Clear JEE Mains', icon: '🎯' },
      { year: 2030, event: 'Graduate from NIT', icon: '🎓' },
      { year: 2032, event: 'Engineering Manager', icon: '👔' },
      { year: 2035, event: 'Startup Founder', icon: '🏢' }
    ],
    color: '#8b5cf6'
  },
  {
    id: 'bitsat',
    name: 'BITSAT',
    tags: ['physics', 'math', 'chemistry', 'english', 'coding'],
    requiredTags: ['physics', 'math', 'chemistry'],
    difficulty: 8,
    careers: ['BITS Student', 'Tech Consultant', 'Product Manager', 'Entrepreneur'],
    description: 'For BITS Pilani admission. Tests speed and accuracy across subjects.',
    syllabusCoverage: 85,
    timeline: [
      { year: 2026, event: 'Clear BITSAT', icon: '🎯' },
      { year: 2030, event: 'Graduate from BITS', icon: '🎓' },
      { year: 2033, event: 'Product Manager', icon: '📊' },
      { year: 2036, event: 'VP of Engineering', icon: '🎖️' }
    ],
    color: '#10b981'
  },
  {
    id: 'neet',
    name: 'NEET',
    tags: ['biology', 'chemistry', 'physics'],
    requiredTags: ['biology', 'chemistry'],
    difficulty: 9,
    careers: ['Doctor (MBBS)', 'Surgeon', 'Medical Researcher', 'Healthcare Leader'],
    description: 'The only gateway to medical colleges in India. Requires memorization and conceptual clarity.',
    syllabusCoverage: 95,
    timeline: [
      { year: 2026, event: 'Clear NEET', icon: '🎯' },
      { year: 2031, event: 'Complete MBBS', icon: '🎓' },
      { year: 2034, event: 'Specialist Doctor', icon: '🩺' },
      { year: 2038, event: 'Senior Consultant', icon: '⚕️' }
    ],
    color: '#f43f5e'
  },
  {
    id: 'clat',
    name: 'CLAT',
    tags: ['english', 'legal', 'history', 'coding'],
    requiredTags: ['english'],
    difficulty: 7,
    careers: ['Corporate Lawyer', 'Judge', 'Legal Advisor', 'Human Rights Activist'],
    description: 'For National Law Universities. Tests reading comprehension and logical reasoning.',
    syllabusCoverage: 80,
    timeline: [
      { year: 2026, event: 'Clear CLAT', icon: '⚖️' },
      { year: 2031, event: 'LLB from NLU', icon: '🎓' },
      { year: 2034, event: 'Corporate Lawyer', icon: '👔' },
      { year: 2038, event: 'Partner at Law Firm', icon: '🏛️' }
    ],
    color: '#eab308'
  },
  {
    id: 'ipmat',
    name: 'IPMAT',
    tags: ['math', 'english', 'coding'],
    requiredTags: ['math', 'english'],
    difficulty: 7,
    careers: ['IIM Student (BBA)', 'Product Manager', 'Business Analyst', 'Entrepreneur'],
    description: 'Direct entry to IIM Indore/Rohtak after 12th. For future business leaders.',
    syllabusCoverage: 75,
    timeline: [
      { year: 2026, event: 'Clear IPMAT', icon: '🎯' },
      { year: 2031, event: 'MBA from IIM', icon: '🎓' },
      { year: 2033, event: 'Product Manager', icon: '📊' },
      { year: 2036, event: 'CEO of Startup', icon: '👑' }
    ],
    color: '#f59e0b'
  },
  {
    id: 'nift',
    name: 'NIFT',
    tags: ['design', 'english', 'history'],
    requiredTags: ['design'],
    difficulty: 6,
    careers: ['Fashion Designer', 'Textile Designer', 'Creative Director', 'Entrepreneur'],
    description: 'For National Institute of Fashion Technology. Tests creativity and design thinking.',
    syllabusCoverage: 70,
    timeline: [
      { year: 2026, event: 'Clear NIFT', icon: '🎨' },
      { year: 2030, event: 'Graduate in Design', icon: '🎓' },
      { year: 2032, event: 'Fashion Designer', icon: '👗' },
      { year: 2035, event: 'Own Fashion Brand', icon: '🏆' }
    ],
    color: '#ec4899'
  },
  {
    id: 'nda',
    name: 'NDA',
    tags: ['physics', 'math', 'fitness', 'english'],
    requiredTags: ['physics', 'math', 'fitness'],
    difficulty: 8,
    careers: ['Army Officer', 'Navy Officer', 'Air Force Pilot', 'Defense Leader'],
    description: 'For National Defense Academy. Requires physical fitness and mental toughness.',
    syllabusCoverage: 85,
    timeline: [
      { year: 2026, event: 'Clear NDA', icon: '🎖️' },
      { year: 2030, event: 'Commission as Officer', icon: '⚔️' },
      { year: 2035, event: 'Squadron Leader', icon: '✈️' },
      { year: 2040, event: 'Defense Strategist', icon: '🛡️' }
    ],
    color: '#22c55e'
  },
  {
    id: 'ca-foundation',
    name: 'CA Foundation',
    tags: ['accounts', 'economics', 'math', 'english'],
    requiredTags: ['accounts'],
    difficulty: 7,
    careers: ['Chartered Accountant', 'Financial Analyst', 'Tax Consultant', 'CFO'],
    description: 'First step to becoming a CA. Tests accounting principles and business laws.',
    syllabusCoverage: 80,
    timeline: [
      { year: 2026, event: 'Clear CA Foundation', icon: '📚' },
      { year: 2031, event: 'Become CA', icon: '🎓' },
      { year: 2034, event: 'Financial Advisor', icon: '💼' },
      { year: 2038, event: 'CFO at MNC', icon: '💰' }
    ],
    color: '#14b8a6'
  },
  {
    id: 'cuet',
    name: 'CUET',
    tags: ['english', 'history', 'economics', 'math', 'biology'],
    requiredTags: [],
    difficulty: 5,
    careers: ['Delhi University Student', 'Researcher', 'Professor', 'Civil Servant'],
    description: 'Common University Entrance Test for central universities. Flexible subject combinations.',
    syllabusCoverage: 70,
    timeline: [
      { year: 2026, event: 'Clear CUET', icon: '🎯' },
      { year: 2029, event: 'Graduate from DU', icon: '🎓' },
      { year: 2032, event: 'UPSC Preparation', icon: '📖' },
      { year: 2035, event: 'IAS Officer', icon: '🏛️' }
    ],
    color: '#a855f7'
  },
  {
    id: 'nata',
    name: 'NATA',
    tags: ['math', 'design', 'physics'],
    requiredTags: ['math', 'design'],
    difficulty: 6,
    careers: ['Architect', 'Urban Planner', 'Landscape Designer', 'Interior Designer'],
    description: 'National Aptitude Test in Architecture. Tests drawing skills, mathematics, and architectural awareness.',
    syllabusCoverage: 75,
    timeline: [
      { year: 2026, event: 'Clear NATA', icon: '📐' },
      { year: 2031, event: 'B.Arch Degree', icon: '🎓' },
      { year: 2034, event: 'Licensed Architect', icon: '🏗️' },
      { year: 2038, event: 'Own Architecture Firm', icon: '🏢' }
    ],
    color: '#ec4899'
  },
  {
    id: 'icar-aieea',
    name: 'ICAR AIEEA',
    tags: ['agriculture', 'biology', 'chemistry', 'physics'],
    requiredTags: ['agriculture'],
    difficulty: 6,
    careers: ['Agricultural Scientist', 'Agronomist', 'Food Technologist', 'Research Officer'],
    description: 'For agricultural universities across India. Tests agriculture fundamentals and PCB concepts.',
    syllabusCoverage: 80,
    timeline: [
      { year: 2026, event: 'Clear ICAR AIEEA', icon: '🌾' },
      { year: 2030, event: 'BSc Agriculture', icon: '🎓' },
      { year: 2033, event: 'Agricultural Officer', icon: '👨‍🌾' },
      { year: 2037, event: 'Research Scientist', icon: '🔬' }
    ],
    color: '#84cc16'
  },
  {
    id: 'nest',
    name: 'NEST',
    tags: ['physics', 'chemistry', 'math', 'biology'],
    requiredTags: ['physics', 'chemistry'],
    difficulty: 8,
    careers: ['Research Scientist', 'Data Scientist', 'Professor', 'ISRO Scientist'],
    description: 'For integrated MSc at NISER and UM-DAE CEBS. For research-oriented students.',
    syllabusCoverage: 85,
    timeline: [
      { year: 2026, event: 'Clear NEST', icon: '🔬' },
      { year: 2031, event: 'Integrated MSc', icon: '🎓' },
      { year: 2034, event: 'PhD Research', icon: '📚' },
      { year: 2038, event: 'Senior Scientist', icon: '🧪' }
    ],
    color: '#06b6d4'
  },
  {
    id: 'hotel-management',
    name: 'NCHM JEE',
    tags: ['english', 'math', 'accounts'],
    requiredTags: ['english'],
    difficulty: 5,
    careers: ['Hotel Manager', 'Chef', 'Event Manager', 'Hospitality Consultant'],
    description: 'For hotel management institutes across India. Tests aptitude and general knowledge.',
    syllabusCoverage: 70,
    timeline: [
      { year: 2026, event: 'Clear NCHM JEE', icon: '🏨' },
      { year: 2030, event: 'Hotel Management Degree', icon: '🎓' },
      { year: 2033, event: 'Hotel Manager', icon: '👔' },
      { year: 2037, event: 'GM at 5-Star Hotel', icon: '⭐' }
    ],
    color: '#f59e0b'
  },
  {
    id: 'mass-comm',
    name: 'IIMC Entrance',
    tags: ['english', 'history', 'economics'],
    requiredTags: ['english'],
    difficulty: 6,
    careers: ['Journalist', 'News Anchor', 'Content Creator', 'Film Director'],
    description: 'For journalism and mass communication. Tests language skills and current affairs.',
    syllabusCoverage: 75,
    timeline: [
      { year: 2026, event: 'Clear IIMC Exam', icon: '📰' },
      { year: 2028, event: 'Journalism Diploma', icon: '🎓' },
      { year: 2031, event: 'Senior Reporter', icon: '🎤' },
      { year: 2035, event: 'Editor-in-Chief', icon: '📺' }
    ],
    color: '#f97316'
  },
  {
    id: 'bca-entrance',
    name: 'BCA Entrance Exams',
    tags: ['computer', 'math', 'english'],
    requiredTags: ['computer'],
    difficulty: 5,
    careers: ['Software Developer', 'App Developer', 'System Analyst', 'IT Consultant'],
    description: 'For Bachelor of Computer Applications. Alternative to engineering for IT careers.',
    syllabusCoverage: 75,
    timeline: [
      { year: 2026, event: 'BCA Admission', icon: '💻' },
      { year: 2029, event: 'BCA Degree', icon: '🎓' },
      { year: 2031, event: 'Software Developer', icon: '👨‍💻' },
      { year: 2035, event: 'Tech Lead', icon: '🚀' }
    ],
    color: '#6366f1'
  },
  {
    id: 'psychology',
    name: 'Psychology Entrance',
    tags: ['psychology', 'english', 'biology'],
    requiredTags: ['psychology'],
    difficulty: 5,
    careers: ['Clinical Psychologist', 'Counselor', 'HR Professional', 'Research Psychologist'],
    description: 'For BA/BSc Psychology programs. Growing field with diverse career options.',
    syllabusCoverage: 70,
    timeline: [
      { year: 2026, event: 'Psychology Admission', icon: '🧠' },
      { year: 2029, event: 'BA Psychology', icon: '🎓' },
      { year: 2031, event: 'Clinical Psychologist', icon: '👨‍⚕️' },
      { year: 2035, event: 'Private Practice', icon: '🏥' }
    ],
    color: '#d946ef'
  },
  {
    id: 'statistics',
    name: 'Statistics Programs',
    tags: ['statistics', 'math', 'computer'],
    requiredTags: ['statistics', 'math'],
    difficulty: 6,
    careers: ['Data Scientist', 'Statistician', 'Actuary', 'Business Analyst'],
    description: 'For BSc Statistics and Data Science. High-demand field in analytics and AI.',
    syllabusCoverage: 80,
    timeline: [
      { year: 2026, event: 'BSc Statistics', icon: '📊' },
      { year: 2029, event: 'Graduate', icon: '🎓' },
      { year: 2031, event: 'Data Analyst', icon: '💹' },
      { year: 2035, event: 'Lead Data Scientist', icon: '🧮' }
    ],
    color: '#0ea5e9'
  }
];

const ExamAlchemist = () => {
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [predictedExams, setPredictedExams] = useState([]);
  const [reactorState, setReactorState] = useState('idle'); // idle, processing, complete
  const [showTimeline, setShowTimeline] = useState(null);

  // Calculate which exams match selected subjects
  const calculateExams = (subjects) => {
    if (subjects.length === 0) {
      setPredictedExams([]);
      setReactorState('idle');
      return;
    }

    setReactorState('processing');

    // Calculate matches
    let matches = EXAM_DATABASE.map(exam => {
      const requiredMatch = exam.requiredTags.every(tag => subjects.includes(tag));
      const totalMatch = exam.tags.filter(tag => subjects.includes(tag)).length;
      const matchPercentage = (totalMatch / exam.tags.length) * 100;

      return {
        ...exam,
        matchPercentage,
        isRecommended: requiredMatch && matchPercentage >= 60,
        hasAnyMatch: totalMatch > 0
      };
    }).filter(exam => exam.isRecommended)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Fallback: If no exams match, show related exams with partial matches
    if (matches.length === 0) {
      matches = EXAM_DATABASE.map(exam => {
        const totalMatch = exam.tags.filter(tag => subjects.includes(tag)).length;
        const matchPercentage = (totalMatch / exam.tags.length) * 100;

        return {
          ...exam,
          matchPercentage,
          isFallback: true,
          hasAnyMatch: totalMatch > 0
        };
      }).filter(exam => exam.hasAnyMatch && exam.matchPercentage >= 30)
        .sort((a, b) => b.matchPercentage - a.matchPercentage)
        .slice(0, 5); // Show top 5 partial matches
    }

    console.log('Selected subjects:', subjects);
    console.log('Predicted exams:', matches.map(m => `${m.name} (${Math.round(m.matchPercentage)}%)${m.isFallback ? ' [Fallback]' : ''}`));

    // Simulate processing delay (reduced from 800ms to 300ms)
    setTimeout(() => {
      setPredictedExams(matches);
      setReactorState('complete');
    }, 300);
  };

  const handleSubjectToggle = (subjectId) => {
    const newSelected = selectedSubjects.includes(subjectId)
      ? selectedSubjects.filter(id => id !== subjectId)
      : [...selectedSubjects, subjectId];

    setSelectedSubjects(newSelected);
    calculateExams(newSelected);
  };

  const getReactorColor = () => {
    const subjectIds = selectedSubjects;
    if (subjectIds.includes('physics') && subjectIds.includes('math')) return '#06b6d4'; // Blue for Tech
    if (subjectIds.includes('biology')) return '#10b981'; // Green for Bio
    if (subjectIds.includes('english') || subjectIds.includes('legal')) return '#f59e0b'; // Orange for Arts
    if (subjectIds.includes('accounts')) return '#14b8a6'; // Teal for Commerce
    if (subjectIds.includes('design')) return '#ec4899'; // Pink for Creative
    return '#8b5cf6'; // Default purple
  };

  const getReactorMessage = () => {
    const subjects = selectedSubjects;
    if (subjects.includes('physics') && subjects.includes('math') && subjects.includes('chemistry')) {
      return 'Engineering Detected...';
    }
    if (subjects.includes('biology') && subjects.includes('chemistry')) {
      return 'Medical Path Detected...';
    }
    if (subjects.includes('math') && subjects.includes('biology')) {
      return 'PCMB - High Workload Path!';
    }
    if (subjects.includes('english') && subjects.includes('coding')) {
      return 'Management Path Emerging...';
    }
    if (subjects.includes('accounts') && subjects.includes('economics')) {
      return 'Commerce Stream Locked...';
    }
    if (subjects.includes('design')) {
      return 'Creative Career Unlocked...';
    }
    if (subjects.includes('fitness') && subjects.includes('physics')) {
      return 'Defense Services Detected...';
    }
    return selectedSubjects.length > 0 ? 'Analyzing Combination...' : 'Select Your Strong Subjects';
  };

  return (
    <section className="exam-alchemist">
      {/* Background Effects */}
      <div className="alchemist-bg">
        <div className="alchemist-grid" />
        <div className="alchemist-orb alchemist-orb-1" />
        <div className="alchemist-orb alchemist-orb-2" />
      </div>

      <div className="alchemist-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="alchemist-header"
        >
          <div className="alchemist-badge">
            <Sparkles size={16} />
            <span>Pre-Exam Career Discovery</span>
          </div>
          <h2 className="alchemist-title">
            The Exam Alchemist
          </h2>
          <p className="alchemist-subtitle">
            Don't know your rank yet? No problem. Tell us your <strong>strong subjects</strong>,
            and we'll reveal which entrance exams and careers align with your strengths.
          </p>
        </motion.div>

        {/* Main Interface - Split Screen */}
        <div className="alchemist-interface">

          {/* Left Side - Subject Inventory */}
          <div className="alchemist-inventory">
            <h3 className="inventory-title">
              <BookOpen size={20} />
              Your Subject Arsenal
            </h3>
            <p className="inventory-subtitle">Click subjects you're confident in</p>

            <div className="subject-grid">
              {SUBJECTS.map((subject) => {
                const Icon = subject.icon;
                const isSelected = selectedSubjects.includes(subject.id);

                return (
                  <motion.button
                    key={subject.id}
                    onClick={() => handleSubjectToggle(subject.id)}
                    className={`subject-bubble ${isSelected ? 'selected' : ''}`}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      '--subject-color': subject.color,
                      borderColor: isSelected ? subject.color : 'rgba(255, 255, 255, 0.1)',
                      background: isSelected
                        ? `linear-gradient(135deg, ${subject.color}20, ${subject.color}10)`
                        : 'rgba(255, 255, 255, 0.03)'
                    }}
                  >
                    <Icon size={24} style={{ color: subject.color }} />
                    <span>{subject.name}</span>
                    {isSelected && (
                      <motion.div
                        className="check-badge"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        style={{ background: subject.color }}
                      >
                        ✓
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Right Side - Reactor Core */}
          <div className="alchemist-reactor">
            <div className="reactor-container">
              <motion.div
                className={`reactor-core ${reactorState}`}
                animate={{
                  scale: reactorState === 'processing' ? [1, 1.1, 1] : 1,
                  rotate: reactorState === 'processing' ? 360 : 0
                }}
                transition={{
                  scale: { repeat: reactorState === 'processing' ? Infinity : 0, duration: 2 },
                  rotate: { repeat: reactorState === 'processing' ? Infinity : 0, duration: 3, ease: 'linear' }
                }}
                style={{
                  '--reactor-color': getReactorColor(),
                  boxShadow: selectedSubjects.length > 0
                    ? `0 0 60px ${getReactorColor()}80, inset 0 0 40px ${getReactorColor()}40`
                    : '0 0 40px rgba(139, 92, 246, 0.3)'
                }}
              >
                {/* Reactor Rings */}
                <div className="reactor-ring ring-1" />
                <div className="reactor-ring ring-2" />
                <div className="reactor-ring ring-3" />

                {/* Center Icon */}
                <div className="reactor-icon">
                  {reactorState === 'processing' ? (
                    <Zap size={48} />
                  ) : selectedSubjects.length > 0 ? (
                    <Target size={48} />
                  ) : (
                    <Atom size={48} />
                  )}
                </div>
              </motion.div>

              {/* Reactor Message */}
              <motion.p
                key={getReactorMessage()}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="reactor-message"
                style={{ color: getReactorColor() }}
              >
                {getReactorMessage()}
              </motion.p>

              {/* Selected Count */}
              {selectedSubjects.length > 0 && (
                <div className="reactor-stats">
                  <div className="stat-item">
                    <span className="stat-value">{selectedSubjects.length}</span>
                    <span className="stat-label">Subjects Selected</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">{predictedExams.length}</span>
                    <span className="stat-label">Exams Predicted</span>
                  </div>
                </div>
              )}

              {/* Predicted Exam Names Preview */}
              {predictedExams.length > 0 && reactorState === 'complete' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="predicted-exams-preview"
                >
                  <p className="preview-label">Recommended Exams:</p>
                  <div className="exam-chips">
                    {predictedExams.slice(0, 5).map((exam) => (
                      <span
                        key={exam.id}
                        className="exam-chip"
                        style={{ borderColor: exam.color, color: exam.color }}
                      >
                        {exam.name}
                      </span>
                    ))}
                    {predictedExams.length > 5 && (
                      <span className="exam-chip-more">
                        +{predictedExams.length - 5} more
                      </span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Results Section - Holographic Exam Cards */}
        <AnimatePresence mode="wait">
          {predictedExams.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="exam-results"
            >
              <h3 className="results-title">
                <Award size={24} />
                {predictedExams[0]?.isFallback
                  ? 'Related Exams You Might Consider'
                  : 'Your Personalized Exam Roadmap'}
              </h3>
              {predictedExams[0]?.isFallback && (
                <p style={{ textAlign: 'center', color: '#f59e0b', marginBottom: '2rem', fontSize: '0.95rem' }}>
                  💡 No perfect matches found. Here are exams with some overlapping subjects. Consider adding more related subjects for better recommendations.
                </p>
              )}

              <div className="exam-cards-grid">
                {predictedExams.map((exam, index) => (
                  <motion.div
                    key={exam.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="exam-card"
                    style={{ '--card-color': exam.color }}
                  >
                    {/* Header */}
                    <div className="exam-card-header">
                      <h4>{exam.name}</h4>
                      <div className="match-badge" style={{ background: exam.color }}>
                        {Math.round(exam.matchPercentage)}% Match
                      </div>
                    </div>

                    {/* Description */}
                    <p className="exam-description">{exam.description}</p>

                    {/* Difficulty Meter */}
                    <div className="difficulty-section">
                      <span className="difficulty-label">Difficulty Level</span>
                      <div className="difficulty-bar">
                        <motion.div
                          className="difficulty-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${exam.difficulty * 10}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          style={{ background: exam.color }}
                        />
                      </div>
                      <span className="difficulty-value">{exam.difficulty}/10</span>
                    </div>

                    {/* Syllabus Coverage */}
                    <div className="coverage-section">
                      <Sparkles size={16} />
                      <span>Your subjects cover <strong>{exam.syllabusCoverage}%</strong> of this exam</span>
                    </div>

                    {/* Career Unlocks */}
                    <div className="careers-section">
                      <h5>Career Unlocks</h5>
                      <div className="career-tags">
                        {exam.careers.map((career, idx) => (
                          <span key={idx} className="career-tag">{career}</span>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Button */}
                    <button
                      className="simulate-btn"
                      onClick={() => setShowTimeline(showTimeline === exam.id ? null : exam.id)}
                    >
                      <Clock size={16} />
                      {showTimeline === exam.id ? 'Hide Timeline' : 'Simulate Future'}
                      <ArrowRight size={16} />
                    </button>

                    {/* Timeline Simulation */}
                    <AnimatePresence>
                      {showTimeline === exam.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="timeline-container"
                        >
                          <div className="timeline">
                            {exam.timeline.map((event, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.15 }}
                                className="timeline-event"
                              >
                                <div className="timeline-year">{event.year}</div>
                                <div className="timeline-icon">{event.icon}</div>
                                <div className="timeline-text">{event.event}</div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {selectedSubjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="empty-state"
          >
            <Atom size={64} className="empty-icon" />
            <h3>Start Your Discovery</h3>
            <p>Select your strong subjects from the left to see which entrance exams align with your strengths.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ExamAlchemist;
