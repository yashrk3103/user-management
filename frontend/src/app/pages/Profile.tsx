import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/Topbar';
import { UserAvatar } from '../components/UserAvatar';
import { RoleBadge } from '../components/RoleBadge';
import { StatusBadge } from '../components/StatusBadge';
import { Edit2, Eye, EyeOff } from 'lucide-react';
import { userService } from '../services/userService';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (!user) return null;

  const handleSaveName = async () => {
    if (editName.trim() === user.name) {
      setIsEditingName(false);
      return;
    }

    try {
      await updateProfile({ name: editName.trim() });
      toast.success('Profile updated successfully');
      setIsEditingName(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword(user._id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  return (
    <>
      <Topbar pageName="My Profile" />
      <div className="flex-1 overflow-hidden p-4 md:p-5">
        <div className="h-full max-w-5xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Profile Info Card */}
          <div className="p-4 md:p-5 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Profile Information
            </h2>

            <div className="flex items-start gap-3 mb-4">
              <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="px-2 py-1 border rounded text-sm font-semibold"
                        style={{ borderColor: 'var(--border-input)', color: 'var(--text-primary)' }}
                        autoFocus
                      />
                      <button
                        onClick={handleSaveName}
                        className="px-3 py-1 rounded text-sm font-medium"
                        style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditName(user.name);
                          setIsEditingName(false);
                        }}
                        className="px-3 py-1 rounded text-sm font-medium border"
                        style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {user.name}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1 rounded hover:bg-[var(--hover-nav-bg)]"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        <Edit2 size={16} />
                      </button>
                    </>
                  )}
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {user.email}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t" style={{ borderColor: 'var(--border-default)' }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Email</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.email}</p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Role</p>
                  <RoleBadge role={user.role} />
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Status</p>
                  <StatusBadge status={user.status} />
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>Member since</p>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="p-4 md:p-5 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-base font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-3">
              {/* Current Password */}
              <div>
                <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                  Current password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full h-10 px-3 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-4"
                    style={{ borderColor: 'var(--border-input)' }}
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
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    className="w-full h-10 px-3 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-4"
                    style={{ borderColor: 'var(--border-input)' }}
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
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[13px] font-medium mb-1" style={{ color: 'var(--text-label)' }}>
                  Confirm new password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    className="w-full h-10 px-3 pr-10 rounded-lg border text-sm focus:outline-none focus:ring-4"
                    style={{ borderColor: 'var(--border-input)' }}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 h-10 rounded-lg text-sm font-medium disabled:opacity-50"
                  style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
                >
                  {isChangingPassword ? 'Saving...' : 'Save password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
