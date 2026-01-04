import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, Heart, GraduationCap, IndianRupee, Eye, TrendingUp, Sparkles } from 'lucide-react';
import CircularProgress from './CircularProgress';

const CollegeCard = ({ college, index, onSave, isSaved }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getProbabilityColor = (prob) => {
    if (prob >= 80) return 'emerald';
    if (prob >= 50) return 'amber';
    return 'rose';
  };

  const getBranchGradient = (branch) => {
    const gradients = {
      'CSE': 'from-blue-600 via-cyan-500 to-blue-600',
      'IT': 'from-purple-600 via-pink-500 to-purple-600',
      'ECE': 'from-orange-600 via-red-500 to-orange-600',
      'EEE': 'from-yellow-600 via-orange-500 to-yellow-600',
      'MECH': 'from-slate-600 via-gray-500 to-slate-600',
      'CIVIL': 'from-green-600 via-emerald-500 to-green-600',
      'MBBS': 'from-red-600 via-rose-500 to-red-600',
      'BDS': 'from-pink-600 via-rose-500 to-pink-600',
      'AI-ML': 'from-violet-600 via-purple-500 to-violet-600',
    };
    return gradients[branch] || 'from-indigo-600 via-blue-500 to-indigo-600';
  };

  const formatFees = (fees) => {
    if (!fees) return 'N/A';
    if (fees >= 100000) return `${(fees / 100000).toFixed(2)}L`;
    return `${(fees / 1000).toFixed(0)}K`;
  };

  const probabilityColor = getProbabilityColor(college.probability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1]
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative h-full"
    >
      {/* Glow Effect on Hover */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${getBranchGradient(college.branch)} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-all duration-500`} />

      {/* Main Card */}
      <div className="relative h-full bg-gradient-to-br from-slate-800/90 via-slate-700/80 to-slate-800/90 rounded-2xl border border-white/20 overflow-hidden backdrop-blur-xl shadow-2xl flex flex-col">

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(6,182,212,0.4),rgba(255,255,255,0))]" />
        </div>

        {/* Top Gradient Bar */}
        <div className={`h-1.5 w-full bg-gradient-to-r ${getBranchGradient(college.branch)}`} />

        {/* Content Container */}
        <div className="relative flex-1 flex flex-col p-5">

          {/* Header Row */}
          <div className="flex items-start justify-between mb-3">
            {/* College Name */}
            <div className="flex-1 pr-3 min-h-[60px] flex flex-col justify-center">
              <h3 className="text-base font-bold text-white leading-snug line-clamp-2 mb-1.5">
                {college.college?.name || 'Unknown College'}
              </h3>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="line-clamp-1">{college.college?.city}, {college.college?.state}</span>
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              onClick={onSave}
              whileTap={{ scale: 0.9 }}
              className={`flex-shrink-0 p-2 rounded-lg transition-all ${
                isSaved
                  ? 'bg-rose-500/20 border border-rose-500/50'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Heart className={`w-4 h-4 transition-all ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            </motion.button>
          </div>

          {/* Probability Ring - Centered */}
          <div className="flex justify-center my-4">
            <div className="relative">
              <CircularProgress value={college.probability} size={90} strokeWidth={7} />

              {/* Floating Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-xs font-bold backdrop-blur-xl border whitespace-nowrap
                  ${college.label === 'HIGH'
                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                    : college.label === 'MODERATE'
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  }`}
              >
                {college.label}
              </motion.div>
            </div>
          </div>

          {/* Branch Badge */}
          <div className="flex justify-center mb-4">
            <div className={`relative px-4 py-1.5 rounded-lg bg-gradient-to-r ${getBranchGradient(college.branch)} shadow-lg`}>
              <div className="absolute inset-0 bg-white/20 rounded-lg backdrop-blur-sm" />
              <div className="relative flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-bold text-white tracking-wide">{college.branch}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 p-2.5">
              <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/10 rounded-full blur-xl" />
              <div className="relative">
                <p className="text-xs text-blue-300 mb-0.5 font-medium">Cutoff</p>
                <p className="text-sm font-bold text-white truncate">{college.cutoffRank?.toLocaleString()}</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-2.5">
              <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/10 rounded-full blur-xl" />
              <div className="relative">
                <p className="text-xs text-purple-300 mb-0.5 font-medium">Your Rank</p>
                <p className="text-sm font-bold text-white truncate">{college.yourRank?.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Margin Indicator */}
          <div className={`relative overflow-hidden rounded-lg p-2.5 mb-3 ${
            college.margin > 0
              ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/30'
              : 'bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/30'
          }`}>
            <div className="flex items-center justify-center gap-1.5">
              <TrendingUp className={`w-3.5 h-3.5 flex-shrink-0 ${college.margin > 0 ? 'text-emerald-400' : 'text-rose-400 rotate-180'}`} />
              <span className={`text-xs font-bold ${college.margin > 0 ? 'text-emerald-300' : 'text-rose-300'} truncate`}>
                {college.margin > 0 ? '+' : ''}{college.margin?.toLocaleString()} ranks
              </span>
            </div>
          </div>

          {/* Reason */}
          <div className="mb-3 p-2.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm min-h-[50px] flex items-center">
            <p className="text-xs text-gray-400 italic leading-relaxed line-clamp-2">
              {college.reason}
            </p>
          </div>

          {/* Fees */}
          {college.college?.fees && (
            <div className="mb-3 p-2.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <IndianRupee className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-xs text-amber-300 font-medium truncate">Annual Fees</span>
                </div>
                <span className="text-sm font-bold text-amber-200 whitespace-nowrap">
                  ₹{formatFees(college.college.fees.general)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-auto grid grid-cols-2 gap-2.5 pt-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative px-3 py-2.5 rounded-lg bg-gradient-to-r ${getBranchGradient(college.branch)} font-bold text-white text-xs shadow-lg overflow-hidden group`}
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center justify-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                View
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-3 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 font-bold text-white text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Compare
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default CollegeCard;
