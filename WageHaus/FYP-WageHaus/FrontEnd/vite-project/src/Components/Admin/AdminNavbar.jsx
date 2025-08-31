import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const userEmail = localStorage.getItem('userEmail'); // Get email from localStorage

  return (
    <>
    <div className='bg-slate-200'>
      <nav className="bg-gray-800 sticky top-0">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center justify-start space-x-4">
              <img
                className="h-8 w-auto"
                src="/Logo.jpg"
                alt="Your Company"
              />
              <Link to="/admin-dashboard" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white">
                Dashboard
              </Link>
              <Link to="/jobseekers" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                JobSeekers
              </Link>
              <Link to="/recruiters" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Recruiters
              </Link>
              <Link to="/seeker-reports" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                JobSeeker Reports
              </Link>
              <Link to="/recruiter-reports" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Recruiter Reports
              </Link>
            </div>

            {/* Right side - Profile Button */}
            <div className="relative ml-6">
              <button
                onClick={toggleMenu}
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-expanded={menuOpen}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="/profile-img.jpg"
                  alt="Profile"
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <button
                    className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700"
                    onClick={() => {
                      toggleSidebar();
                      toggleMenu();
                    }}
                  >
                    Your Profile
                  </button>
                  {/* <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700"
                  >
                    Settings
                  </Link> */}
                  <Link
                    to="/"
                    className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700"
                  >
                    Sign out
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="fixed top-19 right-0 h-full w-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 shadow-lg">
          <button className="absolute top-4 right-4 text-gray-700 hover:text-red-500" onClick={toggleSidebar}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
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
              <h2 className="text-lg font-semibold text-gray-800">ADMIN</h2>
              <p className="text-sm text-gray-600">{userEmail || 'No email found'}</p>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default AdminNavbar;
