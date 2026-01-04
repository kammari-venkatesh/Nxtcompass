import React, { useState } from 'react';

const StepPreferences = ({ onSubmit }) => {
  const [preferences, setPreferences] = useState({
    location: '',
    collegeType: '',
    budgetRange: ''
  });

  return (
    <div className="step-preferences">
      <h3>Your Preferences</h3>
      <div className="preferences-form">
        <input 
          type="text" 
          placeholder="Preferred location"
          value={preferences.location}
          onChange={(e) => setPreferences({...preferences, location: e.target.value})}
        />
        <select value={preferences.collegeType} onChange={(e) => setPreferences({...preferences, collegeType: e.target.value})}>
          <option value="">College Type</option>
          <option value="government">Government</option>
          <option value="private">Private</option>
        </select>
      </div>
    </div>
  );
};

export default StepPreferences;
