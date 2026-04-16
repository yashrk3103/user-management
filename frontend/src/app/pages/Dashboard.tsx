import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/Topbar';
import { Users, UserCheck, ShieldCheck, UserX, UserPlus, Download, KeyRound, Monitor, Smartphone, Chrome, Compass, Globe, Power } from 'lucide-react';
import { userService } from '../services/userService';
import { User } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [terminatingUserId, setTerminatingUserId] = useState<string | null>(null);

  const NOTES_KEY = `admin-notes:${user?._id || 'anonymous'}`;

  const loadUsers = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'manager') {
      void loadUsers();
      const intervalId = window.setInterval(() => {
        void loadUsers(true);
      }, 15000);

      return () => {
        window.clearInterval(intervalId);
      };
    }

    setUsers([]);
    setLoading(false);
  }, [user?.role]);

  useEffect(() => {
    const stored = localStorage.getItem(NOTES_KEY);
    if (stored) setNotes(stored);
  }, [NOTES_KEY]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'active').length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;
  const inactiveUsers = users.filter((u) => u.status === 'inactive').length;

  const newestRegistrations = useMemo(
    () =>
      [...users]
        .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
        .slice(0, 5),
    [users],
  );

  const sessionUsers = useMemo(
    () =>
      [...users].sort((a, b) => {
        const onlineDelta = Number(Boolean(b.isOnline)) - Number(Boolean(a.isOnline));
        if (onlineDelta !== 0) return onlineDelta;

        return +new Date(b.lastSeenAt || b.updatedAt) - +new Date(a.lastSeenAt || a.updatedAt);
      }),
    [users],
  );

  const onlineUsersCount = sessionUsers.filter((u) => u.isOnline).length;
  const offlineUsersCount = sessionUsers.length - onlineUsersCount;

  const browserBreakdown = useMemo(() => {
    const labels = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Other'];
    const counts = labels.map((label) => ({ label, value: 0 }));
    const onlineUsers = users.filter((u) => u.status === 'active' && u.isOnline);

    onlineUsers.forEach((u) => {
      const browser = labels.includes(u.lastBrowser || '') ? (u.lastBrowser as string) : 'Other';
      const target = counts.find((c) => c.label === browser);
      if (target) target.value += 1;
    });

    const total = onlineUsers.length;

    return counts.map((c) => ({
      ...c,
      percentage: total > 0 ? Math.round((c.value / total) * 100) : 0,
    }));
  }, [users]);

  const deviceBreakdown = useMemo(() => {
    const onlineUsers = users.filter((u) => u.status === 'active' && u.isOnline);
    const desktop = onlineUsers.filter((u) => u.lastDeviceType === 'desktop').length;
    const mobile = onlineUsers.length - desktop;
    const total = onlineUsers.length;

    return {
      desktop,
      mobile,
      desktopPct: total > 0 ? Math.round((desktop / total) * 100) : 0,
      mobilePct: total > 0 ? Math.round((mobile / total) * 100) : 0,
    };
  }, [users]);

  const handleSaveNotes = () => {
    localStorage.setItem(NOTES_KEY, notes.trim());
    toast.success('Notes saved');
  };

  const handleExportCsv = () => {
    const header = ['Name', 'Email', 'Role', 'Status', 'Created At'];
    const rows = users.map((u) => [u.name, u.email, u.role, u.status, u.createdAt]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleForcePasswordReset = async () => {
    const email = window.prompt('Enter user email for password reset:');
    if (!email) return;

    const target = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!target) {
      toast.error('User not found');
      return;
    }

    const tempPassword = window.prompt('Enter temporary password (min 6 chars):', 'Temp@1234');
    if (!tempPassword || tempPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await userService.resetUserPassword(target._id, tempPassword);
      toast.success(`Password reset for ${target.name}`);
    } catch {
      toast.error('Failed to reset password');
    }
  };

  const handleTerminateSession = async (target: User) => {
    if (target._id === user?._id) {
      toast.error('You cannot terminate your own active session.');
      return;
    }

    setTerminatingUserId(target._id);
    try {
      await userService.terminateSession(target._id);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === target._id
            ? { ...u, isOnline: false, lastLogoutAt: new Date().toISOString() }
            : u,
        ),
      );
      toast.success(`Session terminated for ${target.name}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to terminate session');
    } finally {
      setTerminatingUserId(null);
    }
  };

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
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<Users size={20} />} label="Total Users" value={totalUsers} color="#7F56D9" to="/users" />
              <StatCard icon={<UserCheck size={20} />} label="Active Users" value={activeUsers} color="#12B76A" to="/users?status=active" />
              <StatCard icon={<ShieldCheck size={20} />} label="Admins" value={adminUsers} color="#175CD3" to="/users?role=admin" />
              <StatCard icon={<UserX size={20} />} label="Inactive Users" value={inactiveUsers} color="#F04438" to="/users?status=inactive" />
            </div>

            <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border xl:col-span-1" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Run common admin tasks instantly.</p>
                <div className="mt-4 space-y-2">
                  <Link
                    to="/users?action=create"
                    className="w-full h-10 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2"
                    style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
                  >
                    <UserPlus size={16} /> Invite New User
                  </Link>
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="w-full h-10 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 border"
                    style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
                  >
                    <Download size={16} /> Export User List (CSV)
                  </button>
                  <button
                    type="button"
                    onClick={handleForcePasswordReset}
                    className="w-full h-10 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 border"
                    style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
                  >
                    <KeyRound size={16} /> Force Password Reset
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-xl border xl:col-span-2" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Newest Registrations</h2>
                  <Link to="/users" className="text-sm" style={{ color: 'var(--focus-ring)' }}>View all users</Link>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left pb-2" style={{ color: 'var(--text-secondary)' }}>User</th>
                        <th className="text-left pb-2" style={{ color: 'var(--text-secondary)' }}>Email</th>
                        <th className="text-left pb-2" style={{ color: 'var(--text-secondary)' }}>Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newestRegistrations.map((u) => (
                        <tr key={u._id} className="border-t" style={{ borderColor: 'var(--border-default)' }}>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: 'var(--active-nav-bg)', color: 'var(--text-primary)' }}>
                                {u.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <Link to={`/users/${u._id}`} style={{ color: 'var(--text-primary)' }}>{u.name}</Link>
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{u.email}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>
                            {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl border xl:col-span-1" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Admin Notes</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Persistent scratchpad for admin reminders.</p>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Remember to update permissions for the marketing team on Friday..."
                  className="mt-3 w-full min-h-[150px] rounded-lg border p-3 text-sm"
                  style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--top-panel-bg)', color: 'var(--text-primary)' }}
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="mt-3 h-9 px-4 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
                >
                  Save Notes
                </button>
              </div>

              <div className="p-5 rounded-xl border xl:col-span-1" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>User Presence</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {onlineUsersCount} online, {offlineUsersCount} offline
                </p>
                <div className="mt-4 space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {sessionUsers.length === 0 ? (
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>No users found.</p>
                  ) : (
                    sessionUsers.map((u) => {
                      const isOnline = Boolean(u.isOnline);
                      const isCurrentAdminSession = u._id === user?._id;
                      const isTerminating = terminatingUserId === u._id;
                      const initials = u.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <div key={u._id} className="p-3 rounded-xl border flex items-start justify-between gap-3" style={{ borderColor: 'var(--border-default)' }}>
                          <div className="flex items-start gap-3 min-w-0">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                              style={{ backgroundColor: 'var(--active-nav-bg)', color: 'var(--text-primary)' }}
                            >
                              {initials}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{u.name}</p>
                              <p className="text-xs inline-flex items-center gap-1 mt-0.5" style={{ color: isOnline ? '#12B76A' : 'var(--text-secondary)' }}>
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: isOnline ? '#12B76A' : 'var(--text-secondary)' }}
                                />
                                {isOnline ? 'Online' : 'Offline'}
                              </p>
                              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                                Last seen {formatDistanceToNow(new Date(u.lastSeenAt || u.updatedAt), { addSuffix: true })}
                              </p>
                            </div>
                          </div>

                          <div className="w-[152px] shrink-0">
                            {isOnline && !isCurrentAdminSession ? (
                              <button
                                type="button"
                                disabled={isTerminating}
                                onClick={() => handleTerminateSession(u)}
                                className="h-9 w-full rounded-lg text-xs border inline-flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-60"
                                style={{
                                  borderColor: 'var(--error-border)',
                                  backgroundColor: 'var(--error-surface)',
                                  color: 'var(--error-text)',
                                }}
                              >
                                <Power size={13} />
                                {isTerminating ? 'Terminating...' : 'Terminate Session'}
                              </button>
                            ) : isCurrentAdminSession ? (
                              <span
                                className="h-9 w-full rounded-lg border inline-flex items-center justify-center text-xs whitespace-nowrap"
                                style={{
                                  borderColor: 'var(--border-input)',
                                  color: 'var(--text-label)',
                                  backgroundColor: 'var(--top-panel-bg)',
                                }}
                              >
                                Current session
                              </span>
                            ) : (
                              <span
                                className="h-9 w-full rounded-lg border inline-flex items-center justify-center text-xs whitespace-nowrap"
                                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                              >
                                No active session
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="p-5 rounded-xl border xl:col-span-1" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Device & Browser Breakdown</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Access distribution across user sessions.</p>

                <div className="mt-4 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="inline-flex items-center gap-1"><Monitor size={14} /> Desktop</span>
                      <span>{deviceBreakdown.desktopPct}%</span>
                    </div>
                    <div className="h-2 rounded mt-1" style={{ backgroundColor: 'var(--active-nav-bg)' }}>
                      <div className="h-full rounded" style={{ width: `${deviceBreakdown.desktopPct}%`, backgroundColor: '#3B82F6' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="inline-flex items-center gap-1"><Smartphone size={14} /> Mobile</span>
                      <span>{deviceBreakdown.mobilePct}%</span>
                    </div>
                    <div className="h-2 rounded mt-1" style={{ backgroundColor: 'var(--active-nav-bg)' }}>
                      <div className="h-full rounded" style={{ width: `${deviceBreakdown.mobilePct}%`, backgroundColor: '#22C55E' }} />
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  {browserBreakdown.map((b) => (
                    <div key={b.label}>
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <span className="inline-flex items-center gap-1">
                          {b.label === 'Chrome' ? <Chrome size={13} /> : b.label === 'Safari' ? <Compass size={13} /> : <Globe size={13} />}
                          {b.label}
                        </span>
                        <span>{b.percentage}%</span>
                      </div>
                      <div className="h-2 rounded mt-1" style={{ backgroundColor: 'var(--active-nav-bg)' }}>
                        <div className="h-full rounded" style={{ width: `${b.percentage}%`, backgroundColor: '#6B7280' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
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
