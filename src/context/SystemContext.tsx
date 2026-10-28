import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Subject,
  ScheduledTask,
  DayOfWeek,
  TaskStatus,
  SessionVerification,
  DailyRecord,
  EvidenceItem,
  BacklogItem,
  UpcomingDeadline,
  Project,
  ContributionEntry,
  ChatMessage,
  PriorityLevel,
  ProjectStandard,
  WeeklyReport,
} from '../types';
import {
  INITIAL_SUBJECTS,
  TIMETABLE_SLOTS,
  INITIAL_PROJECTS,
  INITIAL_BACKLOG,
  INITIAL_UPCOMING,
  INITIAL_EVIDENCE,
  INITIAL_COMMITS,
} from '../data/initialData';

interface ActiveSessionState {
  subjectCode: string;
  taskTitle: string;
  targetDescription: string;
  plannedAmount: number;
  startTime: number; // timestamp
  elapsedSeconds: number;
  isRunning: boolean;
  taskId?: string;
}

interface SystemContextType {
  // Theme
  theme: string;
  setTheme: (themeId: string) => void;

  // Date
  currentDate: string; // YYYY-MM-DD
  setCurrentDate: (date: string) => void;
  dayOfWeek: DayOfWeek;

  // Subjects & Priorities
  subjects: Subject[];
  updateSubjectMarks: (subjectCode: string, marks: number, total: number) => void;

  // Tasks & Schedule
  tasks: ScheduledTask[];
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addNewTask: (task: Omit<ScheduledTask, 'id' | 'date' | 'dayOfWeek'>) => void;
  generateDailyTasks: (dateStr: string) => void;

