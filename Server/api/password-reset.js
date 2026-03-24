const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const User = require('../models/Users');

/**
 * POST /password-reset
 * Generates a new temporary password, hashes it, updates the user record,
 * and emails the new password via nodemailer.
 *
 * Required env vars (add to your .env):
 *   EMAIL_USER     — sender Gmail address e.g. noreply@roditec.co.ke
 *   EMAIL_PASS     — Gmail App Password (not your normal password)
 *   EMAIL_FROM     — display name + address e.g. "Roditec <noreply@roditec.co.ke>"
 *   FRONTEND_URL   — e.g. https://roditec.co.ke  (used in email link)
 */

// ── Nodemailer transporter ─────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',           // swap for 'smtp' + host/port if using another provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Helper: generate a readable temporary password ─────────────────────────
function generateTempPassword(length = 10) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ── Route ──────────────────────────────────────────────────────────────────
router.post('/password-reset', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ flag: '0', message: 'Email is required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      // Return generic message so we don't leak whether the email exists
      return res.status(200).json({
        flag: '0',
        message: 'No account found with that email address.'
      });
    }

    // Generate & hash new temp password
    const tempPassword   = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Persist to DB
    user.password = hashedPassword;
    await user.save();

    // Build email
    const frontendUrl = process.env.FRONTEND_URL || 'https://roditec.co.ke';
    const mailOptions = {
      from:    process.env.EMAIL_FROM || `"Roditec" <${process.env.EMAIL_USER}>`,
      to:      email,
      subject: 'Your Roditec Password Reset',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#fff;border-radius:8px;border:1px solid #e5e7f0">
          <div style="text-align:center;margin-bottom:28px">
            <h2 style="font-family:Georgia,serif;font-size:26px;color:#1A1A2E;margin:0">Roditec</h2>
            <p style="font-size:12px;color:#8888A8;margin:4px 0 0">Kenya's Premier Auto Marketplace</p>
          </div>

          <h3 style="font-size:18px;color:#1A1A2E;margin:0 0 12px">Password Reset Request</h3>
          <p style="font-size:14px;color:#4A4A68;line-height:1.6;margin:0 0 20px">
            Hi <strong>${user.name || 'there'}</strong>,<br/>
            We received a request to reset your password. Here is your temporary password:
          </p>

          <div style="background:#EEF2FF;border:1px solid rgba(59,107,240,.2);border-radius:8px;padding:18px 24px;text-align:center;margin:0 0 24px">
            <p style="font-size:12px;color:#3B6BF0;font-weight:700;letter-spacing:.5px;text-transform:uppercase;margin:0 0 8px">Temporary Password</p>
            <p style="font-family:monospace;font-size:22px;font-weight:700;color:#1A1A2E;letter-spacing:3px;margin:0">${tempPassword}</p>
          </div>

          <p style="font-size:14px;color:#4A4A68;line-height:1.6;margin:0 0 20px">
            Please log in with this temporary password and change it immediately from your account settings.
          </p>

          <div style="text-align:center;margin:0 0 28px">
            <a href="${frontendUrl}/login"
               style="display:inline-block;background:#3B6BF0;color:#fff;font-size:14px;font-weight:600;padding:12px 32px;border-radius:8px;text-decoration:none">
              Log In to Roditec
            </a>
          </div>

          <p style="font-size:12px;color:#8888A8;line-height:1.6;margin:0;border-top:1px solid #E5E7F0;padding-top:20px">
            If you did not request this password reset, please ignore this email or contact us at
            <a href="mailto:info@roditec.co.ke" style="color:#3B6BF0">info@roditec.co.ke</a>.
            Your account remains secure.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      flag: '1',
      message: 'A new password has been sent to your email. Please check your inbox.'
    });

  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ flag: '0', message: 'Server error. Please try again.' });
  }
});

module.exports = router;