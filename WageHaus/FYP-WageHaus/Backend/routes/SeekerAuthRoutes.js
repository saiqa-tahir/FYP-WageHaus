// routes/SeekerauthRoutes.js
const express = require('express');
const { seekerSignup, seekerLogin } = require('../controllers/JobseekerAuthController');
const { recruiterSignup, recruiterLogin } = require('../controllers/recruiterAuthController');
const { adminSignup, adminLogin } = require('../controllers/AdminAuthController');
const { getAllJobseekers, deleteJobseeker, toggleJobseekerStatus } = require('../controllers/JobseekerController');
const { getAllRecruiters, deleteRecruiter, toggleRecruiterStatus } = require('../controllers/RecruiterController');

const router = express.Router();

router.get('/recruiters', getAllRecruiters);
router.delete('/recruiters/:id', deleteRecruiter);
router.patch('/recruiters/:id/toggle-status', toggleRecruiterStatus);

// Signup route
router.post('/jobseeker-signup',seekerSignup);

// Login route
router.post('/jobseeker-login', seekerLogin);

router.post('/recruiter-signup',recruiterSignup);

// Login route
router.post('/recruiter-login', recruiterLogin);
router.post('/admin-signup',adminSignup);

// Login route
router.post('/admin-login', adminLogin);
router.get('/jobseekers', getAllJobseekers);
router.delete('/jobseekers/:id', deleteJobseeker);
router.put('/jobseekers/:id/toggle-status', toggleJobseekerStatus);
module.exports = router;
