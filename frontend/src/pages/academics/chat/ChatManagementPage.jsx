import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../hooks/useTenant';
import { chatService } from '../../../services/chatService';
import { callService } from '../../../services/callService';
import { fileUploadService } from '../../../services/fileUploadService';
import { classSectionService } from '../../../services/classSectionService';
import { ConversationSidebar } from './components/ConversationSidebar';
import { ChatHeader } from './components/ChatHeader';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { CreateConversationModal } from './components/CreateConversationModal';
import { ConversationMembersModal } from './components/ConversationMembersModal';
import { CallModal } from './components/CallModal';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { MessagesSquare, Loader2 } from 'lucide-react';

export const ChatManagementPage = () => {
  const { user, isMainAdmin, isCollegeAdmin, isTeacher, isStudent } = useAuth();
  const { currentCollege } = useTenant();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [classes, setClasses] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [banner, setBanner] = useState({ show: false, message: '', type: 'info' });

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [activeCall, setActiveCall] = useState(null);

  const canManage = isMainAdmin || isCollegeAdmin || isTeacher;

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, [currentCollege?.id]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [convList, clsList] = await Promise.all([
        chatService.getConversationsOfCollege(),
        classSectionService.getAllClasses().catch(() => []),
      ]);

      const convs = Array.isArray(convList) ? convList : [];
      setConversations(convs);
      setClasses(Array.isArray(clsList) ? clsList : []);

      if (convs.length > 0 && !activeConversation) {
        selectConversation(convs[0]);
      }
    } catch (err) {
      setBanner({
        show: true,
        message: 'Could not load conversations. Using offline preview mode.',
        type: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Select conversation & load messages & members
  const selectConversation = async (conv) => {
    setActiveConversation(conv);
    setIsMessagesLoading(true);
    try {
      const [msgRes, memRes] = await Promise.all([
        chatService.getMessages(conv.id),
        chatService.getConversationMembers(conv.id),
      ]);

      const msgList = msgRes?.content || (Array.isArray(msgRes) ? msgRes : []);
      setMessages(msgList);
      setMembers(Array.isArray(memRes) ? memRes : []);
    } catch (err) {
      console.error('Failed to load chat details', err);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  // Send message
  const handleSendMessage = async ({ messageType, message }) => {
    if (!activeConversation) return;
    try {
      const newMsg = await chatService.sendMessage({
        conversationId: activeConversation.id,
        messageType,
        message,
      });

      setMessages((prev) => [...prev, newMsg]);

      // Update last message in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConversation.id
            ? {
                ...c,
                lastMessage: message,
                lastMessageTime: 'Just now',
              }
            : c
        )
      );
    } catch (err) {
      setBanner({
        show: true,
        message: 'Failed to send message.',
        type: 'error',
      });
    }
  };

  // Upload file or image to Cloudinary and post message
  const handleUploadFile = async (file, isImage, onProgress) => {
    if (!activeConversation) return;
    try {
      const uploadRes = await fileUploadService.uploadFile(
        file,
        {
          folder: 'chat/class-conversations',
          entityType: 'CHAT_MESSAGE',
          entityId: activeConversation.id,
          ownerId: user?.userId || 'ADMIN-2026',
        },
        onProgress
      );

      let payloadMessage = '';
      let messageType = 'FILE';

      if (isImage) {
        messageType = 'IMAGE';
        payloadMessage = uploadRes.secureUrl;
      } else {
        messageType = 'FILE';
        payloadMessage = JSON.stringify({
          secureUrl: uploadRes.secureUrl,
          originalFileName: uploadRes.originalFileName || file.name,
          size: uploadRes.size || file.size,
          fileId: uploadRes.fileId,
        });
      }

      await handleSendMessage({
        messageType,
        message: payloadMessage,
      });

      setBanner({
        show: true,
        message: `${isImage ? 'Image' : 'Document'} "${file.name}" uploaded successfully!`,
        type: 'success',
      });
    } catch (err) {
      console.error('File upload failed', err);
      setBanner({
        show: true,
        message: `Failed to upload file "${file.name}".`,
        type: 'error',
      });
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      await chatService.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (err) {
      setBanner({
        show: true,
        message: 'Failed to delete message.',
        type: 'error',
      });
    }
  };

  // Create conversation
  const handleCreateConversation = async (classId) => {
    const newConv = await chatService.createConversation(classId);
    const matchedClass = classes.find((c) => c.id === classId);
    const enriched = {
      ...newConv,
      className: matchedClass?.className || `Class Cohort ${classId}`,
      branchName: matchedClass?.branchName || 'Department Cohort',
      semester: matchedClass?.semester || 1,
      memberCount: 1,
    };
    setConversations((prev) => [enriched, ...prev]);
    selectConversation(enriched);
    setBanner({
      show: true,
      message: `Chat channel for ${enriched.className} launched!`,
      type: 'success',
    });
  };

  // Toggle active status
  const handleToggleActive = async (conv) => {
    const nextState = conv.active === false ? true : false;
    await chatService.toggleActiveStatus(conv.id, nextState);
    const updated = { ...conv, active: nextState };
    setConversations((prev) => prev.map((c) => (c.id === conv.id ? updated : c)));
    if (activeConversation?.id === conv.id) {
      setActiveConversation(updated);
    }
    setBanner({
      show: true,
      message: `Channel ${nextState ? 'activated' : 'archived'}.`,
      type: 'info',
    });
  };

  // Start Audio/Video Call
  const handleStartCall = async (callType) => {
    try {
      const call = await callService.createCall(callType);
      const callWithTopic = {
        ...call,
        topic: `${activeConversation?.className || 'Class'} Conference`,
      };
      setActiveCall(callWithTopic);

      // Post system message into chat
      await handleSendMessage({
        messageType: 'TEXT',
        message: `📢 Started a live ${callType.toLowerCase()} meeting room! Join with code: ${
          call.joinCode
        } or click the call header.`,
      });
    } catch (err) {
      setBanner({
        show: true,
        message: 'Could not initialize call.',
        type: 'error',
      });
    }
  };

  // End Call
  const handleEndCall = async (callId) => {
    await callService.endCall(callId);
    setActiveCall(null);
  };

  // Members Management
  const handleAddMember = async ({ conversationId, userId, memberType }) => {
    const newMember = await chatService.addMember({ conversationId, userId, memberType });
    setMembers((prev) => [...prev, newMember]);
    setBanner({
      show: true,
      message: `Added ${userId} (${memberType}) to channel.`,
      type: 'success',
    });
  };

  const handleToggleMemberActive = async (mem) => {
    const nextState = mem.active === false ? true : false;
    await chatService.updateMemberActiveStatus(mem.id, nextState);
    setMembers((prev) =>
      prev.map((m) => (m.id === mem.id ? { ...m, active: nextState } : m))
    );
  };

  const handleRemoveMember = async (memberId) => {
    await chatService.removeMember(memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    setBanner({
      show: true,
      message: 'Participant removed from channel.',
      type: 'info',
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {banner.show && (
        <AlertBanner
          message={banner.message}
          type={banner.type}
          onClose={() => setBanner({ show: false, message: '', type: 'info' })}
        />
      )}

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={32} className="animate-spin text-blue-600 mb-2" />
          <p className="text-xs">Loading Class Channels...</p>
        </div>
      ) : (
        <div className="flex flex-1 h-full overflow-hidden">
          {/* Channels Sidebar */}
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversation?.id}
            onSelectConversation={selectConversation}
            onOpenCreateModal={() => setIsCreateModalOpen(true)}
            canCreate={canManage}
          />

          {/* Active Chat Stage */}
          <div className="flex-1 flex flex-col h-full bg-slate-50/20 overflow-hidden">
            {activeConversation ? (
              <>
                <ChatHeader
                  conversation={activeConversation}
                  membersCount={members.length}
                  onStartCall={handleStartCall}
                  onOpenMembers={() => setIsMembersModalOpen(true)}
                  onToggleActive={handleToggleActive}
                  canManage={canManage}
                />

                {isMessagesLoading ? (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    <Loader2 size={24} className="animate-spin text-blue-600 mr-2" />
                    <span className="text-xs">Loading message stream...</span>
                  </div>
                ) : (
                  <MessageList
                    messages={messages}
                    currentUserId={user?.userId || 'ADMIN-2026'}
                    onDeleteMessage={handleDeleteMessage}
                    canDelete={canManage}
                  />
                )}

                <MessageInput
                  onSendMessage={handleSendMessage}
                  onUploadFile={handleUploadFile}
                  disabled={activeConversation.active === false}
                  disabledReason="This channel is archived."
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessagesSquare size={48} className="text-slate-300 mb-3" />
                <h3 className="text-sm font-bold text-slate-700">Select a Class Channel</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Choose a cohort from the left panel to join the discussion, view lecture materials,
                  or start an online meeting room.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateConversationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateConversation}
        classes={classes}
        existingClassIds={conversations.map((c) => c.classId)}
      />

      <ConversationMembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        conversation={activeConversation}
        members={members}
        onAddMember={handleAddMember}
        onToggleMemberActive={handleToggleMemberActive}
        onRemoveMember={handleRemoveMember}
        canManage={canManage}
      />

      <CallModal
        isOpen={!!activeCall}
        onClose={() => setActiveCall(null)}
        call={activeCall}
        onEndCall={handleEndCall}
      />
    </div>
  );
};
