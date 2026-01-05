import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Eye, Heart, Search, TrendingUp, MapPin, DollarSign, GraduationCap, Sparkles, ChevronDown, X, Home } from 'lucide-react';
import MegaFooter from '../../components/footer/MegaFooter';
import { getSavedColleges as getSavedCollegesAPI, toggleSaveCollege, removeSavedCollege as removeSavedCollegeAPI } from '../../api/savedColleges';
import { savePredictorResult } from '../../api/predictorResults';
import { useAuth } from '../auth/context/AuthContext';
import { mockResults } from '../../data/mockColleges';
import './PredictorResults.css';

const PredictorResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    states: [],
    branches: [],
    feeRange: [0, 500000],
    probabilityLevels: [],
    searchQuery: ''
  });
  const [sortBy, setSortBy] = useState('probability-desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [savedColleges, setSavedColleges] = useState([]);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [isLoadingSaved, setIsLoadingSaved] = useState(false);

  // Get data from navigation state or use mock data
  const results = location.state?.results || mockResults;
  const input = location.state?.input || { rank: 5000, category: 'General', exam: 'JEE Main' };

  // Save predictor result on mount (only once, only if authenticated and has real data)
  useEffect(() => {
    const saveResult = async () => {
      if (!isAuthenticated || !location.state?.input) return;

      try {
        const topResult = results[0];
        await savePredictorResult({
          exam: input.exam || 'JEE Main',
          input,
          resultsCount: results.length,
          topMatch: topResult ? {
            collegeName: topResult.college?.name,
            branch: topResult.branch,
            probability: topResult.probability
          } : null
        });
        console.log('✅ Predictor result saved');
      } catch (error) {
        console.error('Failed to save predictor result:', error);
      }
    };

    saveResult();
  }, []); // Empty dependency array - run only once on mount

  // Fetch saved colleges on mount (only if authenticated)
  useEffect(() => {
    const fetchSavedColleges = async () => {
      if (!isAuthenticated) {
        setSavedColleges([]);
        return;
      }

      try {
        setIsLoadingSaved(true);
        const savedData = await getSavedCollegesAPI();
        // Backend now returns populated college objects
        // Extract just the IDs for checking saved state
        const savedIds = savedData.map(college => college._id);
        setSavedColleges(savedIds || []);
      } catch (error) {
        console.error('Failed to fetch saved colleges:', error);
        // If not authenticated or error, keep empty array
        setSavedColleges([]);
      } finally {
        setIsLoadingSaved(false);
      }
    };

    fetchSavedColleges();
  }, [isAuthenticated]);

  const itemsPerPage = 12;

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    if (filters.searchQuery) {
      filtered = filtered.filter(r =>
        r.college?.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    if (filters.states.length > 0) {
      filtered = filtered.filter(r => filters.states.includes(r.college?.state));
    }

    if (filters.branches.length > 0) {
      filtered = filtered.filter(r => filters.branches.includes(r.branch));
    }

    filtered = filtered.filter(r => {
      const fee = r.college?.fees?.general || 0;
      return fee >= filters.feeRange[0] && fee <= filters.feeRange[1];
    });

    if (filters.probabilityLevels.length > 0) {
      filtered = filtered.filter(r => {
        if (filters.probabilityLevels.includes('safe') && r.probability >= 80) return true;
        if (filters.probabilityLevels.includes('moderate') && r.probability >= 50 && r.probability < 80) return true;
        if (filters.probabilityLevels.includes('ambitious') && r.probability < 50) return true;
        return false;
      });
    }

    switch (sortBy) {
      case 'probability-desc':
        filtered.sort((a, b) => b.probability - a.probability);
        break;
      case 'probability-asc':
        filtered.sort((a, b) => a.probability - b.probability);
        break;
      case 'fees-asc':
        filtered.sort((a, b) => (a.college?.fees?.general || 0) - (b.college?.fees?.general || 0));
        break;
      case 'fees-desc':
        filtered.sort((a, b) => (b.college?.fees?.general || 0) - (a.college?.fees?.general || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [results, filters, sortBy]);

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const paginatedResults = filteredResults.slice(0, currentPage * itemsPerPage);

  const handleSaveCollege = async (collegeId) => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/auth/login');
      return;
    }

    try {
      console.log('💾 Saving college with ID:', collegeId);

      // Find the college details to show what we're saving
      const collegeDetails = results.find(r => r.college?._id === collegeId);
      if (collegeDetails) {
        console.log(`📖 College: ${collegeDetails.college?.name} - ${collegeDetails.branch}`);
      }

      const result = await toggleSaveCollege(collegeId);
      console.log('✅ Toggle result:', result);

      if (result.saved) {
        setSavedColleges(prev => {
          const updated = [...prev, collegeId];
          console.log('📚 Updated saved colleges (added):', updated);
          console.log('📊 Total saved:', updated.length);
          return updated;
        });
      } else {
        setSavedColleges(prev => {
          const updated = prev.filter(id => id !== collegeId);
          console.log('📚 Updated saved colleges (removed):', updated);
          console.log('📊 Total saved:', updated.length);
          return updated;
        });
      }
    } catch (error) {
      console.error('❌ Failed to toggle save college:', error);
    }
  };

  const handleRemoveCollege = async (collegeId) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await removeSavedCollegeAPI(collegeId);
      setSavedColleges(prev => prev.filter(id => id !== collegeId));
    } catch (error) {
      console.error('Failed to remove saved college:', error);
    }
  };

  // Get saved colleges details
  const savedCollegesDetails = useMemo(() => {
    return results.filter(r => savedColleges.includes(r.college?._id));
  }, [results, savedColleges]);

  const allStates = [...new Set(results.map(r => r.college?.state))];
  const allBranches = [...new Set(results.map(r => r.branch))];

  const ProbabilityRing = ({ probability }) => {
    const getColorClass = () => {
      if (probability >= 80) return 'emerald';
      if (probability >= 50) return 'amber';
      return 'rose';
    };

    const colorClass = getColorClass();
    const circumference = 2 * Math.PI * 28;
    const offset = circumference - (probability / 100) * circumference;

    return (
      <div className="pr-ring">
        <svg className="pr-ring-svg" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" className="pr-ring-bg" />
          <circle
            cx="32"
            cy="32"
            r="28"
            className={`pr-ring-progress pr-ring-progress-${colorClass}`}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="pr-ring-text-wrapper">
          <span className={`pr-ring-text pr-ring-text-${colorClass}`}>
            {probability}%
          </span>
        </div>
      </div>
    );
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter(item => item !== value)
        : [...prev[filterType], value]
    }));
    setCurrentPage(1);
  };

  return (
    <div className="pr-container">

      {/* Aurora Background */}
      <div className="pr-aurora-bg">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 100, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="pr-aurora-orb-1"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, -100, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="pr-aurora-orb-2"
        />
      </div>

      <div className="pr-content">

        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="pr-hero"
        >
          <h1 className="pr-title">
            <span className="pr-title-gradient">Your Future Awaits</span>
          </h1>
          <div className="pr-stats">
            <div className="pr-stat-card">
              <span className="pr-stat-label">
                {input.rank ? 'Your Rank' : input.percentile ? 'Percentile' : input.score ? 'Score' : 'Your Rank'}
              </span>
              <p className="pr-stat-value">
                {input.rank?.toLocaleString() || input.percentile || input.score || 'N/A'}
              </p>
            </div>
            <div className="pr-stat-card">
              <span className="pr-stat-label">Category</span>
              <p className="pr-stat-value">{input.category || 'General'}</p>
            </div>
            <div className="pr-stat-card">
              <span className="pr-stat-label">Exam</span>
              <p className="pr-stat-value">{input.exam || 'JEE Main'}</p>
            </div>
            <div className="pr-stat-card pr-stat-card-success">
              <span className="pr-stat-label pr-stat-label-success">Matches Found</span>
              <p className="pr-stat-value pr-stat-value-success">
                {filteredResults.length}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pr-filters-wrapper"
        >
          <div className="pr-filters-container">

            {/* Filter Header */}
            <div className="pr-filter-header">
              <div className="pr-filter-title-wrapper">
                <div className="pr-filter-icon-box">
                  <Filter className="w-5 h-5 text-white" />
                </div>
                <h2 className="pr-filter-title">Filters & Search</h2>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilters({
                  states: [],
                  branches: [],
                  feeRange: [0, 500000],
                  probabilityLevels: [],
                  searchQuery: ''
                })}
                className="pr-reset-btn"
              >
                Reset All
              </motion.button>
            </div>

            {/* Search Bar */}
            <div className="pr-search-wrapper">
              <Search className="pr-search-icon" />
              <input
                type="text"
                placeholder="Search colleges by name..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                className="pr-search-input"
              />
            </div>

            <div className="pr-filter-grid">

              {/* Match Level */}
              <div className="pr-filter-group">
                <label className="pr-filter-label">
                  <TrendingUp className="w-4 h-4" />
                  Match Level
                </label>
                <div className="pr-filter-buttons">
                  {[
                    { id: 'safe', label: 'Safe', emoji: '🎯', color: 'emerald' },
                    { id: 'moderate', label: 'Moderate', emoji: '⚡', color: 'amber' },
                    { id: 'ambitious', label: 'Dream', emoji: '🚀', color: 'rose' }
                  ].map(level => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => toggleFilter('probabilityLevels', level.id)}
                      className={`pr-filter-btn ${
                        filters.probabilityLevels.includes(level.id)
                          ? `pr-filter-btn-active-${level.color}`
                          : ''
                      }`}
                    >
                      <span>{level.emoji}</span>
                      <span>{level.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Branches */}
              <div className="pr-filter-group">
                <label className="pr-filter-label">
                  <GraduationCap className="w-4 h-4" />
                  Branch
                </label>
                <div className="pr-filter-scroll">
                  <div className="pr-filter-buttons">
                    {allBranches.map(branch => (
                      <motion.button
                        key={branch}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleFilter('branches', branch)}
                        className={`pr-filter-btn ${
                          filters.branches.includes(branch)
                            ? 'pr-filter-btn-active-blue'
                            : ''
                        }`}
                      >
                        <span>{branch}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* States */}
              <div className="pr-filter-group">
                <label className="pr-filter-label">
                  <MapPin className="w-4 h-4" />
                  State
                </label>
                <div className="pr-filter-scroll">
                  <div className="pr-filter-buttons">
                    {allStates.map(state => (
                      <motion.button
                        key={state}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleFilter('states', state)}
                        className={`pr-filter-btn ${
                          filters.states.includes(state)
                            ? 'pr-filter-btn-active-violet'
                            : ''
                        }`}
                      >
                        <span>{state}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="pr-filter-group">
                <label className="pr-filter-label">
                  <Sparkles className="w-4 h-4" />
                  Sort By
                </label>
                <div className="pr-sort-wrapper">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pr-sort-select"
                  >
                    <option value="probability-desc">Best Match First</option>
                    <option value="probability-asc">Long Shots First</option>
                    <option value="fees-asc">Cheapest First</option>
                    <option value="fees-desc">Premium First</option>
                  </select>
                  <ChevronDown className="pr-sort-icon" />
                </div>

                {/* Active Filters Count */}
                <div className="pr-active-filters">
                  <p className="pr-active-filters-text">
                    {filters.states.length + filters.branches.length + filters.probabilityLevels.length} Active Filters
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="pr-results-grid">
            {paginatedResults.map((college, index) => (
                <motion.div
                  key={`${college.college?._id}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="pr-card"
                >
                  <div className="pr-card-overlay" />

                <div className="pr-card-content">

                  {/* Header with Logo & Probability */}
                  <div className="pr-card-header">
                    <div className="pr-card-info">
                      <div className="pr-card-logo">
                        {college.college?.name[0]}
                      </div>
                      <div>
                        <h3 className="pr-card-title">
                          {college.college?.name}
                        </h3>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                          {college.branch}
                        </p>
                      </div>
                    </div>
                    <ProbabilityRing probability={college.probability} />
                  </div>

                  {/* Info Badges */}
                  <div className="pr-badges">
                    <div className="pr-badge pr-badge-violet">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{college.college?.state}</span>
                    </div>
                    <div className="pr-badge pr-badge-amber">
                      <DollarSign className="w-4 h-4 flex-shrink-0" />
                      <span>₹{(college.college?.fees?.general / 100000).toFixed(1)}L/yr</span>
                    </div>
                  </div>

                  {/* Branch Badge - Prominent Display */}
                  <div style={{
                    marginTop: '0.75rem',
                    marginBottom: '0.75rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '0.5rem',
                      color: '#60a5fa',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}>
                      <GraduationCap className="w-4 h-4" />
                      <span>{college.branch}</span>
                    </div>
                  </div>

                  {/* Rank Bar */}
                  <div className="pr-rank-bar-wrapper">
                    <div className="pr-rank-labels">
                      <span>Your: {college.yourRank.toLocaleString()}</span>
                      <span>Cut: {college.cutoffRank.toLocaleString()}</span>
                    </div>
                    <div className="pr-rank-bar-track">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (college.cutoffRank / college.yourRank) * 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.05 }}
                        className={`pr-rank-bar-fill ${
                          college.probability >= 80 ? 'pr-rank-bar-emerald' :
                          college.probability >= 50 ? 'pr-rank-bar-amber' :
                          'pr-rank-bar-rose'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pr-card-actions">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(`/college/details/${college.college?._id}`)}
                      className="pr-btn pr-btn-view"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleSaveCollege(college.college?._id)}
                      className={`pr-btn pr-btn-save ${
                        savedColleges.includes(college.college?._id)
                          ? 'pr-btn-save-active'
                          : ''
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${savedColleges.includes(college.college?._id) ? 'fill-current' : ''}`} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          {currentPage < totalPages && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pr-load-more-wrapper"
            >
              <div className="pr-load-more-actions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  className="pr-load-more-btn"
                >
                  Load More Colleges
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(139, 92, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="pr-home-btn"
                >
                  <Home className="w-5 h-5" />
                  <span>Home</span>
                </motion.button>
              </div>
              <p className="pr-load-more-text">
                Showing {paginatedResults.length} of {filteredResults.length} results
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Saved Colleges Drawer */}
      <AnimatePresence>
        {savedColleges.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="pr-saved-drawer"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSavedDrawer(!showSavedDrawer)}
              className="pr-saved-btn"
            >
              <Heart className="w-5 h-5 fill-current" />
              <span>Saved ({savedColleges.length})</span>
            </motion.button>

            {/* Saved Colleges Panel */}
            <AnimatePresence>
              {showSavedDrawer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pr-saved-panel"
                >
                  <div className="pr-saved-header">
                    <h3 className="pr-saved-title">Your Saved Colleges</h3>
                    <button
                      onClick={() => setShowSavedDrawer(false)}
                      className="pr-saved-close"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="pr-saved-list">
                    {savedCollegesDetails.map((college) => (
                      <motion.div
                        key={college.college?._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="pr-saved-item"
                      >
                        <div className="pr-saved-item-info">
                          <div className="pr-saved-item-logo">
                            {college.college?.name[0]}
                          </div>
                          <div>
                            <h4 className="pr-saved-item-name">{college.college?.name}</h4>
                            <p className="pr-saved-item-branch">{college.branch}</p>
                          </div>
                        </div>

                        <div className="pr-saved-item-actions">
                          <span className="pr-saved-item-probability">
                            {college.probability}% match
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveCollege(college.college?._id)}
                            className="pr-saved-item-remove"
                            title="Remove from saved"
                          >
                            <X className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <MegaFooter />
    </div>
  );
};

export default PredictorResults;
