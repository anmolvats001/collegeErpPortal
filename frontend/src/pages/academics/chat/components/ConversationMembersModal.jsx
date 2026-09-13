import React, { useState } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { Badge } from '../../../../components/common/Badge';
import {
  Users,
  UserPlus,
  Shield,
  GraduationCap,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
} from 'lucide-react';

export const ConversationMembersModal = ({
  isOpen,
  onClose,
  conversation,
  members = [],
  onAddMember,
  onToggleMemberActive,
  onRemoveMember,
  canManage = true,
}) => {
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL' | 'TEACHER' | 'STUDENT'
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserId, setNewUserId] = useState('');
  const [newMemberType, setNewMemberType] = useState('STUDENT');
  const [isAdding, setIsAdding] = useState(false);

  const filteredMembers = members.filter((m) => {
    const matchesTab = activeTab === 'ALL' || m.memberType === activeTab;
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (m.userName && m.userName.toLowerCase().includes(term)) ||
      (m.userId && m.userId.toLowerCase().includes(term)) ||
      (m.email && m.email.toLowerCase().includes(term));
    return matchesTab && matchesSearch;
  });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!newUserId.trim()) return;
    try {
      setIsAdding(true);
      await onAddMember({
        conversationId: conversation.id,
        userId: newUserId.trim(),
        memberType: newMemberType,
      });
      setNewUserId('');
      setShowAddForm(false);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Channel Members: ${conversation?.className || 'Class Channel'}`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === 'ALL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({members.length})
            </button>
            <button
              onClick={() => setActiveTab('TEACHER')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === 'TEACHER' ? 'bg-white shadow-sm text-purple-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Faculty ({members.filter((m) => m.memberType === 'TEACHER').length})
            </button>
            <button
              onClick={() => setActiveTab('STUDENT')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition ${
                activeTab === 'STUDENT' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Students ({members.filter((m) => m.memberType === 'STUDENT').length})
            </button>
          </div>

          {canManage && (
            <Button
              variant={showAddForm ? 'secondary' : 'primary'}
              onClick={() => setShowAddForm(!showAddForm)}
              icon={UserPlus}
              className="text-xs shrink-0"
            >
              {showAddForm ? 'Cancel' : 'Add Participant'}
            </Button>
          )}
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-3"
          >
            <h4 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <UserPlus size={14} /> Add User to Channel
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  User ID / Roll Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. FAC-102 or STU-2026-045"
                  value={newUserId}
                  onChange={(e) => setNewUserId(e.target.value)}
                  required
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Participant Role <span className="text-red-500">*</span>
                </label>
                <select
                  value={newMemberType}
                  onChange={(e) => setNewMemberType(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Faculty / Teacher</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="submit"
                variant="primary"
                isLoading={isAdding}
                disabled={!newUserId.trim() || isAdding}
                className="text-xs py-1.5"
              >
                Confirm Add
              </Button>
            </div>
          </form>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter members by name, ID or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Members List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg">
          {filteredMembers.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No participants found.
            </div>
          ) : (
            filteredMembers.map((mem) => {
              const isTeacher = mem.memberType === 'TEACHER';
              return (
                <div
                  key={mem.id}
                  className="p-3 flex items-center justify-between hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        isTeacher ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {mem.userName ? mem.userName[0] : mem.userId ? mem.userId[0] : 'U'}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-900">
                          {mem.userName || mem.userId}
                        </span>
                        <Badge variant={isTeacher ? 'purple' : 'primary'}>
                          {isTeacher ? 'Faculty' : 'Student'}
                        </Badge>
                        {mem.active === false && (
                          <span className="text-[10px] text-red-600 bg-red-50 px-1 rounded">
                            Muted / Inactive
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {mem.email || mem.userId}
                      </div>
                    </div>
                  </div>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleMemberActive(mem)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition"
                        title={mem.active !== false ? 'Mute/Deactivate Member' : 'Activate Member'}
                      >
                        {mem.active !== false ? (
                          <CheckCircle size={15} className="text-emerald-600" />
                        ) : (
                          <XCircle size={15} className="text-amber-600" />
                        )}
                      </button>

                      <button
                        onClick={() => onRemoveMember(mem.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                        title="Remove from Channel"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};
