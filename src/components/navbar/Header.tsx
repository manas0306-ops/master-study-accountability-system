import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Palette, 
  Calendar, 
  BarChart3, 
  Timer, 
  CheckCircle2, 
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { THEMES } from '../../data/themes';

export const Header: React.FC = () => {
  const {
    theme,
    setIsThemeModalOpen,
    setIsWeeklyReportModalOpen,
    streakDays,
    todayRecord,
    activeSession,
    setIsVerificationModalOpen,
    currentDate,
    setCurrentDate,
    dayOfWeek
  } = useSystem();

  const currentThemeObj = THEMES.find(t => t.id === theme) || THEMES[0];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-theme-surface/90 backdrop-blur-md border-b border-theme-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand & Mascot */}
          <div className="flex items-center space-x-3.5">
            <div className="relative group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-theme-accent to-pink-400 flex items-center justify-center text-white shadow-cute transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-theme-surface"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-extrabold tracking-tight text-theme-primary">
                  Master Study <span className="text-theme-accent">+ Accountability</span>
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-theme-accent/10 text-theme-accent border border-theme-accent/20">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-theme-subtle font-medium flex items-center space-x-1.5">
                <span>Personal Academic Dashboard</span>
                <span>•</span>
                <span className="capitalize font-semibold text-theme-secondary">{dayOfWeek}</span>
                <span>•</span>
                <span>{currentDate}</span>
              </p>
            </div>
          </div>

          {/* Center: Active Session Bar if running */}
          {activeSession && (
            <div className="hidden lg:flex items-center space-x-3 px-4 py-2 rounded-2xl bg-theme-elevated border border-theme-accent/30 shadow-cute animate-pulse-subtle">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                </span>
                <span className="text-xs font-bold text-theme-accent uppercase tracking-wider">
                  Active: {activeSession.subjectCode}
                </span>
              </div>
              <div className="h-4 w-px bg-theme-border" />
              <div className="font-mono font-bold text-sm text-theme-primary flex items-center space-x-1">
                <Timer className="w-4 h-4 text-theme-accent" />
                <span>{formatTimer(activeSession.elapsedSeconds)}</span>
              </div>
              <button
                onClick={() => setIsVerificationModalOpen(true)}
                className="text-xs px-3 py-1 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white font-bold transition shadow-sm flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verify Session</span>
              </button>
            </div>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Streak Counter */}
            <div 
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs"
              title="Daily Active Streak"
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce-slow" />
              <span>{streakDays} Day Streak</span>
            </div>

            {/* Daily Score Pill */}
            {todayRecord && (
              <div 
                className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${
                  todayRecord.dailyScore >= 90
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : todayRecord.dailyScore >= 75
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                }`}
                title={todayRecord.scoreExplanation}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Score: {todayRecord.dailyScore}/100</span>
              </div>
            )}

            {/* Weekly Report Trigger */}
            <button
              onClick={() => setIsWeeklyReportModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-theme-elevated hover:bg-theme-muted border border-theme-border text-theme-secondary text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              title="View Weekly Performance Review"
            >
              <BarChart3 className="w-4 h-4 text-theme-accent" />
              <span className="hidden md:inline">Weekly Report</span>
            </button>

            {/* Theme Selector Button */}
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-theme-accent/10 hover:bg-theme-accent/20 border border-theme-accent/30 text-theme-accent text-xs font-bold flex items-center space-x-2 transition-transform active:scale-95 shadow-sm"
              title="Choose from 5 Day and 5 Night Adorable Themes"
            >
              <Palette className="w-4 h-4" />
              <span className="flex items-center space-x-1">
                <span>{currentThemeObj.emoji}</span>
                <span className="hidden sm:inline">{currentThemeObj.name}</span>
              </span>
            </button>

            {/* Fast Date Navigator */}
            <div className="relative">
              <input
                type="date"
                value={currentDate}
                onChange={(e) => e.target.value && setCurrentDate(e.target.value)}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                title="Change active date"
              />
              <button 
                type="button"
                className="p-2 rounded-xl bg-theme-elevated hover:bg-theme-muted border border-theme-border text-theme-secondary transition"
              >
                <Calendar className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
