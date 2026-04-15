import { useState } from 'react';
import { Topbar } from '../components/Topbar';

export const Authentication = () => {
  const [mfaRequired, setMfaRequired] = useState(true);
  const [passwordRotation, setPasswordRotation] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  return (
    <>
      <Topbar pageName="Authentication" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Authentication</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Configure sign-in policies for stronger account protection.
            </p>
          </div>

          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Require MFA for admins</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Adds one-time verification at sign-in.</p>
              </div>
              <button className="h-9 px-3 rounded-lg border" style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }} onClick={() => setMfaRequired((v) => !v)}>
                {mfaRequired ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Force password rotation</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Request password reset every 90 days.</p>
              </div>
              <button className="h-9 px-3 rounded-lg border" style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }} onClick={() => setPasswordRotation((v) => !v)}>
                {passwordRotation ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            <div>
              <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Session timeout (minutes)</label>
              <select
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="mt-2 h-10 px-3 rounded-lg border w-full"
                style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--app-card-bg)', color: 'var(--text-primary)' }}
              >
                <option value="15">15</option>
                <option value="30">30</option>
                <option value="60">60</option>
                <option value="120">120</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
