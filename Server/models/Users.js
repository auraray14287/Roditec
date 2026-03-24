const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Function to generate a unique user ID
function generateUniqueUserId() {
  return Date.now().toString() + Math.floor(Math.random() * 1000).toString();
}

const UserDataSchema = new Schema({
  user_id: { 
    type: String,
    unique: true, 
    required: true,
    default: generateUniqueUserId,
    index: true
  },
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: String, default: 'active', required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  // ---------------------------------------------------------------
  // Step 6.13 — Role-based access control
  // 'user'   → can browse, rent, buy only (default)
  // 'poster' → admin-granted; can post/edit/delete listings
  // 'admin'  → full access (handled separately via Admin model)
  // ---------------------------------------------------------------
  role: { 
    type: String, 
    enum: ['user', 'poster', 'admin'], 
    default: 'user' 
  },
  canPostListings: { type: Boolean, default: false }
}, {
  timestamps: true
});

// Ensure unique user_id before saving
UserDataSchema.pre('save', async function(next) {
  if (this.isNew && !this.user_id) {
    while (true) {
      const generatedId = generateUniqueUserId();
      const existingUser = await this.constructor.findOne({ user_id: generatedId });
      if (!existingUser) {
        this.user_id = generatedId;
        break;
      }
    }
  }
  next();
});

const Users = mongoose.model('Users', UserDataSchema);
module.exports = Users;