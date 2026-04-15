import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { UserManagement } from './pages/UserManagement';
import { UserDetail } from './pages/UserDetail';
import { Profile } from './pages/Profile';
import { Appearance } from './pages/Appearance';
import { Connections } from './pages/Connections';
import { Notifications } from './pages/Notifications';
import { Security } from './pages/Security';
import { Authentication } from './pages/Authentication';
import { Settings } from './pages/Settings';
import { Documentation } from './pages/Documentation';

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
        element: <Appearance />,
      },
      {
        path: 'connections',
        element: <Connections />,
      },
      {
        path: 'notifications',
        element: <Notifications />,
      },
      {
        path: 'security',
        element: <Security />,
      },
      {
        path: 'authentication',
        element: <Authentication />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'documentation',
        element: <Documentation />,
      },
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
]);
