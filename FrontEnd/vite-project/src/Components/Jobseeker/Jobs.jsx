import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaFilter, FaSearch } from 'react-icons/fa';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    salaryRange: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [jobseekerSkills, setJobseekerSkills] = useState([]);
  const [resumeLoading, setResumeLoading] = useState(true);

  const jobseekerEmail = localStorage.getItem('userEmail');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch jobs
        const jobsResponse = await axios.get('http://localhost:5000/api/jobs');
        const sortedJobs = jobsResponse.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Fetch jobseeker's resume to get skills
        const resumeResponse = await axios.get(`http://localhost:5000/api/resumes/by-email/${jobseekerEmail}`);
        if (resumeResponse.data && resumeResponse.data.skills) {
          const skillsArray = resumeResponse.data.skills.split(',').map(skill => skill.trim().toLowerCase());
          setJobseekerSkills(skillsArray);
        }
        
        setJobs(sortedJobs);
        setLoading(false);
        setResumeLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data.');
        setLoading(false);
        setResumeLoading(false);
      }
    };

    fetchData();
  }, [jobseekerEmail]);

  // Calculate job relevance based on skills match
  const calculateRelevance = (job) => {
    if (!jobseekerSkills.length || !job.skillsRequired) return 0;
    
    const jobSkills = job.skillsRequired.toLowerCase().split(',').map(skill => skill.trim());
    
    const matchedSkills = jobseekerSkills.filter(skill => 
      jobSkills.some(jobSkill => jobSkill.includes(skill)) || 
      jobSkills.some(jobSkill => skill.includes(jobSkill))
    );
    
    return matchedSkills.length;
  };

  // Sort jobs - if no skills matched, sort by date only
  const sortJobs = (jobs) => {
    // If no skills available, sort by date only
    if (!jobseekerSkills.length) {
      return [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Otherwise sort by relevance then date
    return jobs.map(job => ({
      ...job,
      relevance: calculateRelevance(job)
    })).sort((a, b) => {
      if (b.relevance !== a.relevance) {
        return b.relevance - a.relevance;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Filter jobs by time period
  const filterJobsByTimePeriod = (jobs, period) => {
    const now = new Date();
    let filtered = jobs;
    
    switch (period) {
      case 'weekly':
        filtered = jobs.filter((job) => (now - new Date(job.createdAt)) / (1000 * 60 * 60 * 24) <= 7);
        break;
      case 'monthly':
        filtered = jobs.filter((job) => (now - new Date(job.createdAt)) / (1000 * 60 * 60 * 24) <= 30);
        break;
      case 'yearly':
        filtered = jobs.filter((job) => (now - new Date(job.createdAt)) / (1000 * 60 * 60 * 24) <= 365);
        break;
      default:
        filtered = jobs;
    }
    
    return sortJobs(filtered);
  };

  // Handle search term change
  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Apply search and filters
  const applyFilters = (jobs) => {
    let filtered = jobs.filter((job) => {
      const matchesSearchTerm =
        job.jobTitle.toLowerCase().includes(searchTerm) ||
        job.companyName.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm);

      const matchesJobType = filters.jobType ? job.jobType === filters.jobType : true;
      const matchesLocation = filters.location ? job.location.toLowerCase().includes(filters.location.toLowerCase()) : true;

      const matchesSalary = filters.salaryRange
        ? (() => {
            const [min, max] = filters.salaryRange.split('-').map(Number);
            return job.salary >= min && job.salary <= max;
          })()
        : true;
      return matchesSearchTerm && matchesJobType && matchesLocation && matchesSalary;
    });
    
    return sortJobs(filtered);
  };

  // Handle search button click
  const handleSearchClick = () => {
    setShowFilters(false);
  };

  const handleQuickApply = async (job) => {
    try {
      const response = await axios.post('http://localhost:5000/api/applications/apply', {
        jobseekerEmail,
        recruiterEmail: job.email,
        jobTitle: job.jobTitle,
      });

      if (response.status === 201) {
        alert('Application submitted successfully!');
      }
    } catch (error) {
      console.error('Error applying for job:', error);
      alert('Failed to apply for the job. Please try again.');
    }
  };

  if (loading || resumeLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Apply search and filters to jobs
  const filteredJobs = applyFilters(jobs);

  // Get jobs for each category
  const weeklyJobs = filterJobsByTimePeriod(filteredJobs, 'weekly');
  const monthlyJobs = filterJobsByTimePeriod(filteredJobs, 'monthly');
  const yearlyJobs = filterJobsByTimePeriod(filteredJobs, 'yearly');

  return (
    <>
      {/* Search and filter section */}
      <div className="p-6">
        <div className="mx-auto mt-10 relative bg-white min-w-sm max-w-2xl flex flex-col md:flex-row items-center justify-center border py-2 px-2 rounded-2xl gap-2 shadow-2xl focus-within:border-gray-300">
          <input
            type="text"
            placeholder="Search for jobs..."
            className="px-6 py-2 w-full rounded-xl flex-1 outline-none bg-white"
            style={{ borderRadius: '9999px' }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium p-2 rounded-full flex items-center transition-all duration-300 shadow-md hover:shadow-lg"
            style={{ height: '32px', width: '32px' }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="text-xs" />
          </button>
          <button
            className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 border-black text-white active:scale-95 rounded-xl transition-all"
            onClick={handleSearchClick}
          >
            <span className="text-sm font-semibold truncate mx-auto">Search</span>
          </button>
        </div>

        {showFilters && (
          <div className="left-0 mt-2 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg z-10 p-4">
            <div className="flex space-x-4">
              <select
                name="jobType"
                value={filters.jobType}
                onChange={handleFilterChange}
                className="flex-1 border-2 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Job Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Contract">Contract</option>
              </select>

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={filters.location}
                onChange={handleFilterChange}
                className="flex-1 border-2 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 text-sm"
              />

              <select
                name="salaryRange"
                value={filters.salaryRange}
                onChange={handleFilterChange}
                className="flex-1 border-2 border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300 text-sm"
              >
                <option value="">All Salaries</option>
                <option value="0-50000">$0 - $50,000</option>
                <option value="50000-100000">$50,000 - $100,000</option>
                <option value="100000-150000">$100,000 - $150,000</option>
                <option value="150000-200000">$150,000 - $200,000</option>
                <option value="200000-999999">$200,000+</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Weekly Jobs Section */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Weekly Jobs</span>
          </h2>
          <p className="text-white opacity-80">Jobs posted in the last 7 days</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklyJobs.map((job) => (
            <JobCard 
              key={job._id} 
              job={job} 
              handleQuickApply={handleQuickApply} 
              setSelectedJob={setSelectedJob}
            />
          ))}
          {weeklyJobs.length === 0 && <p className="text-gray-600">No weekly jobs found.</p>}
        </div>
      </div>

      {/* Monthly Jobs Section */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Monthly Jobs</span>
          </h2>
          <p className="text-white opacity-80">Jobs posted in the last 30 days</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {monthlyJobs.map((job) => (
            <JobCard 
              key={job._id} 
              job={job} 
              handleQuickApply={handleQuickApply} 
              setSelectedJob={setSelectedJob}
            />
          ))}
          {monthlyJobs.length === 0 && <p className="text-gray-600">No monthly jobs found.</p>}
        </div>
      </div>

      {/* Yearly Jobs Section */}
      <div className="p-6">
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>Yearly Jobs</span>
          </h2>
          <p className="text-white opacity-80">Jobs posted in the last 365 days</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {yearlyJobs.map((job) => (
            <JobCard 
              key={job._id} 
              job={job} 
              handleQuickApply={handleQuickApply} 
              setSelectedJob={setSelectedJob}
            />
          ))}
          {yearlyJobs.length === 0 && <p className="text-gray-600">No yearly jobs found.</p>}
        </div>
      </div>

      {/* Modal for Job Details */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100">
          <div
            className="bg-white mt-12 overflow-y-auto rounded-lg shadow-lg max-w-xl w-full p-6"
            style={{ maxHeight: '80vh' }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedJob.jobTitle}</h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => setSelectedJob(null)}
              >
                ✕
              </button>
            </div>
            <p>
              <strong>Company:</strong> {selectedJob.companyName}
            </p>
            <p>
              <strong>Location:</strong> {selectedJob.location}
            </p>
            <p>
              <strong>Job Type:</strong> {selectedJob.jobType}
            </p>
            <p>
              <strong>Salary:</strong> ${selectedJob.salary} Per Year
            </p>
            <hr className="mt-4"></hr>
            <p className="mt-4">
              <strong>Description:</strong> <br />
              {selectedJob.description}
            </p>
            <p className="mt-2">
              <strong>Project Details:</strong> <br />
              {selectedJob.projectDetails}
            </p>
            <p className="mt-2">
              <strong>Skills Required:</strong> <br />
              {selectedJob.skillsRequired}
            </p>
            <div className="mt-6 flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md"
                onClick={() => setSelectedJob(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Simplified Job Card Component without skills match bar
const JobCard = ({ job, handleQuickApply, setSelectedJob }) => (
  <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6 flex flex-col justify-between h-80 transition-all duration-300 hover:shadow-xl">
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600 font-semibold">{job.companyName}</span>
        </div>
        <span className="text-sm text-gray-500">
          Posted on {new Date(job.createdAt).toLocaleDateString()}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-2">{job.jobTitle}</h2>

      <p className="text-sm text-gray-600 mb-4">{job.location}</p>

      <div className="flex space-x-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
          {job.jobType}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
          ${job.salary} Per Year
        </span>
      </div>

      <p className="text-sm text-gray-600 line-clamp-3 mb-6">{job.description}</p>
    </div>

    <div className="flex space-x-2">
      <button
        className="flex-1 inline-flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-md transition-all duration-300"
        onClick={() => handleQuickApply(job)}
      >
        Quick Apply
      </button>
      <button
        className="flex-1 inline-flex justify-center items-center bg-gray-700 text-gray-300 hover:bg-gray-200 hover:text-black text-sm font-medium py-2 px-4 rounded-md transition-all duration-300"
        onClick={() => setSelectedJob(job)}
      >
        View Details
      </button>
    </div>
  </div>
);

export default Jobs;