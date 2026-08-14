const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '365d'
  });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { username, email, phone, password } = req.body;

    // Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least 1 capital letter, and 1 special character.'
      });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ username, email, phone, password });

    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Signup (requires secret code)
exports.adminSignup = async (req, res) => {
  try {
    const { username, email, phone, password, adminCode } = req.body;

    // Verify secret admin invite code
    if (adminCode !== process.env.ADMIN_SECRET_CODE) {
      return res.status(403).json({ message: 'Invalid admin invite code.' });
    }

    // Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters, with 1 uppercase letter and 1 special character.'
      });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Admin with this email or username already exists.' });
    }

    const user = await User.create({ username, email, phone, password, role: 'admin' });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Direct Reset Password
exports.directResetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Password Validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters long, contain at least 1 capital letter, and 1 special character.'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful. You can now login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google Login
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Check if user already exists
    let user = await User.findOne({ email });

    // Create user if doesn't exist
    if (!user) {
      // Auto-generate username and random password
      const baseUsername = name.replace(/\s+/g, '').toLowerCase();
      let uniqueUsername = baseUsername;
      
      // Ensure unique username
      let usernameExists = await User.findOne({ username: uniqueUsername });
      while (usernameExists) {
        uniqueUsername = `${baseUsername}${Math.floor(Math.random() * 10000)}`;
        usernameExists = await User.findOne({ username: uniqueUsername });
      }

      user = await User.create({
        username: uniqueUsername,
        email,
        phone: "0000000000", // Dummy phone as it's required
        password: Math.random().toString(36).slice(-10) + "A!1", // Satisfy regex
        role: 'user'
      });
    }

    // Return normal app auth token
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

