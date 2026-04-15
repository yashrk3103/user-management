require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

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

    const savedUsers = await User.insertMany(demoUsers);

    demoUsers.forEach((user, index) => {
      console.log(
        `Created ${user.role.toUpperCase()}: ${user.email} (Password: ${user.passwordHash})`
      );
    });

    console.log('\nSeed data inserted successfully!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedUsers();
