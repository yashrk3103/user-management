import { useEffect, useMemo, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import { toast } from 'sonner';
import { Topbar } from '../components/Topbar';

type UserPreferences = {
  securityAlerts: boolean;
  productUpdates: boolean;
  weeklyDigest: boolean;
};

const defaultPreferences: UserPreferences = {
  securityAlerts: true,
  productUpdates: false,
  weeklyDigest: true,
};

export const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const preferencesStorageKey = useMemo(
    () => `user-preferences:${user?._id || 'anonymous'}`,
    [user?._id],
  );

  useEffect(() => {
    if (!user) return;
    setDisplayName(user.name);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem(preferencesStorageKey);
    if (!raw) {
      setPreferences(defaultPreferences);
      return;
    }

    try {
      setPreferences({ ...defaultPreferences, ...JSON.parse(raw) });
    } catch {
      setPreferences(defaultPreferences);
    }
  }, [preferencesStorageKey, user]);

  if (!user) return null;

  const handleSaveProfile = async () => {
    const trimmedName = displayName.trim();

    if (trimmedName.length < 2) {
      toast.error('Name must be at least 2 characters');
      return;
    }

    if (trimmedName === user.name) {
      toast.info('No profile changes to save');
      return;
    }

    setIsSavingProfile(true);
    try {
      await updateProfile({ name: trimmedName });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    setIsChangingPassword(true);
    try {
      await userService.changePassword(user._id, {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed successfully');
    } catch {
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSavePreferences = () => {
    localStorage.setItem(preferencesStorageKey, JSON.stringify(preferences));
    toast.success('Preferences saved');
  };

  return (
    <>
      <Topbar pageName="Settings" />
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl space-y-6">
          <div>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage your personal account, security, and notification preferences.
            </p>
          </div>

          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Display name</label>
              <input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-2 h-10 px-3 rounded-lg border w-full"
                style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--app-card-bg)', color: 'var(--text-primary)' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Email</label>
              <input
                value={user.email}
                disabled
                className="mt-2 h-10 px-3 rounded-lg border w-full opacity-80 cursor-not-allowed"
                style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--top-panel-bg)', color: 'var(--text-secondary)' }}
              />
            </div>

            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSavingProfile}
              className="h-10 px-4 rounded-lg text-sm font-medium disabled:opacity-60"
              style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
            >
              {isSavingProfile ? 'Saving...' : 'Save profile'}
            </button>
          </div>

          <form onSubmit={handleChangePassword} className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Password & security</h2>

            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Current password</label>
              <div className="mt-2 relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 px-3 pr-10 rounded-lg border w-full"
                  style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--app-card-bg)', color: 'var(--text-primary)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>New password</label>
              <div className="mt-2 relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 px-3 pr-10 rounded-lg border w-full"
                  style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--app-card-bg)', color: 'var(--text-primary)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Confirm new password</label>
              <div className="mt-2 relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 px-3 pr-10 rounded-lg border w-full"
                  style={{ borderColor: 'var(--border-input)', backgroundColor: 'var(--app-card-bg)', color: 'var(--text-primary)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="h-10 px-4 rounded-lg text-sm font-medium disabled:opacity-60"
              style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
            >
              {isChangingPassword ? 'Updating...' : 'Update password'}
            </button>
          </form>

          <div className="p-5 rounded-xl border space-y-4" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Notification preferences</h2>

            <label className="flex items-center justify-between gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--border-default)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Security alerts</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Login alerts and suspicious activity notices.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.securityAlerts}
                onChange={(e) => setPreferences((prev) => ({ ...prev, securityAlerts: e.target.checked }))}
                className="h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--border-default)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Product updates</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Feature announcements and improvements.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.productUpdates}
                onChange={(e) => setPreferences((prev) => ({ ...prev, productUpdates: e.target.checked }))}
                className="h-4 w-4"
              />
            </label>

            <label className="flex items-center justify-between gap-3 p-3 rounded-lg border" style={{ borderColor: 'var(--border-default)' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Weekly digest</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>A summary of account activity every week.</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyDigest}
                onChange={(e) => setPreferences((prev) => ({ ...prev, weeklyDigest: e.target.checked }))}
                className="h-4 w-4"
              />
            </label>

            <button
              type="button"
              onClick={handleSavePreferences}
              className="h-10 px-4 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
            >
              Save preferences
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
