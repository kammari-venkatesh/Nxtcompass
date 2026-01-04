import React from 'react';
import GlassCard from '../../components/ui/GlassCard';

const DashboardHome = () => {
  return (
    <section className="dashboard-home">
      <h2>Dashboard</h2>
      <div className="dashboard-grid">
        <GlassCard>
          <h3>Saved Colleges</h3>
          <p>View your saved colleges</p>
        </GlassCard>
        <GlassCard>
          <h3>Quiz History</h3>
          <p>View your quiz attempts</p>
        </GlassCard>
        <GlassCard>
          <h3>Predictions</h3>
          <p>View your college predictions</p>
        </GlassCard>
      </div>
    </section>
  );
};

export default DashboardHome;
