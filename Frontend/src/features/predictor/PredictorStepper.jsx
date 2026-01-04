import React, { useState } from 'react';

const PredictorStepper = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="stepper">
      <div className="stepper-header">
        {steps.map((step, index) => (
          <div key={index} className={`step ${index <= currentStep ? 'active' : ''}`}>
            <span>{index + 1}</span>
            <p>{step.label}</p>
          </div>
        ))}
      </div>
      <div className="stepper-content">
        {steps[currentStep].component}
      </div>
      <div className="stepper-actions">
        <button onClick={handlePrev} disabled={currentStep === 0}>Previous</button>
        <button onClick={handleNext} disabled={currentStep === steps.length - 1}>Next</button>
      </div>
    </div>
  );
};

export default PredictorStepper;
