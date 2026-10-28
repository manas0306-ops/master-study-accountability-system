import React from 'react';
import { 
  X, 
  BarChart3, 
  Trophy, 
  AlertOctagon, 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  FolderGit2, 
  Target,
  Sparkles,
  ArrowUpRight,
  Printer
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const WeeklyReportModal: React.FC = () => {
  const { isWeeklyReportModalOpen, setIsWeeklyReportModalOpen, weeklyReport } = useSystem();

  if (!isWeeklyReportModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-3xl max-h-[90vh] rounded-3xl bg-theme-surface border border-theme-border shadow-cute-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-theme-border bg-theme-elevated/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-theme-accent/15 text-theme-accent">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-theme-primary">
                15. Weekly Performance & Trend Report
              </h2>
              <p className="text-xs text-theme-subtle">
                Review window: {weeklyReport.weekStartDate} to {weeklyReport.weekEndDate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 rounded-xl text-theme-subtle hover:text-theme-primary hover:bg-theme-muted transition"
              title="Print report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsWeeklyReportModalOpen(false)}
              className="p-1.5 rounded-xl text-theme-subtle hover:text-theme-primary hover:bg-theme-muted transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">

          {/* Academic Table */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-theme-secondary mb-3">
              Academic Performance by Subject
            </h3>

            <div className="overflow-x-auto rounded-2xl border border-theme-border">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-theme-elevated/80 border-b border-theme-border text-theme-subtle uppercase text-[10px] font-black">
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Planned</th>
                    <th className="py-3 px-4">Actual</th>
                    <th className="py-3 px-4">Completion</th>
                    <th className="py-3 px-4">Accuracy</th>
                    <th className="py-3 px-4">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-theme-border/50 bg-theme-surface">
                  {weeklyReport.subjectStats.map((sub) => (
                    <tr key={sub.subjectCode} className="hover:bg-theme-elevated/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-theme-primary">
                        {sub.subjectCode}
                      </td>
                      <td className="py-3 px-4 text-theme-secondary">
                        {sub.plannedHours} hrs
                      </td>
                      <td className="py-3 px-4 font-semibold text-theme-primary">
                        {sub.actualHours} hrs
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${sub.completionRate >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                          {sub.completionRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-mono font-bold ${sub.accuracyRate >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {sub.accuracyRate}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-theme-subtle">
                        <span className="flex items-center space-x-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-[11px]">{sub.trendText}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Highlights & Critical Diagnosis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {/* Best Subject */}
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <Trophy className="w-4 h-4" />
                <span>🏆 Best Subject</span>
              </div>
              <p className="text-sm font-extrabold text-theme-primary">
                {weeklyReport.bestSubject}
              </p>
              <p className="text-[11px] text-theme-secondary">
                Consistently highest marks and accurate particle conjugation.
              </p>
            </div>

            {/* Weakest Subject */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-1">
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                <AlertOctagon className="w-4 h-4" />
                <span>🚨 Weakest Subject (Immediate Action)</span>
              </div>
              <p className="text-sm font-extrabold text-theme-primary">
                {weeklyReport.weakestSubject}
              </p>
              <p className="text-[11px] text-theme-secondary">
                Critical priority: Requires 50% more weekly study allocation than Japanese.
              </p>
            </div>

            {/* Biggest Improvement */}
            <div className="p-4 rounded-2xl bg-theme-elevated/70 border border-theme-border space-y-1">
              <div className="flex items-center space-x-2 text-blue-500 font-bold text-xs uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>📈 Biggest Improvement</span>
              </div>
              <p className="text-sm font-extrabold text-theme-primary">
                {weeklyReport.biggestImprovement}
              </p>
            </div>

            {/* Biggest Problem */}
            <div className="p-4 rounded-2xl bg-theme-elevated/70 border border-theme-border space-y-1">
              <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>⚠️ Biggest Problem / Obstacle</span>
              </div>
              <p className="text-sm font-extrabold text-theme-primary">
                {weeklyReport.biggestProblem}
              </p>
            </div>
          </div>

          {/* Strategic Next Week Targets */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-theme-elevated to-theme-surface border border-theme-accent/40 space-y-2">
            <div className="flex items-center space-x-2 text-theme-accent font-black text-xs uppercase tracking-wider">
              <Target className="w-4 h-4" />
              <span>🎯 Next Week's Objective Condition</span>
            </div>
            <p className="text-sm font-extrabold text-theme-primary">
              {weeklyReport.nextWeekTarget}
            </p>
            <div className="flex items-center space-x-4 text-xs text-theme-subtle pt-1 font-medium">
              <span>Backlog: {weeklyReport.backlogSummary}</span>
              <span>•</span>
              <span>Projects: {weeklyReport.projectProgressSummary}</span>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme-border bg-theme-elevated/40 flex items-center justify-between">
          <p className="text-xs text-theme-subtle">
            Generated autonomously by the Master Study Accountability System.
          </p>
          <button
            onClick={() => setIsWeeklyReportModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition shadow-sm"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
