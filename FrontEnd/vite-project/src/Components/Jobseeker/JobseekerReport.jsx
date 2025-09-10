import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SeekerNavbar from './SeekerNavbar';

const JobseekerReport = () => {
  const [query, setQuery] = useState('');
  const [reports, setReports] = useState([]);
  const userEmail = localStorage.getItem('userEmail');

  // Function to fetch reports
  const fetchReports = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/reports/${userEmail}`);
      setReports(res.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Failed to fetch reports. Please try again.');
    }
  };

  // Fetch reports on component mount
  useEffect(() => {
    fetchReports();
  }, [userEmail]);

  // Handle report submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/reports', {
        email: userEmail,
        query,
        status: 'pending',
      });
      alert('Report submitted successfully');
      setQuery('');
      fetchReports(); // Refresh reports after submission
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    }
  };

  return (
    <div>
      <SeekerNavbar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Report an Issue</h2>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            placeholder="Describe your issue here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
          />
          <button
            type="submit"
            className="mt-4 bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
          >
            Submit
          </button>
        </form>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Your Reports</h3>

            <button
              onClick={fetchReports}
              className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>

            </button>
          </div>
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-gradient-to-r from-gray-50 to-purple-50 p-6 rounded-lg shadow-lg mb-6 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Query Section */}
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-600">Query:</span> {report.query}
                </p>
              </div>

              {/* Status Section */}
              <div className="flex items-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-gray-700">
                  <span className="font-semibold text-gray-600">Status:</span>{' '}
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      report.status === 'Resolved'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {report.status}
                  </span>
                </p>
              </div>

              {/* Admin Reply Section */}
              {report.replyMessage && (
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                  <p className="text-gray-700">
                    <span className="font-semibold text-gray-600">Admin Reply:</span>{' '}
                    {report.replyMessage}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobseekerReport;