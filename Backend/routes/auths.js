const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const router = express.Router();

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
    console.error("JWT_SECRET is not defined in the environment variables.");
    process.exit(1);  // Stop the application if JWT_SECRET is missing
}

router.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        user = new User({ username, email, password, role });
        await user.save();

        res.status(201).json({ message: "User signed up successfully" });
    } catch (error) {
        console.error(error); // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User does not exist" });

        // Compare the provided password with the stored hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // Create JWT token using the JWT_SECRET from environment variables
        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

        // Return the token and user information
        res.json({
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        console.error(error);  // Log the error
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
