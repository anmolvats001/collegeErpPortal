import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useTenant } from '../../../hooks/useTenant';
import { noticeService } from '../../../services/noticeService';
import { NoticeCard } from './components/NoticeCard';
import { NoticeDetailModal } from './components/NoticeDetailModal';
import { CreateNoticeModal } from './components/CreateNoticeModal';
import { AlertBanner } from '../../../components/common/AlertBanner';
import { Button } from '../../../components/common/Button';
import { Bell, Plus, Search, Filter, Loader2 } from 'lucide-react';

export const NoticeManagementPage = () => {
  const { isMainAdmin, isCollegeAdmin, isTeacher, hasPermission } = useAuth();
  const { currentCollege } = useTenant();

  const [notices, setNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ACTIVE'); // 'ACTIVE' | 'CURRENT' | 'ALL'
  const [searchTerm, setSearchTerm] = useState('');
  const [banner, setBanner] = useState({ show: false, message: '', type: 'info' });

  // Modals
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const canManage = isMainAdmin || isCollegeAdmin || isTeacher || hasPermission('POST_NOTICE');

  useEffect(() => {
    loadNotices();
  }, [currentCollege?.id]);

  const loadNotices = async () => {
    setIsLoading(true);
    try {
      const list = await noticeService.getAllNotices();
      setNotices(Array.isArray(list) ? list : []);
    } catch (err) {
      setBanner({
        show: true,
        message: 'Could not load notices from server. Loaded offline preview circulars.',
        type: 'warning',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create or update notice
  const handleSaveNotice = async (noticeData) => {
    if (editingNotice) {
      const updated = await noticeService.updateNotice(editingNotice.noticeId, noticeData);
      setNotices((prev) =>
        prev.map((n) => (n.noticeId === editingNotice.noticeId ? { ...n, ...updated } : n))
      );
      setBanner({ show: true, message: 'Circular updated successfully!', type: 'success' });
    } else {
      const created = await noticeService.createNotice(noticeData);
      setNotices((prev) => [created, ...prev]);
      setBanner({ show: true, message: 'Notice broadcasted to campus!', type: 'success' });
    }
    setEditingNotice(null);
  };

  // Deactivate
  const handleDeactivate = async (noticeId) => {
    await noticeService.deactivateNotice(noticeId);
    setNotices((prev) =>
      prev.map((n) => (n.noticeId === noticeId ? { ...n, active: false } : n))
    );
    setBanner({ show: true, message: 'Notice marked as deactivated/archived.', type: 'info' });
  };

  // Delete
  const handleDelete = async (noticeId) => {
    if (!window.confirm('Are you sure you want to delete this notice circular?')) return;
    await noticeService.deleteNotice(noticeId);
    setNotices((prev) => prev.filter((n) => n.noticeId !== noticeId));
    setBanner({ show: true, message: 'Notice deleted.', type: 'info' });
  };

  // Filtered notices
  const filteredNotices = notices.filter((n) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (n.title && n.title.toLowerCase().includes(term)) ||
      (n.description && n.description.toLowerCase().includes(term)) ||
      (n.author && n.author.toLowerCase().includes(term));

    const isExpired = n.expiryDate && new Date(n.expiryDate) < new Date();
    const isActive = n.active !== false && !isExpired;

    if (activeFilter === 'ACTIVE') return matchesSearch && isActive;
    if (activeFilter === 'CURRENT') return matchesSearch && !isExpired;
    return matchesSearch;
  });

  return (
    <div className="space-y-4">
      {banner.show && (
        <AlertBanner
          message={banner.message}
          type={banner.type}
          onClose={() => setBanner({ show: false, message: '', type: 'info' })}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="text-blue-600" size={24} />
            <h1 className="text-lg font-bold text-slate-900">Academic Notices & Circulars</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional announcements, examination schedules, fee deadlines, and departmental updates.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            onClick={() => {
              setEditingNotice(null);
              setIsCreateModalOpen(true);
            }}
            icon={Plus}
            className="text-xs"
          >
            Broadcast Notice
          </Button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveFilter('ACTIVE')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeFilter === 'ACTIVE'
                ? 'bg-white shadow-sm text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Circulars
          </button>
          <button
            onClick={() => setActiveFilter('CURRENT')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeFilter === 'CURRENT'
                ? 'bg-white shadow-sm text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Current Bulletin
          </button>
          <button
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
              activeFilter === 'ALL'
                ? 'bg-white shadow-sm text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Notices ({notices.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search circulars by keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none w-full sm:w-64"
          />
        </div>
      </div>

      {/* Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-xs">Loading circulars...</p>
        </div>
      ) : filteredNotices.length === 0 ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <Bell size={36} className="mx-auto mb-2 text-slate-300" />
          <h4 className="text-sm font-bold text-slate-700">No Circulars Found</h4>
          <p className="text-xs text-slate-500 mt-1">
            There are no notices matching your current search or filter criteria.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotices.map((notice) => (
            <NoticeCard
              key={notice.noticeId}
              notice={notice}
              onViewNotice={(n) => {
                setSelectedNotice(n);
                setIsDetailModalOpen(true);
              }}
              onEditNotice={(n) => {
                setEditingNotice(n);
                setIsCreateModalOpen(true);
              }}
              onDeactivateNotice={handleDeactivate}
              onDeleteNotice={handleDelete}
              canManage={canManage}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <NoticeDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedNotice(null);
        }}
        notice={selectedNotice}
      />

      <CreateNoticeModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setEditingNotice(null);
        }}
        onSubmit={handleSaveNotice}
        initialData={editingNotice}
      />
    </div>
  );
};
