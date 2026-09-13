import React, { useEffect, useRef } from 'react';
import { MessageSquareDashed } from 'lucide-react';
import { MessageItem } from './MessageItem';

export const MessageList = ({
  messages = [],
  currentUserId,
  onDeleteMessage,
  canDelete = false,
  className = '',
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-slate-50/30">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
          <MessageSquareDashed size={24} />
        </div>
        <h3 className="text-sm font-bold text-slate-700">No Messages Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Start the discussion for this class cohort! Share syllabus updates, homework guidelines,
          or query clarifications.
        </p>
      </div>
    );
  }

  // Group messages by date
  let lastDateStr = null;

  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-3 bg-white ${className}`}>
      {messages.map((msg) => {
        const msgDate = msg.createdAt ? new Date(msg.createdAt).toLocaleDateString() : 'Today';
        const showDateSeparator = msgDate !== lastDateStr;
        lastDateStr = msgDate;

        return (
          <React.Fragment key={msg.id}>
            {showDateSeparator && (
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-slate-200"></div>
                <span className="px-3 py-0.5 text-[10px] font-bold text-slate-500 bg-slate-100 rounded-full mx-2 uppercase tracking-wide">
                  {msgDate}
                </span>
                <div className="flex-1 border-t border-slate-200"></div>
              </div>
            )}
            <MessageItem
              message={msg}
              currentUserId={currentUserId}
              onDeleteMessage={onDeleteMessage}
              canDelete={canDelete}
            />
          </React.Fragment>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
