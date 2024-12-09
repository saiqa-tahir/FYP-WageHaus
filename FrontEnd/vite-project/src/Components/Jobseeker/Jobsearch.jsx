import React, { useState } from "react";
import SeekerNavbar from './SeekerNavbar'; 
import "./Jobsearch.css";

export default function Jobsearch() {
  const [searchInputs, setSearchInputs] = useState({
    jobName: "",
    salary: "",
    location: "",
  });

  const [jobResults, setJobResults] = useState([]); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchInputs({ ...searchInputs, [name]: value });
  };

  const handleSearch = () => {
    // Dummy job data with salary as number and location as city only
    const dummyJobs = [
      { id: 1, title: 'Software Engineer', salary: 120000, location: 'New York' },
      { id: 2, title: 'Frontend Developer', salary: 100000, location: 'San Francisco' },
      { id: 3, title: 'Backend Developer', salary: 110000, location: 'Austin' },
      { id: 4, title: 'Full Stack Developer', salary: 115000, location: 'Remote' },
      { id: 5, title: 'Data Scientist', salary: 130000, location: 'Chicago' },
    ];

    // Filter jobs based on user inputs
    const filteredJobs = dummyJobs.filter(job => 
      job.title.toLowerCase().includes(searchInputs.jobName.toLowerCase()) &&
      job.salary >= Number(searchInputs.salary) &&
      job.location.toLowerCase().includes(searchInputs.location.toLowerCase())
    );

    setJobResults(filteredJobs);
  };

  return (
    <>
      <SeekerNavbar /> 
      <div className="jobsearch-container">
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
                placeholder="City"
                value={searchInputs.location}
                onChange={handleInputChange}
              />
              <button onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>

        {/* Job Results Section */}
        <div className="job-results">
          {jobResults.length > 0 ? (
            jobResults.map((job) => (
              <div className="job-card" key={job.id}>
                <h3 className="job-title">{job.title}</h3>
                <p className="job-salary">${job.salary.toLocaleString()}</p> 
                <p className="job-location">{job.location}</p>
                <button className="apply-btn">Apply Now</button>
              </div>
            ))
          ) : (
            <p className="no-results">No jobs found. Please adjust your search criteria.</p>
          )}
        </div>
      </div>
    </>
  );
}


