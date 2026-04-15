import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';

export const Layout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--page-bg)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen overflow-hidden" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="h-full w-full overflow-hidden flex relative" style={{ backgroundColor: 'var(--app-card-bg)' }}>
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
};