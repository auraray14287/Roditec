const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const CarListing = require('../models/CarListing');
const Admin = require('../models/Admin');
const User = require('../models/Users');

// ── Multer config (unchanged) ──────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext  = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(ext && mime ? null : new Error('Images only (jpeg/jpg/png/webp)'), ext && mime);
  },
});

// ── Auth middleware ────────────────────────────────────────────────────────
/**
 * requireListingAuth
 * Checks for either:
 *   - admin-id header  → verified against Admin collection (full access)
 *   - user-id  header  → verified against User collection  (must have role 'dealer' or 'assigned')
 *
 * Attaches req.authEntity and req.authRole to the request.
 */
async function requireListingAuth(req, res, next) {
  try {
    const adminId = req.headers['admin-id'];
    const userId  = req.headers['user-id'];

    if (adminId) {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        return res.status(403).json({ flag: '0', message: 'Forbidden. Invalid admin credentials.' });
      }
      req.authEntity = admin;
      req.authRole   = 'admin';
      return next();
    }

    if (userId) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(403).json({ flag: '0', message: 'Forbidden. User not found.' });
      }
      // Only users explicitly assigned by admin may list
      const allowedRoles = ['dealer', 'assigned', 'agent'];
      if (!allowedRoles.includes((user.role || '').toLowerCase())) {
        return res.status(403).json({
          flag: '0',
          message: 'Forbidden. Only admin-approved dealers can create or modify listings.'
        });
      }
      req.authEntity = user;
      req.authRole   = 'dealer';
      return next();
    }

    return res.status(401).json({
      flag: '0',
      message: 'Unauthorised. Please provide admin-id or user-id header.'
    });

  } catch (err) {
    console.error('Auth middleware error:', err);
    return res.status(500).json({ flag: '0', message: 'Authentication error.' });
  }
}

// ── GET /api/listings/listings  (public — anyone can browse) ───────────────
router.get('/listings', async (req, res) => {
  try {
    const listings = await CarListing.find({ listing_status: { $ne: 'deleted' } }).sort({ createdAt: -1 });
    return res.status(200).json(listings);
  } catch (error) {
    console.error('Get listings error:', error);
    return res.status(500).json({ flag: '0', message: 'Failed to fetch listings.' });
  }
});

// ── GET /api/listings/listings/:id  (public) ──────────────────────────────
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await CarListing.findOne({ listing_id: req.params.id });
    if (!listing) return res.status(404).json({ flag: '0', message: 'Listing not found.' });
    return res.status(200).json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    return res.status(500).json({ flag: '0', message: 'Failed to fetch listing.' });
  }
});

// ── POST /api/listings/listings  (admin or assigned dealer only) ───────────
router.post('/listings', requireListingAuth, upload.array('images', 10), async (req, res) => {
  try {
    const {
      make, model, year, price, mileage, fuelType,
      transmission, carType, RentSell, description,
      location, condition, features,
    } = req.body;

    if (!make || !model || !year || !price || !RentSell) {
      return res.status(400).json({ flag: '0', message: 'make, model, year, price and RentSell are required.' });
    }

    const images = (req.files || []).map(file => ({
      url:      `/uploads/${file.filename}`,
      filename: file.filename,
    }));

    const listing = new CarListing({
      make, model, year: parseInt(year), price: parseFloat(price),
      mileage: parseInt(mileage) || 0,
      fuelType, transmission, carType, RentSell,
      description, location, condition,
      features: features ? (Array.isArray(features) ? features : features.split(',').map(f => f.trim())) : [],
      images,
      listing_status: 'active',
      listed_by:      req.authRole === 'admin' ? 'admin' : req.authEntity._id,
      listed_by_role: req.authRole,
      createdAt:      new Date(),
    });

    await listing.save();
    return res.status(201).json({ flag: '1', message: 'Listing created successfully.', listing });

  } catch (error) {
    console.error('Create listing error:', error);
    return res.status(500).json({ flag: '0', message: 'Failed to create listing.' });
  }
});

// ── PUT /api/listings/listings/:id  (admin or assigned dealer only) ────────
router.put('/listings/:id', requireListingAuth, upload.array('images', 10), async (req, res) => {
  try {
    const listing = await CarListing.findOne({ listing_id: req.params.id });
    if (!listing) return res.status(404).json({ flag: '0', message: 'Listing not found.' });

    // Dealers may only edit their own listings; admin can edit any
    if (req.authRole === 'dealer' && String(listing.listed_by) !== String(req.authEntity._id)) {
      return res.status(403).json({ flag: '0', message: 'Forbidden. You can only edit your own listings.' });
    }

    const updates = { ...req.body };

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        filename: file.filename,
      }));
    }

    if (updates.price)   updates.price   = parseFloat(updates.price);
    if (updates.year)    updates.year    = parseInt(updates.year);
    if (updates.mileage) updates.mileage = parseInt(updates.mileage);
    if (updates.features && !Array.isArray(updates.features)) {
      updates.features = updates.features.split(',').map(f => f.trim());
    }

    updates.updatedAt = new Date();

    const updated = await CarListing.findOneAndUpdate(
      { listing_id: req.params.id },
      { $set: updates },
      { new: true }
    );

    return res.status(200).json({ flag: '1', message: 'Listing updated successfully.', listing: updated });

  } catch (error) {
    console.error('Update listing error:', error);
    return res.status(500).json({ flag: '0', message: 'Failed to update listing.' });
  }
});

// ── DELETE /api/listings/listings/:id  (admin only) ───────────────────────
router.delete('/listings/:id', requireListingAuth, async (req, res) => {
  try {
    if (req.authRole !== 'admin') {
      return res.status(403).json({ flag: '0', message: 'Forbidden. Only admins can delete listings.' });
    }

    const listing = await CarListing.findOneAndUpdate(
      { listing_id: req.params.id },
      { $set: { listing_status: 'deleted', deletedAt: new Date() } },
      { new: true }
    );

    if (!listing) return res.status(404).json({ flag: '0', message: 'Listing not found.' });

    return res.status(200).json({ flag: '1', message: 'Listing deleted successfully.' });

  } catch (error) {
    console.error('Delete listing error:', error);
    return res.status(500).json({ flag: '0', message: 'Failed to delete listing.' });
  }
});

module.exports = router;