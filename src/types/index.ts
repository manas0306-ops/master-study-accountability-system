export type PriorityLevel = 'maintain' | 'improve' | 'high' | 'critical';

export type TaskStatus = 
  | 'not-started' 
  | 'in-progress' 
  | 'completed' 
  | 'missed' 
  | 'partially-completed' 
  | 'carried-forward';

export type MasteryLevel = 'started' | 'studied' | 'practiced' | 'mastered';

export type ProjectStandard = 'needs-work' | 'satisfactory' | 'excellent';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Subject {
  id: string;
  code: string;
  name: string;
  currentMarks: number;
  totalMarks: number;
  percentage: number;
  priority: PriorityLevel;
  topics: string[];
  color: string;
  units: string;
  accentBg: string;
}

export interface TimetableSlot {
  id: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  subjectCode: string;
  title: string;
  focusTopics: string[];
  requiredOutcome: string[];
  unit: string;
}

export interface ScheduledTask {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  subjectCode: string;
  taskTitle: string;
  focusTopics: string[];
  requiredOutcome: string[];
  priority: PriorityLevel;
  status: TaskStatus;
  plannedQuestions?: number;
  completedQuestions?: number;
  accuracy?: number;
  notes?: string;
  completedAt?: string;
}

export interface SessionVerification {
  id: string;
  taskId?: string;
  subjectCode: string;
  targetDescription: string;
  completedWork: string;
  plannedAmount: number;
  completedAmount: number;
  questionsSolvedDetails: string;
  mistakesMade: string;
  unfinishedWork: string;
  confidenceLevel: number; // 1-10
  evidenceUrlOrText?: string;
  completionPercentage: number;
  accuracyPercentage: number;
  masteryLevel: MasteryLevel;
  timestamp: string;
  durationMinutes: number;
}

export interface SubjectDailyStats {
  planned: string;
  actual: string;
  completionRate: number;
  accuracyRate: number;
  topicsCovered: string[];
  mistakesLogged: string[];
  confidence: number;
  artifactsCreated?: string;
  sentencesPracticed?: number;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  subjects: Record<string, SubjectDailyStats>;
  dailyScore: number;
  scoreClassification: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  scoreExplanation: string;
  verdict: 'excellent' | 'good' | 'average' | 'poor';
  verdictNote: string;
  totalPlannedTimeMinutes: number;
  totalActualTimeMinutes: number;
  completedTasks: string[];
  partiallyCompletedTasks: string[];
  missedTasks: string[];
  evidenceIds: string[];
}

export interface EvidenceItem {
  id: string;
  date: string; // YYYY-MM-DD
  subjectOrProject: string;
  title: string;
  type: 
    | 'screenshot' 
    | 'code' 
    | 'solved-questions' 
    | 'notes' 
    | 'diagram' 
    | 'simulator-output' 
    | 'wireframe' 
    | 'github-commit' 
    | 'sentence-practice' 
    | 'quiz-score' 
    | 'assignment';
  evidenceContent: string;
  result: string;
  verified: boolean;
  timestamp: string;
}

export interface BacklogItem {
  id: string;
  dateAdded: string;
  subjectCode: string;
  title: string;
  description: string;
  priorityRank: number; // 1 to 5 (1 highest)
  academicImportance: 'critical' | 'high' | 'medium';
  deadline?: string;
  estimatedMinutes: number;
  status: 'pending' | 'scheduled' | 'completed';
  scheduledDate?: string;
}

export interface UpcomingDeadline {
  id: string;
  title: string;
  subjectOrProject: string;
  type: 
    | 'assignment' 
    | 'ca' 
    | 'mte' 
    | 'exam' 
    | 'project-deadline' 
    | 'submission' 
    | 'viva' 
    | 'presentation' 
    | 'lab' 
    | 'quiz';
  deadlineDate: string; // YYYY-MM-DD
  priority: PriorityLevel;
  notes?: string;
  isCompleted: boolean;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string;
}

export interface ProjectRubricScore {
  functionality: number; // 0-10
  codeQuality: number; // 0-10
  uiUx: number; // 0-10
  documentation: number; // 0-10
  testing: number; // 0-10
  deployment: number; // 0-10
  originality: number; // 0-10
  presentation: number; // 0-10
  errorHandling: number; // 0-10
  realWorldUsefulness: number; // 0-10
}

export interface Project {
  id: string;
  title: string;
  objective: string;
  deadline: string;
  currentPhase: string;
  completionPercentage: number;
  milestones: ProjectMilestone[];
  rubricScores: ProjectRubricScore;
  qualityScore: number;
  standard: ProjectStandard;
  githubUrl?: string;
  demoUrl?: string;
  lastUpdated: string;
}

export interface ContributionEntry {
  id: string;
  date: string; // YYYY-MM-DD
  type: 'study-session' | 'git-commit' | 'evidence' | 'project-milestone' | 'task-completed';
  title: string;
  description?: string;
  commitHash?: string;
  points: number; // contribution weight (1-5)
  timestamp: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  mode: 'day' | 'night';
  description: string;
  emoji: string;
  tagline: string;
  previewColors: {
    base: string;
    surface: string;
    accent: string;
    text: string;
  };
}

export interface WeeklyReport {
  weekStartDate: string;
  weekEndDate: string;
  subjectStats: {
    subjectCode: string;
    plannedHours: number;
    actualHours: number;
    completionRate: number;
    accuracyRate: number;
    trend: 'up' | 'down' | 'stable';
    trendText: string;
  }[];
  bestSubject: string;
  weakestSubject: string;
  biggestImprovement: string;
  biggestProblem: string;
  mostImportantTopicNextWeek: string;
  backlogSummary: string;
  projectProgressSummary: string;
  nextWeekTarget: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  badge?: string;
  actionPayload?: {
    type: 'START_PLAN' | 'START_SESSION' | 'SHOW_RECORD' | 'SHOW_BACKLOG' | 'SHOW_UPCOMING';
    target?: string;
  };
}
