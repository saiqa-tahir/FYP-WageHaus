import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin-signup', { email, password });

      // Store the JWT token in localStorage or cookies for authentication
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userEmail', email);
      // Redirect user to admin dashboard
      navigate('/admin-Dashboard');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || 'Error during signup'); // Display backend error or default error
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <form onSubmit={handleAdminSignup}>
              <div className="max-w-md mx-auto">
                <div>
                  <h1 className="text-2xl font-semibold">Admin Signup</h1>
                </div>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                <div className="divide-y divide-gray-200">
                  <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                    <div className="relative">
                      <input
                        autocomplete="off"
                        id="email"
                        name="email"
                        type="text"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <label
                        htmlFor="email"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Email Address
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        autocomplete="off"
                        id="password"
                        name="password"
                        type="password"
                        className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <label
                        htmlFor="password"
                        className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <button
                        type="submit"
                        className="bg-cyan-500 text-white rounded-md hover:bg-cyan-400 px-2 py-1"
                      >
                        Sign up
                      </button>
                    </div>
                    <div className="">
                      <div className="mt-3 text-center text-sm dark:text-gray-700">
                        Already Have An Account?{' '}
                        <a
                          className="text-cyan-500 underline hover:text-cyan-400 ml-1"
                          href="/admin-login"
                        >
                          Log In here
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
