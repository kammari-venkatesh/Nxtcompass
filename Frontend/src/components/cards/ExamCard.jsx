import React from 'react';
import GlassCard from '../ui/GlassCard';

const ExamCard = ({ exam }) => {
  return (
    <GlassCard className="exam-card">
      <div className="exam-card-content">
        <h3>{exam.name}</h3>
        <p>{exam.description}</p>
      </div>
    </GlassCard>
  );
};

export default ExamCard;
