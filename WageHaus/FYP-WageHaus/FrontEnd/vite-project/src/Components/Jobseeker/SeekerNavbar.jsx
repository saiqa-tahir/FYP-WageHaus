import React, { useState } from 'react';
import CreateResume from './CreateResume';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const SeekerNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const togglePopup = () => setPopupOpen(!popupOpen);
  const userEmail = localStorage.getItem('userEmail'); 

  // Handle View Resume
  const handleViewResume = async () => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      console.error('User email not found in localStorage');
      return;
    }
  
    try {
      const response = await axios.get(`http://localhost:5000/api/resumes/download/${userEmail}`, {
        responseType: 'blob', // Ensure the response is handled as binary data
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank'); // Open PDF in a new tab
    } catch (error) {
      console.error('Error fetching resume PDF:', error);
    }
  };

  return (
    <>
      <nav className="bg-gray-800 sticky top-0">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Left side - Navigation items */}
            <div className="flex flex-1 items-center justify-start space-x-4">
              <img
                className="h-8 w-auto"
                src="/Logo.jpg"
                alt="WAGE HAUS"
              />
              <a href="/jobseeker-dashboard" className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white" aria-current="page">Dashboard</a>
              <Link to="/community" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Community</Link>
              {/* <a href="#" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">Projects</a> */}
              
              {/* Replacing Calendar with Report an Issue */}
              <Link to="/jobseeker-report" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                Report an Issue
              </Link>
            </div>

            {/* Right side - Profile button */}
            <div className="relative ml-3">
              <button
                onClick={toggleMenu}
                className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-expanded={menuOpen}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="h-8 w-8 rounded-full object-cover"
                  src="/profile-img.jpg"
                  alt=""
                />
              </button>
              {menuOpen && (
                <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700" role="menuitem" onClick={() => { toggleSidebar(), toggleMenu() }}>Your Profile</a>
                  {/* <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700" role="menuitem">Settings</a> */}
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-gray-300 hover:rounded-sm text-gray-700" role="menuitem">Sign out</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="fixed top-19 right-0 h-full w-96 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300 shadow-lg">
          <button className="absolute top-4 right-4 text-gray-700 hover:text-red-500" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="p-6 space-y-6">
            <h2 className="text-xl text-center font-bold text-gray-800">User Profile</h2>
            <div className="flex flex-col items-center justify-center space-y-3">
              <img className="h-20 w-20 rounded-full shadow-md object-cover" src="/profile-img.jpg" alt="User Avatar" />
              {/* <h2 className="text-lg font-semibold text-gray-800">Saiqa Tahir</h2> */}
              <p className="text-sm text-gray-600">{userEmail}</p>
            </div>
            <button className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300" onClick={togglePopup}>
              Create Resume
            </button>
            <button
              className="mt-4 w-full rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600 focus:outline-none focus:ring focus:ring-green-300"
              onClick={handleViewResume} // Call handleViewResume here
            >
              View Resume
            </button>

          </div>
        </div>
      )}
      {popupOpen && <CreateResume togglePopup={togglePopup} />}
    </>
  );
};

export default SeekerNavbar;
