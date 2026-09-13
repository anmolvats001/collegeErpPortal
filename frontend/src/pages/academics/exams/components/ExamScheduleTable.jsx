import React from 'react';
import { Calendar, Clock, Edit2, Trash2, Award, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { Badge } from '../../../../components/common/Badge';

export const ExamScheduleTable = ({
  exams = [],
  onEditExam,
  onDeleteExam,
  onOpenGrades,
  canManage = true,
}) => {
  const getExamTypeBadge = (type) => {
    switch (type) {
      case 'MIDTERM':
        return <Badge variant="primary">Mid-Term</Badge>;
      case 'ENDTERM':
        return <Badge variant="purple">End-Term</Badge>;
      case 'QUIZ':
        return <Badge variant="warning">Quiz</Badge>;
      case 'PRACTICAL':
        return <Badge variant="success">Practical / Lab</Badge>;
      case 'VIVA':
        return <Badge variant="info">Viva Voce</Badge>;
      default:
        return <Badge variant="secondary">{type || 'Exam'}</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return <Badge variant="info">Scheduled</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (exams.length === 0) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <Award size={36} className="mx-auto mb-2 text-slate-300" />
        <h4 className="text-sm font-bold text-slate-700">No Examinations Scheduled</h4>
        <p className="text-xs text-slate-500 mt-1">
          Schedule academic mid-terms, quizzes, and laboratory tests for your class subjects.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <th className="p-3.5">Examination</th>
              <th className="p-3.5">Type</th>
              <th className="p-3.5">Class & Subject</th>
              <th className="p-3.5">Date & Time</th>
              <th className="p-3.5 text-center">Marks (Max / Pass)</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {exams.map((exam) => (
              <tr key={exam.examId} className="hover:bg-slate-50/80 transition">
                <td className="p-3.5 font-bold text-slate-900 max-w-xs">
                  <div className="truncate">{exam.examName}</div>
                  <div className="text-[11px] text-slate-400 font-normal mt-0.5">
                    ID: {exam.examId}
                  </div>
                </td>

                <td className="p-3.5 whitespace-nowrap">
                  {getExamTypeBadge(exam.examType)}
                </td>

                <td className="p-3.5">
                  <div className="font-semibold text-slate-800">
                    {exam.subjectName || exam.subjectCode || 'Class Subject'}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs">
                    {exam.className || 'Cohort'} • {exam.teacherName || 'Faculty'}
                  </div>
                </td>

                <td className="p-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                    <Calendar size={13} className="text-slate-400" />
                    <span>{exam.examDate}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <Clock size={12} className="text-slate-400" />
                    <span>
                      {exam.startTime?.substring(0, 5)} - {exam.endTime?.substring(0, 5)}
                    </span>
                  </div>
                </td>

                <td className="p-3.5 text-center whitespace-nowrap font-medium">
                  <span className="text-slate-900 font-bold">{exam.maxMarks}</span>
                  <span className="text-slate-400 mx-1">/</span>
                  <span className="text-emerald-600 font-semibold">{exam.passingMarks}</span>
                </td>

                <td className="p-3.5 whitespace-nowrap">
                  {getStatusBadge(exam.status)}
                </td>

                <td className="p-3.5 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onOpenGrades(exam)}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                      title="Grade Book / Enter Scores"
                    >
                      <FileSpreadsheet size={13} />
                      <span>Scores</span>
                    </button>

                    {canManage && (
                      <>
                        <button
                          onClick={() => onEditExam(exam)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition"
                          title="Edit Exam"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteExam(exam.examId)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete Exam"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
