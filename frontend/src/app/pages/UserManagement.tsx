import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Topbar } from '../components/Topbar';
import { UserAvatar } from '../components/UserAvatar';
import { RoleBadge } from '../components/RoleBadge';
import { UserModal } from '../components/UserModal';
import { Search, Filter, Plus, MoreVertical, Eye, Edit2, Trash2, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import { userService } from '../services/userService';
import { User, CreateUserDto, UpdateUserDto } from '../types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'manager' | 'user'>(() => {
    const role = searchParams.get('role');
    return role === 'admin' || role === 'manager' || role === 'user' ? role : 'all';
  });
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>(() => {
    const status = searchParams.get('status');
    return status === 'active' || status === 'inactive' ? status : 'all';
  });
  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (data: CreateUserDto) => {
    try {
      await userService.createUser(data);
      await loadUsers();
      toast.success('User created successfully');
    } catch (error: any) {
      throw error;
    }
  };

  const handleUpdateUser = async (data: UpdateUserDto) => {
    if (!editingUser) return;
    try {
      await userService.updateUser(editingUser._id, data);
      await loadUsers();
      toast.success(`${editingUser.name} details updated`, {
        description: 'View profile',
        action: {
          label: 'View',
          onClick: () => window.location.href = `/users/${editingUser._id}`,
        },
      });
    } catch (error: any) {
      throw error;
    }
  };

  const handleModalSubmit = async (data: CreateUserDto | UpdateUserDto) => {
    if (modalMode === 'create') {
      await handleCreateUser(data as CreateUserDto);
      return;
    }
    await handleUpdateUser(data as UpdateUserDto);
  };

  const handleDeactivateUser = async (user: User) => {
    if (!window.confirm(`Deactivate ${user.name}? They will not be able to log in.`)) return;

    try {
      await userService.deactivateUser(user._id);
      await loadUsers();
      toast.success('User deactivated successfully');
    } catch (error) {
      toast.error('Failed to deactivate user');
    } finally {
      setActiveDropdown(null);
    }
  };

  const handleActivateUser = async (user: User) => {
    try {
      await userService.activateUser(user._id);
      await loadUsers();
      toast.success('User activated successfully');
    } catch (error) {
      toast.error('Failed to activate user');
    } finally {
      setActiveDropdown(null);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode('edit');
    setEditingUser(user);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(filteredUsers.map((u) => u._id)));
    }
  };

  const toggleSelectUser = (id: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedUsers(newSelected);
  };

  const canEditUser = (user: User) => {
    if (currentUser?.role === 'admin') return true;
    if (currentUser?.role === 'manager' && user.role !== 'admin') return true;
    return false;
  };

  const canManageUserStatus = () => currentUser?.role === 'admin';

  const filteredUsers = users.filter((user) =>
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (roleFilter === 'all' || user.role === roleFilter) &&
    (statusFilter === 'all' || user.status === statusFilter)
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (roleFilter === 'all') {
      params.delete('role');
    } else {
      params.set('role', roleFilter);
    }

    if (statusFilter === 'all') {
      params.delete('status');
    } else {
      params.set('status', statusFilter);
    }

    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      setSearchParams(params, { replace: true });
    }
  }, [roleFilter, statusFilter, searchParams, setSearchParams]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  if (!['admin', 'manager'].includes(currentUser?.role || '')) {
    return (
      <>
        <Topbar pageName="User management" />
        <div className="flex-1 overflow-auto p-6">
          <div className="p-6 rounded-xl border max-w-xl" style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}>
            <h2 className="text-base font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Access denied</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              You do not have permission to manage users.
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar pageName="User management" />
      <div className="flex-1 overflow-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            User management
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Manage your team members and their account permissions here.
          </p>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="text-base font-medium" style={{ color: 'var(--text-primary)' }}>
            All users <span style={{ color: 'var(--text-secondary)' }}>({filteredUsers.length})</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[240px] h-10 pl-10 pr-3 rounded-lg border text-sm focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'var(--border-input)',
                  backgroundColor: 'var(--app-card-bg)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--focus-ring)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-input)';
                }}
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <div className="h-10 px-3 rounded-lg border text-sm font-medium flex items-center gap-2"
                style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}>
                <Filter size={16} />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as 'all' | 'admin' | 'manager' | 'user')}
                  className="bg-transparent outline-none"
                >
                  <option value="all">All roles</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                </select>
              </div>

              <div className="h-10 px-3 rounded-lg border text-sm font-medium flex items-center gap-2"
                style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                  className="bg-transparent outline-none"
                >
                  <option value="all">All status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Add User (Admin Only) */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={openCreateModal}
                className="h-10 px-4 rounded-lg text-sm font-medium flex items-center gap-2"
                style={{ backgroundColor: 'var(--primary-btn-bg)', color: 'var(--primary-btn-text)' }}
              >
                <Plus size={18} />
                Add user
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-visible" style={{ borderColor: 'var(--border-default)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--app-card-bg)' }}>
                <th className="text-left p-4 w-12">
                  <input
                    type="checkbox"
                    checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border cursor-pointer"
                    style={{ borderColor: 'var(--border-input)', accentColor: 'var(--focus-ring)' }}
                  />
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase" style={{ color: 'var(--text-secondary)' }}>
                  User name
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase" style={{ color: 'var(--text-secondary)' }}>
                  Access
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase" style={{ color: 'var(--text-secondary)' }}>
                  Last active ↓
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase" style={{ color: 'var(--text-secondary)' }}>
                  Date added
                </th>
                <th className="text-left p-4 text-xs font-medium uppercase" style={{ color: 'var(--text-secondary)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Loading users...
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-t hover:bg-[var(--hover-nav-bg)] transition-colors"
                    style={{ borderColor: 'var(--border-default)' }}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.has(user._id)}
                        onChange={() => toggleSelectUser(user._id)}
                        className="w-4 h-4 rounded border cursor-pointer"
                        style={{ borderColor: 'var(--border-input)', accentColor: 'var(--focus-ring)' }}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={user.name} avatar={user.avatar} />
                        <div>
                          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                            {user.name}
                          </div>
                          <div className="text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {user.lastActive ? formatDate(user.lastActive) : 'Never'}
                    </td>
                    <td className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/users/${user._id}`}
                          className="h-8 w-[108px] rounded border text-xs font-medium inline-flex items-center justify-center gap-1"
                          style={{ borderColor: 'var(--border-input)', color: 'var(--text-label)' }}
                        >
                          <Eye size={14} />
                          View
                        </Link>

                        {canManageUserStatus() && (
                          user.status === 'active' ? (
                            <button
                              onClick={() => handleDeactivateUser(user)}
                              className="h-8 w-[108px] rounded text-xs font-medium inline-flex items-center justify-center gap-1"
                              style={{ backgroundColor: 'var(--error-bg)', color: '#fff' }}
                            >
                              <Trash2 size={14} />
                              Deactivate
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user)}
                              className="h-8 w-[108px] rounded text-xs font-medium inline-flex items-center justify-center gap-1"
                              style={{ backgroundColor: '#12B76A', color: '#fff' }}
                            >
                              <UserCheck size={14} />
                              Activate
                            </button>
                          )
                        )}

                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === user._id ? null : user._id)}
                          className="p-1 rounded hover:bg-[var(--active-nav-bg)]"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <MoreVertical size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {activeDropdown === user._id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                            {/** Open upward for bottom rows so menu remains visible without scrolling */}
                            {(() => {
                              const shouldOpenUp = index >= Math.max(0, paginatedUsers.length - 2);
                              return (
                            <div
                              className={`absolute right-0 w-48 rounded-lg border shadow-lg z-50 py-1 ${shouldOpenUp ? 'bottom-full mb-1' : 'top-full mt-1'}`}
                              style={{ backgroundColor: 'var(--app-card-bg)', borderColor: 'var(--border-default)' }}
                            >
                              <Link
                                to={`/users/${user._id}`}
                                className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--hover-nav-bg)]"
                                style={{ color: 'var(--text-label)' }}
                                onClick={() => setActiveDropdown(null)}
                              >
                                <Eye size={16} />
                                View profile
                              </Link>
                              {canEditUser(user) && (
                                <button
                                  onClick={() => openEditModal(user)}
                                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--hover-nav-bg)]"
                                  style={{ color: 'var(--text-label)' }}
                                >
                                  <Edit2 size={16} />
                                  Edit user
                                </button>
                              )}
                              {canManageUserStatus() && (
                                <>
                                  <div className="my-1 border-t" style={{ borderColor: 'var(--border-default)' }} />
                                  {user.status === 'active' ? (
                                    <button
                                      onClick={() => handleDeactivateUser(user)}
                                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--hover-nav-bg)]"
                                      style={{ color: 'var(--error-text)' }}
                                    >
                                      <Trash2 size={16} />
                                      Deactivate user
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleActivateUser(user)}
                                      className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--hover-nav-bg)]"
                                      style={{ color: 'var(--text-label)' }}
                                    >
                                      <UserCheck size={16} />
                                      Activate user
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                              );
                            })()}
                          </>
                        )}
                      </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-1 mt-5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded hover:bg-[var(--hover-nav-bg)] disabled:opacity-30"
              style={{ color: 'var(--text-label)' }}
            >
              <ChevronLeft size={18} />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 rounded text-sm font-medium"
                style={{
                  backgroundColor: currentPage === page ? 'var(--hover-nav-bg)' : 'transparent',
                  color: 'var(--text-label)',
                  border: currentPage === page ? '1px solid var(--border-input)' : 'none',
                }}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded hover:bg-[var(--hover-nav-bg)] disabled:opacity-30"
              style={{ color: 'var(--text-label)' }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        user={editingUser}
        mode={modalMode}
        currentUserRole={currentUser?.role}
      />
    </>
  );
};
