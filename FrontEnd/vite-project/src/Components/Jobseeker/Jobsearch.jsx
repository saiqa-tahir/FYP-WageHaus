import React, { useState } from "react";
import SeekerNavbar from './SeekerNavbar'; 
import "./Jobsearch.css";

export default function Jobsearch() {
  const [searchInputs, setSearchInputs] = useState({
    jobName: "",
    salary: "",
    location: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs({ ...searchInputs, [name]: value });
  };

  return (
    <>
      <SeekerNavbar /> {}
      <div className="jobsearch-container">
        {}
        <div className="banner">
          <div className="search-section">
            <h2>Find Your Dream Job</h2>
            <div className="search-form">
              <input
                type="text"
                name="jobName"
                placeholder="Job Name"
                value={searchInputs.jobName}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="salary"
                placeholder="Minimum Salary"
                value={searchInputs.salary}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={searchInputs.location}
                onChange={handleInputChange}
              />
              <button>Search</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


