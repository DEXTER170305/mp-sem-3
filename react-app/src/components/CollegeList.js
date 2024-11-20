import React, { useState, useEffect } from 'react';
import './CollegeList.css';

const CollegeList = ({ filters }) => {
  const [expanded, setExpanded] = useState({});
  const [colleges, setColleges] = useState([]); // Store fetched data
  const [filteredColleges, setFilteredColleges] = useState([]);

  // Fetch college data from the backend
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await fetch('http://localhost:5000/get-colleges');
        const data = await response.json();
        setColleges(data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching colleges:', error);
      }
    };

    fetchColleges();
  }, []); // Empty dependency array ensures this runs once when component mounts

  // Filter colleges based on selected filters
  useEffect(() => {
    const filtered = colleges.filter((college) => {
      // Check branch filter
      const matchesBranch = filters.branch
        ? college.branches.some((branch) => branch.name.toLowerCase().includes(filters.branch.toLowerCase()))
        : true;

      // Check hobbies filter
      const matchesHobbies = filters.hobbies.length
        ? filters.hobbies.every((hobby) => college.hobbies.includes(hobby))
        : true;

      return matchesBranch && matchesHobbies;
    });

    setFilteredColleges(filtered);
  }, [filters, colleges]);

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="college-list">
      {filteredColleges.length > 0 ? (
        filteredColleges.map((college, index) => (
          <div key={index} className="college-card">
            <h4 onClick={() => toggleExpand(index)} className="college-name">
              {college.name} <span>({college.institutionCode})</span>
              <span className="arrow">{expanded[index] ? '▲' : '▼'}</span>
            </h4>
            {expanded[index] && (
              <div className="college-details">
                <p><strong>Location:</strong> {college.location}</p>
                <p><strong>NIRF Rank:</strong> {college.nirfRank}</p>
                <p><strong>Branch:</strong> {college.branch}</p>
                <p><strong>Fees:</strong> {college.fee}</p>
                <p><strong>Average Package:</strong> {college.avgPackage}</p>
                <p><strong>Cutoff:</strong> {college.cutoff}</p>
                <h5>Branches and Cutoffs:</h5>
                <table className="branch-table">
                  <thead>
                    <tr>
                      <th>Branch</th>
                      <th>Cutoff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.branches.map((branch, branchIndex) => (
                      <tr key={branchIndex}>
                        <td>{branch.name}</td>
                        <td>{branch.cutoff}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No colleges match the selected filters.</p>
      )}
    </div>
  );
};

export default CollegeList;
