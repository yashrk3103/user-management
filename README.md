# User Management System

A full-stack MERN (MongoDB, Express, React, Node.js) web application for managing user accounts with role-based access control (RBAC), JWT authentication, and comprehensive audit tracking.

## 🎯 Project Overview

This application demonstrates a professional, production-ready implementation of:
- Secure user authentication with JWT
- Role-based authorization (Admin, Manager, User)
- User lifecycle management (create, read, update, deactivate)
- Audit logging and tracking
- Responsive, modern UI
- Clean, maintainable code architecture

**Assessment:** MERN Stack Developer Intern Assessment by Purple Merit Technologies  
**Deadline:** April 17, 2026

## ✨ Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Secure password hashing with bcrypt
- ✅ Role-based access control (RBAC)
- ✅ Token expiration and validation
- ✅ Inactive user lockout
- ✅ Protected API endpoints
- ✅ Protected frontend routes

### User Management (Admin)
- ✅ Create new users with role assignment
- ✅ View paginated list of all users
- ✅ Search users by name or email
- ✅ Filter by role and status
- ✅ View detailed user information
- ✅ Edit user details and role
- ✅ Deactivate/soft delete users
- ✅ Track user creation and modifications

### Manager Capabilities
- ✅ View all users and details
- ✅ Edit non-admin users (except role change)
- ✅ Cannot create or remove users

### User Profile (All Users)
- ✅ View own profile
- ✅ Update name and password
- ✅ Cannot view other profiles
- ✅ Cannot change own role

### Audit & Activity
- ✅ Track created by and updated by
- ✅ Timestamp tracking (createdAt, updatedAt)
- ✅ Audit information visible in user details
- ✅ History of modifications

## 🏗️ Architecture

### Technology Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- bcrypt for password hashing
- express-validator for input validation
- CORS enabled

**Frontend:**
- React 19 with hooks
- React Router v6
- Context API for state management
- Axios for HTTP requests
- Vite for build tooling
- Modern CSS3 for styling

**Database:**
- MongoDB Atlas (Cloud)

**Deployment:**
- Backend: Render, Railway, or similar Node.js hosting
- Frontend: Vercel, Netlify, or GitHub Pages
- Database: MongoDB Atlas Cloud

### Project Structure

```
user-management/
├── backend/
│   ├── config/          # Database & environment config
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, errors, validation
│   ├── utils/           # Helper functions
│   ├── seeds/           # Database seeding
│   ├── server.js        # Main entry point
│   ├── package.json
│   ├── .env             # Environment variables
│   └── README.md        # Backend setup guide
│
├── frontend/
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── components/  # Reusable components
│   │   ├── context/     # Auth context
│   │   ├── services/    # API integration
│   │   ├── styles/      # CSS files
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/          # Static assets
│   ├── package.json
│   ├── .env             # Environment variables
│   ├── vite.config.js   # Vite configuration
│   └── README.md        # Frontend setup guide
│
├── ARCHITECTURE.md      # System architecture details
├── DEPLOYMENT.md        # Deployment instructions
├── .gitignore
└── README.md            # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account
- Git

### Local Development Setup

**1. Clone Repository**
```bash
git clone <your-repo-url>
cd user-management
```

**2. Backend Setup**
```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/user-management?retryWrites=true&w=majority
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_EXPIRE=7d
NODE_ENV=development
EOF

# Seed demo data
npm run seed

# Start server
npm run dev
```

Server runs on `http://localhost:5000`

**3. Frontend Setup** (in new terminal)
```bash
cd frontend
npm install

# Create .env file (optional, defaults to localhost)
echo "VITE_API_BASE_URL=http://localhost:5000/api" > .env

# Start dev server
npm run dev
```

Application runs on `http://localhost:5173`

## 🔐 Demo Credentials

After seeding, use these to test:

```
Admin User:
  Email: admin@example.com
  Password: admin123

Manager User:
  Email: manager@example.com
  Password: manager123

Regular User:
  Email: user@example.com
  Password: user123
```

## 📖 Documentation

- **[Backend README](backend/README.md)** - API endpoints, setup, configuration
- **[Frontend README](frontend/README.md)** - Components, pages, environment setup
- **[Architecture Guide](ARCHITECTURE.md)** - System design, data flow, security
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update own profile
- `POST /api/users` - Create user (admin)
- `GET /api/users` - List users (admin, manager)
- `GET /api/users/:id` - Get user details (admin, manager)
- `PUT /api/users/:id` - Update user (admin)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin)

