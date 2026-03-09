const express = require('express');
const bcrypt = require('bcrypt');
const Users = require('../models/Users');
const Admin = require('../models/Admin');

const router = express.Router();

// Middleware: verify admin token
const verifyAdmin = async (req, res, next) => {
  const adminId = req.headers['admin-id'];
  if (!adminId) {
    return res.status(401).json({ message: "Unauthorized. Admin access required." });
  }
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Authorization error." });
  }
};

// ADMIN-ONLY: Register new user
router.post('/register', verifyAdmin, async (req, res) => {
  const { name, email, mobileno, password } = req.body;

  if (!name || !email || !mobileno || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existing = await Users.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new Users({
      name,
      email,
      mobile: mobileno,
      password: hashedPassword,
      status: 'active'
    });

    await user.save();
    res.status(200).json({ message: "User registered successfully." });
  } catch (error) {
    console.error("Error during registration: ", error);
    res.status(500).json({ message: "Registration failed." });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login attempt for email:', email);
    const user = await Users.findOne({ email });
    
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (passwordMatch) {
        user.lastLogin = new Date();
        await user.save();
        return res.json({ flag: "1", name: user.name, id: user._id });
      }
    }
    
    return res.json({ flag: "0", message: "Invalid email or password." });
  } catch (error) {
    console.error("Login error: ", error);
    return res.status(500).json({ flag: "0", message: "Database error" });
  }
});

module.exports = router;