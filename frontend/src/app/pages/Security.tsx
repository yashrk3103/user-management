import { useEffect, useMemo, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { userService } from '../services/userService';
import { User } from '../types';
import { Link } from 'react-router';

export const Security = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userService.getUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const stats = useMemo(() => {
    const admins = users.filter((u) => u.role === 'admin').length;
    const inactive = users.filter((u) => u.status === 'inactive').length;
    const active = users.filter((u) => u.status === 'active').length;
    return { admins, inactive, active };
  }, [users]);

  const riskyUsers = useMemo(() => users.filter((u) => u.status === 'inactive').slice(0, 8), [users]);

  return (
    <>
      <Topbar pageName="Security & Access" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Security & Access</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Monitor account access risk and enforce administrative controls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Active Users</p>
              <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>{stats.active}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Inactive Accounts</p>
              <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>{stats.inactive}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Admin Accounts</p>
              <p className="text-3xl font-semibold" style={{ color: 'var(--text-primary)' }}>{stats.admins}</p>
            </div>
          </div>

          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Accounts Requiring Review</h2>
              <Link to="/users?status=inactive" className="text-sm" style={{ color: 'var(--focus-ring)' }}>View all inactive</Link>
            </div>
            <div className="mt-4 space-y-2">
              {riskyUsers.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No risky accounts found.</p>
              ) : (
                riskyUsers.map((u) => (
                  <Link
                    key={u._id}
                    to={`/users/${u._id}`}
                    className="block p-3 rounded-lg border hover:bg-[var(--hover-nav-bg)]"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
