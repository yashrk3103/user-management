import { Link } from 'react-router';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="text-center max-w-md">
        <div className="mb-6">
          <h1 className="text-6xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            404
          </h1>
          <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Page not found
          </h2>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
          >
            <Home size={18} />
            Go to Dashboard
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 h-11 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
