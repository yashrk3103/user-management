import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/UserDetail.css';

export const UserDetailPage = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUserById(id);
      setUser(response.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading user...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!user) return <div className="error-message">User not found</div>;

  const canEdit = ['admin', 'manager'].includes(currentUser?.role) && user.role !== 'admin';

  return (
    <div className="user-detail-container">
      <div className="page-header">
        <h1>{user.name}</h1>
        {canEdit && <Link to={`/users/${id}/edit`} className="btn btn-primary">Edit User</Link>}
      </div>

      <div className="user-detail-card">
        <div className="detail-section">
          <h2>User Information</h2>
          <div className="detail-row">
            <label>Name:</label>
            <span>{user.name}</span>
          </div>
          <div className="detail-row">
            <label>Email:</label>
            <span>{user.email}</span>
          </div>
          <div className="detail-row">
            <label>Role:</label>
            <span className={`role-badge role-${user.role}`}>{user.role}</span>
          </div>
          <div className="detail-row">
            <label>Status:</label>
            <span className={`status-badge status-${user.status}`}>{user.status}</span>
          </div>
        </div>

        <div className="detail-section">
          <h2>Audit Information</h2>
          <div className="detail-row">
            <label>Created At:</label>
            <span>{new Date(user.createdAt).toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <label>Created By:</label>
            <span>{user.createdBy?.name || 'System'} ({user.createdBy?.email || 'N/A'})</span>
          </div>
          <div className="detail-row">
            <label>Updated At:</label>
            <span>{new Date(user.updatedAt).toLocaleString()}</span>
          </div>
          <div className="detail-row">
            <label>Updated By:</label>
            <span>{user.updatedBy?.name || 'System'} ({user.updatedBy?.email || 'N/A'})</span>
          </div>
        </div>

        <Link to="/users" className="btn btn-secondary">Back to Users</Link>
      </div>
    </div>
  );
};
