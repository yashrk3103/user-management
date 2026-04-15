require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const ensureAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminEmail = 'admin@example.com';
    const defaultPassword = 'admin123';

    let admin = await User.findOne({ email: adminEmail }).select('+passwordHash');

    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: adminEmail,
        passwordHash: defaultPassword,
        role: 'admin',
        status: 'active',
      });
      console.log('Created admin user:', adminEmail);
    } else {
      admin.name = admin.name || 'Admin User';
      admin.role = 'admin';
      admin.status = 'active';
      // Reset to known demo password for access recovery.
      admin.passwordHash = defaultPassword;
      await admin.save();
      console.log('Updated existing admin user:', adminEmail);
    }

    console.log('Admin login restored: admin@example.com / admin123');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Failed to ensure admin:', error.message);
    process.exit(1);
  }
};

ensureAdmin();
