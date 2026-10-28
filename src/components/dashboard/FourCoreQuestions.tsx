import React from 'react';
import { 
  Compass, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRightCircle, 
  ListTodo, 
  TrendingUp, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const FourCoreQuestions: React.FC = () => {
  const { 
    tasks, 
    verificationHistory, 
    backlog, 
    subjects, 
    setPreSessionSubjectCode, 
    setIsPreSessionModalOpen 
  } = useSystem();

  // 1. What was I supposed to do?
  const totalTasks = tasks.length;
  const taskTitles = tasks.map(t => t.subjectCode).join(', ');

  // 2. What did I actually do?
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const partialTasks = tasks.filter(t => t.status === 'partially-completed').length;

  // 3. What am I behind on?
  const pendingBacklog = backlog.filter(b => b.status === 'pending');
  const criticalBacklog = pendingBacklog.filter(b => b.academicImportance === 'critical');

  // 4. What should I do next?
  // Weakest subject calculation
  const weakestSubject = subjects.slice().sort((a, b) => a.percentage - b.percentage)[0];

  const handleNextAction = () => {
    setPreSessionSubjectCode(weakestSubject.code);
    setIsPreSessionModalOpen(true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-theme-accent/10 text-theme-accent">
            <Compass className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-extrabold uppercase tracking-wider text-theme-secondary">
            The 4 Core Accountability Pillars
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-theme-subtle">
          Real-time Continuous Verification
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Pillar 1 */}
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border/80 shadow-cute relative overflow-hidden group hover:border-theme-accent/50 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-theme-subtle">
              Pillar 01
            </span>
            <span className="p-1.5 rounded-xl bg-blue-500/10 text-blue-500">
              <ListTodo className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-xs font-bold text-theme-secondary mb-1">
            1. What was I supposed to do?
          </h3>
          <p className="text-sm font-black text-theme-primary">
            {totalTasks} Scheduled Sessions
          </p>
          <p className="text-[11px] text-theme-subtle mt-1 line-clamp-1">
            Focus: {taskTitles || 'Engineering core slots'}
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border/80 shadow-cute relative overflow-hidden group hover:border-theme-accent/50 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-theme-subtle">
              Pillar 02
            </span>
            <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-xs font-bold text-theme-secondary mb-1">
            2. What did I actually do?
          </h3>
          <p className="text-sm font-black text-theme-primary flex items-center space-x-1.5">
            <span>{completedTasks} Verified</span>
            {partialTasks > 0 && (
              <span className="text-xs text-amber-500 font-semibold">
                (+{partialTasks} partial)
              </span>
            )}
          </p>
          <p className="text-[11px] text-theme-subtle mt-1 line-clamp-1">
            {verificationHistory.length} total verification checks logged
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border/80 shadow-cute relative overflow-hidden group hover:border-theme-accent/50 transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-theme-subtle">
              Pillar 03
            </span>
            <span className="p-1.5 rounded-xl bg-rose-500/10 text-rose-500">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <h3 className="text-xs font-bold text-theme-secondary mb-1">
            3. What am I behind on?
          </h3>
          <p className="text-sm font-black text-rose-600 dark:text-rose-400">
            {pendingBacklog.length} Backlog Items
          </p>
          <p className="text-[11px] text-theme-subtle mt-1 line-clamp-1">
            {criticalBacklog.length > 0 ? `🚨 ${criticalBacklog.length} Critical Priority` : 'No critical backlog'}
          </p>
        </div>

        {/* Pillar 4 */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-theme-elevated to-theme-surface border border-theme-accent/40 shadow-cute relative overflow-hidden group hover:border-theme-accent transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-theme-accent">
              Pillar 04 • Next Action
            </span>
            <span className="p-1.5 rounded-xl bg-theme-accent/15 text-theme-accent">
              <Zap className="w-4 h-4 fill-theme-accent" />
            </span>
          </div>
          <h3 className="text-xs font-bold text-theme-secondary mb-1">
            4. What should I do next?
          </h3>
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="text-xs font-black text-theme-primary">
                {weakestSubject.code} Numerical
              </p>
              <p className="text-[10px] text-rose-500 font-bold">
                Weakest ({weakestSubject.percentage}%)
              </p>
            </div>
            <button
              onClick={handleNextAction}
              className="px-2.5 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-[11px] font-bold transition flex items-center space-x-1 shadow-sm"
            >
              <span>Start</span>
              <ArrowRightCircle className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
