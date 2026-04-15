import { useAuth } from '../context/AuthContext';
import { UserAvatar } from './UserAvatar';
import { ChevronRight, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface TopbarProps {
  pageName: string;
}

export const Topbar = ({ pageName }: TopbarProps) => {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      className="px-6 border-b flex items-center"
      style={{
        borderColor: 'var(--panel-border)',
        backgroundColor: 'var(--top-panel-bg)',
        minHeight: 'var(--panel-header-height)',
      }}
    >
      <div className="w-full flex items-center justify-between">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px]">
          <div
            className="w-5 h-5 rounded"
            style={{
              background: isDark
                ? 'linear-gradient(135deg, #F0F0F0 0%, #8D8D8D 100%)'
                : 'linear-gradient(135deg, #2D74DA 0%, #67A4F0 100%)',
            }}
          />
          <span style={{ color: 'var(--text-secondary)' }}>Sisyphus Ventures</span>
          <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {pageName}
          </span> 
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              className="relative h-9 w-9 rounded-lg border transition-colors cursor-pointer"
              style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <Sun
                size={16}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
                }`}
              />
              <Moon
                size={16}
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
                }`}
              />
            </button>
          )}

          {/* User Info */}
          {user && (
            <Link to="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {user.name}
              </span>
              <UserAvatar 
                name={user.name} 
                avatar={user.avatar} 
                showOnline 
                online={user.status === 'active'} 
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};