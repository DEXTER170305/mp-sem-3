import React from 'react';

const FilterSidebar = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>
      <div>
        {/* Category filter */}
        <div>
          <label>Category</label>
          <select onChange={(e) => onFilterChange('category', e.target.value)}>
            <option value="">All</option>
            <option value="OPEN">OPEN</option>
            <option value="EWS">EWS</option>
            <option value="OBC">OBC</option>
            <option value="TFWS">TFWS</option>
            <option value="ST">ST</option>
          </select>
        </div>
        
        {/* Branch filter */}
        <div>
          <label>Branch</label>
          <select onChange={(e) => onFilterChange('branch', e.target.value)}>
            <option value="">All</option>
            <option value="Computer Science and Engineering">Computer Science and Engineering</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Data Science">Data Science</option>
            <option value="Mechanical Engineering">Mechanical Engineering</option>
            <option value="Electrical Engineering">Electrical Engineering</option>
            <option value="Civil Engineering">Civil Engineering</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics and Communication Engineering">Electronics and Communication Engineering</option>
            <option value="Mechanical Design Engineering">Mechanical Design Engineering</option>
            <option value="Automobile Engineering">Automobile Engineering</option>
          </select>
        </div>

        {/* Ownership filter */}
        <div>
          <label>Ownership</label>
          <select onChange={(e) => onFilterChange('ownership', e.target.value)}>
            <option value="">All</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Government-aided Autonomus">Government-aided Autonomus</option>
            <option value="Un-aided Autonomus">Un-aided Autonomus</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
