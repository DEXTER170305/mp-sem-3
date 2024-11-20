import React from 'react';

const FilterSidebar = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>
      <div>
        <label>Branch</label>
        <select onChange={(e) => onFilterChange('branch', e.target.value)}>
          <option value="">All</option>
          <option value="Engineering">Engineering</option>
          <option value="Commerce">Commerce</option>
          <option value="IT">Information Technology</option>
          {/* Add more branches as needed */}
        </select>
      </div>
      <div>
        <label>Home University</label>
        <select onChange={(e) => onFilterChange('homeUniversity', e.target.value)}>
          <option value="">All</option>
          <option value="University A">University A</option>
          <option value="University B">University B</option>
          {/* Add more universities */}
        </select>
      </div>
      <div>
        <label>Ownership</label>
        <select onChange={(e) => onFilterChange('ownership', e.target.value)}>
          <option value="">All</option>
          <option value="Private">Private</option>
          <option value="Government">Government</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
