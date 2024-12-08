import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; 
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import "./LoginandSignUp.css";
export default function Login() {
    const { userType } = useParams();
    const navigate = useNavigate(); 
    const [isImageSliding, setIsImageSliding] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSlide = () => {
        setIsImageSliding(true);
        setTimeout(() => setIsImageSliding(false), 800);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            alert('Please fill all the fields.');
            return;
        }

        if (password.length > 12) {
            setError('Password must be 12 characters or less.');
            return;
        }


        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            alert('Login successful');
            console.log(res.data); 

            
            if (userType === 'jobseeker') {
                navigate('/SeekerNavbar/jobseeker');
            } else if (userType === 'recruiter') {
                navigate('/jobsearch/recruiter');
            } else if(userType === 'Admin') {
                navigate('/jobsearch/Admin'); 
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="container-fluid d-flex min-vh-100">
            <div className={`col-md-11 d-flex justify-content-center align-items-center side-image ${isImageSliding ? 'slide-down' : ''}`}>
                <img src='/jobportal.png' alt="Side Illustration" className="img-fluid" />
            </div>
            <div className="col-md-5 d-flex justify-content-center align-items-center">
                <div className="form-box p-4">
                    <form onSubmit={handleLogin}>
                        <h1>Login</h1>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="mb-3 input-box">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="mb-3 input-box">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FaLock className="icon" />
                        </div>
                        <button type="submit" className="btn btn-light-green w-100">Login</button>
                        <p className="mt-3 toggle-link">
                            Don't have an account?{' '}
                            <Link to={`/signup/${userType}`} onClick={handleSlide}>
                                Sign Up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
