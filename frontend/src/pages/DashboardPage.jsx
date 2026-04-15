import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css';

export const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p className="subtitle">Role: <span className={`role-badge role-${user?.role}`}>{user?.role}</span></p>
      </div>

      <div className="dashboard-grid">
        {(['admin', 'manager'].includes(user?.role)) && (
          <div className="dashboard-card">
            <h2>User Management</h2>
            <p>Manage system users and permissions</p>
            <Link to="/users" className="btn btn-primary">View Users</Link>
          </div>
        )}

        <div className="dashboard-card">
          <h2>My Profile</h2>
          <p>Update your personal information</p>
          <Link to="/profile" className="btn btn-primary">Edit Profile</Link>
        </div>

        {user?.role === 'admin' && (
          <div className="dashboard-card">
            <h2>Create User</h2>
            <p>Add a new user to the system</p>
            <Link to="/users/create" className="btn btn-primary">Create User</Link>
          </div>
        )}

        <div className="dashboard-card">
          <h2>System Info</h2>
          <p>Current Status: <strong className="status-badge status-active">Active</strong></p>
          <p>API Base: http://localhost:5000/api</p>
        </div>
      </div>

      <div className="role-permissions">
        <h2>Your Permissions</h2>
        {user?.role === 'admin' && (
          <ul>
            <li>✓ Create users</li>
            <li>✓ Edit all users</li>
            <li>✓ Delete/Deactivate users</li>
            <li>✓ Assign roles</li>
            <li>✓ View all users</li>
          </ul>
        )}
        {user?.role === 'manager' && (
          <ul>
            <li>✓ View all users</li>
            <li>✓ Edit non-admin users</li>
            <li>✓ Cannot delete users</li>
            <li>✗ Cannot assign admin role</li>
          </ul>
        )}
        {user?.role === 'user' && (
          <ul>
            <li>✓ View own profile</li>
            <li>✓ Edit own profile</li>
            <li>✗ Cannot view other users</li>
            <li>✗ Cannot manage users</li>
          </ul>
        )}
      </div>
    </div>
  );
};
