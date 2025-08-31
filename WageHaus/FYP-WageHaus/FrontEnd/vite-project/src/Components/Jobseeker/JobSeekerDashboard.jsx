import React from 'react';
import SeekerNavbar from './SeekerNavbar';
import Jobs from '../Jobseeker/Jobs';
const JobSeekerDashboard = () => {
  return (
    <div className='bg-gray-100'>
      <SeekerNavbar />
      <div className="flex justify-center items-center mt-8">
        <h1 className="text-4xl font-bold text-gray-800">Find Your Job Here</h1>
      </div>
      <Jobs/>
    </div>
  );
};

export default JobSeekerDashboard;