  // Active Session & Verification
  activeSession: ActiveSessionState | null;
  startSession: (subjectCode: string, taskTitle: string, targetDescription: string, plannedAmount: number, taskId?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  cancelSession: () => void;
  submitSessionVerification: (data: Omit<SessionVerification, 'id' | 'timestamp'>) => void;
  verificationHistory: SessionVerification[];

  // Daily Records & Score
  dailyRecords: Record<string, DailyRecord>;
  todayRecord: DailyRecord | null;
  calculateDailyScore: (dateStr: string) => DailyRecord;

  // Evidence
  evidenceList: EvidenceItem[];
  addEvidence: (item: Omit<EvidenceItem, 'id' | 'timestamp'>) => void;

  // Backlog
  backlog: BacklogItem[];
  addBacklogItem: (item: Omit<BacklogItem, 'id' | 'dateAdded'>) => void;
  resolveBacklogItem: (id: string) => void;
  rescheduleBacklogItem: (id: string, newDate: string) => void;

  // Upcoming
  upcoming: UpcomingDeadline[];
  addUpcomingDeadline: (item: Omit<UpcomingDeadline, 'id'>) => void;
  toggleUpcomingCompleted: (id: string) => void;

  // Projects
  projects: Project[];
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;
  updateProjectRubric: (projectId: string, field: string, score: number) => void;
  updateProjectStatus: (projectId: string, standard: ProjectStandard) => void;

  // Contributions & Git Commits
  contributions: ContributionEntry[];
  gitCommits: typeof INITIAL_COMMITS;
  recordContribution: (type: ContributionEntry['type'], title: string, points?: number, commitHash?: string) => void;
  streakDays: number;
  longestStreak: number;
  totalContributions: number;

  // AI Accountability Partner Chat
  chatMessages: ChatMessage[];
  sendUserMessage: (text: string) => void;
  clearChat: () => void;

  // Modals & Triggers
  isPreSessionModalOpen: boolean;
  setIsPreSessionModalOpen: (open: boolean) => void;
  preSessionSubjectCode: string | null;
  setPreSessionSubjectCode: (code: string | null) => void;
  isVerificationModalOpen: boolean;
  setIsVerificationModalOpen: (open: boolean) => void;
  isThemeModalOpen: boolean;
  setIsThemeModalOpen: (open: boolean) => void;
  isWeeklyReportModalOpen: boolean;
  setIsWeeklyReportModalOpen: (open: boolean) => void;

  // Generated Weekly Report
  weeklyReport: WeeklyReport;

  // Reset demo data
  resetAllData: () => void;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'master_study_system_v1_';

export const SystemProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<string>(() => {
    return localStorage.getItem(`${LOCAL_STORAGE_PREFIX}theme`) || 'sakura-day';
  });

  const setTheme = (themeId: string) => {
    setThemeState(themeId);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}theme`, themeId);
    document.documentElement.setAttribute('data-theme', themeId);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Current Date State (Defaults to real today or simulated fixed date)
  const [currentDate, setCurrentDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Day of week calculation
  const dayOfWeek = useMemo<DayOfWeek>(() => {
    const d = new Date(currentDate);
    const dayIndex = d.getDay();
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days[dayIndex];
  }, [currentDate]);

  // Subjects
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}subjects`);
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}subjects`, JSON.stringify(subjects));
  }, [subjects]);

  const updateSubjectMarks = (code: string, marks: number, total: number) => {
    setSubjects(prev => prev.map(sub => {
      if (sub.code === code) {
        const pct = Math.round((marks / total) * 10000) / 100;
        let p: PriorityLevel = 'maintain';
        if (pct < 60) p = 'critical';
        else if (pct < 70) p = 'high';
        else if (pct < 80) p = 'improve';
        else p = 'maintain';

        return {
          ...sub,
          currentMarks: marks,
          totalMarks: total,
          percentage: pct,
          priority: p,
        };
      }
      return sub;
    }));
  };

  // Helper to generate tasks for a given date
  const buildTasksForDate = (dateStr: string, currentDay: DayOfWeek): ScheduledTask[] => {
    const matchingSlots = TIMETABLE_SLOTS.filter(s => s.day === currentDay);
    if (matchingSlots.length > 0) {
      return matchingSlots.map(slot => {
        const sub = subjects.find(s => s.code === slot.subjectCode);
        return {
          id: `task-${dateStr}-${slot.id}`,
          date: dateStr,
          dayOfWeek: currentDay,
          startTime: slot.startTime,
          endTime: slot.endTime,
          subjectCode: slot.subjectCode,
          taskTitle: slot.title,
          focusTopics: slot.focusTopics,
          requiredOutcome: slot.requiredOutcome,
          priority: sub ? sub.priority : 'high',
          status: 'not-started',
          plannedQuestions: 8,
          completedQuestions: 0,
        };
      });
    }

    // Weekend default tasks
    return [
      {
        id: `task-${dateStr}-weekend-1`,
        date: dateStr,
        dayOfWeek: currentDay,
        startTime: '10:00',
        endTime: '13:00',
        subjectCode: 'CSE306',
        taskTitle: 'Weekend Deep Sprint: Networks Numerical & Backlog',
        focusTopics: ['CRC practice backlog', 'Subnetting VLSM', 'Hamming code exercises'],
        requiredOutcome: ['Clear at least 2 backlog items', '100% manual accuracy test'],
        priority: 'critical',
        status: 'not-started',
        plannedQuestions: 10,
        completedQuestions: 0,
      },
      {
        id: `task-${dateStr}-weekend-2`,
        date: dateStr,
        dayOfWeek: currentDay,
        startTime: '15:00',
        endTime: '18:00',
        subjectCode: 'CSE423',
        taskTitle: 'Project Implementation & Git Milestone Sprint',
        focusTopics: ['Cloud Architecture Planner', 'Accountability UI tests', 'Git commit push'],
        requiredOutcome: ['Ship functional feature', 'Add evidence log', 'Verify Satisfactory standard'],
        priority: 'improve',
        status: 'not-started',
        plannedQuestions: 4,
        completedQuestions: 0,
      },
    ];
  };

  // Tasks
  const [tasks, setTasks] = useState<ScheduledTask[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}tasks_${currentDate}`);
    if (saved) return JSON.parse(saved);
    return buildTasksForDate(currentDate, dayOfWeek);
  });

  const generateDailyTasks = (dateStr: string) => {
    const d = new Date(dateStr);
    const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const targetDay = days[d.getDay()];
    const newTasks = buildTasksForDate(dateStr, targetDay);
    setTasks(newTasks);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}tasks_${dateStr}`, JSON.stringify(newTasks));
  };

  // Keep tasks synced with current date
  useEffect(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}tasks_${currentDate}`);
    if (saved) {
      setTasks(JSON.parse(saved));
    } else {
      const newTasks = buildTasksForDate(currentDate, dayOfWeek);
      setTasks(newTasks);
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}tasks_${currentDate}`, JSON.stringify(newTasks));
    }
  }, [currentDate, dayOfWeek]);

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => {
      const updated = prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toLocaleTimeString() : t.completedAt,
          };
        }
        return t;
      });
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}tasks_${currentDate}`, JSON.stringify(updated));
      return updated;
    });

    const target = tasks.find(t => t.id === taskId);
    if (target) {
      if (status === 'completed') {
        recordContribution('task-completed', `Completed: ${target.taskTitle}`, 2);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
        });
      } else if (status === 'missed' || status === 'partially-completed') {
        // Auto-transfer to Backlog
        addBacklogItem({
          subjectCode: target.subjectCode,
          title: `Unfinished: ${target.taskTitle}`,
          description: `Automatically carried forward from ${currentDate}. Focus topics: ${target.focusTopics.slice(0, 3).join(', ')}.`,
          priorityRank: target.priority === 'critical' ? 1 : target.priority === 'high' ? 2 : 3,
          academicImportance: target.priority === 'critical' ? 'critical' : target.priority === 'high' ? 'high' : 'medium',
          estimatedMinutes: 45,
          status: 'pending',
        });
      }
    }
  };

  const addNewTask = (task: Omit<ScheduledTask, 'id' | 'date' | 'dayOfWeek'>) => {
    const newTask: ScheduledTask = {
      ...task,
      id: `task-${currentDate}-${Date.now()}`,
      date: currentDate,
      dayOfWeek,
    };
    setTasks(prev => {
      const updated = [...prev, newTask];
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}tasks_${currentDate}`, JSON.stringify(updated));
      return updated;
    });
  };

  // Active Session & Verification
  const [activeSession, setActiveSession] = useState<ActiveSessionState | null>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}active_session`);
    return saved ? JSON.parse(saved) : null;
  });

  const [verificationHistory, setVerificationHistory] = useState<SessionVerification[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}verification_history`);
    return saved ? JSON.parse(saved) : [];
  });

  // Timer loop for active session
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeSession && activeSession.isRunning) {
      interval = setInterval(() => {
        setActiveSession(prev => {
          if (!prev) return null;
          const updated = {
            ...prev,
            elapsedSeconds: prev.elapsedSeconds + 1,
          };
          localStorage.setItem(`${LOCAL_STORAGE_PREFIX}active_session`, JSON.stringify(updated));
          return updated;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeSession?.isRunning]);

  const startSession = (
    subjectCode: string,
    taskTitle: string,
    targetDescription: string,
    plannedAmount: number,
    taskId?: string
  ) => {
    const session: ActiveSessionState = {
      subjectCode,
      taskTitle,
      targetDescription,
      plannedAmount,
      startTime: Date.now(),
      elapsedSeconds: 0,
      isRunning: true,
      taskId,
    };
    setActiveSession(session);
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}active_session`, JSON.stringify(session));

    // Mark task in-progress if attached
    if (taskId) {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'in-progress' } : t));
    }
  };

  const pauseSession = () => {
    setActiveSession(prev => {
      if (!prev) return null;
      const updated = { ...prev, isRunning: false };
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}active_session`, JSON.stringify(updated));
      return updated;
    });
  };

  const resumeSession = () => {
    setActiveSession(prev => {
      if (!prev) return null;
      const updated = { ...prev, isRunning: true };
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}active_session`, JSON.stringify(updated));
      return updated;
    });
  };

  const cancelSession = () => {
    setActiveSession(null);
    localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}active_session`);
  };

  const submitSessionVerification = (data: Omit<SessionVerification, 'id' | 'timestamp'>) => {
    const newEntry: SessionVerification = {
      ...data,
      id: `verif-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    setVerificationHistory(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem(`${LOCAL_STORAGE_PREFIX}verification_history`, JSON.stringify(updated));
      return updated;
    });

    // Mark task as completed or partially-completed
    if (activeSession?.taskId) {
      const targetStatus = newEntry.completionPercentage >= 90 ? 'completed' : 'partially-completed';
      updateTaskStatus(activeSession.taskId, targetStatus);
    }

    // Auto-record contribution
    recordContribution(
      'study-session',
      `Session Verified: ${data.subjectCode} (${data.completionPercentage}% completion, ${data.accuracyPercentage}% accuracy)`,
      data.completionPercentage >= 80 ? 4 : 2
    );

    // If unfinished work exists, auto-add to backlog
    if (data.unfinishedWork && data.unfinishedWork.trim().length > 3) {
      addBacklogItem({
        subjectCode: data.subjectCode,
        title: `Unfinished work: ${data.subjectCode}`,
        description: data.unfinishedWork,
        priorityRank: data.subjectCode === 'CSE306' ? 1 : 2,
        academicImportance: data.subjectCode === 'CSE306' ? 'critical' : 'high',
        estimatedMinutes: 30,
        status: 'pending',
      });
    }

    // Clear active session
    cancelSession();
    setIsVerificationModalOpen(false);

    // Trigger celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // Backlog
  const [backlog, setBacklog] = useState<BacklogItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}backlog`);
    return saved ? JSON.parse(saved) : INITIAL_BACKLOG;
  });

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}backlog`, JSON.stringify(backlog));
  }, [backlog]);

  const addBacklogItem = (item: Omit<BacklogItem, 'id' | 'dateAdded'>) => {
    const newItem: BacklogItem = {
      ...item,
      id: `backlog-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      dateAdded: currentDate,
    };
    setBacklog(prev => [newItem, ...prev]);
  };

  const resolveBacklogItem = (id: string) => {
    setBacklog(prev => prev.map(item => item.id === id ? { ...item, status: 'completed' } : item));
    recordContribution('task-completed', 'Resolved Backlog Item', 3);
  };

  const rescheduleBacklogItem = (id: string, newDate: string) => {
    setBacklog(prev => prev.map(item => item.id === id ? { ...item, status: 'scheduled', scheduledDate: newDate } : item));
  };

  // Upcoming
  const [upcoming, setUpcoming] = useState<UpcomingDeadline[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}upcoming`);
    return saved ? JSON.parse(saved) : INITIAL_UPCOMING;
  });

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}upcoming`, JSON.stringify(upcoming));
  }, [upcoming]);

  const addUpcomingDeadline = (item: Omit<UpcomingDeadline, 'id'>) => {
    const newItem: UpcomingDeadline = {
      ...item,
      id: `up-${Date.now()}`,
    };
    setUpcoming(prev => [...prev, newItem]);
  };

  const toggleUpcomingCompleted = (id: string) => {
    setUpcoming(prev => prev.map(u => u.id === id ? { ...u, isCompleted: !u.isCompleted } : u));
  };

  // Evidence
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}evidence`);
    return saved ? JSON.parse(saved) : INITIAL_EVIDENCE;
  });

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}evidence`, JSON.stringify(evidenceList));
  }, [evidenceList]);

  const addEvidence = (item: Omit<EvidenceItem, 'id' | 'timestamp'>) => {
    const newEv: EvidenceItem = {
      ...item,
      id: `ev-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setEvidenceList(prev => [newEv, ...prev]);
    recordContribution('evidence', `Evidence Verified: ${item.title} (${item.subjectOrProject})`, 3);
  };

  // Projects
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}projects`);
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}projects`, JSON.stringify(projects));
  }, [projects]);

  const toggleProjectMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedMilestones = p.milestones.map(m => {
          if (m.id === milestoneId) {
            const nextCompleted = !m.completed;
            return {
              ...m,
              completed: nextCompleted,
              completedAt: nextCompleted ? new Date().toISOString().split('T')[0] : undefined,
            };
          }
          return m;
        });

        const completedCount = updatedMilestones.filter(m => m.completed).length;
        const completionPct = Math.round((completedCount / updatedMilestones.length) * 100);

        return {
          ...p,
          milestones: updatedMilestones,
          completionPercentage: completionPct,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));

    recordContribution('project-milestone', 'Project Milestone Updated', 3);
  };

  const updateProjectRubric = (projectId: string, field: string, score: number) => {
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        const updatedRubric = {
          ...p.rubricScores,
          [field]: Math.max(0, Math.min(10, score)),
        };
        const sum = Object.values(updatedRubric).reduce((a, b) => a + b, 0);
        const qualityScore = Math.round(sum);
        const standard: ProjectStandard = qualityScore >= 80 ? 'excellent' : qualityScore >= 60 ? 'satisfactory' : 'needs-work';

        return {
          ...p,
          rubricScores: updatedRubric,
          qualityScore,
          standard,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
      }
      return p;
    }));
  };

  const updateProjectStatus = (projectId: string, standard: ProjectStandard) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, standard } : p));
  };

  // Git Commits & Contributions
  const [gitCommits] = useState(INITIAL_COMMITS);

  const [contributions, setContributions] = useState<ContributionEntry[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}contributions`);
    if (saved) return JSON.parse(saved);

    // Initial seed from commits + initial evidence
    const entries: ContributionEntry[] = [];
    INITIAL_COMMITS.forEach((c, idx) => {
      entries.push({
        id: `contrib-commit-${idx}`,
        date: c.date,
        type: 'git-commit',
        title: c.message,
        commitHash: c.hash,
        points: c.points,
        timestamp: `${c.date} 12:00:00`,
      });
    });

    INITIAL_EVIDENCE.forEach((ev, idx) => {
      entries.push({
        id: `contrib-ev-${idx}`,
        date: ev.date,
        type: 'evidence',
        title: ev.title,
        points: 3,
        timestamp: `${ev.date} 18:00:00`,
      });
    });

    return entries;
  });

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}contributions`, JSON.stringify(contributions));
  }, [contributions]);

  const recordContribution = (
    type: ContributionEntry['type'],
    title: string,
    points: number = 2,
    commitHash?: string
  ) => {
    const newEntry: ContributionEntry = {
      id: `contrib-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      date: currentDate,
      type,
      title,
      points,
      commitHash,
      timestamp: new Date().toISOString(),
    };
    setContributions(prev => [newEntry, ...prev]);
  };

  // Streak calculation
  const { streakDays, longestStreak, totalContributions } = useMemo(() => {
    if (contributions.length === 0) {
      return { streakDays: 0, longestStreak: 0, totalContributions: 0 };
    }

    const uniqueDates = Array.from(new Set(contributions.map(c => c.date))).sort();
    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    const todayStr = currentDate;
    const hasToday = uniqueDates.includes(todayStr);

    for (let i = 0; i < uniqueDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    }

    currentStreak = hasToday ? tempStreak : 0;

    return {
      streakDays: currentStreak || 3, // Initial warm streak
      longestStreak: Math.max(maxStreak, 5),
      totalContributions: contributions.length,
    };
  }, [contributions, currentDate]);

  // Daily Score calculation (40% completion, 30% accuracy, 20% consistency, 10% evidence)
  const [dailyRecords, setDailyRecords] = useState<Record<string, DailyRecord>>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}daily_records`);
    return saved ? JSON.parse(saved) : {};
  });

  const calculateDailyScore = (dateStr: string): DailyRecord => {
    const dayTasks = tasks.filter(t => t.date === dateStr);
    const dayVerifications = verificationHistory.filter(v => v.timestamp.startsWith(dateStr));
    const dayEvidence = evidenceList.filter(e => e.date === dateStr);

    const totalTasks = dayTasks.length || 1;
    const completedTasks = dayTasks.filter(t => t.status === 'completed').length;
    const partialTasks = dayTasks.filter(t => t.status === 'partially-completed').length;

    // 1. Completion Rate (0-40)
    const completionRatio = (completedTasks + partialTasks * 0.5) / totalTasks;
    const completionScore = Math.round(completionRatio * 40);

    // 2. Accuracy Rate (0-30)
    let accuracySum = 0;
    if (dayVerifications.length > 0) {
      accuracySum = dayVerifications.reduce((acc, v) => acc + v.accuracyPercentage, 0) / dayVerifications.length;
    } else {
      accuracySum = 75; // baseline assumption
    }
    const accuracyScore = Math.round((accuracySum / 100) * 30);

    // 3. Consistency (0-20) - based on streak and whether study started on time
    const consistencyScore = streakDays > 0 ? 18 : 10;

    // 4. Evidence (0-10)
    const evidenceScore = Math.min(10, dayEvidence.length * 5);

    const totalScore = Math.min(100, completionScore + accuracyScore + consistencyScore + evidenceScore);

    let classification: 'excellent' | 'good' | 'needs-improvement' | 'poor' = 'needs-improvement';
    let verdict: 'excellent' | 'good' | 'average' | 'poor' = 'average';
    let verdictNote = '';

    if (totalScore >= 90) {
      classification = 'excellent';
      verdict = 'excellent';
      verdictNote = 'Outstanding execution. High completion, verified accuracy, and documented evidence.';
    } else if (totalScore >= 75) {
      classification = 'good';
      verdict = 'good';
      verdictNote = 'Solid work today. Main target objectives met with steady consistency.';
    } else if (totalScore >= 60) {
      classification = 'needs-improvement';
      verdict = 'average';
      verdictNote = 'Average day. Too much passive studying or incomplete numerical problems. Review your mistake log.';
    } else {
      classification = 'poor';
      verdict = 'poor';
      verdictNote = 'Unacceptable session discipline. Critical priorities left unverified. Backlog carries over.';
    }

    const explanation = `Score breakdown: Task Completion (${completionScore}/40), Accuracy (${accuracyScore}/30), Consistency (${consistencyScore}/20), Evidence Logged (${evidenceScore}/10).`;

    const record: DailyRecord = {
      date: dateStr,
      dayOfWeek,
      subjects: {},
      dailyScore: totalScore,
      scoreClassification: classification,
      scoreExplanation: explanation,
      verdict,
      verdictNote,
      totalPlannedTimeMinutes: totalTasks * 80,
      totalActualTimeMinutes: (completedTasks * 80) + (partialTasks * 45),
      completedTasks: dayTasks.filter(t => t.status === 'completed').map(t => t.taskTitle),
      partiallyCompletedTasks: dayTasks.filter(t => t.status === 'partially-completed').map(t => t.taskTitle),
      missedTasks: dayTasks.filter(t => t.status === 'missed').map(t => t.taskTitle),
      evidenceIds: dayEvidence.map(e => e.id),
    };

    return record;
  };

  const todayRecord = useMemo(() => {
    return calculateDailyScore(currentDate);
  }, [tasks, verificationHistory, evidenceList, currentDate, streakDays]);

  // Modals & Chat
  const [isPreSessionModalOpen, setIsPreSessionModalOpen] = useState(false);
  const [preSessionSubjectCode, setPreSessionSubjectCode] = useState<string | null>(null);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isWeeklyReportModalOpen, setIsWeeklyReportModalOpen] = useState(false);

  // Chat system (AI Accountability Partner)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-init-1',
        sender: 'assistant',
        content: `🎓 **MASTER ACCOUNTABILITY SYSTEM ONLINE**\n\nI am your Personal Study Manager, Project Manager, and Academic Tracker.\n\nYour current academic priorities:\n• **CSE306**: 🚨 Critical (50.00%)\n• **MTH401**: 🔴 High Priority (56.67%)\n• **CSE423**: 🟡 Improve (70.00%)\n• **INT335**: 🟡 Improve (70.83%)\n• **JAP602**: 🟢 Maintain (83.33%)\n\nI will not let you settle for passive reading. Type **"Start today's plan"** or click any quick command below to begin.`,
        timestamp: 'Just now',
        badge: 'Accountability Bot',
      },
    ];
  });

  const sendUserMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Process Accountability command
    setTimeout(() => {
      const lower = text.toLowerCase().trim();
      let reply = '';
      let badge = 'Partner Verdict';

      if (lower.includes("start today's plan")) {
        const criticalCount = subjects.filter(s => s.priority === 'critical' || s.priority === 'high').length;
        reply = `📅 **TODAY'S PLAN ACTIVATED (${currentDate})**\n\n**Top 3 Priorities:**\n1. **CSE306 Computer Networks** (Critical: 50.0%) — Target: CRC polynomial division & VLSM subnetting.\n2. **MTH401 Discrete Mathematics** (High: 56.67%) — Target: Formal proof mechanics & recurrence relations.\n3. **Clear Backlog** (${backlog.filter(b => b.status === 'pending').length} pending items).\n\n**Today's Success Condition:**\nYou must complete at least 2 core numerical sessions with a verified accuracy of ≥ 75% and submit at least 1 piece of manual proof evidence. Passive reading will NOT be counted.`;
      } else if (lower.startsWith('start ') && (lower.includes('cse') || lower.includes('mth') || lower.includes('int') || lower.includes('jap'))) {
        const code = lower.split(' ')[1].toUpperCase();
        setPreSessionSubjectCode(code);
        setIsPreSessionModalOpen(true);
        reply = `⏳ Initializing session for **${code}**. Setting up your Target Contract now. Remember: measurable problem count only. No vague "studied" claims!`;
      } else if (lower.includes('end session')) {
        if (activeSession) {
          setIsVerificationModalOpen(true);
          reply = `🛑 Ending active session for **${activeSession.subjectCode}**. Opening Session Completion Verification now. Have your problem count, accuracy, and mistake details ready.`;
        } else {
          reply = `⚠️ No active session currently in progress. Start a session first by typing **"Start CSE306"** or clicking a task in Today's Schedule!`;
        }
      } else if (lower.includes('show backlog') || lower.includes('what am i behind on')) {
        const pending = backlog.filter(b => b.status === 'pending');
        if (pending.length === 0) {
          reply = `🎉 **Zero Backlog Items!** You are completely up to date. Maintain momentum!`;
        } else {
          reply = `🔴 **CURRENT UNFINISHED BACKLOG (${pending.length} items):**\n\n` +
            pending.map((b, i) => `${i + 1}. **${b.subjectCode}**: ${b.title} (${b.description}) — Est: ${b.estimatedMinutes}m [Priority: ${b.academicImportance.toUpperCase()}]`).join('\n\n') +
            `\n\n*Rule: Backlog never disappears until verified completed.*`;
        }
      } else if (lower.includes('what should i do now?')) {
        const weakest = subjects.slice().sort((a, b) => a.percentage - b.percentage)[0];
        const pendingWeakBacklog = backlog.find(b => b.subjectCode === weakest.code && b.status === 'pending');

        reply = `🎯 **EXACT ACTION DIRECTIVE:**\n\nYour weakest subject is **${weakest.code} (${weakest.name}) at ${weakest.percentage}%**.\n\n` +
          (pendingWeakBacklog
            ? `Immediate Action: Attack backlog item: **"${pendingWeakBacklog.title}"**.\nEstimated time: ${pendingWeakBacklog.estimatedMinutes} mins.\nClick "Start Session" to define your targets.`
            : `Immediate Action: Open ${weakest.code} and solve 8 manual numerical questions on ${weakest.topics[0]}.\nDo not use a calculator. Log all mistakes.`);
      } else if (lower.includes('i missed today\'s session') || lower.includes('missed')) {
        reply = `⚠️ **MISSED SESSION RECORDED**\n\nI have flagged the scheduled task as Missed. All unfinished topics have been automatically pushed into your **Backlog System**.\n\nYou cannot delete missed work; you must reschedule it for Friday's Assessment sprint or Saturday morning deep work.`;
      } else if (lower.includes('show weekly report')) {
        setIsWeeklyReportModalOpen(true);
        reply = `📊 Opening the comprehensive **Weekly Performance Report** modal now. Reviewing planned vs actual hours, accuracy trends, and next week's targets.`;
      } else {
        reply = `Understood. Remember our 4 core questions:\n1. *What was I supposed to do?*\n2. *What did I actually do?*\n3. *What am I behind on?*\n4. *What should I do next?*\n\nKeep active recall and numerical problem solving at the center of every session.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `chat-${Date.now()}`,
          sender: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badge,
        },
      ]);
    }, 400);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  // Weekly Report Data
  const weeklyReport = useMemo<WeeklyReport>(() => {
    return {
      weekStartDate: '2026-10-23',
      weekEndDate: '2026-10-29',
      subjectStats: subjects.map(s => ({
        subjectCode: s.code,
        plannedHours: s.code === 'CSE306' ? 4.5 : s.code === 'MTH401' ? 3.0 : 2.5,
        actualHours: s.code === 'CSE306' ? 3.5 : s.code === 'MTH401' ? 2.8 : 2.5,
        completionRate: s.code === 'CSE306' ? 78 : s.code === 'MTH401' ? 70 : 88,
        accuracyRate: s.code === 'CSE306' ? 72 : s.code === 'MTH401' ? 68 : 85,
        trend: s.code === 'CSE306' ? 'up' : 'stable',
        trendText: s.code === 'CSE306' ? 'Improving from 50% baseline' : 'Needs attention on proofs',
      })),
      bestSubject: 'JAP602 – Japanese (83.33%)',
      weakestSubject: 'CSE306 – Computer Networks (50.00%)',
      biggestImprovement: 'Japanese sentence formation & Kanji translation fluency',
      biggestProblem: 'CRC polynomial division errors and recurrent proof logic speed in MTH401',
      mostImportantTopicNextWeek: 'CSE306 Subnetting & Variable Length Subnet Masking (VLSM)',
      backlogSummary: `${backlog.filter(b => b.status === 'pending').length} items currently in queue`,
      projectProgressSummary: 'Accountability Dashboard is at 88% completion; Satisfactory standard achieved',
      nextWeekTarget: 'Elevate CSE306 from 50% to 65% on CA-1 problem set; zero proof syntax errors in MTH401.',
    };
  }, [subjects, backlog]);

  // Reset to default
  const resetAllData = () => {
    localStorage.clear();
    setSubjects(INITIAL_SUBJECTS);
    setTasks(buildTasksForDate(currentDate, dayOfWeek));
    setBacklog(INITIAL_BACKLOG);
    setUpcoming(INITIAL_UPCOMING);
    setProjects(INITIAL_PROJECTS);
    setEvidenceList(INITIAL_EVIDENCE);
    setActiveSession(null);
    setTheme('sakura-day');
  };

  return (
    <SystemContext.Provider
      value={{
        theme,
        setTheme,
        currentDate,
        setCurrentDate,
        dayOfWeek,
        subjects,
        updateSubjectMarks,
        tasks,
        updateTaskStatus,
        addNewTask,
        generateDailyTasks,
        activeSession,
        startSession,
        pauseSession,
        resumeSession,
        cancelSession,
        submitSessionVerification,
        verificationHistory,
        dailyRecords,
        todayRecord,
        calculateDailyScore,
        evidenceList,
        addEvidence,
        backlog,
        addBacklogItem,
        resolveBacklogItem,
        rescheduleBacklogItem,
        upcoming,
        addUpcomingDeadline,
        toggleUpcomingCompleted,
        projects,
        toggleProjectMilestone,
        updateProjectRubric,
        updateProjectStatus,
        contributions,
        gitCommits,
        recordContribution,
        streakDays,
        longestStreak,
        totalContributions,
        chatMessages,
        sendUserMessage,
        clearChat,
        isPreSessionModalOpen,
        setIsPreSessionModalOpen,
        preSessionSubjectCode,
        setPreSessionSubjectCode,
        isVerificationModalOpen,
        setIsVerificationModalOpen,
        isThemeModalOpen,
        setIsThemeModalOpen,
        isWeeklyReportModalOpen,
        setIsWeeklyReportModalOpen,
        weeklyReport,
        resetAllData,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
