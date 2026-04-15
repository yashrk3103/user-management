import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

export const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          UMS
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">Dashboard</Link>
          </li>

          {['admin', 'manager'].includes(user?.role) && (
            <li className="nav-item">
              <Link to="/users" className="nav-link">Users</Link>
            </li>
          )}

          <li className="nav-item">
            <Link to="/profile" className="nav-link">Profile</Link>
          </li>

          <li className="nav-item user-info">
            <span>{user?.name}</span>
            <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
          </li>

          <li className="nav-item">
            <button onClick={handleLogout} className="btn btn-logout">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
