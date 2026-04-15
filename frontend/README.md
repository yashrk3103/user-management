# User Management System - Frontend

A modern React-based web application for managing user accounts with role-based access control. Built with React, React Router, and Axios for a responsive, user-friendly experience.

## Features

- **User Authentication**: Secure login with JWT tokens
- **Role-Based UI**: Dynamic navigation and content based on user roles
- **User Management Dashboard**: Admin and manager capabilities for managing users
- **Profile Management**: Users can view and update their own profile
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern Architecture**: Component-based with React hooks and Context API

## Tech Stack

- **React 19** with hooks
- **React Router v6** for client-side routing
- **Axios** for API communication
- **Context API** for state management
- **Vite** for build tooling and development server
- **CSS3** for responsive styling

## Prerequisites

- Node.js (v14+)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Running the Application

Development mode:
```bash
npm run dev
```

The app runs on `http://localhost:5173`

Production build:
```bash
npm run build
```

Preview build:
```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── pages/              # Page components (Login, Dashboard, Users, etc.)
│   ├── components/         # Reusable components (Navigation, ProtectedRoute)
│   ├── context/            # React Context (AuthContext)
│   ├── services/           # API service layer
│   ├── styles/             # CSS files
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Main app component with routing
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── .env                    # Environment variables
└── package.json            # Dependencies and scripts
```

## Pages

### Login Page
- Email and password authentication
- Demo credentials display for quick testing
- Token stored in localStorage

### Dashboard
- Personalized greeting
- Role-specific quick actions
- Permission overview

### User List (Admin/Manager)
- Paginated table of users
- Search by name or email
- Filter by role and status
- Actions: View, Edit (admin), Deactivate (admin)

### User Detail
- Full user information
- Audit information (created by, updated by, timestamps)
- Back navigation

### User Edit (Admin)
- Edit user name, email, password, role, status
- Form validation
- Confirmation on cancel

### Create User (Admin)
- Create new user with role and status assignment
- Auto-validation of email uniqueness

### Profile Page
- View own profile information
- Update name and password
- Success/error feedback

## Authentication Flow

1. User enters credentials on login page
2. API returns JWT token and user data
3. Token stored in localStorage
4. Token automatically included in API requests via interceptor
5. Protected routes check authentication status
6. Expired/invalid tokens redirect to login
7. Logout clears token and user data

## Role-Based Access

```
Admin:
- Access to all features
- Can view/edit/create/delete users
- Can assign roles

Manager:
- Can view all users
- Can edit non-admin users
- Limited permissions

User:
- Can only view/edit own profile
- No access to user management
```

## API Integration

Base URL: `http://localhost:5000/api` (configurable in .env)

All requests automatically include JWT token in headers:
```
Authorization: Bearer <token>
```

### Available Endpoints

**Auth:**
- `POST /auth/login` - Login user

**Users:**
- `GET /users/profile` - Get own profile
- `PUT /users/profile` - Update own profile
- `GET /users` - List users (with pagination/filters)
- `GET /users/:id` - Get user details
- `POST /users` - Create user (admin)
- `PUT /users/:id` - Update user (admin)
- `PUT /users/:id/deactivate` - Deactivate user (admin)

## Environment Variables

```env
# API Base URL for HTTP requests
VITE_API_BASE_URL=http://localhost:5000/api
```

For production:
```env
VITE_API_BASE_URL=https://your-backend-api.com/api
```

## Testing with Demo Credentials

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

## Development Tips

- React Hot Module Replacement (HMR) is enabled for fast development
- Use browser DevTools to inspect components and network requests
- Check localStorage for stored token and user data
- API error messages are displayed in the UI

## Building for Production

```bash
npm run build
```

Creates optimized production build in the `dist/` folder.

Deploy to any static hosting:
- Vercel
- Netlify
- GitHub Pages
- AWS S3
- etc.

## Deployment

When deploying to production:

1. Update `.env` with production API URL
2. Build the application: `npm run build`
3. Deploy the `dist/` folder to your hosting
4. Ensure backend API is accessible from frontend URL

## Code Quality

Run ESLint:
```bash
npm run lint
```

## Contributing

Follow these guidelines:
- Use consistent component naming
- Keep components focused and reusable
- Maintain clean separation of concerns
- Write meaningful commit messages
- Test all flows before submitting

## License

ISC

