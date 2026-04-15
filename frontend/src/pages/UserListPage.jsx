import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import '../styles/UserList.css';

export const UserListPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', role: '', status: '' });
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getUsers(page, 10, filters);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPage(1);
  };

  const handleDeactivate = async (userId) => {
    if (!window.confirm('Deactivate this user?')) return;

    try {
      await userAPI.deactivateUser(userId);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deactivate user');
    }
  };

  if (!['admin', 'manager'].includes(user?.role)) {
    return <div className="error-message">You do not have permission to view this page</div>;
  }

  return (
    <div className="user-list-container">
      <div className="page-header">
        <h1>User Management</h1>
        {user?.role === 'admin' && <Link to="/users/create" className="btn btn-primary">Create User</Link>}
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters">
        <input
          type="text"
          name="search"
          placeholder="Search by name or email"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>
        <select name="status" value={filters.status} onChange={handleFilterChange}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="no-data">No users found</div>
      ) : (
        <>
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                  <td><span className={`status-badge status-${u.status}`}>{u.status}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/users/${u._id}`} className="btn btn-small">View</Link>
                    {user?.role === 'admin' && u.role !== 'admin' && (
                      <>
                        <Link to={`/users/${u._id}/edit`} className="btn btn-small">Edit</Link>
                        {u.status === 'active' && (
                          <button
                            onClick={() => handleDeactivate(u._id)}
                            className="btn btn-small btn-danger"
                          >
                            Deactivate
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn btn-small"
            >
              Previous
            </button>
            <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="btn btn-small"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
