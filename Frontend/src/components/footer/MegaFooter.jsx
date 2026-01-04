import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Sparkles, Brain, MessageCircle, TrendingUp,
  Stethoscope, Briefcase, Scale, Palette, Instagram, Linkedin,
  Twitter, Youtube, Send, AlertCircle, Users, Megaphone, Mail
} from 'lucide-react';
import './MegaFooter.css';

const MegaFooter = () => {
  const [email, setEmail] = useState('');
  const [onlineCount] = useState(14203);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  const platformTools = [
    { name: 'College Predictor', link: '/predictor' },
    { name: 'Career Manifesto', link: '/manifesto' },
    { name: 'The Clarity Quiz', link: '/quiz' },
    { name: 'AI Mentor Chat', link: '/chat' }
  ];

  const topStreams = [
    { name: 'Engineering (B.Tech)', icon: GraduationCap, link: '/streams/engineering' },
    { name: 'Medical (MBBS)', icon: Stethoscope, link: '/streams/medical' },
    { name: 'Management (MBA)', icon: Briefcase, link: '/streams/management' },
    { name: 'Law (CLAT)', icon: Scale, link: '/streams/law' },
    { name: 'Design (NIFT)', icon: Palette, link: '/streams/design' }
  ];

  const helpDesk = [
    { name: 'Report an Error', icon: AlertCircle },
    { name: 'College Partners', icon: Users },
    { name: 'Advertise with Us', icon: Megaphone },
    { name: 'Student Grievances', icon: Mail }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, link: '#', color: '#E4405F' },
    { name: 'LinkedIn', icon: Linkedin, link: '#', color: '#0077B5' },
    { name: 'Twitter', icon: Twitter, link: '#', color: '#1DA1F2' },
    { name: 'YouTube', icon: Youtube, link: '#', color: '#FF0000' }
  ];

  const seoTags = [
    'Top Engineering Colleges in India',
    'Best MBA Colleges in Delhi',
    'JEE Advanced 2026 Cutoff',
    'NEET Rank Predictor 2026',
    'VITEEE Rank vs Marks',
    'CSE vs IT Comparison',
    'Top Medical Colleges',
    'IIT Bombay Admission Process',
    'BITS Pilani BITSAT',
    'NIT Trichy Placements',
    'IIIT Hyderabad Cutoff',
    'Best Engineering Colleges in Bangalore',
    'Top Colleges in Hyderabad',
    'JEE Main Counselling',
    'NEET Counselling 2026',
    'Career After 12th',
    'Engineering Branch Selector',
    'College Comparison Tool',
    'Scholarship Information',
    'Hostel Facilities Ranking',
    'Placement Records 2025',
    'Top Private Colleges',
    'Government Engineering Colleges',
    'Medical College Fees',
    'MBA Entrance Exams'
  ];

  return (
    <footer className="mega-footer">
      {/* Constellation Background */}
      <div className="mega-footer-background" />

      {/* Top Glow Line */}
      <div className="mega-footer-glow-line" />

      {/* Content Container */}
      <div className="mega-footer-content">

        {/* Layer 1: Call to Orbit CTA */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mega-footer-cta"
        >
          <div className="mega-footer-cta-content">
            <div className="mega-footer-cta-left">
              <h2 className="mega-footer-cta-title">
                Ready to find your dream college?
              </h2>
              <p className="mega-footer-cta-subtitle">
                Join thousands of students on their journey to success
              </p>
            </div>

            <div className="mega-footer-cta-right">
              <form onSubmit={handleSubscribe} className="mega-footer-subscribe">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email for exam alerts..."
                  className="mega-footer-input"
                  required
                />
                <button type="submit" className="mega-footer-subscribe-btn">
                  <Send size={18} />
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Layer 2: Navigation Matrix - 5 Columns */}
        <div className="mega-footer-matrix">

          {/* Column 1: Brand Identity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mega-footer-column mega-footer-brand"
          >
            <Link to="/" className="mega-footer-logo">
              <span className="mega-footer-logo-icon">◆</span>
              NxtCompass
            </Link>
            <p className="mega-footer-tagline">
              Navigating Futures, One Algorithm at a Time.
            </p>
            <div className="mega-footer-live-stat">
              <span className="mega-footer-live-dot"></span>
              <span className="mega-footer-live-text">
                {onlineCount.toLocaleString()} Students Online Now
              </span>
            </div>
          </motion.div>

          {/* Column 2: Platform Tools */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mega-footer-column"
          >
            <h3 className="mega-footer-column-title">Tools</h3>
            <ul className="mega-footer-links">
              {platformTools.map((tool, index) => (
                <li key={index}>
                  <Link to={tool.link} className="mega-footer-link">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Top Streams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mega-footer-column"
          >
            <h3 className="mega-footer-column-title">Top Streams</h3>
            <ul className="mega-footer-links">
              {topStreams.map((stream, index) => {
                const Icon = stream.icon;
                return (
                  <li key={index}>
                    <Link to={stream.link} className="mega-footer-link mega-footer-link-icon">
                      <Icon size={14} />
                      {stream.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Column 4: Help Desk */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mega-footer-column"
          >
            <h3 className="mega-footer-column-title">Help Desk</h3>
            <ul className="mega-footer-links">
              {helpDesk.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index}>
                    <a href="#" className="mega-footer-link mega-footer-link-icon">
                      <Icon size={14} />
                      {item.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.div>

          {/* Column 5: Social Matrix */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mega-footer-column"
          >
            <h3 className="mega-footer-column-title">Connect</h3>
            <div className="mega-footer-social">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mega-footer-social-btn"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = social.color;
                      e.currentTarget.style.boxShadow = `0 0 20px ${social.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Icon size={20} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Layer 3: SEO Bedrock */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mega-footer-seo"
        >
          <h4 className="mega-footer-seo-title">Quick Search</h4>
          <div className="mega-footer-tags">
            {seoTags.map((tag, index) => (
              <motion.a
                key={index}
                href="#"
                className="mega-footer-tag"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.02 }}
              >
                {tag}
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Layer 4: Legal Dock */}
        <div className="mega-footer-legal">
          <div className="mega-footer-legal-left">
            © 2026 NxtCompass. All Systems Nominal.
          </div>
          <div className="mega-footer-legal-right">
            <a href="#" className="mega-footer-legal-link">Privacy Policy</a>
            <span className="mega-footer-legal-divider">|</span>
            <a href="#" className="mega-footer-legal-link">Terms of Service</a>
            <span className="mega-footer-legal-divider">|</span>
            <a href="#" className="mega-footer-legal-link">Data Usage</a>
          </div>
        </div>
      </div>

      {/* Wave Animation */}
      <div className="mega-footer-wave">
        <svg viewBox="0 0 1200 40" preserveAspectRatio="none">
          <path
            d="M0,20 Q300,0 600,20 T1200,20 L1200,40 L0,40 Z"
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </footer>
  );
};

export default MegaFooter;
