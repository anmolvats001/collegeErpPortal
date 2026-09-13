import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { userService } from '../../services/userService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Shield,
  RefreshCw,
  Mail,
  User,
  Lock,
} from 'lucide-react';

import { IS_PREVIEW_MODE, MOCK_USER_DIRECTORY } from '../../utils/mockData';

export const UserManagementPage = () => {
  const { isMainAdmin, isCollegeAdmin, hasPermission } = useAuth();
  const { activeCollegeName, activeCollegeId } = useTenant();

  const canCreateUser = isMainAdmin || isCollegeAdmin || hasPermission('CREATE_USER');
  const canUpdateUser = isMainAdmin || isCollegeAdmin || hasPermission('UPDATE_USER');
  const canDeleteUser = isMainAdmin || hasPermission('DELETE_USER');

  const [users, setUsers] = useState(IS_PREVIEW_MODE ? MOCK_USER_DIRECTORY : []);
  const [isLoading, setIsLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [alert, setAlert] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    email: '',
    password: '',
  });

  const loadUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      let data = [];
      if (isMainAdmin && !activeCollegeId) {
        data = await userService.getAllUsers();
      } else {
        data = await userService.getCollegeUsers();
      }
      setUsers(Array.isArray(data) && data.length > 0 ? data : (IS_PREVIEW_MODE ? MOCK_USER_DIRECTORY : []));
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setUsers(MOCK_USER_DIRECTORY);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to load user directory.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isMainAdmin, activeCollegeId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      loadUsers();
      return;
    }

    setIsLoading(true);
    try {
      const data = await userService.searchUsers(searchKeyword.trim());
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        const lower = searchKeyword.toLowerCase();
        const matched = MOCK_USER_DIRECTORY.filter(
          (u) =>
            u.userId.toLowerCase().includes(lower) ||
            u.userName.toLowerCase().includes(lower)
        );
        setUsers(matched);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Search failed.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setFormData({ userId: '', userName: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (user) => {
    setIsEditing(true);
    setFormData({
      userId: user.userId || '',
      userName: user.userName || '',
      email: user.email || '',
      password: '',
    });
    setIsModalOpen(true);
  };

  // Submit User Create / Update
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      if (isEditing) {
        await userService.updateUserByAdmin(formData);
        setAlert({ type: 'success', message: `User ${formData.userId} updated successfully.` });
        setUsers((prev) =>
          prev.map((u) => (u.userId === formData.userId ? { ...u, ...formData } : u))
        );
      } else {
        await userService.createUser(formData);
        setAlert({ type: 'success', message: `User ${formData.userId} created successfully.` });
        setUsers((prev) => [
          ...prev,
          { ...formData, active: true, collegeId: activeCollegeId || 'COL-DELHI-001' },
        ]);
      }
      setIsModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditing) {
          setUsers((prev) =>
            prev.map((u) => (u.userId === formData.userId ? { ...u, ...formData } : u))
          );
          setAlert({ type: 'success', message: `[Preview Mode] User ${formData.userId} updated.` });
        } else {
          setUsers((prev) => [
            ...prev,
            { ...formData, active: true, collegeId: activeCollegeId || 'COL-DELHI-001' },
          ]);
          setAlert({ type: 'success', message: `[Preview Mode] User ${formData.userId} created.` });
        }
        setIsModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Operation failed. Please verify user attributes.',
        });
      }
    } finally {
      setModalLoading(false);
    }
  };

  // Toggle Activation
  const handleToggleStatus = async (user) => {
    try {
      if (user.active) {
        await userService.deactivateUser(user.userId);
        setAlert({ type: 'success', message: `User ${user.userId} deactivated.` });
      } else {
        await userService.activateUser(user.userId);
        setAlert({ type: 'success', message: `User ${user.userId} activated.` });
      }
      setUsers((prev) =>
        prev.map((u) => (u.userId === user.userId ? { ...u, active: !u.active } : u))
      );
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setUsers((prev) =>
          prev.map((u) => (u.userId === user.userId ? { ...u, active: !u.active } : u))
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] User ${user.userId} status changed to ${!user.active ? 'Active' : 'Inactive'}.`,
        });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Status change failed.',
        });
      }
    }
  };

  // Delete User
  const handleDeleteUser = async (userId) => {
    if (!window.confirm(`Are you sure you wish to delete user account "${userId}"?`)) return;

    try {
      await userService.deleteUser(userId);
      setAlert({ type: 'success', message: `User ${userId} deleted successfully.` });
      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setUsers((prev) => prev.filter((u) => u.userId !== userId));
        setAlert({ type: 'success', message: `[Preview Mode] User ${userId} removed.` });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Could not delete user.',
        });
      }
    }
  };

  // Filtered List
  const filteredUsers = users.filter((u) => {
    if (filterStatus === 'ACTIVE') return u.active === true;
    if (filterStatus === 'INACTIVE') return u.active === false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">User & Staff Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {activeCollegeName
              ? `Authorized Accounts for ${activeCollegeName}`
              : 'Enterprise Multi-Tenant User Management'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={loadUsers}
            disabled={isLoading}
            className="text-xs"
          >
            Refresh
          </Button>
          {canCreateUser && (
            <Button
              variant="primary"
              icon={UserPlus}
              onClick={handleOpenCreateModal}
              className="text-xs"
            >
              Provision User
            </Button>
          )}
        </div>
      </div>

      {/* Alert Banner */}
      {alert && (
        <div
          className={`p-3 rounded text-xs border flex items-center justify-between ${
            alert.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          <div className="flex items-center gap-2">
            {alert.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{alert.message}</span>
          </div>
          <button
            onClick={() => setAlert(null)}
            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full sm:w-80">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 text-slate-400">
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by User ID or Name..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
          <Button type="submit" variant="secondary" className="text-xs py-1.5 px-3">
            Search
          </Button>
        </form>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded text-xs border border-slate-200">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1 rounded font-semibold transition ${
              filterStatus === 'ALL'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({users.length})
          </button>
          <button
            onClick={() => setFilterStatus('ACTIVE')}
            className={`px-3 py-1 rounded font-semibold transition ${
              filterStatus === 'ACTIVE'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('INACTIVE')}
            className={`px-3 py-1 rounded font-semibold transition ${
              filterStatus === 'INACTIVE'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
        {isLoading ? (
          <Loader message="Fetching user directory..." />
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Users size={36} className="mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold">No user records found</p>
            <p className="text-xs mt-0.5">Try adjusting search criteria or add a new institutional user.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">User ID / Reg No.</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user) => (
                  <tr key={user.userId} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {user.userId}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {user.userName || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {user.email || '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {user.phoneNumber || '—'}
                    </td>
                    <td className="py-3 px-4">
                      {user.active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="warning">Inactive</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {canUpdateUser && (
                          <>
                            <button
                              onClick={() => handleToggleStatus(user)}
                              title={user.active ? 'Deactivate User' : 'Activate User'}
                              className={`p-1.5 rounded text-xs border transition ${
                                user.active
                                  ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border-amber-200'
                                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200'
                              }`}
                            >
                              {user.active ? <XCircle size={14} /> : <CheckCircle size={14} />}
                            </button>
                            <button
                              onClick={() => handleOpenEditModal(user)}
                              title="Edit User"
                              className="p-1.5 rounded text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition"
                            >
                              <Edit2 size={14} />
                            </button>
                          </>
                        )}
                        {canDeleteUser && (
                          <button
                            onClick={() => handleDeleteUser(user.userId)}
                            title="Delete User"
                            className="p-1.5 rounded text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit User: ${formData.userId}` : 'Provision Institutional User'}
        subtitle={
          isEditing
            ? 'Update user information and administrative credentials.'
            : 'Register a new institutional user with Core Service access.'
        }
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <Input
            id="modalUserId"
            label="User ID / Registration No."
            type="text"
            placeholder="e.g. STU202601 or FACULTY01"
            icon={User}
            value={formData.userId}
            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            disabled={isEditing}
            required
          />

          <Input
            id="modalUserName"
            label="Full Name"
            type="text"
            placeholder="e.g. Dr. Jane Doe or John Smith"
            icon={User}
            value={formData.userName}
            onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
            required
          />

          <Input
            id="modalEmail"
            label="Institutional Email Address"
            type="email"
            placeholder="e.g. name@college.edu"
            icon={Mail}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            id="modalPassword"
            label={isEditing ? 'New Password (Leave blank to keep existing)' : 'Initial Password'}
            type="password"
            placeholder="Enter password"
            icon={Lock}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!isEditing}
          />

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={modalLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={modalLoading}
              className="text-xs"
            >
              {isEditing ? 'Save Changes' : 'Create Account'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
