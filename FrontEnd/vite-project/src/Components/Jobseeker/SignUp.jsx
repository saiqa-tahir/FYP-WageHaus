import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import './LoginandSignUp.css';

export default function SignUp() {
    const { userType } = useParams();
    const navigate = useNavigate();
    const [isImageSliding, setIsImageSliding] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSlide = () => {
        setIsImageSliding(true);
        setTimeout(() => setIsImageSliding(false), 800);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || !username) {
            alert('Please fill all the fields.');
            return;
        }

        if (password.length > 12) {
            setError('Password must be 12 characters or less.');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/api/auth/signup', {
                username,
                email,
                password,
                role: userType,
            });
            alert('Sign up successful');
            console.log(res.data); 

            if (userType === 'jobseeker') {
                navigate('/SeekerNavbar/jobseeker');
            } else if (userType === 'recruiter') {
                navigate('/jobsearch/recruiter');
            } else if (userType === 'Admin') {
                navigate('/jobsearch/Admin'); 
            }

        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="container-fluid d-flex min-vh-100">
            <div className={`col-md-11 d-flex justify-content-center align-items-center side-image ${isImageSliding ? 'slide-up' : ''}`}>
                <img src='/jobportal.png' alt="Side Illustration" className="img-fluid" />
            </div>
            <div className="col-md-5 d-flex justify-content-center align-items-center">
                <div className="form-box p-4">
                    <form onSubmit={handleSignUp}>
                        <h1>Sign Up</h1>
                        {error && <p className="text-danger">{error}</p>}
                        <div className="mb-3 input-box">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <FaUser className="icon" />
                        </div>
                        <div className="mb-3 input-box">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FaEnvelope className="icon" />
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
                        <button type="submit" className="btn btn-light-green w-100">Sign Up</button>
                        <p className="mt-3 toggle-link">
                            Already have an account?{' '}
                            <Link to={`/login/${userType}`} onClick={handleSlide}>
                                Login
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
