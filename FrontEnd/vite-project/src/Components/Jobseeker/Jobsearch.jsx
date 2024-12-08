import React, { useState } from "react";
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
    <div className="jobsearch-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>WAGE HAUS</h1>
        </div>
        <ul className="navbar-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <button className="navbar-btn">Add Community</button>
      </nav>

      {/* Banner Section */}
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
  );
}

