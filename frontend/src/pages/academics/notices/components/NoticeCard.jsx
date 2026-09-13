import React from 'react';
import { Calendar, Clock, Edit2, Trash2, Eye, Bell, XCircle, CheckCircle, UserCheck } from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';

export const NoticeCard = ({
  notice,
  onViewNotice,
  onEditNotice,
  onDeactivateNotice,
  onDeleteNotice,
  canManage = true,
}) => {
  const isExpired = notice.expiryDate && new Date(notice.expiryDate) < new Date();
  const isActive = notice.active !== false && !isExpired;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Bell size={16} />
            </span>
            <Badge variant={isActive ? 'success' : isExpired ? 'secondary' : 'danger'}>
              {isActive ? 'Active Notice' : isExpired ? 'Expired' : 'Deactivated'}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewNotice(notice)}
              className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded transition"
              title="Read Full Notice"
            >
              <Eye size={15} />
            </button>
            {canManage && (
              <>
                <button
                  onClick={() => onEditNotice(notice)}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded transition"
                  title="Edit Notice"
                >
                  <Edit2 size={15} />
                </button>
                {isActive && (
                  <button
                    onClick={() => onDeactivateNotice(notice.noticeId)}
                    className="p-1 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded transition"
                    title="Deactivate Notice"
                  >
                    <XCircle size={15} />
                  </button>
                )}
                <button
                  onClick={() => onDeleteNotice(notice.noticeId)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                  title="Delete Notice"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Title & Excerpt */}
        <h3
          onClick={() => onViewNotice(notice)}
          className="text-sm font-bold text-slate-900 mt-2.5 hover:text-blue-600 transition cursor-pointer line-clamp-2"
        >
          {notice.title}
        </h3>

        <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
          {notice.description}
        </p>
      </div>

      {/* Card Footer Info */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-1 text-slate-500 font-medium">
          <Calendar size={12} className="text-slate-400" />
          <span>
            {notice.publishDate ? new Date(notice.publishDate).toLocaleDateString() : 'Immediate'}
          </span>
          {notice.expiryDate && (
            <span className="text-slate-400">
              • Exp: {new Date(notice.expiryDate).toLocaleDateString()}
            </span>
          )}
        </div>

        {notice.author && (
          <span className="text-slate-500 font-medium truncate max-w-[140px]">
            By: {notice.author}
          </span>
        )}
      </div>
    </div>
  );
};
