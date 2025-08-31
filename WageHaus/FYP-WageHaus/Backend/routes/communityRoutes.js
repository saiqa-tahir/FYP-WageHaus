// backend/routes/CommunityRoutes.js
const express = require('express');
const router = express.Router();
const { recommendGroups, upload, joinGroup, leaveGroup, addPost, getAllGroups,  getGroupPosts } = require('../controllers/communityController');

// Fetch all groups
router.get('/groups', getAllGroups);
// Recommend groups based on CV
router.post('/recommend-groups', upload.single('cv'), recommendGroups);

// Join a group
router.post('/join-group/:groupId', joinGroup);

// Leave a group
router.post('/leave-group/:groupId', leaveGroup);

// Add a post to a group
router.post('/add-post/:groupId', addPost);

// Get group posts
router.get('/group-posts/:groupId', getGroupPosts);

module.exports = router;


