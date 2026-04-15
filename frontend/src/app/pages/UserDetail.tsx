import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/Topbar';
import { UserAvatar } from '../components/UserAvatar';
import { RoleBadge } from '../components/RoleBadge';
import { StatusBadge } from '../components/StatusBadge';
import { UserModal } from '../components/UserModal';
import { ArrowLeft, Edit2, UserCheck, Trash2 } from 'lucide-react';
import { userService } from '../services/userService';
import { User, UpdateUserDto } from '../types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const UserDetail = () => {
  const { user: currentUser } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    if (!id) return;
    try {
      const data = await userService.getUserById(id);
      setUser(data);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Topbar pageName="User Details" />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Topbar pageName="User Details" />
        <div className="flex-1 flex items-center justify-center">
          <p style={{ color: 'var(--text-secondary)' }}>User not found</p>
        </div>
      </>
    );
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };

  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy \'at\' h:mm a');
  };

  const handleUpdateUser = async (data: UpdateUserDto) => {
    if (!id) return;
    await userService.updateUser(id, data);
    await loadUser();
    toast.success('User updated successfully');
  };

  const handleDeactivateUser = async () => {
    if (!id || !user) return;
    if (!window.confirm(`Deactivate ${user.name}? They will not be able to log in.`)) return;

    setIsUpdatingStatus(true);
    try {
      await userService.deactivateUser(id);
      await loadUser();
      toast.success('User deactivated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to deactivate user');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleActivateUser = async () => {
    if (!id) return;

    setIsUpdatingStatus(true);
    try {
      await userService.activateUser(id);
      await loadUser();
      toast.success('User activated successfully');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to activate user');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const canAdminManage = currentUser?.role === 'admin';

  return (
    <>
      <Topbar pageName="User Details" />
      <div className="flex-1 overflow-auto p-6">
        {/* Back Button */}
        <Link
          to="/users"
          className="inline-flex items-center gap-2 mb-6 text-sm hover:underline"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={16} />
          Back to users
        </Link>

        <div className="max-w-3xl space-y-6">
          {/* Profile Header Card */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <div className="flex items-start gap-4 justify-between">
              <div className="flex items-start gap-4">
              <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {user.name}
                  </h1>
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {user.email}
                </p>
              </div>
              </div>

              {canAdminManage && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="h-9 px-3 rounded-lg border text-sm font-medium flex items-center gap-2"
                    style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>

                  {user.status === 'active' ? (
                    <button
                      onClick={handleDeactivateUser}
                      disabled={isUpdatingStatus}
                      className="h-9 w-[126px] rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--error-bg)', color: '#fff' }}
                    >
                      <Trash2 size={16} />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={handleActivateUser}
                      disabled={isUpdatingStatus}
                      className="h-9 w-[126px] rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ backgroundColor: '#12B76A', color: '#fff' }}
                    >
                      <UserCheck size={16} />
                      Activate
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              User Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Email
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {user.email}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Role
                </p>
                <div>
                  <RoleBadge role={user.role} />
                </div>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Status
                </p>
                <div>
                  <StatusBadge status={user.status} />
                </div>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Member Since
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formatDate(user.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Last Active
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                </p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                  Last Updated
                </p>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {formatDate(user.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="p-6 rounded-xl border" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Audit Information
            </h2>
            <div className="space-y-2">
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Created by <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.createdBy || 'System'}</span> on {formatDateTime(user.createdAt)}
              </p>
              <p className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                Last updated by <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{user.updatedBy || user.name}</span> on {formatDateTime(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {canAdminManage && (
        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleUpdateUser}
          user={user}
          mode="edit"
          currentUserRole={currentUser?.role}
        />
      )}
    </>
  );
};
