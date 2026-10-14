require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany({});

    const demoUsers = [
      // ── Admins (3) ──
      {
        name: 'Admin User',
        email: 'admin@example.com',
        passwordHash: 'admin123',
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Yash Khunt',
        email: 'yash.khunt@example.com',
        passwordHash: 'admin123',
        role: 'admin',
        status: 'active',
      },
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        passwordHash: 'admin123',
        role: 'admin',
        status: 'active',
      },

      // ── Managers (4) ──
      {
        name: 'Manager User',
        email: 'manager@example.com',
        passwordHash: 'manager123',
        role: 'manager',
        status: 'active',
      },
      {
        name: 'Rahul Verma',
        email: 'rahul.verma@example.com',
        passwordHash: 'manager123',
        role: 'manager',
        status: 'active',
      },
      {
        name: 'Ananya Patel',
        email: 'ananya.patel@example.com',
        passwordHash: 'manager123',
        role: 'manager',
        status: 'active',
      },
      {
        name: 'David Chen',
        email: 'david.chen@example.com',
        passwordHash: 'manager123',
        role: 'manager',
        status: 'active',
      },

      // ── Regular Users (10) ──
      {
        name: 'Regular User',
        email: 'user@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Arjun Nair',
        email: 'arjun.nair@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Meera Joshi',
        email: 'meera.joshi@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Neha Gupta',
        email: 'neha.gupta@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Rohan Mehta',
        email: 'rohan.mehta@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Kavya Iyer',
        email: 'kavya.iyer@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Aditya Kulkarni',
        email: 'aditya.kulkarni@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        passwordHash: 'user123',
        role: 'user',
        status: 'active',
      },

      // ── Inactive Users (2) ──
      {
        name: 'Inactive User',
        email: 'inactive@example.com',
        passwordHash: 'inactive123',
        role: 'user',
        status: 'inactive',
      },
      {
        name: 'Amit Desai',
        email: 'amit.desai@example.com',
        passwordHash: 'user123',
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
