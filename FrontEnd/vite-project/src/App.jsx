import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import RecruiterAndJobSeeker from "./Components/MainPage/RecruiterAndJobSeeker";
import SeekerSignup from "./Components/Jobseeker/SeekerSignup";
import SeekerLogin from "./Components/Jobseeker/SeekerLogin";
import RecruiterSignup from "./Components/Recruiter/RecruiterSignup";
import RecruiterLogin from "./Components/Recruiter/RecruiterLogin";
import JobSeekerDashboard from "./Components/Jobseeker/JobSeekerDashboard";
import RecruiterDashboard from "./Components/Recruiter/RecruiterDashboard";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminSignup from "./Components/Admin/AdminSignup";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import Jobseekers from "./Components/Admin/Jobseekers";
import Recruiters from "./Components/Admin/Recruiters";
import ChatRoom from "./Components/Jobseeker/ChatRoom";
import Community from "./Components/Jobseeker/Community";
import Discussion from "./Components/Jobseeker/Discussion";
import JobseekerReport from "./Components/Jobseeker/JobseekerReport";
import ReportsBySeeker from "./Components/Admin/ReportsBySeeker";
import JobRequests from "./Components/Recruiter/JobRequests";
import ReportsByRecruiter from "./Components/Admin/ReportsByRecruiter";
import RecruiterReport from "./Components/Recruiter/RecruiterReport";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RecruiterAndJobSeeker />} />
          <Route path="/jobseeker-login" element={<SeekerLogin />} />
          <Route path="/jobseeker-signup" element={<SeekerSignup />} />
          <Route path="/recruiter-login" element={<RecruiterLogin />} />
          <Route path="/recruiter-signup" element={<RecruiterSignup />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-signup" element={<AdminSignup />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={["jobseeker"]} />}>
            <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />
            <Route path="/community" element={<Community />} />
        <Route path="/discussion/:groupId" element={<Discussion />} />
        <Route path="/chat/:groupId" element={<ChatRoom />} />
            <Route path="/jobseeker-report" element={<JobseekerReport />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
            <Route path="/recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="/applications" element={<JobRequests />} />
            <Route path="/recruiter-report" element={<RecruiterReport />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/jobseekers" element={<Jobseekers />} />
            <Route path="/recruiters" element={<Recruiters />} />
            <Route path="/seeker-reports" element={<ReportsBySeeker />} />
            <Route path="/recruiter-reports" element={<ReportsByRecruiter />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;