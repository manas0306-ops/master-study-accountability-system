import React from 'react';
import { 
  Flame, 
  Award, 
  TrendingUp, 
  CheckCircle, 
  Crosshair, 
  CalendarCheck, 
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const DailyScoreWidget: React.FC = () => {
  const { todayRecord, streakDays, tasks } = useSystem();

  if (!todayRecord) return null;

  const score = todayRecord.dailyScore;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length || 1;
  const completionRatio = Math.round((completedCount / totalTasks) * 40);

  const getScoreClassificationStyle = (classification: string) => {
    switch (classification) {
      case 'excellent':
        return {
          badge: '🟢 Excellent',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
          gradient: 'from-emerald-500 to-teal-400',
        };
      case 'good':
        return {
          badge: '🟡 Good',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400',
          gradient: 'from-amber-500 to-yellow-400',
        };
      case 'needs-improvement':
        return {
          badge: '🟠 Needs Improvement',
          bg: 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
          gradient: 'from-orange-500 to-amber-400',
        };
      default:
        return {
          badge: '🔴 Poor',
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400',
          gradient: 'from-rose-500 to-red-600',
        };
    }
  };

  const style = getScoreClassificationStyle(todayRecord.scoreClassification);

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-theme-accent/15 text-theme-accent">
            <Flame className="w-5 h-5 fill-theme-accent" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-theme-primary">
              9. Daily Performance Score Formula
            </h2>
            <p className="text-xs text-theme-subtle">
              Weighted by: 40% Completion • 30% Accuracy • 20% Consistency • 10% Evidence
            </p>
          </div>
        </div>

        <span className={`px-3 py-1.5 rounded-2xl text-xs font-black border ${style.bg}`}>
          {style.badge}
        </span>
      </div>

      {/* Main Score Visual */}
      <div className="p-5 rounded-2xl bg-theme-elevated/60 border border-theme-border flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Score Number Dial */}
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center justify-center">
            <div className={`w-24 h-24 rounded-3xl bg-gradient-to-tr ${style.gradient} flex flex-col items-center justify-center text-white shadow-cute font-black`}>
              <span className="text-3xl tracking-tighter">{score}</span>
              <span className="text-[10px] uppercase font-bold opacity-80">/ 100</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-theme-subtle">
              Today's Verdict
            </span>
            <h3 className="text-sm font-extrabold text-theme-primary mt-0.5">
              {todayRecord.verdictNote}
            </h3>
            <p className="text-xs text-theme-secondary mt-1">
              {todayRecord.scoreExplanation}
            </p>
          </div>
        </div>

        {/* 4 Formula Breakdown Gauges */}
        <div className="w-full md:w-72 space-y-2.5">
          {/* 1. Completion */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-theme-secondary mb-1">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span>Task Completion (40%)</span>
              </span>
              <span className="font-mono">{completionRatio} / 40</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-theme-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-emerald-500 transition-all duration-500" 
                style={{ width: `${(completionRatio / 40) * 100}%` }}
              />
            </div>
          </div>

          {/* 2. Accuracy */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-theme-secondary mb-1">
              <span className="flex items-center space-x-1">
                <Crosshair className="w-3 h-3 text-blue-500" />
                <span>Accuracy Verification (30%)</span>
              </span>
              <span className="font-mono">22 / 30</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-theme-muted overflow-hidden">
              <div className="h-full rounded-full bg-blue-500" style={{ width: '73%' }} />
            </div>
          </div>

          {/* 3. Consistency */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-theme-secondary mb-1">
              <span className="flex items-center space-x-1">
                <CalendarCheck className="w-3 h-3 text-purple-500" />
                <span>Consistency & Streak (20%)</span>
              </span>
              <span className="font-mono">{streakDays > 0 ? '18' : '10'} / 20</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-theme-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-purple-500" 
                style={{ width: `${((streakDays > 0 ? 18 : 10) / 20) * 100}%` }} 
              />
            </div>
          </div>

          {/* 4. Evidence */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-theme-secondary mb-1">
              <span className="flex items-center space-x-1">
                <FileCheck className="w-3 h-3 text-amber-500" />
                <span>Evidence / Output (10%)</span>
              </span>
              <span className="font-mono">{Math.min(10, todayRecord.evidenceIds.length * 5)} / 10</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-theme-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-amber-500" 
                style={{ width: `${(Math.min(10, todayRecord.evidenceIds.length * 5) / 10) * 100}%` }} 
              />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
