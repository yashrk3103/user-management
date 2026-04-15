import { useState } from 'react';
import { Topbar } from '../components/Topbar';
import { CheckCircle2, Link2, Unplug } from 'lucide-react';

type Integration = { id: string; name: string; category: string; connected: boolean };

export const Connections = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'slack', name: 'Slack', category: 'Notifications', connected: true },
    { id: 'google', name: 'Google Workspace', category: 'SSO', connected: false },
    { id: 'okta', name: 'Okta', category: 'Identity', connected: true },
    { id: 'webhook', name: 'Custom Webhooks', category: 'Automation', connected: false },
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations((prev) => prev.map((it) => (it.id === id ? { ...it, connected: !it.connected } : it)));
  };

  return (
    <>
      <Topbar pageName="Connections" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Connections</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage integrations for identity, notifications, and automation.
            </p>
          </div>

          <div className="space-y-3">
            {integrations.map((it) => (
              <div key={it.id} className="p-4 rounded-xl border flex items-center justify-between" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--active-nav-bg)' }}>
                    <Link2 size={18} style={{ color: 'var(--text-label)' }} />
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{it.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{it.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm inline-flex items-center gap-1" style={{ color: it.connected ? '#12B76A' : 'var(--text-secondary)' }}>
                    {it.connected ? <CheckCircle2 size={16} /> : <Unplug size={16} />}
                    {it.connected ? 'Connected' : 'Disconnected'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleConnection(it.id)}
                    className="h-9 px-3 rounded-lg text-sm font-medium"
                    style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
                  >
                    {it.connected ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
