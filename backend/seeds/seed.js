require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany({});

    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: 'admin123',
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Manager User',
        email: 'manager@example.com',
        passwordHash: 'manager123',
        role: 'manager',
        status: 'active',
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Inactive User',
        email: 'inactive@example.com',
        passwordHash: 'inactive123',
        role: 'user',
        status: 'inactive',
      },
    ];

    // Use create() instead of insertMany() to trigger pre-save hooks for password hashing
    for (const userData of demoUsers) {
      const user = await User.create(userData);
      console.log(
        `Created ${user.role.toUpperCase()}: ${user.email}`
      );
    }

    console.log('\n✓ Database seeded successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedUsers();
