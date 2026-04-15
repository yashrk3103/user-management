import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { UserDetail } from './pages/UserDetail';
import { Profile } from './pages/Profile';
import { Placeholder } from './pages/Placeholder';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'users/:id',
        element: <UserDetail />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'appearance',
        element: <Placeholder pageName="Appearance" />,
      },
      {
        path: 'connections',
        element: <Placeholder pageName="Connections" />,
      },
      {
        path: 'notifications',
        element: <Placeholder pageName="Notifications" />,
      },
      {
        path: 'security',
        element: <Placeholder pageName="Security & Access" />,
      },
      {
        path: 'authentication',
        element: <Placeholder pageName="Authentication" />,
      },
      {
        path: 'settings',
        element: <Placeholder pageName="Settings" />,
      },
      {
        path: 'documentation',
        element: <Placeholder pageName="Documentation" />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
