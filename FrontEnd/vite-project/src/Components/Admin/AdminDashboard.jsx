import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import './admin.css'; // Import the CSS file for styling
import Jobs from '../Jobseeker/Jobs';
import JobCard from '../Recruiter/JobCard';
const AdminDashboard = () => {
  const [jobseekers, setJobseekers] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetching all jobseekers and recruiters initially
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No token found, please login again.');
          return;
        }

        // Fetch jobseekers
        const { data: jobseekersData } = await axios.get('http://localhost:5000/api/auth/jobseekers', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobseekers(jobseekersData);

        // Fetch recruiters
        const { data: recruitersData } = await axios.get('http://localhost:5000/api/auth/recruiters', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecruiters(recruitersData);

      } catch (err) {
        setError('Error fetching users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <AdminNavbar />
      <Jobs/>
      
      </div>
  );
};

export default AdminDashboard;
