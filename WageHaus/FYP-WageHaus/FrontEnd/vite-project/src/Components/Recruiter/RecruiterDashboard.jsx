import React from 'react'
import RecruiterNavbar from './RecruiterNavbar'

import JobCard from './JobCard'
const RecruiterDashboard = () => {
  return (
    <div> <RecruiterNavbar/>
    <div className="flex justify-center items-center mt-8">
        <h1 className="text-4xl font-bold text-gray-800">My Listings</h1>
        
      </div>
      <JobCard />
    
    </div>
  )
}

export default RecruiterDashboard
