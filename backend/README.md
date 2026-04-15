# User Management System - Backend

A Node.js/Express REST API backend for a full-stack MERN user management application with JWT authentication and role-based access control (RBAC).

## Features

- **JWT Authentication**: Secure login with token-based authentication
- **Role-Based Access Control (RBAC)**: Admin, Manager, and User roles with specific permissions
- **User Management**: Create, read, update, and deactivate users
- **Audit Tracking**: Track user creation and modification history (createdBy, updatedBy, timestamps)
- **Password Security**: Bcrypt hashing for secure password storage
- **Input Validation**: Comprehensive validation using express-validator
- **Error Handling**: Consistent error response format with proper HTTP status codes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **CORS**: Enabled for cross-origin requests

## Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB Atlas account or local MongoDB server

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/user-management?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Seed demo data:
```bash
npm run seed
```

Demo credentials:
- **Admin**: admin@example.com / admin123
- **Manager**: manager@example.com / manager123
- **User**: user@example.com / user123

## Running the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server runs on `http://localhost:5000`

Health check: `GET http://localhost:5000/health`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users/profile` - Get current user profile (auth required)
- `PUT /api/users/profile` - Update current user profile (auth required)
- `POST /api/users` - Create user (admin only)
- `GET /api/users` - List users with pagination and filters (admin, manager)
- `GET /api/users/:id` - Get user details (admin, manager)
- `PUT /api/users/:id` - Update user (admin only)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin only)

## Role Permissions

### Admin
- Full access to all users
- Can create, update, and deactivate users
- Can assign and change roles
- Can view all user details with audit information

### Manager
- Can view all users
- Can view and edit non-admin users
- Cannot delete/deactivate users
- Cannot assign roles

### User
- Can view and edit own profile only
- Cannot view other users
- Cannot change own role

## Request/Response Format

All requests and responses use JSON format.

### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Login Response (Success)
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "user",
    "status": "active",
    "createdAt": "2024-04-15T10:30:00Z",
    "updatedAt": "2024-04-15T10:30:00Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Security Notes

- **Passwords** are hashed using bcrypt and never returned in responses
- **JWT tokens** should be sent in the Authorization header: `Authorization: Bearer <token>`
- **Environment variables** must be configured securely
- **CORS** is enabled to allow requests from the frontend
- **Input validation** prevents injection attacks
- **Inactive users** cannot log in

## Deployment

This backend can be deployed to any Node.js hosting platform:
- Render
- Railway
- Heroku
- AWS
- DigitalOcean
- etc.

Remember to:
1. Set environment variables in your hosting platform
2. Use a production-grade MongoDB URI
3. Use a strong JWT_SECRET
4. Set NODE_ENV=production

## Project Structure

```
backend/
├── config/          # Database and app configuration
├── models/          # Mongoose schemas
├── routes/          # API route handlers
├── middleware/      # Authentication and error handling
├── controllers/     # Business logic
├── utils/           # Helper functions and utilities
├── seeds/           # Database seeding scripts
├── server.js        # Entry point
├── .env             # Environment variables (not in git)
└── package.json     # Dependencies and scripts
```

## Contributing

Follow these guidelines:
- Use meaningful commit messages
- Maintain clean architecture with separation of concerns
- Add validation for new endpoints
- Never commit .env files
- Test API endpoints before pushing

## License

ISC
