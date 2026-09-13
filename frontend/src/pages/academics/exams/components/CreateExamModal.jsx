import React, { useState, useEffect } from 'react';
import { Modal } from '../../../../components/common/Modal';
import { Button } from '../../../../components/common/Button';
import { Award, AlertCircle, School, BookOpen, User } from 'lucide-react';

export const CreateExamModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  classes = [],
  classSubjects = [],
  teacherSubjects = [],
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState('');
  const [formData, setFormData] = useState({
    examName: '',
    examType: 'MIDTERM',
    classSubjectId: '',
    teacherSubjectId: '',
    examDate: '',
    startTime: '10:00',
    endTime: '12:00',
    maxMarks: 100,
    passingMarks: 40,
    status: 'SCHEDULED',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Filter class subjects if user selects a specific class
  const filteredClassSubjects = selectedClassFilter
    ? classSubjects.filter(
        (cs) => (cs.classId || cs.classSectionId) === selectedClassFilter
      )
    : classSubjects;

  useEffect(() => {
    if (initialData) {
      setFormData({
        examName: initialData.examName || '',
        examType: initialData.examType || 'MIDTERM',
        classSubjectId: initialData.classSubjectId || '',
        teacherSubjectId: initialData.teacherSubjectId || '',
        examDate: initialData.examDate || '',
        startTime: initialData.startTime?.substring(0, 5) || '10:00',
        endTime: initialData.endTime?.substring(0, 5) || '12:00',
        maxMarks: initialData.maxMarks || 100,
        passingMarks: initialData.passingMarks || 40,
        status: initialData.status || 'SCHEDULED',
      });
      const matchedCS = classSubjects.find(
        (cs) => (cs.id || cs.classSubjectId) === initialData.classSubjectId
      );
      if (matchedCS) {
        setSelectedClassFilter(matchedCS.classId || matchedCS.classSectionId || '');
      }
    } else {
      const defaultCS = classSubjects[0];
      const defaultTS = teacherSubjects[0];
      setFormData({
        examName: '',
        examType: 'MIDTERM',
        classSubjectId: defaultCS ? (defaultCS.id || defaultCS.classSubjectId) : '',
        teacherSubjectId: defaultTS ? (defaultTS.id || defaultTS.teacherSubjectId) : '',
        examDate: new Date().toISOString().split('T')[0],
        startTime: '10:00',
        endTime: '12:00',
        maxMarks: 100,
        passingMarks: 40,
        status: 'SCHEDULED',
      });
      setSelectedClassFilter('');
    }
    setError('');
  }, [initialData, isOpen, classSubjects, teacherSubjects]);

  const handleClassFilterChange = (classId) => {
    setSelectedClassFilter(classId);
    const available = classId
      ? classSubjects.filter((cs) => (cs.classId || cs.classSectionId) === classId)
      : classSubjects;
    if (available.length > 0) {
      setFormData((prev) => ({
        ...prev,
        classSubjectId: available[0].id || available[0].classSubjectId,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.examName.trim()) {
      setError('Please provide an examination name.');
      return;
    }
    if (!formData.classSubjectId) {
      setError('Please select a class and curriculum subject.');
      return;
    }
    if (!formData.teacherSubjectId) {
      setError('Please assign a supervising faculty member.');
      return;
    }
    if (Number(formData.passingMarks) > Number(formData.maxMarks)) {
      setError('Passing marks cannot exceed maximum marks.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      await onSubmit({
        ...formData,
        maxMarks: Number(formData.maxMarks),
        passingMarks: Number(formData.passingMarks),
        startTime: formData.startTime.length === 5 ? `${formData.startTime}:00` : formData.startTime,
        endTime: formData.endTime.length === 5 ? `${formData.endTime}:00` : formData.endTime,
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save examination schedule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Examination Schedule' : 'Schedule New Examination'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Exam Name / Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Data Structures Mid-Term Exam"
            value={formData.examName}
            onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Examination Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.examType}
              onChange={(e) => setFormData({ ...formData, examType: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="MIDTERM">Mid-Term Exam</option>
              <option value="ENDTERM">End-Term Exam</option>
              <option value="QUIZ">Quiz / Class Test</option>
              <option value="PRACTICAL">Lab / Practical</option>
              <option value="INTERNAL">Internal Assessment</option>
              <option value="VIVA">Viva Voce</option>
              <option value="OTHER">Other Evaluation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Status <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="SCHEDULED">Scheduled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Class Selection & Filtering */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <School size={14} className="text-blue-600" />
            <span>Class Cohort & Subject Allocation</span>
          </div>

          {classes.length > 0 && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Filter by Class Section
              </label>
              <select
                value={selectedClassFilter}
                onChange={(e) => handleClassFilterChange(e.target.value)}
                className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">-- All Class Cohorts ({classSubjects.length} subjects) --</option>
                {classes.map((cls) => (
                  <option key={cls.classId || cls.id} value={cls.classId || cls.id}>
                    {cls.className || `Class ${cls.classId}`} (Sem {cls.semester || 1}, Sec {cls.section || 'A'})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Select Class & Subject <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.classSubjectId}
              onChange={(e) => setFormData({ ...formData, classSubjectId: e.target.value })}
              required
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            >
              <option value="">-- Choose Class Curriculum Subject --</option>
              {filteredClassSubjects.map((cs) => {
                const val = cs.id || cs.classSubjectId;
                return (
                  <option key={val} value={val}>
                    Class: {cs.className || 'Class'} • {cs.subjectCode || 'Course'} - {cs.subjectName || 'Subject'}
                  </option>
                );
              })}
            </select>
            {filteredClassSubjects.length === 0 && (
              <p className="text-[11px] text-amber-600 mt-1">
                No subjects mapped for this class yet.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Supervising Faculty Member <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.teacherSubjectId}
            onChange={(e) => setFormData({ ...formData, teacherSubjectId: e.target.value })}
            required
            className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">-- Select Faculty Member --</option>
            {teacherSubjects.map((ts) => {
              const val = ts.id || ts.teacherSubjectId;
              return (
                <option key={val} value={val}>
                  {ts.teacherName || ts.teacherId || 'Faculty'} ({ts.subjectCode || 'Subject'})
                </option>
              );
            })}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Exam Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              required
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Start Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              required
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              End Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              required
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Maximum Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              required
              value={formData.maxMarks}
              onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Passing Standard Marks <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.passingMarks}
              onChange={(e) => setFormData({ ...formData, passingMarks: e.target.value })}
              className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            icon={Award}
          >
            {initialData ? 'Update Exam' : 'Publish Schedule'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
