import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Jobseekers.css'; // Optional for styling
import AdminNavbar from './AdminNavbar';

const Jobseekers = () => {
  const [recruiters, setRecruiters] = useState([]);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/recruiters');
      setRecruiters(response.data);
    } catch (error) {
      console.error('Error fetching recruiters:', error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/jobseekers/${id}`);
      setRecruiters((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting recruiter:', error);
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/auth/jobseekers/${id}/toggle-status`);
      fetchRecruiters(); // Refresh the list
    } catch (error) {
      console.error('Error toggling recruiter status:', error);
    }
  };

  return (
    <div className='bg-slate-200' >
      <AdminNavbar />
     
      <div className="flex justify-center items-center mt-8 bg-blend-color-burn">
        <h1 className="text-4xl font-bold text-gray-800 p-4">JobSeeker</h1>
      </div>
      <div className="recruiters-container ">
        {recruiters.map((recruiter) => (
          <div key={recruiter._id} className="recruiters-card ">
            <h3>{recruiter.email}</h3>
            <p>Status: {recruiter.isAllowed ? 'Allowed' : 'Disallowed'}</p>
            <div style={{ display: 'flex' }}>
              <button
                onClick={() => deleteUser(recruiter._id)}
                style={{
                  marginRight: '5%',
                  backgroundColor: '#2c3738', // Dark gray
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#2c3738')} // Darker gray on hover
                onMouseOut={(e) => (e.target.style.backgroundColor = '#2c3738')} // Reset to dark gray
                            >
                Delete
              </button>
              <button
                onClick={() => toggleStatus(recruiter._id)}
                style={{
                  marginRight: '5%',
                  backgroundColor: '#4a5568', // Dark gray
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#2d3748')} // Darker gray on hover
                onMouseOut={(e) => (e.target.style.backgroundColor = '#4a5568')} // Reset to dark gray
              >
                {recruiter.isAllowed ? 'Disallow' : 'Allow'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobseekers;