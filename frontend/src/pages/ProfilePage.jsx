import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import '../styles/Form.css';

export const ProfilePage = () => {
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      const user = response.data.data;
      setFormData({
        name: user.name,
        password: '',
      });
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) delete dataToSend.password;

      await userAPI.updateProfile(dataToSend);
      setSuccess('Profile updated successfully');
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="form-container">
      <h1>My Profile</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-info">
        <p><strong>Email:</strong> {currentUser?.email}</p>
        <p><strong>Role:</strong> <span className={`role-badge role-${currentUser?.role}`}>{currentUser?.role}</span></p>
        <p><strong>Status:</strong> <span className={`status-badge status-${currentUser?.status}`}>{currentUser?.status}</span></p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Change Password (optional)</label>
          <input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary">
          {submitting ? 'Saving...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};
