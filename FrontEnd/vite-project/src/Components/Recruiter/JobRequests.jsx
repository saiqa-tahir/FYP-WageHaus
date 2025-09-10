import React, { useState, useEffect } from 'react'; // Add useState and useEffect
import axios from 'axios';
import RecruiterNavbar from './RecruiterNavbar';
const JobRequests = () => {
  const [applications, setApplications] = useState([]);
  const recruiterEmail = localStorage.getItem('userEmail'); // Get recruiter's email from local storage

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/applications/${recruiterEmail}`);
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, [recruiterEmail]);

  // Function to handle PDF download and open in new tab
  const handleViewResume = async (resumeId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/resumes/generate-pdf/${resumeId}`, {
        responseType: 'blob', // Ensure the response is handled as binary data
      });

      // Create a Blob from the PDF data
      const file = new Blob([response.data], { type: 'application/pdf' });

      // Generate a URL for the Blob
      const fileURL = URL.createObjectURL(file);

      // Open the PDF in a new tab
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Error fetching resume PDF:', error);
    }
  };

  return (
 <div><RecruiterNavbar/>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Job Applications</h2>
      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application._id} className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-700"><span className="font-semibold">Jobseeker Email:</span> {application.jobseekerEmail}</p>
            <p className="text-gray-700 mt-2"><span className="font-semibold">Job Title:</span> {application.jobTitle}</p>
            <p className="text-gray-700 mt-2"><span className="font-semibold">Status:</span> {application.status}</p>

            {/* Replace <a> tag with a button */}
            <button
              onClick={() => handleViewResume(application.resumeId._id)}
              className="mt-4 inline-block bg-cyan-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              View Resume
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default JobRequests;