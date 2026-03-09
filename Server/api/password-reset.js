const express = require('express');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Users = require('../models/Users');

const router = express.Router();

// Generate a random password
const generatePassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

router.post('/password-reset', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user) {
      return res.json({ flag: "0", message: "No account associated with this email." });
    }

    // Generate and hash new password
    const newPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Save new password to database
    user.password = hashedPassword;
    await user.save();

    // Send email with new password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Roditec Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your New Roditec Password',
      html: `
        <h2>Password Reset - Roditec</h2>
        <p>Hello ${user.name},</p>
        <p>Your password has been reset. Here is your new temporary password:</p>
        <h3 style="color: #2e7d32;">${newPassword}</h3>
        <p>Please log in and change your password immediately.</p>
        <br/>
        <p>The Roditec Team</p>
      `,
    });

    return res.json({ flag: "1", message: "A new password has been sent to your email." });

  } catch (error) {
    console.error("Error in password reset: ", error);
    return res.status(500).json({ flag: "0", message: "Failed to reset password. Please try again." });
  }
});

module.exports = router;
