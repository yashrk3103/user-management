import { Link, useLocation } from 'react-router';
import {
  LayoutGrid,
  Palette,
  Link as LinkIcon,
  Bell,
  Users,
  Shield,
  Fingerprint,
  Settings,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { BrandLogo } from './BrandLogo';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[];
  badge?: number;
}

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const generalItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutGrid size={18} /> },
    { label: 'Appearance', path: '/appearance', icon: <Palette size={18} />, roles: ['admin'] },
    { label: 'Connections', path: '/connections', icon: <LinkIcon size={18} /> },
    { label: 'Notifications', path: '/notifications', icon: <Bell size={18} /> },
  ];

  const managementItems: NavItem[] = [
    { label: 'User management', path: '/users', icon: <Users size={18} />, roles: ['admin', 'manager'] },
    { label: 'Security & access', path: '/security', icon: <Shield size={18} />, roles: ['admin'] },
    { label: 'Authentication', path: '/authentication', icon: <Fingerprint size={18} />, roles: ['admin'] },
  ];

  const bottomItems: NavItem[] = [
    { label: 'Settings', path: '/settings', icon: <Settings size={18} /> },
    { label: 'Documentation', path: '/documentation', icon: <FileText size={18} /> },
  ];

  const canViewItem = (item: NavItem) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role || '');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ item }: { item: NavItem }) => (
    <Link
      to={item.path}
      onClick={() => setIsMobileOpen(false)}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
        isActive(item.path)
          ? 'font-medium'
          : 'hover:bg-[var(--hover-nav-bg)]'
      }`}
      style={{
        backgroundColor: isActive(item.path) ? 'var(--active-nav-bg)' : 'transparent',
        color: isActive(item.path) ? 'var(--active-nav-text)' : 'var(--text-label)',
      }}
    >
      <span style={{ color: isActive(item.path) ? 'var(--text-label)' : 'var(--text-secondary)' }}>
        {item.icon}
      </span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="px-1.5 py-0.5 text-xs font-medium rounded-full text-white" style={{ backgroundColor: 'var(--primary-btn-bg)' }}>
          {item.badge}
        </span>
      )}
    </Link>
  );

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div
        className="px-6 border-b flex items-center"
        style={{
          borderColor: 'var(--panel-border)',
          minHeight: 'var(--panel-header-height)',
        }}
      >
        <div className="flex items-center gap-3">
          <BrandLogo size={32} rounded={10} />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>
                User Manager
              </span>
              <span className="px-1.5 py-0.5 text-[11px] rounded" style={{ backgroundColor: 'var(--active-nav-bg)', color: 'var(--text-secondary)' }}>
                v1.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          {/* General Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              General
            </div>
            <div className="space-y-1">
              {generalItems.filter(canViewItem).map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>
          </div>

          {/* Management Section */}
          <div>
            <div className="px-3 mb-2 text-[11px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Management
            </div>
            <div className="space-y-1">
              {managementItems.filter(canViewItem).map((item) => (
                <NavLink key={item.path} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t space-y-1" style={{ borderColor: 'var(--sidebar-border)' }}>
        {bottomItems.map((item) => (
          <NavLink key={item.path} item={item} />
        ))}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors hover:bg-[var(--hover-nav-bg)]"
          style={{ color: 'var(--text-label)' }}
        >
          <LogOut size={18} style={{ color: 'var(--text-secondary)' }} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-6 left-6 z-50 p-2 rounded-lg shadow-lg"
        style={{ backgroundColor: 'var(--app-card-bg)', border: '1px solid var(--border-default)' }}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-[280px] flex flex-col transition-transform md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          backgroundColor: 'var(--sidebar-panel-bg)',
          borderRight: '1px solid var(--panel-border)'
        }}
      >
        <SidebarContent />
      </aside>
    </>
  );
};