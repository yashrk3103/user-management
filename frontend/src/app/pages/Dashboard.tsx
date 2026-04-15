import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/Topbar';
import { Users, UserCheck, ShieldCheck, UserX } from 'lucide-react';
import { userService } from '../services/userService';
import { User } from '../types';

export const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length;

  const StatCard = ({
    icon,
    label,
    value,
    color,
    to,
  }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
    to?: string;
  }) => {
    const content = (
      <div
        className="p-5 rounded-xl border h-full transition-colors"
        style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
            <div style={{ color }}>{icon}</div>
          </div>
          <div className="flex-1">
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
              {label}
            </p>
            <p className="text-[32px] font-semibold leading-none" style={{ color: 'var(--text-primary)' }}>
              {loading ? '...' : value}
            </p>
          </div>
        </div>
      </div>
    );

    if (!to) return content;

    return (
      <Link to={to} className="block rounded-xl hover:opacity-95" title={`View ${label.toLowerCase()}`}>
        {content}
      </Link>
    );
  };

  return (
    <>
      <Topbar pageName="Dashboard" />
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {user?.name}
          </p>
        </div>

        {/* Stats Grid */}
        {user?.role === 'admin' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users size={20} />} label="Total Users" value={totalUsers} color="#7F56D9" to="/users" />
            <StatCard icon={<UserCheck size={20} />} label="Active Users" value={activeUsers} color="#12B76A" to="/users?status=active" />
            <StatCard icon={<ShieldCheck size={20} />} label="Admins" value={adminUsers} color="#175CD3" to="/users?role=admin" />
            <StatCard icon={<UserX size={20} />} label="Inactive Users" value={inactiveUsers} color="#F04438" to="/users?status=inactive" />
          </div>
        ) : user?.role === 'manager' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatCard icon={<Users size={20} />} label="Total Users" value={totalUsers} color="#7F56D9" to="/users" />
            <StatCard icon={<UserCheck size={20} />} label="Active Users" value={activeUsers} color="#12B76A" to="/users?status=active" />
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="p-8 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
              <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Welcome to User Manager
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                You're logged in as a user. Navigate through the sidebar to access your profile and notifications.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: 'var(--active-nav-bg)' }}>
                  <div className="h-full rounded-full" style={{ backgroundColor: 'var(--focus-ring)', width: '75%' }} />
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>75%</span>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>
                Profile completion
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
