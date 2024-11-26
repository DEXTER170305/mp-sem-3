import React from 'react';
import './PercentileFilter.css';

const PercentileFilter = ({ onPercentileChange }) => {
  const handlePercentileInput = (event) => {
    const value = event.target.value;
    if (onPercentileChange) {
      onPercentileChange(value);
    }
  };

  return (
    <div className="percentile-filter">
      <label htmlFor="percentile-input">Enter Percentile:</label>
      <input
        type="number"
        id="percentile-input"
        min="0"
        max="100"
        placeholder="e.g., 85"
        onChange={handlePercentileInput}
      />
    </div>
  );
};

export default PercentileFilter;
