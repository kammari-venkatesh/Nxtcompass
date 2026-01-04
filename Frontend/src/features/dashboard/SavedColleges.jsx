import React from 'react';
import CollegeCard from '../../components/cards/CollegeCard';

const SavedColleges = () => {
  const [colleges, setColleges] = React.useState([]);

  return (
    <div className="saved-colleges">
      <h3>Saved Colleges</h3>
      <div className="colleges-grid">
        {colleges.map((college, index) => (
          <CollegeCard key={index} college={college} />
        ))}
      </div>
    </div>
  );
};

export default SavedColleges;
