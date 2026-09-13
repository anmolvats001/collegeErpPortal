import React from 'react';
import {
  Hash,
  Users,
  Phone,
  Video,
  Settings,
  Info,
  ShieldCheck,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';

export const ChatHeader = ({
  conversation,
  membersCount = 0,
  onStartCall,
  onOpenMembers,
  onToggleActive,
  canManage = true,
}) => {
  if (!conversation) return null;

  return (
    <div className="h-16 px-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 shadow-sm">
      {/* Left info */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shrink-0">
          <Hash size={20} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-bold text-slate-800 truncate">
              {conversation.className || `Class ${conversation.classId}`}
            </h1>
            <Badge variant={conversation.active !== false ? 'success' : 'danger'}>
              {conversation.active !== false ? 'Active Room' : 'Archived'}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 truncate mt-0.5">
            {conversation.branchName && <span>{conversation.branchName}</span>}
            {conversation.semester && <span>• Semester {conversation.semester}</span>}
            <span>•</span>
            <button
              onClick={onOpenMembers}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 hover:underline"
            >
              <Users size={12} />
              <span>{membersCount || conversation.memberCount || 0} participants</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onStartCall('AUDIO')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          title="Start Audio Conference"
        >
          <Phone size={14} className="text-emerald-600" />
          <span className="hidden sm:inline">Audio Call</span>
        </button>

        <button
          onClick={() => onStartCall('VIDEO')}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          title="Start Video Meeting"
        >
          <Video size={14} />
          <span className="hidden sm:inline">Video Meet</span>
        </button>

        <button
          onClick={onOpenMembers}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition"
          title="View & Manage Members"
        >
          <Users size={18} />
        </button>

        {canManage && onToggleActive && (
          <button
            onClick={() => onToggleActive(conversation)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition"
            title={conversation.active !== false ? 'Archive Channel' : 'Activate Channel'}
          >
            {conversation.active !== false ? (
              <XCircle size={18} className="text-amber-600" />
            ) : (
              <CheckCircle size={18} className="text-emerald-600" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
