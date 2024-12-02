const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});

// Hash the password before saving it
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();  // Only hash if the password is new or modified

    try {
        const salt = await bcrypt.genSalt(10);  // Generate a salt for hashing
        this.password = await bcrypt.hash(this.password, salt);  // Hash the password
        next();  // Continue saving the user
    } catch (error) {
        next(error);  // Pass any errors to the next middleware
    }
});

// Method to compare entered password with stored password
UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);  // Compare the entered password with the stored hash
};

module.exports = mongoose.model('User', UserSchema);