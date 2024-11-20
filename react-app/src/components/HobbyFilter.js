import React, { useState } from 'react';
import './HobbyFilter.css';

function HobbyFilter({ onHobbyChange }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const hobbiesList = [
    'Sports',
    'Seminars',
    'Technical Seminars',
    'Coding',
    'Hackathons',
    'Cultural Events',
    'Tech Workshops',
    'Social Work',
    'Art',
    'Innovation',
    'Innovation & Research',
    'Community Service',
    'Community Outreach',
    'Music',
    'Entrepreneurship',
    'Research',
    'Research Projects',
    'Research & Development',
    'Industry Training',
    'Robotics'
  ];

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleHobbySelect = (hobby) => {
    const updatedHobbies = selectedHobbies.includes(hobby)
      ? selectedHobbies.filter((item) => item !== hobby)
      : [...selectedHobbies, hobby];

    setSelectedHobbies(updatedHobbies);
    onHobbyChange(updatedHobbies);
  };

  return (
    <div className="hobby-filter">
      <div className="hobby-filter-header" onClick={handleToggleDropdown}>
        Would you like to select colleges based on hobbies?
      </div>
      {showDropdown && (
        <div className="hobby-dropdown">
          {hobbiesList.map((hobby) => (
            <label key={hobby} className="hobby-option">
              <input
                type="checkbox"
                value={hobby}
                onChange={() => handleHobbySelect(hobby)}
                checked={selectedHobbies.includes(hobby)}
              />
              {hobby}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default HobbyFilter;