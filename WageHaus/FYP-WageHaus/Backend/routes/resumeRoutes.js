const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { getAllJobseekers, deleteJobseeker, toggleJobseekerStatus } = require('../controllers/JobseekerController');
router.post('/create', resumeController.createResume);
router.get('/', resumeController.getResumes);
router.get('/:id', resumeController.getResumeById);
router.get('/generate-pdf/:id', resumeController.generateResumePDF);
router.get('/download/:email', resumeController.generateResumePDF); // Change route to use email
// Manage jobseekersy
router.get('/jobseekers', getAllJobseekers);
router.delete('/jobseekers/:id', deleteJobseeker);
router.put('/jobseekers/:id/toggle-status', toggleJobseekerStatus);

// In your backend routes (e.g., routes/resumes.js)

const Resume = require('../models/Resume');

router.get('/by-email/:email', async (req, res) => {
  try {
    const resume = await Resume.findOne({ email: req.params.email });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching resume', error: err.message });
  }
});


module.exports = router;
