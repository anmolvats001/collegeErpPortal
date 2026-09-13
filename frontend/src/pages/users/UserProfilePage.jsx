import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Loader } from '../../components/common/Loader';
import {
  User,
  Phone,
  Mail,
  Heart,
  KeyRound,
  Edit,
  ShieldCheck,
  Building2,
  CheckCircle,
  AlertCircle,
  Lock,
} from 'lucide-react';

import { IS_PREVIEW_MODE, MOCK_PROFILE } from '../../utils/mockData';

export const UserProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(IS_PREVIEW_MODE ? MOCK_PROFILE : null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Edit Profile Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    userName: IS_PREVIEW_MODE ? MOCK_PROFILE.userName : '',
    phoneNumber: IS_PREVIEW_MODE ? String(MOCK_PROFILE.phoneNumber) : '',
    alternatePhoneNumber: IS_PREVIEW_MODE ? String(MOCK_PROFILE.alternatePhoneNumber) : '',
    bloodGroup: IS_PREVIEW_MODE ? MOCK_PROFILE.bloodGroup : '',
    image: '',
  });

  // Change Password Modal
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await userService.getMyProfile();
      if (data) {
        setProfile(data);
        setEditForm({
          userName: data.userName || '',
          phoneNumber: data.phoneNumber ? String(data.phoneNumber) : '',
          alternatePhoneNumber: data.alternatePhoneNumber ? String(data.alternatePhoneNumber) : '',
          bloodGroup: data.bloodGroup || '',
          image: data.image || '',
        });
      } else if (IS_PREVIEW_MODE) {
        setProfile(MOCK_PROFILE);
      }
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setProfile(MOCK_PROFILE);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to fetch personal profile details.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Handle Edit Profile Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    const payload = {
      userName: editForm.userName,
      phoneNumber: editForm.phoneNumber ? Number(editForm.phoneNumber) : null,
      alternatePhoneNumber: editForm.alternatePhoneNumber ? Number(editForm.alternatePhoneNumber) : null,
      bloodGroup: editForm.bloodGroup,
      image: editForm.image,
    };

    try {
      await userService.updateMyProfile(payload);
      setAlert({ type: 'success', message: 'Profile details updated successfully.' });
      setIsEditModalOpen(false);
      loadProfile();
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setProfile((prev) => ({ ...prev, ...payload }));
        setAlert({ type: 'success', message: '[Preview Mode] Profile details updated successfully.' });
        setIsEditModalOpen(false);
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to update profile.',
        });
      }
    } finally {
      setEditLoading(false);
    }
  };

  // Handle Password Change Submit
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAlert({ type: 'danger', message: 'New password and confirmation do not match.' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAlert({ type: 'danger', message: 'New password must be at least 6 characters long.' });
      return;
    }

    setPasswordLoading(true);
    try {
      await userService.changePassword(
        passwordForm.oldPassword,
        passwordForm.newPassword
      );
      setAlert({ type: 'success', message: 'Password changed successfully.' });
      setIsPasswordModalOpen(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (IS_PREVIEW_MODE) {
        setAlert({ type: 'success', message: '[Preview Mode] Password changed successfully.' });
        setIsPasswordModalOpen(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setAlert({
          type: 'danger',
          message: error.response?.data?.message || 'Failed to change password. Verify old password.',
        });
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 rounded p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-900 font-bold">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {profile?.userName || user?.userId || 'Institutional Profile'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Account ID: <span className="font-mono font-semibold">{user?.userId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            icon={Edit}
            onClick={() => setIsEditModalOpen(true)}
            className="text-xs"
          >
            Edit Profile
          </Button>
          <Button
            variant="outline"
            icon={KeyRound}
            onClick={() => setIsPasswordModalOpen(true)}
            className="text-xs"
          >
            Change Password
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

      {isLoading ? (
        <Loader message="Loading institutional profile..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Institutional Affiliation Card */}
          <div className="bg-white border border-slate-200 rounded shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <Building2 size={16} className="text-blue-800" />
              <span>Institutional Standing</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Primary Role</span>
                <span className="font-bold text-slate-900 mt-0.5 inline-block">
                  <Badge variant="primary">
                    {user?.roles?.[0]?.replace('ROLE_', '') || 'AUTHORIZED USER'}
                  </Badge>
                </span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">Account Status</span>
                <span className="mt-0.5 inline-block">
                  {profile?.active !== false ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="warning">Suspended</Badge>
                  )}
                </span>
              </div>

              {profile?.collegeId && (
                <div>
                  <span className="text-slate-400 block text-[11px]">College Tenant ID</span>
                  <span className="font-mono text-slate-700 mt-0.5 block break-all text-[11px]">
                    {profile.collegeId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact and Bio Details */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded shadow-sm p-5 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-blue-800" />
              <span>Personal & Contact Credentials</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block flex items-center gap-1">
                  <User size={13} className="text-slate-400" />
                  <span>Full Legal Name</span>
                </span>
                <span className="font-semibold text-slate-900 text-sm mt-1 block">
                  {profile?.userName || '—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block flex items-center gap-1">
                  <Mail size={13} className="text-slate-400" />
                  <span>Email Address</span>
                </span>
                <span className="font-semibold text-slate-900 text-sm mt-1 block break-all">
                  {profile?.email || '—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block flex items-center gap-1">
                  <Phone size={13} className="text-slate-400" />
                  <span>Primary Telephone</span>
                </span>
                <span className="font-semibold text-slate-900 text-sm mt-1 block">
                  {profile?.phoneNumber ? `+91 ${profile.phoneNumber}` : '—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block flex items-center gap-1">
                  <Phone size={13} className="text-slate-400" />
                  <span>Alternate Contact</span>
                </span>
                <span className="font-semibold text-slate-900 text-sm mt-1 block">
                  {profile?.alternatePhoneNumber ? `+91 ${profile.alternatePhoneNumber}` : '—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block flex items-center gap-1">
                  <Heart size={13} className="text-slate-400" />
                  <span>Blood Group</span>
                </span>
                <span className="font-semibold text-slate-900 text-sm mt-1 block">
                  {profile?.bloodGroup || '—'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block flex items-center gap-1">
                  <User size={13} className="text-slate-400" />
                  <span>Father's / Guardian Name</span>
                </span>
                <span className="font-semibold text-slate-900 text-sm mt-1 block">
                  {profile?.fatherName || '—'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Personal Information"
        subtitle="Update your contact telephone and medical record details."
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            id="editUserName"
            label="Full Name"
            type="text"
            icon={User}
            value={editForm.userName}
            onChange={(e) => setEditForm({ ...editForm, userName: e.target.value })}
            required
          />

          <Input
            id="editPhone"
            label="Primary Contact Number"
            type="number"
            placeholder="10-digit telephone"
            icon={Phone}
            value={editForm.phoneNumber}
            onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
          />

          <Input
            id="editAltPhone"
            label="Emergency Alternate Telephone"
            type="number"
            placeholder="Alternate phone"
            icon={Phone}
            value={editForm.alternatePhoneNumber}
            onChange={(e) => setEditForm({ ...editForm, alternatePhoneNumber: e.target.value })}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="bloodGroupSelect" className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Blood Group
            </label>
            <select
              id="bloodGroupSelect"
              value={editForm.bloodGroup}
              onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
              className="w-full py-2.5 px-3 text-sm bg-white border border-slate-300 rounded shadow-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsEditModalOpen(false)}
              disabled={editLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={editLoading}
              className="text-xs"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Account Password"
        subtitle="Specify your current password and establish a new access key."
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            id="currentOldPassword"
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            icon={Lock}
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            required
          />

          <Input
            id="newAccountPassword"
            label="New Password"
            type="password"
            placeholder="Enter new password (min 6 characters)"
            icon={Lock}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            required
          />

          <Input
            id="confirmAccountPassword"
            label="Confirm New Password"
            type="password"
            placeholder="Re-enter new password"
            icon={Lock}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            required
          />

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => setIsPasswordModalOpen(false)}
              disabled={passwordLoading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={passwordLoading}
              className="text-xs"
            >
              Commit Password Change
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
