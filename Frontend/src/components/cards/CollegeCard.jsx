import React from 'react';
import GlassCard from '../ui/GlassCard';

const CollegeCard = ({ college }) => {
  return (
    <GlassCard className="college-card">
      <div className="college-card-content">
        <h3>{college.name}</h3>
        <p>{college.location}</p>
        <div className="college-stats">
          <span>Ranking: {college.ranking}</span>
          <span>NIRF: {college.nirf}</span>
        </div>
      </div>
    </GlassCard>
  );
};

export default CollegeCard;
