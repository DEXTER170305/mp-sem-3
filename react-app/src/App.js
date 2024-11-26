import React, { useState } from 'react';
import FilterSidebar from './components/FilterSidebar';
import CollegeList from './components/CollegeList';
import Header from './components/Header';
import HobbyFilter from './components/HobbyFilter';
import PercentileFilter from './components/PercentileFilter'; // Import Percentile Filter
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    branch: '',
    category: '',
    ownership: '',
    hobbies: [],
    homeUniversity: '',
    percentile: '', // Add percentile to filters
  });

  const handleFilterChange = (filterName, value) => {
    const updatedFilters = {
      ...filters,
      [filterName]: value === '' ? '' : value,
    };
    setFilters(updatedFilters);
  };

  const handleHobbyChange = (selectedHobbies) => {
    setFilters({
      ...filters,
      hobbies: selectedHobbies,
    });
  };

  const handlePercentileChange = (value) => {
    setFilters({
      ...filters,
      percentile: value,
    });
  };

  return (
    <div className="App">
      <Header />
      <HobbyFilter onHobbyChange={handleHobbyChange} />
      <PercentileFilter onPercentileChange={handlePercentileChange} />
      <div className="main-content">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        <CollegeList filters={filters} />
      </div>
    </div>
  );
}

export default App;
