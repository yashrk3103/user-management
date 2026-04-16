import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Key, X } from 'lucide-react';
import { demoCredentials } from '../services/mockData';
import { RoleBadge } from '../components/RoleBadge';
import { BrandLogo } from '../components/BrandLogo';
import { toast } from 'sonner';

export const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoCreds, setShowDemoCreds] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      toast.success('Welcome back!', {
        description: 'You have successfully signed in.',
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setShowDemoCreds(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 md:py-8" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="w-full max-w-[420px]">
        {/* Login Card */}
        <div className="relative rounded-2xl p-8 md:p-10 shadow-xl" style={{ backgroundColor: 'var(--app-card-bg)' }}>
          {/* Demo credentials trigger */}
          <button
            type="button"
            onClick={() => setShowDemoCreds((prev) => !prev)}
            className="absolute top-4 right-4 h-9 w-9 rounded-lg border flex items-center justify-center cursor-pointer"
            style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
            title="Demo credentials"
          >
            <Key size={16} />
          </button>

          {showDemoCreds && (
            <div
              className="absolute top-14 right-0 md:right-4 rounded-xl p-4 border shadow-2xl z-20"
              style={{
                backgroundColor: 'var(--app-card-bg)',
                borderColor: 'var(--border-default)',
                width: 'min(360px, calc(100vw - 2rem))',
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Key size={16} style={{ color: 'var(--text-label)' }} />
                  <span className="text-[13px] font-semibold" style={{ color: 'var(--text-label)' }}>
                    Demo Credentials
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDemoCreds(false)}
                  className="p-1 rounded hover:bg-[var(--hover-nav-bg)] cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                  title="Close"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1.5">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.email}
                    onClick={() => handleDemoClick(cred.email, cred.password)}
                    className="w-full grid grid-cols-[auto_1fr_auto] items-center gap-2.5 p-2.5 rounded-md hover:bg-[var(--hover-nav-bg)] transition-colors text-left cursor-pointer"
                  >
                    <RoleBadge role={cred.role} />
                    <span className="min-w-0 text-[12px] truncate" style={{ color: 'var(--text-secondary)' }}>
                      {cred.email}
                    </span>
                    <span className="text-[12px] shrink-0" style={{ color: 'var(--text-muted)' }}>
                      {cred.password}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-[11px] mt-3 text-center" style={{ color: 'var(--text-muted)' }}>
                Click any row to auto-fill credentials
              </p>
            </div>
          )}

          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-8">
            <BrandLogo size={48} rounded={12} />
          </div>

          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Sign in to your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="w-full h-11 px-3.5 rounded-lg border text-sm focus:outline-none focus:ring-4"
                style={{
                  borderColor: 'var(--border-input)',
                  backgroundColor: 'var(--app-card-bg)',
                  color: 'var(--text-primary)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--focus-ring)';
                  e.target.style.boxShadow = '0 0 0 4px rgba(127, 86, 217, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-input)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 px-3.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-4"
                  style={{
                    borderColor: 'var(--border-input)',
                    backgroundColor: 'var(--app-card-bg)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--focus-ring)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(127, 86, 217, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border-input)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="text-[13px] p-3 rounded-lg border"
                style={{
                  backgroundColor: 'var(--error-surface)',
                  color: 'var(--error-text)',
                  borderColor: 'var(--error-border)',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
              style={{
                backgroundColor: 'var(--primary-btn-bg)',
                color: 'var(--primary-btn-text)',
              }}
              onMouseEnter={(e) => !isLoading && (e.currentTarget.style.backgroundColor = 'var(--primary-btn-hover)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-btn-bg)')}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
              New here?{' '}
              <Link to="/signup" className="font-medium hover:underline" style={{ color: 'var(--text-primary)' }}>
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};