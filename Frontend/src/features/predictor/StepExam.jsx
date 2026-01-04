import React, { useState } from 'react';
import Input from '../../components/ui/Input';

const StepExam = ({ onSubmit }) => {
  const [exam, setExam] = useState('');

  return (
    <div className="step-exam">
      <h3>Select Your Exam</h3>
      <Input 
        type="text" 
        placeholder="Enter exam name"
        value={exam}
        onChange={(e) => setExam(e.target.value)}
      />
    </div>
  );
};

export default StepExam;
