import React, { useState } from 'react';
import FilterSidebar from './components/FilterSidebar';
import CollegeList from './components/CollegeList';
import Header from './components/Header';
import HobbyFilter from './components/HobbyFilter'; // New component for hobby filter
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    branch: '',
    homeUniversity: '',
    ownership: '',
    hobbies: []
  });

  const handleFilterChange = (filterName, value) => {
    setFilters({
      ...filters,
      [filterName]: value,
    });
  };

  const handleHobbyChange = (selectedHobbies) => {
    setFilters({
      ...filters,
      hobbies: selectedHobbies,
    });
  };

  return (
    <div className="App">
      <Header />
      <HobbyFilter onHobbyChange={handleHobbyChange} />
      <div className="main-content">
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
        <CollegeList filters={filters} />
      </div>
    </div>
  );
}

export default App;
