import React, { useState } from 'react';
import FilterSidebar from './components/FilterSidebar';
import CollegeList from './components/CollegeList';
import Header from './components/Header';
import HobbyFilter from './components/HobbyFilter'; // New component for hobby filter
import './App.css';

function App() {
  const [filters, setFilters] = useState({
    branch: '',
    category: '',  // Added category for filtering colleges
    ownership: '',
    hobbies: []
  });

  const handleFilterChange = (filterName, value) => {
    const updatedFilters = {
      ...filters,
      [filterName]: value === '' ? '' : value,
    };
    console.log("Filter Updated:", updatedFilters); // Debug updated filters
    setFilters(updatedFilters);
  };
  
  const handleHobbyChange = (selectedHobbies) => {
    console.log("Hobby Filter Updated:", selectedHobbies); // Debug hobbies
    setFilters({
      ...filters,
      hobbies: selectedHobbies,
    });
  };
  
  console.log("Rendering App with Filters:", filters);
  

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
