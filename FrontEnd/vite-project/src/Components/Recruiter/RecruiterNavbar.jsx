import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostJobPopup from './PostJobPopup'; // Import the popup component

const RecruiterNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [jobPopupOpen, setJobPopupOpen] = useState(false); // State for popup visibility
  const userEmail = localStorage.getItem('userEmail');

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleJobPopup = () => setJobPopupOpen(!jobPopupOpen);

  return (
    <>
      <nav className="bg-gray-800 sticky top-0">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center">
            <div className="flex flex-1 items-center space-x-4">
              <img
                className="h-8 w-auto"
                src="/Logo.jpg"
                alt="Your Company"
              />
              <Link to="/recruiter-dashboard" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
                Dashboard
              </Link>
              <Link to="/applications" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Applications
              </Link>
              <Link to="/recruiter-report" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
               Report an Issue
              </Link>
            </div>
            <button
              type="button"
              onClick={toggleJobPopup}
              className="text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 mt-2 mr-10 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              + Post Job
            </button>
            <div className="relative ml-auto">
              <button
                onClick={toggleMenu}
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-expanded={menuOpen}
              >
                <span className="sr-only">Open user menu</span>
                <img className="h-8 w-8 rounded-full object-cover" src="/profile-img.jpg" alt="" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700"
                    onClick={() => {
                      toggleSidebar();
                      toggleMenu();
                    }}
                  >
                    Your Profile
                  </Link>
                  {/* <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700">
                    Settings
                  </Link> */}
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700">
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="fixed top-0 right-0 h-full w-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 shadow-lg">
          <button className="absolute top-4 right-4 text-gray-700 hover:text-red-500" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="p-6 space-y-6">
            <h2 className="text-xl text-center font-bold text-gray-800">User Profile</h2>
            <div className="flex flex-col items-center justify-center space-y-3">
              <img
                className="h-20 w-20 rounded-full shadow-md object-cover"
                src="/profile-img.jpg"
                alt="User Avatar"
              />
              <h2 className="text-lg font-semibold text-gray-800">Saiqa Tahir</h2>
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
            <div className="space-y-4">
              <Link to="/edit-profile">
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                  Edit Profile
                </button>
              </Link>
              <Link to="/logout">
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">
                  Logout
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Job Post Popup */}
      <PostJobPopup isOpen={jobPopupOpen} onClose={toggleJobPopup} />
    </>
  );
};

export default RecruiterNavbar;
