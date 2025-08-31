import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
const ReportsByRecruiter = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      const res = await axios.get('http://localhost:5000/api/recruiter/reports');
      setReports(res.data);
    };
    fetchReports();
  }, []);

  const handleResolve = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/recruiter/reports/${id}`, { status: 'resolved', replyMessage });
      setReports(reports.map(report => report._id === id ? { ...report, status: 'resolved', replyMessage } : report));
      setSelectedReport(null);
      setReplyMessage('');
      alert('Reply sent successfully');
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  return (
    <div><AdminNavbar/>
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Reports by Recruiters</h2>
      <table className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Query</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report._id} className="border-b border-gray-200 hover:bg-gray-50">
              <td className="p-3">{report.email}</td>
              <td className="p-3">{report.query}</td>
              <td className="p-3">
                <span className={`px-3 py-1 rounded-full text-sm ${report.status === 'pending' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}`}>
                  {report.status}
                </span>
              </td>
              <td className="p-3">
                {report.status === 'pending' && (
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                  >
                    Resolve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Popup for sending reply */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h3 className="text-xl font-bold mb-4">Send Reply to {selectedReport.email}</h3>
            <textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Enter your reply..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleResolve(selectedReport._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ReportsByRecruiter;