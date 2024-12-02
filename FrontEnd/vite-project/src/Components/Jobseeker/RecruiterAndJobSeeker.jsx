import React from 'react';
import { Link } from 'react-router-dom';
import "./RecruiterAndJobSeeker.css";

export default function RecruiterAndJobSeeker() {
  return (
    <div className="container">
      {/* Left Side */}
      <div className="left-side">
        <div className="content">
          <h1>Wage Haus</h1>
          <h2>The Career Making Platform</h2>
          <p>Connect to your dream job or find the ideal candidate with ease.</p>
        </div>
        <div className="side-menu">
          <h2 className="User">Select User</h2>
          <Link to="/login/recruiter">
            <button className="btn btn-warning btn-lg mb-3">Recruiter</button>
          </Link>
          <Link to="/login/jobseeker">
            <button className="btn btn-primary btn-lg">Job Seeker</button>
          </Link>
          <Link to="/login/Admin">
            <button className="btn btn-warning btn-lg">Admin</button>
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="right-side">
        <div className="design-content">
          <h3>Empowering Careers</h3>
          <p>Our AI-driven platform streamlines recruitment and job discovery.</p>
          <div className="image-placeholder">
            <img src='/jobimage.png' alt="Empowering Careers" className="image-content" />
          </div>
        </div>
      </div>
    </div>
  );
}