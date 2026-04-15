import { useTheme } from 'next-themes';
import { Topbar } from '../components/Topbar';

export const Appearance = () => {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <Topbar pageName="Appearance" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Appearance</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Customize theme and visual preferences for your workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: 'light', title: 'Light', desc: 'Clean and bright' },
              { id: 'dark', title: 'Dark', desc: 'Matte dark mode' },
              { id: 'system', title: 'System', desc: 'Follow OS setting' },
            ].map((opt) => {
              const active = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className="p-5 rounded-xl border text-left transition-colors"
                  style={{
                    borderColor: active ? 'var(--focus-ring)' : 'var(--border-default)',
                    backgroundColor: 'var(--app-card-bg)',
                  }}
                >
                  <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{opt.title}</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{opt.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Preview Palette</h2>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[ 'var(--sidebar-panel-bg)', 'var(--top-panel-bg)', 'var(--active-nav-bg)', 'var(--primary-btn-bg)' ].map((token) => (
                <div key={token} className="rounded-lg border p-3" style={{ borderColor: 'var(--border-default)' }}>
                  <div className="h-10 rounded" style={{ backgroundColor: token }} />
                  <p className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{token}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
