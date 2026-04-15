import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { User, CreateUserDto, UpdateUserDto, UserRole, UserStatus } from '../types';
import { generatePassword } from '../utils/colors';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserDto | UpdateUserDto) => Promise<void>;
  user?: User | null;
  mode: 'create' | 'edit';
  currentUserRole?: UserRole;
}

export const UserModal = ({ isOpen, onClose, onSubmit, user, mode, currentUserRole }: UserModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as UserRole,
    status: 'active' as UserStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (mode === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        status: 'active',
      });
    }
    setErrors({});
  }, [user, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        if (!formData.password) {
          setErrors({ password: 'Password is required' });
          setIsSubmitting(false);
          return;
        }
        await onSubmit(formData as CreateUserDto);
      } else {
        const updateData: UpdateUserDto = {
          name: formData.name,
          email: formData.email,
        };

        if (currentUserRole === 'admin') {
          updateData.role = formData.role;
          updateData.status = formData.status;
        } else {
          if (formData.role !== 'admin') {
            updateData.role = formData.role;
          }
        }

        await onSubmit(updateData);
      }
      onClose();
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to save user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGeneratePassword = () => {
    setFormData({ ...formData, password: generatePassword() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-[480px] rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: 'var(--app-card-bg)' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {mode === 'create' ? 'Add new user' : 'Edit user'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--hover-nav-bg)]"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
              Full name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full h-11 px-3.5 rounded-lg border text-sm focus:outline-none focus:ring-4"
              style={{
                borderColor: errors.name ? 'var(--error-border)' : 'var(--border-input)',
                backgroundColor: 'var(--app-card-bg)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--focus-ring)';
                e.target.style.boxShadow = '0 0 0 4px rgba(127, 86, 217, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.name ? 'var(--error-border)' : 'var(--border-input)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: 'var(--error-text)' }}>{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
              Email address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full h-11 px-3.5 rounded-lg border text-sm focus:outline-none focus:ring-4"
              style={{
                borderColor: errors.email ? 'var(--error-border)' : 'var(--border-input)',
                backgroundColor: 'var(--app-card-bg)',
                color: 'var(--text-primary)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--focus-ring)';
                e.target.style.boxShadow = '0 0 0 4px rgba(127, 86, 217, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email ? 'var(--error-border)' : 'var(--border-input)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: 'var(--error-text)' }}>{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
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
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              {currentUserRole === 'admin' && <option value="admin">Admin</option>}
            </select>
          </div>

          {/* Status */}
          {currentUserRole === 'admin' && (
            <div>
            <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as UserStatus })}
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
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            </div>
          )}

          {/* Password (create only) */}
          {mode === 'create' && (
            <div>
              <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                Password
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  placeholder="Enter password"
                  className="flex-1 h-11 px-3.5 rounded-lg border text-sm focus:outline-none focus:ring-4"
                  style={{
                    borderColor: errors.password ? 'var(--error-border)' : 'var(--border-input)',
                    backgroundColor: 'var(--app-card-bg)',
                    color: 'var(--text-primary)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--focus-ring)';
                    e.target.style.boxShadow = '0 0 0 4px rgba(127, 86, 217, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? 'var(--error-border)' : 'var(--border-input)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={handleGeneratePassword}
                  className="px-4 h-11 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: 'var(--active-nav-bg)', color: 'var(--text-secondary)' }}
                >
                  Generate
                </button>
              </div>
              {errors.password && (
                <p className="text-xs mt-1" style={{ color: 'var(--error-text)' }}>{errors.password}</p>
              )}
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE', color: 'var(--error-text)' }}>
              {errors.submit}
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-default)' }}>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-lg text-sm font-medium border transition-colors"
              style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                backgroundColor: 'var(--primary-btn-bg)',
                color: 'var(--primary-btn-text)',
              }}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {mode === 'create' ? 'Create user' : 'Save changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
