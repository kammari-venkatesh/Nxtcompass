import React, { useState } from 'react';

const StepCategory = ({ onSubmit }) => {
  const [category, setCategory] = useState('');

  return (
    <div className="step-category">
      <h3>Select Stream/Category</h3>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Select Category</option>
        <option value="engineering">Engineering</option>
        <option value="medical">Medical</option>
        <option value="commerce">Commerce</option>
        <option value="arts">Arts</option>
      </select>
    </div>
  );
};

export default StepCategory;
