import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Circle, 
  Sparkles,
  Tag
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { UpcomingDeadline, PriorityLevel } from '../../types';

export const UpcomingDeadlines: React.FC = () => {
  const { upcoming, addUpcomingDeadline, toggleUpcomingCompleted, currentDate } = useSystem();
  const [isAdding, setIsAdding] = useState(false);

  // New deadline form
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('CSE306 Computer Networks');
  const [newType, setNewType] = useState<UpcomingDeadline['type']>('ca');
  const [newDate, setNewDate] = useState('2026-11-05');
  const [newPriority, setNewPriority] = useState<PriorityLevel>('critical');
  const [newNotes, setNewNotes] = useState('');

  const calculateDaysRemaining = (deadlineStr: string) => {
    const today = new Date(currentDate);
    const target = new Date(deadlineStr);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addUpcomingDeadline({
      title: newTitle,
      subjectOrProject: newSubject,
      type: newType,
      deadlineDate: newDate,
      priority: newPriority,
      notes: newNotes,
      isCompleted: false,
    });

    setIsAdding(false);
    setNewTitle('');
    setNewNotes('');
  };

  const getTypeBadge = (type: UpcomingDeadline['type']) => {
    const map: Record<string, string> = {
      ca: 'CA (Continuous Assessment)',
      mte: 'MTE (Mid-Term Exam)',
      exam: 'Final Exam',
      assignment: 'Assignment',
      'project-deadline': 'Project Milestone',
      submission: 'Code Submission',
      viva: 'Viva Voce',
      presentation: 'Presentation Deck',
      lab: 'Lab Practical',
      quiz: 'Online Quiz',
    };
    return map[type] || type.toUpperCase();
  };

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarClock className="w-5 h-5 text-theme-accent" />
            <h2 className="text-lg font-extrabold text-theme-primary">
              12. Upcoming Deadlines & Exam Radar
            </h2>
          </div>
          <p className="text-xs text-theme-subtle mt-1">
            Tracks CAs, MTEs, Vivas, and submissions. Automatically injects requirements into daily planning.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-xl bg-theme-elevated hover:bg-theme-muted border border-theme-border text-xs font-bold text-theme-secondary flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4 text-theme-accent" />
          <span>Add Deadline</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-theme-elevated border border-theme-accent/30 space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Subject / Project</label>
              <input
                type="text"
                placeholder="e.g., CSE306 Computer Networks"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Assessment Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-bold text-theme-primary"
              >
                <option value="ca">CA (Continuous Assessment)</option>
                <option value="mte">MTE (Mid-Term Exam)</option>
                <option value="exam">Final Exam</option>
                <option value="assignment">Assignment</option>
                <option value="project-deadline">Project Deadline</option>
                <option value="submission">Submission</option>
                <option value="viva">Viva Voce</option>
                <option value="presentation">Presentation</option>
                <option value="lab">Lab Evaluation</option>
                <option value="quiz">Quiz</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Deadline Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-theme-secondary block mb-1">Assessment Title</label>
            <input
              type="text"
              placeholder="e.g., CA-1: Hamming Code, CRC & Subnetting Numerical"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-theme-secondary block mb-1">Scope & Preparation Notes</label>
            <input
              type="text"
              placeholder="e.g., Practice 20 problems without notes; verify 100% calculation accuracy"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-theme-subtle hover:bg-theme-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition shadow-sm"
            >
              Save Upcoming Task
            </button>
          </div>
        </form>
      )}

      {/* Deadlines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {upcoming.map((item) => {
          const daysLeft = calculateDaysRemaining(item.deadlineDate);
          const isUrgent = daysLeft <= 5 && !item.isCompleted;

          return (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                item.isCompleted
                  ? 'bg-theme-surface opacity-60 border-theme-border'
                  : isUrgent
                  ? 'bg-rose-500/5 border-rose-500/30 ring-1 ring-rose-500/20'
                  : 'bg-theme-elevated/40 border-theme-border'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-theme-accent/15 text-theme-accent font-mono text-[10px] font-black uppercase">
                    {getTypeBadge(item.type)}
                  </span>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono ${
                    item.isCompleted
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : daysLeft <= 3
                      ? 'bg-rose-500 text-white animate-pulse'
                      : daysLeft <= 7
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-theme-muted text-theme-secondary'
                  }`}>
                    {item.isCompleted ? '✓ Completed' : daysLeft < 0 ? 'Overdue' : `${daysLeft} days left`}
                  </span>
                </div>

                <h4 className={`text-sm font-extrabold ${item.isCompleted ? 'line-through text-theme-subtle' : 'text-theme-primary'}`}>
                  {item.title}
                </h4>

                <p className="text-xs font-semibold text-theme-secondary mt-0.5">
                  {item.subjectOrProject}
                </p>

                {item.notes && (
                  <p className="text-[11px] text-theme-subtle mt-1.5 line-clamp-2">
                    {item.notes}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-theme-border/50 flex items-center justify-between">
                <span className="text-[11px] font-mono text-theme-subtle">
                  Date: {item.deadlineDate}
                </span>

                <button
                  onClick={() => toggleUpcomingCompleted(item.id)}
                  className="text-xs font-bold text-theme-accent hover:underline flex items-center space-x-1"
                >
                  {item.isCompleted ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Completed</span>
                    </>
                  ) : (
                    <>
                      <Circle className="w-3.5 h-3.5" />
                      <span>Mark Complete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
