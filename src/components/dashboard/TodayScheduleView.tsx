import React, { useState } from 'react';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Info
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { ScheduledTask, TaskStatus } from '../../types';

export const TodayScheduleView: React.FC = () => {
  const { 
    tasks, 
    updateTaskStatus, 
    currentDate, 
    dayOfWeek, 
    setPreSessionSubjectCode, 
    setIsPreSessionModalOpen,
    addNewTask,
    startSession
  } = useSystem();

  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);

  // New task form state
  const [newSubjectCode, setNewSubjectCode] = useState('CSE306');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newStartTime, setNewStartTime] = useState('21:00');
  const [newEndTime, setNewEndTime] = useState('22:30');
  const [newFocusTopics, setNewFocusTopics] = useState('');

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'not-started':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-theme-muted text-theme-subtle border border-theme-border">
            <span>⬜ Not Started</span>
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 animate-pulse">
            <span>🟡 In Progress</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <span>🟢 Completed</span>
          </span>
        );
      case 'missed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <span>🔴 Missed</span>
          </span>
        );
      case 'partially-completed':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            <span>🔵 Partially Completed</span>
          </span>
        );
      case 'carried-forward':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
            <span>⏳ Carried Forward</span>
          </span>
        );
    }
  };

  const handleStartTask = (task: ScheduledTask) => {
    setPreSessionSubjectCode(task.subjectCode);
    setIsPreSessionModalOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    addNewTask({
      startTime: newStartTime,
      endTime: newEndTime,
      subjectCode: newSubjectCode,
      taskTitle: newTaskTitle,
      focusTopics: newFocusTopics.split(',').map(s => s.trim()).filter(Boolean),
      requiredOutcome: ['Master topic theory', 'Solve problems without solutions', 'Record mistake log'],
      priority: newSubjectCode === 'CSE306' ? 'critical' : 'high',
      status: 'not-started',
      plannedQuestions: 8,
      completedQuestions: 0,
    });

    setIsAddingTask(false);
    setNewTaskTitle('');
    setNewFocusTopics('');
  };

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarDays className="w-5 h-5 text-theme-accent" />
            <h2 className="text-lg font-extrabold text-theme-primary">
              2. Today's Timetable & Schedule Tracker
            </h2>
          </div>
          <p className="text-xs text-theme-subtle mt-1 flex items-center space-x-2">
            <span className="capitalize font-bold text-theme-secondary">{dayOfWeek}</span>
            <span>•</span>
            <span>{currentDate}</span>
            <span>•</span>
            <span className="text-theme-accent font-semibold">Strict Accountability Enforcement</span>
          </p>
        </div>

        <button
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="px-3 py-1.5 rounded-xl bg-theme-elevated hover:bg-theme-muted border border-theme-border text-xs font-bold text-theme-secondary flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4 text-theme-accent" />
          <span>Add Custom Task</span>
        </button>
      </div>

      {/* Add Task Form */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="p-4 rounded-2xl bg-theme-elevated border border-theme-accent/30 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-theme-primary">Create New Study Task</h4>
            <span className="text-[11px] text-theme-subtle">Will be bound to today's schedule</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Subject</label>
              <select
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-bold text-theme-primary"
              >
                <option value="CSE306">CSE306 - Networks (Critical)</option>
                <option value="MTH401">MTH401 - Discrete Maths (High)</option>
                <option value="CSE423">CSE423 - Cloud Computing</option>
                <option value="INT335">INT335 - Design Thinking</option>
                <option value="JAP602">JAP602 - Japanese</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Task Title</label>
              <input
                type="text"
                placeholder="e.g., CRC Polynomial Division Exercises"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Time Slot</label>
              <div className="flex space-x-1">
                <input
                  type="text"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-center font-mono"
                />
                <span className="self-center text-xs text-theme-subtle">-</span>
                <input
                  type="text"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-1/2 px-2 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-center font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-theme-secondary block mb-1">Focus Topics (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., Error Control, CRC-16, Parity check"
              value={newFocusTopics}
              onChange={(e) => setNewFocusTopics(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-theme-subtle hover:bg-theme-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition shadow-sm"
            >
              Add to Schedule
            </button>
          </div>
        </form>
      )}

      {/* Tasks Table / List */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const isExpanded = expandedTaskId === task.id;
          const isCompleted = task.status === 'completed';

          return (
            <div
              key={task.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isCompleted
                  ? 'bg-theme-surface border-emerald-500/30'
                  : task.status === 'in-progress'
                  ? 'bg-amber-500/5 border-amber-500/40 ring-1 ring-amber-500/30'
                  : 'bg-theme-elevated/40 border-theme-border hover:border-theme-accent/40'
              }`}
            >
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Time & Subject */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-theme-muted text-theme-primary font-mono text-xs font-bold flex flex-col items-center justify-center min-w-[70px] border border-theme-border/50">
                    <Clock className="w-3.5 h-3.5 mb-1 text-theme-accent" />
                    <span>{task.startTime}</span>
                    <span className="text-[10px] text-theme-subtle">{task.endTime}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-theme-accent/15 text-theme-accent font-mono text-[11px] font-black uppercase">
                        {task.subjectCode}
                      </span>
                      <h3 className={`text-sm font-extrabold ${isCompleted ? 'line-through text-theme-subtle' : 'text-theme-primary'}`}>
                        {task.taskTitle}
                      </h3>
                    </div>

                    <p className="text-xs text-theme-secondary line-clamp-1">
                      {task.focusTopics.join(' • ')}
                    </p>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                    className="text-xs font-bold px-2.5 py-1.5 rounded-xl bg-theme-surface border border-theme-border text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent"
                  >
                    <option value="not-started">⬜ Not Started</option>
                    <option value="in-progress">🟡 In Progress</option>
                    <option value="completed">🟢 Completed</option>
                    <option value="missed">🔴 Missed</option>
                    <option value="partially-completed">🔵 Partially Completed</option>
                    <option value="carried-forward">⏳ Carried Forward</option>
                  </select>

                  {/* Start Button */}
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => handleStartTask(task)}
                      className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition flex items-center space-x-1 shadow-sm"
                    >
                      <Play className="w-3 h-3 fill-white" />
                      <span className="hidden sm:inline">Start</span>
                    </button>
                  )}

                  {/* Expand / Collapse Details */}
                  <button
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                    className="p-1.5 rounded-xl text-theme-subtle hover:text-theme-primary hover:bg-theme-muted transition"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-4 pt-2 border-t border-theme-border/50 bg-theme-surface/60 text-xs space-y-3">
                  <div>
                    <h4 className="font-bold text-theme-secondary mb-1">Required Measurable Outcomes:</h4>
                    <ul className="list-disc list-inside space-y-1 text-theme-subtle">
                      {task.requiredOutcome.map((out, i) => (
                        <li key={i}>{out}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-theme-elevated/70 border border-theme-border flex items-center space-x-2 text-[11px] text-theme-secondary">
                    <Info className="w-4 h-4 text-theme-accent shrink-0" />
                    <span>
                      Accountability Rule: You cannot mark complete without providing solved questions count, mistakes log, and accuracy proof.
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
