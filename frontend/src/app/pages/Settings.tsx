import { useState } from 'react';
import { Topbar } from '../components/Topbar';

export const Settings = () => {
  const [orgName, setOrgName] = useState('Sisyphus Ventures');
  const [defaultRole, setDefaultRole] = useState('user');

  return (
    <>
      <Topbar pageName="Settings" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Define organization defaults for user provisioning and governance.
            </p>
          </div>

          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Organization name</label>
              <input
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="mt-2 h-10 px-3 rounded-lg border w-full"
                style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--app-card-bg)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Default role for new users</label>
              <select
                value={defaultRole}
                onChange={(e) => setDefaultRole(e.target.value)}
                className="mt-2 h-10 px-3 rounded-lg border w-full"
                style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--app-card-bg)', color: 'var(--text-primary)' }}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <button className="h-10 px-4 rounded-lg text-sm font-medium" style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}>
              Save settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
