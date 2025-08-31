// routes/jobPostRoutes.js
const express = require('express');
const router = express.Router();
const jobPostController = require('../controllers/jobPostController');

// Route to create a new job post
router.post('/create', jobPostController.createJobPost);

// Route to get all job posts
router.get('/', jobPostController.getAllJobPosts);

module.exports = router;
