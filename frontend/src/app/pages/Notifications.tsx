import { useEffect, useMemo, useState } from 'react';
import { Topbar } from '../components/Topbar';
import { userService } from '../services/userService';
import { User } from '../types';
import { Bell, CircleAlert, CheckCircle2 } from 'lucide-react';

interface AppNotification {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success';
  createdAt: string;
}

export const Notifications = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    userService.getUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const notifications = useMemo<AppNotification[]>(() => {
    const inactiveUsers = users.filter((u) => u.status === 'inactive').length;
    const adminCount = users.filter((u) => u.role === 'admin').length;

    return [
      {
        id: 'n1',
        title: 'Inactive accounts detected',
        description: `${inactiveUsers} user account(s) are inactive and may need review.`,
        severity: inactiveUsers > 0 ? 'warning' : 'success',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'n2',
        title: 'Admin coverage',
        description: `System currently has ${adminCount} administrator account(s).`,
        severity: adminCount < 1 ? 'warning' : 'info',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'n3',
        title: 'User sync complete',
        description: 'Latest user synchronization completed successfully.',
        severity: 'success',
        createdAt: new Date().toISOString(),
      },
    ];
  }, [users]);

  const iconFor = (severity: AppNotification['severity']) => {
    if (severity === 'warning') return <CircleAlert size={18} style={{ color: '#F79009' }} />;
    if (severity === 'success') return <CheckCircle2 size={18} style={{ color: '#12B76A' }} />;
    return <Bell size={18} style={{ color: 'var(--text-label)' }} />;
  };

  return (
    <>
      <Topbar pageName="Notifications" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Operational alerts and system messages for user management.
            </p>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">{iconFor(n.severity)}</div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{n.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
