import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle, 
  ArrowUpRight, 
  Play, 
  Sliders, 
  X, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { PriorityLevel, Subject } from '../../types';

export const AcademicPrioritiesCard: React.FC = () => {
  const { subjects, updateSubjectMarks, setPreSessionSubjectCode, setIsPreSessionModalOpen } = useSystem();
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [tempMarks, setTempMarks] = useState<number>(0);
  const [tempTotal, setTempTotal] = useState<number>(25);

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'critical':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>🚨 Critical Priority</span>
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-500/15 text-orange-600 dark:text-orange-400 border border-orange-500/30">
            <span>🔴 High Priority</span>
          </span>
        );
      case 'improve':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <span>🟡 Improve</span>
          </span>
        );
      case 'maintain':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span>🟢 Maintain</span>
          </span>
        );
    }
  };

  const openEditor = (sub: Subject) => {
    setEditingSubject(sub);
    setTempMarks(sub.currentMarks);
    setTempTotal(sub.totalMarks);
  };

  const handleSaveMarks = () => {
    if (editingSubject) {
      updateSubjectMarks(editingSubject.code, Number(tempMarks), Number(tempTotal));
      setEditingSubject(null);
    }
  };

  const handleStartStudy = (subCode: string) => {
    setPreSessionSubjectCode(subCode);
    setIsPreSessionModalOpen(true);
  };

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-theme-accent" />
            <h2 className="text-lg font-extrabold text-theme-primary">
              1. Academic Priority & Performance Matrix
            </h2>
          </div>
          <p className="text-xs text-theme-subtle mt-1">
            Weakest subjects receive prioritized study hours. Time is never distributed blindly.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-theme-secondary bg-theme-elevated px-3 py-1.5 rounded-xl border border-theme-border/60">
          <Sparkles className="w-4 h-4 text-theme-accent" />
          <span>Priority Threshold: &lt;60% Critical • 60-70% High</span>
        </div>
      </div>

      {/* Subject Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const isCritical = sub.priority === 'critical';
          const isHigh = sub.priority === 'high';

          return (
            <div
              key={sub.code}
              className={`p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                isCritical
                  ? 'bg-rose-500/5 border-rose-500/40 shadow-sm'
                  : isHigh
                  ? 'bg-orange-500/5 border-orange-500/30'
                  : 'bg-theme-elevated/40 border-theme-border hover:border-theme-accent/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-xs font-black text-theme-secondary uppercase tracking-wider">
                      {sub.code}
                    </span>
                    <h3 className="text-sm font-extrabold text-theme-primary">
                      {sub.name}
                    </h3>
                  </div>
                  {getPriorityBadge(sub.priority)}
                </div>

                {/* Score Bar & Performance */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-theme-subtle">Current Performance</span>
                    <span className="font-extrabold font-mono text-theme-primary">
                      {sub.percentage}% ({sub.currentMarks}/{sub.totalMarks})
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-theme-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCritical
                          ? 'bg-rose-500'
                          : isHigh
                          ? 'bg-orange-500'
                          : sub.percentage >= 80
                          ? 'bg-emerald-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, sub.percentage)}%` }}
                    />
                  </div>
                </div>

                {/* Units & Key Focus */}
                <div className="mt-3 text-xs text-theme-secondary space-y-1">
                  <p className="font-semibold text-theme-subtle text-[11px]">
                    Syllabus: <span className="text-theme-primary">{sub.units}</span>
                  </p>
                  <p className="text-[11px] line-clamp-2 text-theme-subtle">
                    Topics: {sub.topics.slice(0, 3).join(', ')}...
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-theme-border/50 flex items-center justify-between">
                <button
                  onClick={() => openEditor(sub)}
                  className="text-[11px] font-bold text-theme-subtle hover:text-theme-primary flex items-center space-x-1 transition"
                  title="Update assessment marks"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Update Marks</span>
                </button>

                <button
                  onClick={() => handleStartStudy(sub.code)}
                  className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Start Session</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Marks Modal */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute-lg space-y-4">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div>
                <h3 className="text-base font-extrabold text-theme-primary">
                  Update Marks: {editingSubject.code}
                </h3>
                <p className="text-xs text-theme-subtle">{editingSubject.name}</p>
              </div>
              <button
                onClick={() => setEditingSubject(null)}
                className="p-1 rounded-xl text-theme-subtle hover:text-theme-primary transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-theme-secondary block mb-1">
                  Marks Obtained
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tempMarks}
                  onChange={(e) => setTempMarks(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-sm font-mono text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-theme-secondary block mb-1">
                  Total Marks
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={tempTotal}
                  onChange={(e) => setTempTotal(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-sm font-mono text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
              </div>

              <div className="p-3 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-secondary flex items-center justify-between">
                <span>Calculated Percentage:</span>
                <span className="font-mono font-bold text-theme-accent">
                  {tempTotal > 0 ? ((tempMarks / tempTotal) * 100).toFixed(2) : '0.00'}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-theme-border">
              <button
                onClick={() => setEditingSubject(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-theme-secondary hover:bg-theme-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMarks}
                className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition shadow-sm"
              >
                Save & Recalculate Priority
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
