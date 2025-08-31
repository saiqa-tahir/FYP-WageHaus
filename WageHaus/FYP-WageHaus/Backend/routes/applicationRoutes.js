const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');

router.post('/apply', applicationController.applyForJob);
router.get('/:recruiterEmail', applicationController.getApplicationsByRecruiter);

module.exports = router;