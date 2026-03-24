const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/Users');
const Admin = require('../models/Admin');

/**
 * POST /api/admin/register
 * Admin-only user registration.
 * Requires a valid admin-id header.
 * Public self-registration has been removed from this endpoint.
 */
router.post('/register', async (req, res) => {
  try {
    // ── Verify admin identity ──────────────────────────────────────────────
    const adminId = req.headers['admin-id'];
    if (!adminId) {
      return res.status(401).json({
        flag: '0',
        message: 'Unauthorised. Admin authentication required.'
      });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(403).json({
        flag: '0',
        message: 'Forbidden. Invalid admin credentials.'
      });
    }

    // ── Validate required fields ───────────────────────────────────────────
    const { name, email, mobileno, password } = req.body;

    if (!name || !email || !mobileno || !password) {
      return res.status(400).json({
        flag: '0',
        message: 'All fields are required: name, email, mobileno, password.'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ flag: '0', message: 'Invalid email format.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ flag: '0', message: 'Password must be at least 6 characters.' });
    }

    // ── Check for duplicate ────────────────────────────────────────────────
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ flag: '0', message: 'A user with this email already exists.' });
    }

    // ── Create user ────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      mobile: mobileno,
      password: hashedPassword,
      status: 'Active',
      createdAt: new Date(),
    });

    await newUser.save();

    return res.status(201).json({
      flag: '1',
      message: `User "${name}" registered successfully.`,
      user: { id: newUser._id, name, email }
    });

  } catch (error) {
    console.error('Admin register error:', error);
    return res.status(500).json({ flag: '0', message: 'Server error. Please try again.' });
  }
});

module.exports = router;