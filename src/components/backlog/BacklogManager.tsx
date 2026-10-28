import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Flame, 
  Plus, 
  ArrowUpRight,
  ShieldAlert,
  ArchiveRestore
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { BacklogItem } from '../../types';

export const BacklogManager: React.FC = () => {
  const { 
    backlog, 
    resolveBacklogItem, 
    rescheduleBacklogItem, 
    addBacklogItem,
    setPreSessionSubjectCode,
    setIsPreSessionModalOpen 
  } = useSystem();

  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState('CSE306');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newMinutes, setNewMinutes] = useState(40);
  const [newImportance, setNewImportance] = useState<'critical' | 'high' | 'medium'>('critical');

  const pendingItems = backlog.filter(b => b.status === 'pending');
  const completedItems = backlog.filter(b => b.status === 'completed');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    addBacklogItem({
      subjectCode: newSubject,
      title: newTitle,
      description: newDesc || 'Unfinished numerical practice exercises',
      priorityRank: newImportance === 'critical' ? 1 : newImportance === 'high' ? 2 : 3,
      academicImportance: newImportance,
      estimatedMinutes: newMinutes,
      status: 'pending',
    });

    setIsAdding(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleSolveNow = (item: BacklogItem) => {
    setPreSessionSubjectCode(item.subjectCode);
    setIsPreSessionModalOpen(true);
  };

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-extrabold text-theme-primary">
              11. Backlog Quarantine System
            </h2>
          </div>
          <p className="text-xs text-theme-subtle mt-1">
            Unfinished tasks never disappear. Prioritized by academic importance and weakness.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1.5 rounded-xl bg-theme-elevated hover:bg-theme-muted border border-theme-border text-xs font-bold text-theme-secondary flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4 text-theme-accent" />
          <span>Add Backlog Task</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-theme-elevated border border-rose-500/30 space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Subject</label>
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-bold text-theme-primary"
              >
                <option value="CSE306">CSE306 - Networks (Critical)</option>
                <option value="MTH401">MTH401 - Discrete Maths (High)</option>
                <option value="CSE423">CSE423 - Cloud Computing</option>
                <option value="INT335">INT335 - Design Thinking</option>
                <option value="JAP602">JAP602 - Japanese</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Importance</label>
              <select
                value={newImportance}
                onChange={(e) => setNewImportance(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-bold text-theme-primary"
              >
                <option value="critical">🚨 Critical</option>
                <option value="high">🔴 High</option>
                <option value="medium">🟡 Medium</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Est. Time (mins)</label>
              <input
                type="number"
                value={newMinutes}
                onChange={(e) => setNewMinutes(parseInt(e.target.value) || 10)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-theme-secondary block mb-1">Backlog Title</label>
            <input
              type="text"
              placeholder="e.g., CRC practice — 5 problems remaining"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
              required
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
              className="px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition shadow-sm"
            >
              Add to Quarantine
            </button>
          </div>
        </form>
      )}

      {/* Pending Items List */}
      <div className="space-y-3">
        {pendingItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-theme-elevated/40 border border-dashed border-theme-border text-theme-subtle text-xs">
            🎉 Zero backlog! All study commitments have been verified completed.
          </div>
        ) : (
          pendingItems.map((item) => {
            const isCritical = item.academicImportance === 'critical';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCritical
                    ? 'bg-rose-500/5 border-rose-500/30 ring-1 ring-rose-500/20'
                    : 'bg-theme-elevated/50 border-theme-border'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`p-2.5 rounded-xl text-xs font-bold font-mono flex flex-col items-center justify-center min-w-[60px] border ${
                    isCritical
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  }`}>
                    <AlertTriangle className="w-4 h-4 mb-1" />
                    <span>Rank {item.priorityRank}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-theme-accent/15 text-theme-accent font-mono text-[11px] font-black uppercase">
                        {item.subjectCode}
                      </span>
                      <h4 className="text-sm font-extrabold text-theme-primary">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-xs text-theme-secondary line-clamp-1">
                      {item.description}
                    </p>

                    <div className="flex items-center space-x-3 text-[11px] text-theme-subtle font-medium mt-1.5">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>~{item.estimatedMinutes} mins</span>
                      </span>
                      <span>•</span>
                      <span>Added: {item.dateAdded}</span>
                      {item.scheduledDate && (
                        <>
                          <span>•</span>
                          <span className="text-theme-accent font-semibold">Rescheduled for: {item.scheduledDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  <button
                    onClick={() => rescheduleBacklogItem(item.id, '2026-10-31 (Friday Sprint)')}
                    className="px-2.5 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-muted border border-theme-border text-theme-secondary text-xs font-semibold transition"
                    title="Schedule for Friday Troubleshooting session"
                  >
                    Reschedule
                  </button>

                  <button
                    onClick={() => handleSolveNow(item)}
                    className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>Solve Now</span>
                  </button>

                  <button
                    onClick={() => resolveBacklogItem(item.id)}
                    className="p-1.5 rounded-xl text-emerald-500 hover:bg-emerald-500/10 border border-emerald-500/30 transition"
                    title="Mark verified as complete"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Completed summary toggle */}
      {completedItems.length > 0 && (
        <div className="pt-2 text-[11px] text-theme-subtle flex items-center space-x-2">
          <ArchiveRestore className="w-3.5 h-3.5" />
          <span>{completedItems.length} previously quarantined backlog items solved and verified.</span>
        </div>
      )}
    </div>
  );
};
