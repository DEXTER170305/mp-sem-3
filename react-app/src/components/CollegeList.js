import React, { useState, useEffect } from 'react';
import './CollegeList.css';

const CollegeList = ({ filters }) => {
  const [expanded, setExpanded] = useState({});
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log("useEffect triggered with filters:", filters);

    const fetchColleges = async () => {
      console.log("Fetch function invoked");
      setLoading(true);
      setError('');
      try {
        const queryParams = new URLSearchParams();

        if (filters.branch) queryParams.append('branch', filters.branch);
        if (filters.hobbies.length > 0) queryParams.append('hobbies', filters.hobbies.join(','));

        console.log("Query Params:", queryParams.toString());

        const response = await fetch(`http://localhost:5000/get-colleges?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();

        console.log("Received Data:", data);
        setColleges(data);
      } catch (err) {
        console.error("Error occurred:", err);
        setError('An error occurred while fetching colleges.');
      } finally {
        setLoading(false);
      }
    };

    fetchColleges();
  }, [filters]);

  useEffect(() => {
    const filtered = colleges.filter((college) => {
      const matchesBranch = filters.branch
        ? college.branches.some((b) => b.branchname.toLowerCase().includes(filters.branch.toLowerCase()))
        : true;
      const matchesHobbies = filters.hobbies.length
        ? filters.hobbies.every((hobby) => college.hobbies.includes(hobby))
        : true;
      const matchesOwnership = filters.ownership
        ? college.status.toLowerCase().includes(filters.ownership.toLowerCase())
        : true;

      return matchesBranch && matchesHobbies && matchesOwnership;
    });

    // Sort filtered colleges by NIRF Rank (ascending)
    const sortedColleges = filtered.sort((a, b) => {
      const nirfA = a.nirfrank === 'N/A' ? Infinity : parseInt(a.nirfrank); // Handle N/A ranks
      const nirfB = b.nirfrank === 'N/A' ? Infinity : parseInt(b.nirfrank); // Handle N/A ranks
      return nirfA - nirfB;
    });

    console.log("Filtered and Sorted Colleges:", sortedColleges);
    setFilteredColleges(sortedColleges);
  }, [colleges, filters]);

  const toggleExpand = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="college-list">
      {loading && <p>Loading colleges...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {filteredColleges.length > 0 ? (
        filteredColleges.map((college, index) => (
          <div key={index} className="college-card">
            <h4 onClick={() => toggleExpand(index)} className="college-name">
              {college.name} <span>({college.institutioncode})</span>
              <span className="arrow">{expanded[index] ? '▲' : '▼'}</span>
            </h4>
            {expanded[index] && (
              <div className="college-details">
                <p><strong>Location:</strong> {college.location}</p>
                <p><strong>NIRF Rank:</strong> {college.nirfrank}</p>
                <p><strong>Hobbies:</strong> {college.hobbies.join(', ')}</p>
                <p><strong>Status:</strong> {college.status}</p>
                <p><strong>University:</strong> {college.university}</p>
                <p><strong>Branches:</strong></p>
                <ul>
                  {college.branches.map((branch, idx) => (
                    <li key={idx}>
                      {branch.branchname} (Cutoff: {branch.cutoff})
                    </li>
                  ))}
                </ul>
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