See [Backend README](backend/README.md) for detailed documentation.

## 👥 Role-Based Permissions

```
ADMIN
├─ Create users
├─ View all users
├─ Edit all users
├─ Assign roles
└─ Deactivate users

MANAGER
├─ View all users
├─ Edit non-admin users
└─ View audit information

USER
├─ View own profile
└─ Edit own profile
```

## 🧪 Testing

### Test Admin Scenario
1. Login as admin@example.com
2. Navigate to Users
3. Create a new user
4. Edit user details
5. Deactivate a user
6. View user details with audit info

### Test Manager Scenario
1. Login as manager@example.com
2. Navigate to Users
3. View user list and details
4. Edit non-admin user
5. Try editing admin user (should be restricted)

### Test User Scenario
1. Login as user@example.com
2. Can only view/edit own profile
3. No access to user management
4. Try accessing /users (should redirect)

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token with expiration
- ✅ RBAC enforced on backend
- ✅ Input validation on all endpoints
- ✅ SQL/NoSQL injection prevention
- ✅ CORS configuration
- ✅ Inactive user lockout
- ✅ Never expose password hashes
- ✅ Environment variables for secrets
- ✅ Secure token storage on frontend

## 📦 Build & Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

Creates optimized `dist/` folder for deployment.

### Deploy
Follow [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Backend deployment (Render, Railway)
- Frontend deployment (Vercel, Netlify)
- MongoDB Atlas setup
- Custom domain configuration

## 📝 Logs & Debugging

### Backend Errors
- Check terminal output
- Check MongoDB connection
- View environment variables

### Frontend Errors
- Open browser DevTools (F12)
- Check Console tab
- Check Network tab for API calls
- View localStorage for tokens

## 🤝 Code Quality

- Clean, layered architecture
- Separation of concerns (routes, controllers, services)
- Consistent error handling
- Input validation on all endpoints
- Meaningful commit history
- Professional documentation
- Responsive design
- Accessibility considerations

## 📊 Performance

- Paginated user list (10 items per page)
- Database indexes on frequently queried fields
- Efficient JWT token validation
- Minimal frontend bundle size
- Lazy loading of routes

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack MERN development
- User authentication and authorization
- RESTful API design
- Database modeling with Mongoose
- React hooks and Context API
- React Router navigation
- Component-based architecture
- Responsive web design
- Git workflow with meaningful commits
- Production deployment

## ⚡ Next Steps / Future Enhancements

- [ ] Unit and integration tests
- [ ] E2E testing with Cypress
- [ ] Refresh token rotation
- [ ] OAuth2 integration (Google, GitHub)
- [ ] Advanced audit logging
- [ ] Activity dashboard
- [ ] User analytics
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] API rate limiting
- [ ] WebSocket for real-time updates
- [ ] Mobile app
- [ ] GraphQL API alternative

## 📋 Deliverables Checklist

- [x] Source code in GitHub repository (public)
- [x] Comprehensive README.md with setup instructions
- [x] Backend deployment with public URL
- [x] Frontend deployment with public URL
- [x] Working authentication system
- [x] RBAC implementation
- [x] User management features
- [x] Audit tracking
- [x] Clean, professional code
- [x] Meaningful commit history
- [x] Architecture documentation
- [x] Deployment guide
- [ ] 2-3 minute demo video (pending)

## 🆘 Troubleshooting

### Backend won't start
```
Check:
- MongoDB connection string in .env
- JWT_SECRET is set
- PORT is available
- Node modules installed: npm install
```

### Frontend won't connect to API
```
Check:
- VITE_API_BASE_URL in .env
- Backend is running
- CORS is enabled
- Check console for error messages
```

### Login not working
```
Check:
- MongoDB seeded: npm run seed
- Correct demo credentials
- Backend responding to POST /api/auth/login
```

## 📞 Support

For issues:
1. Check the documentation files
2. Review the error messages
3. Check browser console (F12)
4. Check backend logs
5. Verify environment configuration

## 📄 License

ISC

---

**Built with ❤️ as part of MERN Stack Developer Intern Assessment**

*Assessment Period: April 14-17, 2026*
