import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  FolderGit2, 
  FolderArchive, 
  Calendar, 
  Bot, 
  Sparkles, 
  Flame, 
  RefreshCw,
  GitCommit,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { useSystem } from './context/SystemContext';
import { Header } from './components/navbar/Header';
import { ThemeSelectorModal } from './components/navbar/ThemeSelectorModal';
import { FourCoreQuestions } from './components/dashboard/FourCoreQuestions';
import { AcademicPrioritiesCard } from './components/dashboard/AcademicPrioritiesCard';
import { TodayScheduleView } from './components/dashboard/TodayScheduleView';
import { DailyScoreWidget } from './components/dashboard/DailyScoreWidget';
import { PreSessionModal } from './components/session/PreSessionModal';
import { ActiveSessionBar } from './components/session/ActiveSessionBar';
import { SessionVerificationModal } from './components/session/SessionVerificationModal';
import { BacklogManager } from './components/backlog/BacklogManager';
import { UpcomingDeadlines } from './components/upcoming/UpcomingDeadlines';
import { ProjectDashboard } from './components/projects/ProjectDashboard';
import { EvidenceLogView } from './components/evidence/EvidenceLogView';
import { ContributionCalendar } from './components/contributions/ContributionCalendar';
import { CommitHistoryFeed } from './components/contributions/CommitHistoryFeed';
import { CommandCenter } from './components/assistant/CommandCenter';
import { WeeklyReportModal } from './components/records/WeeklyReportModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'backlog' | 'projects' | 'evidence' | 'contributions' | 'assistant'
  >('dashboard');

  const { resetAllData, backlog } = useSystem();
  const pendingBacklogCount = backlog.filter(b => b.status === 'pending').length;

  const tabs = [
    { id: 'dashboard', label: 'Today & Academic Plan', icon: LayoutDashboard },
    { 
      id: 'backlog', 
      label: 'Backlog & Radar', 
      icon: AlertTriangle, 
      badge: pendingBacklogCount > 0 ? pendingBacklogCount : undefined 
    },
    { id: 'projects', label: 'Projects & Milestones', icon: FolderGit2 },
    { id: 'evidence', label: 'Evidence Repository', icon: FolderArchive },
    { id: 'contributions', label: 'Calendar & Git Commits', icon: GitCommit },
    { id: 'assistant', label: 'Accountability Bot', icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-theme-base text-theme-primary flex flex-col transition-colors duration-300 pb-20">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tabs Bar */}
        <div className="flex items-center space-x-1.5 overflow-x-auto p-1.5 rounded-2xl bg-theme-surface border border-theme-border shadow-sm scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-theme-accent text-white shadow-cute'
                    : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-elevated'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-theme-accent'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-white text-theme-accent' : 'bg-rose-500 text-white'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            {/* The 4 Core Questions Banner */}
            <FourCoreQuestions />

            {/* Daily Score Formula Breakdown */}
            <DailyScoreWidget />

            {/* Academic Priorities Matrix */}
            <AcademicPrioritiesCard />

            {/* Today's Timetable & Schedule Tracker */}
            <TodayScheduleView />
          </div>
        )}

        {/* Tab 2: Backlog & Radar View */}
        {activeTab === 'backlog' && (
          <div className="space-y-6 animate-fade-in">
            <BacklogManager />
            <UpcomingDeadlines />
          </div>
        )}

        {/* Tab 3: Projects View */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fade-in">
            <ProjectDashboard />
          </div>
        )}

        {/* Tab 4: Evidence View */}
        {activeTab === 'evidence' && (
          <div className="space-y-6 animate-fade-in">
            <EvidenceLogView />
          </div>
        )}

        {/* Tab 5: Calendar & Commits View */}
        {activeTab === 'contributions' && (
          <div className="space-y-6 animate-fade-in">
            {/* GitHub-style Heatmap */}
            <ContributionCalendar />

            {/* Live Commit Feed with conventional commit sync */}
            <CommitHistoryFeed />
          </div>
        )}

        {/* Tab 6: AI Accountability Partner */}
        {activeTab === 'assistant' && (
          <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            <CommandCenter />
          </div>
        )}

      </main>

      {/* Floating Active Session Bar */}
      <ActiveSessionBar />

      {/* Modals */}
      <ThemeSelectorModal />
      <PreSessionModal />
      <SessionVerificationModal />
      <WeeklyReportModal />

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-theme-border/60 text-center text-xs text-theme-subtle">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Master Study + Project Accountability System • Designed with ❤️ and extreme rigor.
          </p>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data to initial prompt state?')) {
                  resetAllData();
                }
              }}
              className="text-[11px] text-theme-subtle hover:text-rose-500 flex items-center space-x-1 transition"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
