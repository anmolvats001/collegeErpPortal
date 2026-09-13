import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { roleService } from '../../services/roleService';
import { permissionService } from '../../services/permissionService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import {
  Shield,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Users,
  Key,
  UserPlus,
  RefreshCw,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import {
  IS_PREVIEW_MODE,
  MOCK_ROLES,
  MOCK_PERMISSIONS,
  MOCK_ROLE_PERMISSIONS,
} from '../../utils/mockData';

export const RoleManagementPage = () => {
  const { isMainAdmin } = useAuth();

  const [roles, setRoles] = useState(IS_PREVIEW_MODE ? MOCK_ROLES : []);
  const [permissions, setPermissions] = useState(IS_PREVIEW_MODE ? MOCK_PERMISSIONS : []);
  const [rolePermissionsMap, setRolePermissionsMap] = useState(
    IS_PREVIEW_MODE ? MOCK_ROLE_PERMISSIONS : {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ROLES'); // 'ROLES' | 'PERMISSIONS'
  const [alert, setAlert] = useState(null);

  // Create / Edit Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isEditingRole, setIsEditingRole] = useState(false);
  const [roleFormData, setRoleFormData] = useState({ roleId: '', roleName: '', roleDescription: '' });
  const [roleModalLoading, setRoleModalLoading] = useState(false);

  // Permission Configuration Modal State
  const [isPermModalOpen, setIsPermModalOpen] = useState(false);
  const [selectedRoleForPerms, setSelectedRoleForPerms] = useState(null);
  const [selectedPermCodes, setSelectedPermCodes] = useState([]);
  const [permModalLoading, setPermModalLoading] = useState(false);

  // Assign User to Role Modal State
  const [isUserAssignModalOpen, setIsUserAssignModalOpen] = useState(false);
  const [selectedRoleForUser, setSelectedRoleForUser] = useState(null);
  const [assignUserId, setAssignUserId] = useState('');
  const [userAssignLoading, setUserAssignLoading] = useState(false);

  const loadRolesAndPermissions = useCallback(async () => {
    setIsLoading(true);
    try {
      const [rolesData, permsData] = await Promise.allSettled([
        roleService.getAllRoles(),
        permissionService.getAllPermissions(),
      ]);

      if (rolesData.status === 'fulfilled' && Array.isArray(rolesData.value) && rolesData.value.length > 0) {
        setRoles(rolesData.value);
      } else if (IS_PREVIEW_MODE) {
        setRoles(MOCK_ROLES);
      }

      if (permsData.status === 'fulfilled' && permsData.value?.permssions) {
        setPermissions(permsData.value.permssions);
      } else if (IS_PREVIEW_MODE) {
        setPermissions(MOCK_PERMISSIONS);
      }
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setRoles(MOCK_ROLES);
        setPermissions(MOCK_PERMISSIONS);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to fetch roles from service.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRolesAndPermissions();
  }, [loadRolesAndPermissions]);

  // Open Create Role Modal
  const handleOpenCreateRole = () => {
    setIsEditingRole(false);
    setRoleFormData({ roleId: '', roleName: 'ROLE_', roleDescription: '' });
    setIsRoleModalOpen(true);
  };

  // Open Edit Role Modal
  const handleOpenEditRole = (role) => {
    setIsEditingRole(true);
    setRoleFormData({
      roleId: role.roleId,
      roleName: role.roleName,
      roleDescription: role.roleDescription || '',
    });
    setIsRoleModalOpen(true);
  };

  // Submit Role Form
  const handleRoleSubmit = async (e) => {
    e.preventDefault();
    setRoleModalLoading(true);
    try {
      if (isEditingRole) {
        await roleService.updateRole(roleFormData.roleId, {
          roleName: roleFormData.roleName,
          roleDescription: roleFormData.roleDescription,
        });
        setAlert({ type: 'success', message: `Role ${roleFormData.roleName} updated.` });
        setRoles((prev) =>
          prev.map((r) => (r.roleId === roleFormData.roleId ? { ...r, ...roleFormData } : r))
        );
      } else {
        const created = await roleService.createRole({
          roleName: roleFormData.roleName,
          roleDescription: roleFormData.roleDescription,
        });
        setAlert({ type: 'success', message: `Role ${roleFormData.roleName} created.` });
        setRoles((prev) => [
          ...prev,
          created || {
            roleId: `role-${Date.now()}`,
            roleName: roleFormData.roleName,
            roleDescription: roleFormData.roleDescription,
            usersCount: 0,
            permissionCount: 0,
          },
        ]);
      }
      setIsRoleModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        if (isEditingRole) {
          setRoles((prev) =>
            prev.map((r) => (r.roleId === roleFormData.roleId ? { ...r, ...roleFormData } : r))
          );
          setAlert({ type: 'success', message: `[Preview Mode] Role ${roleFormData.roleName} updated.` });
        } else {
          setRoles((prev) => [
            ...prev,
            {
              roleId: `role-${Date.now()}`,
              roleName: roleFormData.roleName,
              roleDescription: roleFormData.roleDescription,
              usersCount: 0,
              permissionCount: 0,
            },
          ]);
          setAlert({ type: 'success', message: `[Preview Mode] Role ${roleFormData.roleName} created.` });
        }
        setIsRoleModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to save role.',
        });
      }
    } finally {
      setRoleModalLoading(false);
    }
  };

  // Delete Role
  const handleDeleteRole = async (role) => {
    if (!window.confirm(`Are you certain you wish to delete role "${role.roleName}"?`)) return;

    try {
      await roleService.deleteRole(role.roleId);
      setAlert({ type: 'success', message: `Role ${role.roleName} deleted.` });
      setRoles((prev) => prev.filter((r) => r.roleId !== role.roleId));
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setRoles((prev) => prev.filter((r) => r.roleId !== role.roleId));
        setAlert({ type: 'success', message: `[Preview Mode] Role ${role.roleName} deleted.` });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to delete role.',
        });
      }
    }
  };

  // Open Permission Matrix Modal
  const handleOpenPermissionsModal = async (role) => {
    setSelectedRoleForPerms(role);
    setIsPermModalOpen(true);
    setPermModalLoading(true);

    try {
      const resp = await permissionService.getPermissionsForRole(role.roleId);
      const permCodes = resp?.permssions ? resp.permssions.map((p) => p.permissionCode) : [];
      setSelectedPermCodes(permCodes);
    } catch (error) {
      // Fallback in preview mode
      const cached = rolePermissionsMap[role.roleId] || [];
      setSelectedPermCodes(cached);
    } finally {
      setPermModalLoading(false);
    }
  };

  // Toggle individual permission checkbox
  const handleTogglePermissionCode = (code) => {
    setSelectedPermCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Save Permission Matrix
  const handleSaveRolePermissions = async () => {
    if (!selectedRoleForPerms) return;
    setPermModalLoading(true);

    try {
      await permissionService.updateRolePermissions(
        selectedRoleForPerms.roleId,
        selectedPermCodes
      );
      setAlert({
        type: 'success',
        message: `Permissions for ${selectedRoleForPerms.roleName} updated successfully.`,
      });
      setRolePermissionsMap((prev) => ({
        ...prev,
        [selectedRoleForPerms.roleId]: selectedPermCodes,
      }));
      setRoles((prev) =>
        prev.map((r) =>
          r.roleId === selectedRoleForPerms.roleId
            ? { ...r, permissionCount: selectedPermCodes.length }
            : r
        )
      );
      setIsPermModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setRolePermissionsMap((prev) => ({
          ...prev,
          [selectedRoleForPerms.roleId]: selectedPermCodes,
        }));
        setRoles((prev) =>
          prev.map((r) =>
            r.roleId === selectedRoleForPerms.roleId
              ? { ...r, permissionCount: selectedPermCodes.length }
              : r
          )
        );
        setAlert({
          type: 'success',
          message: `[Preview Mode] Permissions for ${selectedRoleForPerms.roleName} saved (${selectedPermCodes.length} assigned).`,
        });
        setIsPermModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to update role permissions.',
        });
      }
    } finally {
      setPermModalLoading(false);
    }
  };

  // Open User-Role Assign Modal
  const handleOpenUserAssignModal = (role) => {
    setSelectedRoleForUser(role);
    setAssignUserId('');
    setIsUserAssignModalOpen(true);
  };

  // Submit User Role Assignment
  const handleUserAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignUserId.trim() || !selectedRoleForUser) return;

    setUserAssignLoading(true);
    try {
      await roleService.assignRoleToUser(selectedRoleForUser.roleId, assignUserId.trim());
      setAlert({
        type: 'success',
        message: `Role ${selectedRoleForUser.roleName} successfully assigned to user ${assignUserId}.`,
      });
      setIsUserAssignModalOpen(false);
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setAlert({
          type: 'success',
          message: `[Preview Mode] Role ${selectedRoleForUser.roleName} bound to user ${assignUserId}.`,
        });
        setIsUserAssignModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to assign role to user.',
        });
      }
    } finally {
      setUserAssignLoading(false);
    }
  };

  // Group permissions by category
  const categorizedPermissions = permissions.reduce((acc, perm) => {
    const cat = perm.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(perm);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield size={22} className="text-blue-800" />
            <h1 className="text-xl font-bold text-slate-900">Access Control & Security Roles</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure Role-Based Access Control (RBAC) and fine-grained microservice permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={loadRolesAndPermissions}
            disabled={isLoading}
            className="text-xs"
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={handleOpenCreateRole}
            className="text-xs"
          >
            Define Role
          </Button>
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

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('ROLES')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'ROLES'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ShieldCheck size={16} />
          <span>Institutional Roles ({roles.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('PERMISSIONS')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'PERMISSIONS'
              ? 'border-blue-800 text-blue-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Key size={16} />
          <span>Granular Permission Catalog ({permissions.length})</span>
        </button>
      </div>

      {/* TAB 1: Roles Directory */}
      {activeTab === 'ROLES' && (
        <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden">
          {isLoading ? (
            <Loader message="Loading security roles..." />
          ) : roles.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Shield size={36} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No roles defined</p>
              <p className="text-xs mt-0.5">Click "Define Role" to create your first security role.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Role Identifier</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Permissions</th>
                    <th className="py-3 px-4">Bound Members</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {roles.map((role) => {
                    const permCount =
                      role.permissionCount ??
                      (rolePermissionsMap[role.roleId]?.length || 0);

                    return (
                      <tr key={role.roleId} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {role.roleName}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-sm">
                          {role.roleDescription || 'Standard institutional role'}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={permCount > 0 ? 'primary' : 'neutral'}>
                            {permCount} Privileges
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-600 font-medium">
                            {role.usersCount ?? '—'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenPermissionsModal(role)}
                              className="px-2 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                              title="Configure Permissions"
                            >
                              <SlidersHorizontal size={13} />
                              <span>Privileges</span>
                            </button>
                            <button
                              onClick={() => handleOpenUserAssignModal(role)}
                              className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 flex items-center gap-1"
                              title="Assign Role to User"
                            >
                              <UserPlus size={13} />
                              <span>Assign</span>
                            </button>
                            <button
                              onClick={() => handleOpenEditRole(role)}
                              className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-200"
                              title="Edit Role Description"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteRole(role)}
                              className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50"
                              title="Delete Role"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Granular Permissions Catalog */}
      {activeTab === 'PERMISSIONS' && (
        <div className="space-y-5">
          {Object.entries(categorizedPermissions).map(([category, perms]) => (
            <div key={category} className="bg-white border border-slate-200 rounded shadow-sm p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2 mb-3 flex items-center justify-between">
                <span>{category} Domain</span>
                <Badge variant="neutral">{perms.length} Permissions</Badge>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {perms.map((p) => (
                  <div
                    key={p.permissionCode}
                    className="p-3 bg-slate-50 border border-slate-200 rounded hover:border-slate-300 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-blue-900">
                        {p.permissionCode}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-800">{p.permissionName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{p.permissionDescription}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL 1: Create / Edit Role */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title={isEditingRole ? `Edit Role: ${roleFormData.roleName}` : 'Define New Institutional Role'}
        subtitle="Establish access roles for grouping security permissions."
      >
        <form onSubmit={handleRoleSubmit} className="space-y-4">
          <Input
            id="roleNameInput"
            label="Role Code (Convention: ROLE_NAME)"
            type="text"
            placeholder="e.g. ROLE_DEAN or ROLE_HOD"
            icon={Shield}
            value={roleFormData.roleName}
            onChange={(e) => setRoleFormData({ ...roleFormData, roleName: e.target.value })}
            disabled={isEditingRole}
            required
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="roleDesc" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Role Responsibility & Description
            </label>
            <textarea
              id="roleDesc"
              rows={3}
              placeholder="Outline the operational responsibilities associated with this role..."
              value={roleFormData.roleDescription}
              onChange={(e) => setRoleFormData({ ...roleFormData, roleDescription: e.target.value })}
              className="w-full p-2.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-800"
              required
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsRoleModalOpen(false)}
              disabled={roleModalLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={roleModalLoading}
              className="text-xs"
            >
              {isEditingRole ? 'Commit Updates' : 'Create Role'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: Configure Permissions Matrix */}
      <Modal
        isOpen={isPermModalOpen}
        onClose={() => setIsPermModalOpen(false)}
        maxWidth="max-w-2xl"
        title={`Privilege Matrix: ${selectedRoleForPerms?.roleName || ''}`}
        subtitle={`Select granular operational capabilities to bind to this role. (${selectedPermCodes.length} currently assigned)`}
      >
        <div className="space-y-5">
          {permModalLoading ? (
            <Loader message="Loading assigned permissions..." />
          ) : (
            <>
              {Object.entries(categorizedPermissions).map(([category, perms]) => (
                <div key={category} className="border border-slate-200 rounded p-3.5 bg-slate-50">
                  <div className="flex items-center justify-between mb-2.5 pb-1.5 border-b border-slate-200">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {category}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const catCodes = perms.map((p) => p.permissionCode);
                        const allSelected = catCodes.every((c) => selectedPermCodes.includes(c));
                        if (allSelected) {
                          setSelectedPermCodes((prev) => prev.filter((c) => !catCodes.includes(c)));
                        } else {
                          setSelectedPermCodes((prev) => Array.from(new Set([...prev, ...catCodes])));
                        }
                      }}
                      className="text-[11px] text-blue-800 hover:underline font-semibold"
                    >
                      Toggle Category
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {perms.map((p) => {
                      const isChecked = selectedPermCodes.includes(p.permissionCode);
                      return (
                        <label
                          key={p.permissionCode}
                          className={`flex items-start gap-2 p-2 rounded border text-xs cursor-pointer transition select-none ${
                            isChecked
                              ? 'bg-blue-50 border-blue-300 text-blue-950 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleTogglePermissionCode(p.permissionCode)}
                            className="mt-0.5 rounded text-blue-800 focus:ring-blue-800"
                          />
                          <div>
                            <span className="block font-mono text-[11px]">{p.permissionCode}</span>
                            <span className="text-[10px] text-slate-500 font-normal">
                              {p.permissionDescription}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Selected <strong>{selectedPermCodes.length}</strong> of {permissions.length} total permissions
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsPermModalOpen(false)}
                    disabled={permModalLoading}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSaveRolePermissions}
                    isLoading={permModalLoading}
                    className="text-xs"
                  >
                    Save Permission Matrix
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* MODAL 3: Assign User to Role */}
      <Modal
        isOpen={isUserAssignModalOpen}
        onClose={() => setIsUserAssignModalOpen(false)}
        title={`Assign Role: ${selectedRoleForUser?.roleName || ''}`}
        subtitle="Associate an institutional User ID or Registration Number with this role."
      >
        <form onSubmit={handleUserAssignSubmit} className="space-y-4">
          <Input
            id="assignUserIdInput"
            label="User ID / Registration No."
            type="text"
            placeholder="e.g. ADM-001 or FAC-102"
            icon={Users}
            value={assignUserId}
            onChange={(e) => setAssignUserId(e.target.value)}
            required
          />

          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900">
            <p>
              Assigning <strong>{selectedRoleForUser?.roleName}</strong> will immediately grant all associated privileges to this institutional account upon next token refresh.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsUserAssignModalOpen(false)}
              disabled={userAssignLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={userAssignLoading}
              className="text-xs"
            >
              Confirm Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
