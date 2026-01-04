import { motion, AnimatePresence } from 'framer-motion';
import { Filter, MapPin, DollarSign, GraduationCap, Target, X, RotateCcw, Sparkles } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters, allResults, isMobileOpen, closeMobile }) => {
  const uniqueStates = [...new Set(allResults.map(r => r.college?.state).filter(Boolean))].sort();
  const uniqueBranches = [...new Set(allResults.map(r => r.branch).filter(Boolean))].sort();

  const handleStateToggle = (state) => {
    setFilters(prev => ({
      ...prev,
      states: prev.states.includes(state)
        ? prev.states.filter(s => s !== state)
        : [...prev.states, state]
    }));
  };

  const handleBranchToggle = (branch) => {
    setFilters(prev => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter(b => b !== branch)
        : [...prev.branches, branch]
    }));
  };

  const handleProbabilityToggle = (level) => {
    setFilters(prev => ({
      ...prev,
      probabilityLevels: prev.probabilityLevels.includes(level)
        ? prev.probabilityLevels.filter(l => l !== level)
        : [...prev.probabilityLevels, level]
    }));
  };

  const resetFilters = () => {
    setFilters({
      states: [],
      branches: [],
      feeRange: [0, 500000],
      probabilityLevels: []
    });
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 backdrop-blur-2xl border-r border-white/10 shadow-2xl">

      {/* Glow Effect */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50" />
              <div className="relative p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
                <Filter className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">Smart Filters</h2>
          </div>
          {isMobileOpen && (
            <motion.button
              onClick={closeMobile}
              whileTap={{ scale: 0.9 }}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>
        <p className="text-sm text-gray-400">Refine your college matches</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-8">

          {/* Probability Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-emerald-500/20 rounded-lg">
                <Target className="w-4 h-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Admission Chance</h3>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Safe Bet', emoji: '🟢', value: 'safe', subtitle: '80%+ match', gradient: 'from-emerald-500/10 to-green-500/10', border: 'emerald-500/30', text: 'emerald-300' },
                { label: 'Moderate', emoji: '🟡', value: 'moderate', subtitle: '50-79% match', gradient: 'from-amber-500/10 to-yellow-500/10', border: 'amber-500/30', text: 'amber-300' },
                { label: 'Ambitious', emoji: '🔴', value: 'ambitious', subtitle: 'Below 50%', gradient: 'from-rose-500/10 to-red-500/10', border: 'rose-500/30', text: 'rose-300' }
              ].map(({ label, emoji, value, subtitle, gradient, border, text }) => (
                <motion.label
                  key={value}
                  whileHover={{ x: 4 }}
                  className={`relative flex items-center gap-3 cursor-pointer p-4 rounded-xl bg-gradient-to-r ${gradient} border border-${border} backdrop-blur-xl transition-all ${
                    filters.probabilityLevels.includes(value) ? 'ring-2 ring-cyan-500/50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.probabilityLevels.includes(value)}
                    onChange={() => handleProbabilityToggle(value)}
                    className="w-5 h-5 rounded-lg accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{emoji}</span>
                      <span className={`text-sm font-bold text-${text}`}>{label}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* State Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                <MapPin className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Location</h3>
            </div>

            <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar pr-2">
              {uniqueStates.slice(0, 25).map(state => (
                <motion.label
                  key={state}
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl backdrop-blur-xl transition-all ${
                    filters.states.includes(state)
                      ? 'bg-purple-500/20 border border-purple-500/50'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.states.includes(state)}
                    onChange={() => handleStateToggle(state)}
                    className="w-4 h-4 rounded accent-purple-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-300 font-medium">{state}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* Branch Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-orange-500/20 rounded-lg">
                <GraduationCap className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Branch</h3>
            </div>

            <div className="flex flex-wrap gap-2">
              {uniqueBranches.map(branch => (
                <motion.button
                  key={branch}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBranchToggle(branch)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-bold transition-all overflow-hidden ${
                    filters.branches.includes(branch)
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }`}
                >
                  {filters.branches.includes(branch) && (
                    <div className="absolute inset-0 bg-white/20" />
                  )}
                  <span className="relative">{branch}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Fee Range Slider */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-amber-500/20 rounded-lg">
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-bold text-white">Annual Budget</h3>
            </div>

            <div className="space-y-4 px-2">
              <div className="relative pt-2">
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="10000"
                  value={filters.feeRange[1]}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    feeRange: [0, parseInt(e.target.value)]
                  }))}
                  className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer slider-thumb"
                  style={{
                    background: `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${(filters.feeRange[1] / 500000) * 100}%, rgba(255,255,255,0.1) ${(filters.feeRange[1] / 500000) * 100}%, rgba(255,255,255,0.1) 100%)`
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">₹0</span>
                <div className="px-4 py-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-xl border border-amber-500/30 backdrop-blur-xl">
                  <span className="text-sm font-bold text-amber-300">
                    ₹{(filters.feeRange[1] / 100000).toFixed(1)}L
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">₹5L</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Footer */}
      <div className="relative p-6 border-t border-white/10 bg-gradient-to-t from-black/20 to-transparent">
        <motion.button
          onClick={resetFilters}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-5 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset All Filters
        </motion.button>
      </div>
    </div>
  );

  if (!isMobileOpen) {
    return (
      <div className="hidden lg:block w-80 h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      exit={{ x: -320 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed inset-y-0 left-0 w-80 z-50 lg:hidden"
    >
      {sidebarContent}
    </motion.div>
  );
};

export default FilterSidebar;
