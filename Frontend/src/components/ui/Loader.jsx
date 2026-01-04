import React from 'react';

const Loader = ({ size = 'medium' }) => {
  return (
    <div className={`loader loader-${size}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default Loader;
