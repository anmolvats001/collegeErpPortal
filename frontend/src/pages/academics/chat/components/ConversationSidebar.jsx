import React, { useState } from 'react';
import { Search, Plus, Hash, CheckCircle, Clock } from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';

export const ConversationSidebar = ({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onOpenCreateModal,
  canCreate = true,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = conversations.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.className && c.className.toLowerCase().includes(term)) ||
      (c.branchName && c.branchName.toLowerCase().includes(term)) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(term))
    );
  });

  return (
    <div className="w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col h-full shrink-0">
      {/* Search and New Channel Header */}
      <div className="p-3 border-b border-slate-200 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Hash className="text-blue-600" size={18} />
            <h2 className="text-sm font-bold text-slate-800">Class Channels</h2>
          </div>
          {canCreate && (
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded shadow-sm transition"
              title="Create New Channel"
            >
              <Plus size={14} />
              <span>New</span>
            </button>
          )}
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search channels or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Conversations Channel List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400">
            No class channels found matching your search.
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = conv.id === activeConversationId;
            return (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv)}
                className={`w-full text-left p-3 flex flex-col gap-1 transition ${
                  isSelected
                    ? 'bg-blue-50 border-l-4 border-blue-600 text-slate-900'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 font-semibold text-xs truncate max-w-[180px]">
                    <span className="text-slate-400 font-normal">#</span>
                    <span className="truncate">{conv.className || `Class ${conv.classId}`}</span>
                  </div>
                  {conv.lastMessageTime && (
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {conv.lastMessageTime}
                    </span>
                  )}
                </div>

                {conv.branchName && (
                  <div className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                    <span>{conv.branchName}</span>
                    {conv.semester && (
                      <span className="text-slate-400">• Sem {conv.semester}</span>
                    )}
                  </div>
                )}

                {conv.lastMessage && (
                  <p className="text-[11px] text-slate-500 truncate w-full mt-0.5 line-clamp-1">
                    {conv.lastMessage}
                  </p>
                )}

                <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {conv.memberCount ? `${conv.memberCount} members` : 'Active'}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
