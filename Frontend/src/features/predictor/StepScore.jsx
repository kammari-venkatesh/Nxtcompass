import React, { useState } from 'react';
import Input from '../../components/ui/Input';

const StepScore = ({ onSubmit }) => {
  const [score, setScore] = useState('');

  return (
    <div className="step-score">
      <h3>Enter Your Score</h3>
      <Input 
        type="number" 
        placeholder="Enter your score"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
    </div>
  );
};

export default StepScore;
