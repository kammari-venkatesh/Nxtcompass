import React from 'react';
import GlassCard from '../ui/GlassCard';

const StoryCard = ({ story }) => {
  return (
    <GlassCard className="story-card">
      <div className="story-card-content">
        <h3>{story.title}</h3>
        <p>{story.excerpt}</p>
        <span className="story-author">by {story.author}</span>
      </div>
    </GlassCard>
  );
};

export default StoryCard;
