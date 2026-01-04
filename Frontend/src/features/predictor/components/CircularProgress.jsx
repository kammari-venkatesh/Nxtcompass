import { motion } from 'framer-motion';

const CircularProgress = ({ value, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  // Neon color based on probability
  const getColor = () => {
    if (value >= 80) return {
      stroke: '#10b981',
      glow: 'rgba(16, 185, 129, 0.6)',
      text: 'text-emerald-400'
    };
    if (value >= 50) return {
      stroke: '#f59e0b',
      glow: 'rgba(245, 158, 11, 0.6)',
      text: 'text-amber-400'
    };
    return {
      stroke: '#ef4444',
      glow: 'rgba(239, 68, 68, 0.6)',
      text: 'text-rose-400'
    };
  };

  const colors = getColor();

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Outer glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-2xl opacity-40"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`
        }}
      />

      <svg width={size} height={size} className="transform -rotate-90 relative z-10">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle with glow */}
        <defs>
          <filter id={`glow-${value}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          filter={`url(#glow-${value})`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`text-3xl font-extrabold ${colors.text} drop-shadow-lg`}
          >
            {value}%
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default CircularProgress;
