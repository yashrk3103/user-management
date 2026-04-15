# System Architecture

## Overview

The User Management System is a full-stack MERN application with clear separation between frontend and backend. It implements JWT-based authentication and role-based access control (RBAC) at both the API and UI levels.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT BROWSER                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │         React Frontend (Vite)                    │   │
│  ├──────────────────────────────────────────────────┤   │
│  │  • Login Authentication                          │   │
│  │  • Context API (Auth State Management)           │   │
│  │  • React Router (Client-side Routing)            │   │
│  │  • Role-based UI Rendering                       │   │
│  │  • Protected Routes & Components                 │   │
│  └──────────────────────────────────────────────────┘   │
│                       ▼                                   │
│              (JWT Token in Headers)                      │
│                       ▼                                   │
└─────────────────────────────────────────────────────────┘
                       │
         ┌─────────────┴──────────────┐
         │                            │
    ┌────▼────────────────────────┐   │
    │  CORS Enabled Network       │   │
    │  Axios HTTP Client          │   │
    └────┬────────────────────────┘   │
         │                            │
         └────────────┬───────────────┘
                      │
         ┌────────────▼──────────────┐
         │ Express Server (Port 5000)│
         └────────────┬──────────────┘
                      │
        ┌─────────────┼──────────────┐
        │             │              │
    ┌───▼────┐  ┌────▼────┐  ┌─────▼──────┐
    │  Auth  │  │  Users  │  │  Middleware│
    │ Routes │  │ Routes  │  │  & Utils   │
    └───┬────┘  └────┬────┘  └─────┬──────┘
        │            │             │
        └───────┬────┴─────────┬───┘
                │              │
        ┌───────▼──────┐  ┌────▼─────────┐
        │ Controllers  │  │  Middleware  │
        │ & Services   │  │  - Auth      │
        └───────┬──────┘  │  - RBAC      │
                │         │  - Validation│
        ┌───────▼──────┐  │  - Errors    │
        │  Mongoose    │  └──────────────┘
        │   Models     │
        └───────┬──────┘
                │
        ┌───────▼──────────────┐
        │  MongoDB Atlas       │
        │  (Cloud Database)    │
        └──────────────────────┘
```

## Backend Architecture

### Layered Architecture

The backend follows a clean, layered architecture pattern:

```
Routing Layer
    │
    ▼
Middleware Layer (Auth, Validation, Error Handling)
    │
    ▼
Controller Layer (Business Logic Orchestration)
    │
    ▼
Service/Repository Layer (Data Operations)
    │
    ▼
Model Layer (Mongoose Schemas)
    │
    ▼
Database (MongoDB)
```

### Components

#### 1. **Routes** (`/routes`)
- `authRoutes.js`: Handles POST /login
- `userRoutes.js`: User CRUD operations and profile management

#### 2. **Controllers** (`/controllers`)
- `authController.js`: Login validation and token generation
- `userController.js`: User operations (create, read, update, deactivate)

#### 3. **Middleware** (`/middleware`)
- `auth.js`: JWT verification and role-based authorization
- `errorHandler.js`: Centralized error response formatting

#### 4. **Models** (`/models`)
- `User.js`: User schema with password hashing, role, status, and audit fields

#### 5. **Utilities** (`/utils`)
- `jwt.js`: Token generation and verification
- `errors.js`: Custom error class
- `validation.js`: Input validation middleware

#### 6. **Configuration** (`/config`)
- `db.js`: MongoDB connection setup

#### 7. **Seeds** (`/seeds`)
- `seed.js`: Database population with demo users

### Data Flow

```
HTTP Request
    │
    ▼
Express Middleware (CORS, JSON Parser)
    │
    ▼
Routes → Controllers
    │
    ▼
Auth Middleware (JWT Verification)
    │
    ▼
Validation Middleware
    │
    ▼
Authorization Middleware (Role Check)
    │
    ▼
Business Logic
    │
    ▼
Mongoose Queries
    │
    ▼
MongoDB Database
    │
    ▼
Response Formatting
    │
    ▼
HTTP Response
```

## Frontend Architecture

### Component Hierarchy

```
index.html
    │
    ▼
main.jsx
    │
    ▼
App.jsx (Router & AuthProvider)
    │
    ├─ Navigation (Global)
    │
    ├─ Routes
    │   ├─ LoginPage
    │   ├─ DashboardPage
    │   ├─ UserListPage
    │   ├─ UserDetailPage
    │   ├─ CreateUserPage
    │   ├─ EditUserPage
    │   └─ ProfilePage
    │
    └─ ProtectedRoute (Wrapper)
```

### State Management

```
Context API (AuthContext)
    │
    ├─ user: Current user object
    ├─ token: JWT token
    ├─ isAuthenticated: Boolean flag
    │
    ├─ Methods
    │   ├─ login(email, password)
    │   └─ logout()
    │
    └─ localStorage Persistence
        ├─ token
        └─ user
```

### Data Flow (Frontend)

```
User Action (Login)
    │
    ▼
Form Submission
    │
    ▼
API Call (authAPI.login)
    │
    ▼
Axios with JWT Interceptor
    │
    ▼
