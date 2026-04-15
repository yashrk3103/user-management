import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { toast } from 'sonner';

export const Signup = () => {
  const navigate = useNavigate();
  const { signup, user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created successfully');
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center px-4" style={{ backgroundColor: 'var(--page-bg)' }}>
      <div className="w-full max-w-[420px] space-y-6">
        <div className="rounded-2xl p-10 shadow-xl" style={{ backgroundColor: 'var(--app-card-bg)' }}>
          <div className="flex justify-center mb-8">
            <BrandLogo size={48} rounded={12} />
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Create account
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Join the platform as a new user
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                Full name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full h-11 px-3.5 rounded-lg border text-sm focus:outline-none focus:ring-4"
                style={{
                  borderColor: 'var(--border-input)',
                  backgroundColor: 'var(--app-card-bg)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

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
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full h-11 px-3.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-4"
                  style={{
                    borderColor: 'var(--border-input)',
                    backgroundColor: 'var(--app-card-bg)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  className="w-full h-11 px-3.5 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-4"
                  style={{
                    borderColor: 'var(--border-input)',
                    backgroundColor: 'var(--app-card-bg)',
                    color: 'var(--text-primary)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-[13px] p-3 rounded-lg" style={{ backgroundColor: '#FEE', color: 'var(--error-text)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              style={{
                backgroundColor: 'var(--primary-btn-bg)',
                color: 'var(--primary-btn-text)',
              }}
            >
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>
        </div>

        <div className="text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-medium hover:underline" style={{ color: 'var(--text-primary)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
