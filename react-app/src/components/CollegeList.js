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
        if (filters.category) {
          queryParams.append('category', filters.category.toLowerCase());
        } else {
          queryParams.append('category', 'open'); // Default to 'open'
        }
        

        console.log("Query Params:", queryParams.toString());
        console.log("Query URL:", `http://localhost:5000/get-colleges?${queryParams.toString()}`);


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

      const matchesCity = filters.homeUniversity
        ? college.location.toLowerCase().includes(filters.homeUniversity.toLowerCase())
        : true;

      // Check if the college has at least one valid branch within the cutoff range
      const hasValidBranch = college.branches.some((branch) => {
        return (
          !filters.percentile || // If no percentile is provided, consider all branches valid
          (parseFloat(branch.cutoff) >= parseFloat(filters.percentile) - 3 &&
           parseFloat(branch.cutoff) <= parseFloat(filters.percentile) + 3)
        );
      });

      // Include the college only if all filters match and it has a valid branch
      return matchesBranch && matchesHobbies && matchesOwnership && matchesCity && hasValidBranch;
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
                <h5>Branches and Cutoffs:</h5>
                <table className="branch-table">
                  <thead>
                    <tr>
                      <th>Branch</th>
                      <th>Cutoff</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.branches
                      .filter((branch) => {
                        return (
                          !filters.percentile || // If no percentile is provided, show all branches
                          (parseFloat(branch.cutoff) >= parseFloat(filters.percentile) - 3 &&
                           parseFloat(branch.cutoff) <= parseFloat(filters.percentile) + 3)
                        );
                      })
                      .map((branch, idx) => (
                        <tr key={idx}>
                          <td>{branch.branchname}</td>
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
