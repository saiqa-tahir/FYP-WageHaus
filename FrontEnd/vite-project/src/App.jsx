import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SeekerNavbar from './Components/Jobseeker/SeekerNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Components/Jobseeker/Login';
import RecruiterAndJobSeeker from './Components/Jobseeker/RecruiterAndJobSeeker';
import SignUp from './Components/Jobseeker/SignUp';
// Make sure you import SignUp
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
<<<<<<< HEAD
    <Router>
      
      <Routes>
    
        <Route path="/" element={<RecruiterAndJobSeeker />} />
        <Route path="/login/:userType" element={<Login />} />
        <Route path="/signup/:userType" element={<SignUp />} />
       <Route path="/SeekerNavbar/:userType" element={<SeekerNavbar />}/>
      </Routes>
    </Router>
  );
=======
    <>
<div></div>


    <SeekerNavbar/>
  
        </>
  )
>>>>>>> ef3f6a4e3a303aae00c99b59c875607e2faaeb75
}

export default App;