Backend API Response
    │
    ▼
AuthContext.login() Updates State
    │
    ▼
localStorage.setItem (Persistence)
    │
    ▼
Navigation to Dashboard
    │
    ▼
Protected Route Check
    │
    ▼
Render Protected Component
```

## Security Architecture

### Authentication Flow

```
┌──────────────────┐
│ User Login       │
│ email/password   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ Validate Credentials     │
│ (express-validator)      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Database Query                   │
│ Find user by email               │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ Compare Password                 │
│ bcrypt.compare()                 │
│ (salted hash comparison)         │
└────────┬─────────────────────────┘
         │
         ▼┌─ Rejected ─┐
┌──────────▼─────────────▼──────────────┐
│       Generate JWT Token             │
│ (User ID + Expiration)               │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Return Token to Client   │
│ Send Response            │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Store Token in           │
│ localStorage (Frontend)  │
└──────────────────────────┘
```

### Authorization (RBAC) Flow

```
API Request with Token
    │
    ▼
Extract Token from Header
    │
    ▼
Verify JWT Signature
    │
    ▼
Decode User ID
    │
    ▼
Fetch User from Database
    │
    ▼
Check User Status (Active/Inactive)
    │
    ├─ Inactive? → 401 Unauthorized
    │
    ▼
Attach User Object to req.user
    │
    ▼
Check Route Authorization
    │
    ├─ Required Role: 'admin'
    │   └─ User Role !== 'admin'? → 403 Forbidden
    │
    ├─ Required Role: ['admin', 'manager']
    │   └─ User Role not in array? → 403 Forbidden
    │
    ▼
Proceed to Business Logic
    │
    ▼
Execute Controller Action
```

### Role Hierarchy

```
Admin
├─ Can create users
├─ Can assign roles (including admin)
├─ Can edit all users
├─ Can deactivate users
├─ Can view all user details
└─ Can access manager features

Manager
├─ Can view all users
├─ Can edit non-admin users
├─ Can view audit information
└─ CANNOT:
    ├─ Create users
    ├─ Assign admin role
    ├─ Deactivate users
    └─ Edit admin users

User
├─ Can view own profile
├─ Can update own profile (name, password)
├─ CANNOT change own role
└─ CANNOT:
    ├─ View other users
    ├─ Create users
    └─ Manage any users
```

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  name: String (required, min: 2),
  email: String (required, unique, email format),
  passwordHash: String (required, hashed with bcrypt),
  role: Enum ['admin', 'manager', 'user'] (default: 'user'),
  status: Enum ['active', 'inactive'] (default: 'active'),
  createdBy: ObjectId (ref: User, nullable),
  updatedBy: ObjectId (ref: User, nullable),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Indexes:**
- email: unique
- role, status: for filtering queries

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {} // optional
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "stack": "error stack" // only in development
}
```

## Deployment Architecture

```
┌─────────────────────────────────────┐
│      User's Browser / Device        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│    CDN / Static Hosting             │
│    (Vercel, Netlify, etc.)          │
│    ├─ React Build (dist/)           │
│    ├─ CSS Files                     │
│    └─ JavaScript Bundles            │
└──────────────┬──────────────────────┘
               │
               ▼
         (HTTPS Request)
               │
               ▼
┌──────────────────────────────────────┐
│    Backend Server (Cloud)            │
│    (Render, Railway, etc.)           │
│                                      │
│    ├─ Express Server                 │
│    ├─ Node.js Runtime                │
│    └─ Environment Variables          │
└──────────────┬──────────────────────┘
               │
               ▼
┌──────────────────────────────────────┐
│    MongoDB Atlas (Cloud)             │
│                                      │
│    ├─ Database Cluster               │
│    ├─ Automated Backups              │
│    ├─ Connection Pooling             │
│    └─ Security Groups                │
└──────────────────────────────────────┘
```

## Performance Considerations

1. **Frontend**
   - Code splitting with React Router
   - Lazy loading of components
   - Caching of API responses via localStorage
   - Minimal bundle size with Vite

2. **Backend**
   - Connection pooling for MongoDB
   - Indexed queries for fast lookups
   - Pagination for large datasets
   - Caching of frequently accessed data

3. **Database**
   - Indexed fields (email, role, status)
   - Query optimization
   - Proper field selection

## Security Measures

1. **Authentication**
   - JWT token-based (no session state on server)
   - Tokens have expiration
   - Secure token storage on frontend

2. **Authorization**
   - Role-based access control (RBAC)
   - Inheritance hierarchy (Admin > Manager > User)
   - Middleware-level enforcement

3. **Data Protection**
   - Password hashing with bcrypt
   - Never return password in responses
   - CORS configuration
   - Input validation and sanitization

4. **Infrastructure**
   - Environment variables for secrets
   - HTTPS for all communication
   - Inactive user lockout
   - Audit logging (createdBy, updatedBy)

## Scalability Plan

Future enhancements:
- Redis caching for frequently accessed data
- Message queues for async operations
- Microservices architecture for independent scaling
- GraphQL API alternative
- WebSocket support for real-time updates
- Advanced audit logging system
- Activity monitoring and analytics
