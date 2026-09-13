import React, { useState } from 'react';
import { FileText, Download, Trash2, Shield, GraduationCap, ExternalLink, Eye, X } from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';

export const MessageItem = ({
  message,
  currentUserId,
  onDeleteMessage,
  canDelete = false,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isMine = message.userId === currentUserId;
  const isTeacher =
    message.userRole === 'TEACHER' ||
    message.userRole === 'ROLE_TEACHER' ||
    message.userName?.includes('Prof.') ||
    message.userName?.includes('Dr.');

  // Extract initials
  const initials = (message.userName || message.userId || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Format time
  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  // Parse file metadata if payload is JSON
  let fileInfo = null;
  if (message.messageType === 'FILE') {
    try {
      fileInfo = JSON.parse(message.message);
    } catch {
      fileInfo = {
        secureUrl: message.message,
        originalFileName: message.message,
      };
    }
  }

  // Parse image URL if payload is JSON
  let imageUrl = message.message;
  if (message.messageType === 'IMAGE') {
    try {
      const parsed = JSON.parse(message.message);
      imageUrl = parsed.secureUrl || parsed.url || message.message;
    } catch {
      imageUrl = message.message;
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={`group flex items-start gap-3 p-2.5 rounded-lg transition hover:bg-slate-50 ${
        isMine ? 'bg-blue-50/40' : ''
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-sm ${
          isTeacher
            ? 'bg-purple-600 text-white'
            : isMine
            ? 'bg-blue-600 text-white'
            : 'bg-slate-200 text-slate-700'
        }`}
      >
        {initials}
      </div>

      {/* Message Content Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-slate-900 truncate">
            {message.userName || message.userId}
          </span>

          {isTeacher && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded">
              <Shield size={10} /> Faculty
            </span>
          )}

          {!isTeacher && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded">
              <GraduationCap size={10} /> Student
            </span>
          )}

          <span className="text-[10px] text-slate-400 ml-auto shrink-0">{formattedTime}</span>

          {(canDelete || isMine) && onDeleteMessage && (
            <button
              onClick={() => onDeleteMessage(message.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-600 transition p-1"
              title="Delete Message"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>

        {/* Payload */}
        <div className="mt-1 text-xs text-slate-800 break-words leading-relaxed">
          {message.messageType === 'FILE' && fileInfo ? (
            <div className="inline-flex items-center gap-3 px-3 py-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-blue-400 transition mt-1 max-w-md">
              <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>

              <div className="min-w-0 text-left flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate max-w-[260px]">
                  {fileInfo.originalFileName || fileInfo.name || 'Attached Document'}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>Class Document</span>
                  {fileInfo.size && <span>• {formatFileSize(fileInfo.size)}</span>}
                </div>
              </div>

              {fileInfo.secureUrl && (
                <a
                  href={fileInfo.secureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition"
                  title="Open / Download File"
                >
                  <Download size={16} />
                </a>
              )}
            </div>
          ) : message.messageType === 'IMAGE' ? (
            <div className="mt-1.5">
              <div
                onClick={() => setIsPreviewOpen(true)}
                className="relative inline-block max-w-sm rounded-lg overflow-hidden border border-slate-200 shadow-sm cursor-pointer group/img"
              >
                <img
                  src={imageUrl}
                  alt="Shared attachment"
                  className="w-full h-auto object-cover max-h-64 transition group-hover/img:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition gap-1.5 text-xs font-medium">
                  <Eye size={16} />
                  <span>Click to view</span>
                </div>
              </div>

              {/* Lightbox Preview Modal */}
              {isPreviewOpen && (
                <div
                  onClick={() => setIsPreviewOpen(false)}
                  className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-xl overflow-hidden shadow-2xl p-2"
                  >
                    <button
                      onClick={() => setIsPreviewOpen(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition"
                      title="Close Preview"
                    >
                      <X size={18} />
                    </button>
                    <img
                      src={imageUrl}
                      alt="Full Preview"
                      className="max-h-[80vh] w-auto mx-auto object-contain rounded-lg"
                    />
                    <div className="p-2 text-center">
                      <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                      >
                        <ExternalLink size={12} /> Open original image in new tab
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{message.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
