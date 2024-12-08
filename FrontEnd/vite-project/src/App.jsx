import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SeekerNavbar from './Components/Jobseeker/SeekerNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Jobseeker/Login';
import RecruiterAndJobSeeker from './Components/Jobseeker/RecruiterAndJobSeeker';
import SignUp from './Components/Jobseeker/SignUp';
import Jobsearch from './Components/Jobseeker/Jobsearch';
// Make sure you import SignUp
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      
      <Routes>
    
        <Route path="/" element={<RecruiterAndJobSeeker />} />
        <Route path="/login/:userType" element={<Login />} />
        <Route path="/signup/:userType" element={<SignUp />} />
       <Route path="/Jobsearch/:userType" element={<Jobsearch />}/>
       <SeekerNavbar/>
      </Routes>
    </Router>
  );
}

export default App;
