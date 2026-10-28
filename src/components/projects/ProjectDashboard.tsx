import React, { useState } from 'react';
import { 
  FolderGit2, 
  CheckCircle2, 
  Circle, 
  ExternalLink, 
  GitBranch, 
  Award, 
  Sparkles, 
  Sliders, 
  ChevronDown, 
  ChevronUp,
  ShieldCheck
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { Project, ProjectMilestone, ProjectStandard } from '../../types';

export const ProjectDashboard: React.FC = () => {
  const { projects, toggleProjectMilestone, updateProjectRubric, updateProjectStatus } = useSystem();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || 'proj-1');
  const [isRubricExpanded, setIsRubricExpanded] = useState<boolean>(false);

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  if (!activeProject) return null;

  const rubricCriteria = [
    { key: 'functionality', label: 'Core Functionality', desc: 'All functional capabilities work without breaking' },
    { key: 'codeQuality', label: 'Code Quality & Clean Architecture', desc: 'Type safety, separation of concerns, modularity' },
    { key: 'uiUx', label: 'UI/UX & Aesthetic Polish', desc: 'Delightful themes, responsive design, typography' },
    { key: 'documentation', label: 'Documentation & README', desc: 'Architecture specs, usage instructions, clear API notes' },
    { key: 'testing', label: 'Testing & Verification', desc: 'Unit tests, edge cases, formula verification' },
    { key: 'deployment', label: 'Deployment & Build Readiness', desc: 'Optimized production build, zero warnings' },
    { key: 'originality', label: 'Originality & Innovation', desc: 'Novel accountability model & interactive features' },
    { key: 'presentation', label: 'Presentation & Demo Flow', desc: 'Polished demo, intuitive interactions' },
    { key: 'errorHandling', label: 'Error Handling & Resilience', desc: 'Validation feedback, fallback state handling' },
    { key: 'realWorldUsefulness', label: 'Real-World Practical Utility', desc: 'Actually keeps academic progress disciplined' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <FolderGit2 className="w-5 h-5 text-theme-accent" />
            <h2 className="text-lg font-extrabold text-theme-primary">
              13. Project Management & Excellence Standard
            </h2>
          </div>
          <p className="text-xs text-theme-subtle mt-1">
            Track milestones, code standards, and verify against the Satisfactory vs Excellent rubric.
          </p>
        </div>

        {/* Project Selector tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-1 sm:pb-0">
          {projects.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedProjectId === p.id
                  ? 'bg-theme-accent text-white shadow-sm'
                  : 'bg-theme-elevated text-theme-secondary hover:bg-theme-muted'
              }`}
            >
              {p.title.split(' ')[0]} {p.title.split(' ')[1]}...
            </button>
          ))}
        </div>
      </div>

      {/* Project Card Banner */}
      <div className="p-6 rounded-2xl bg-theme-elevated/70 border border-theme-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-theme-accent/15 text-theme-accent font-mono text-xs font-black uppercase">
              Phase: {activeProject.currentPhase}
            </span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase ${
              activeProject.standard === 'excellent'
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
            }`}>
              {activeProject.standard === 'excellent' ? '🏆 Excellent Standard' : '🟡 Satisfactory'}
            </span>
          </div>

          <h3 className="text-xl font-extrabold text-theme-primary">
            {activeProject.title}
          </h3>

          <p className="text-xs text-theme-secondary leading-relaxed">
            {activeProject.objective}
          </p>

          <div className="flex items-center space-x-4 text-xs text-theme-subtle pt-1">
            <span>Deadline: <strong className="text-theme-primary font-mono">{activeProject.deadline}</strong></span>
            <span>•</span>
            <span>Last Updated: <strong className="text-theme-primary font-mono">{activeProject.lastUpdated}</strong></span>
          </div>
        </div>

        {/* Quality Score Badge & Progress */}
        <div className="flex items-center space-x-5 self-stretch lg:self-auto justify-between lg:justify-end">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-theme-accent to-indigo-500 flex flex-col items-center justify-center text-white font-black shadow-cute">
              <span className="text-2xl">{activeProject.qualityScore}</span>
              <span className="text-[10px] uppercase font-bold opacity-80">Score /100</span>
            </div>
            <span className="text-[10px] font-bold text-theme-subtle block mt-1">
              Quality Rating
            </span>
          </div>

          <div className="w-36 space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-theme-secondary">Completion</span>
              <span className="text-theme-accent font-mono">{activeProject.completionPercentage}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-theme-muted overflow-hidden">
              <div 
                className="h-full rounded-full bg-theme-accent transition-all duration-500" 
                style={{ width: `${activeProject.completionPercentage}%` }}
              />
            </div>
            <span className="text-[10px] text-theme-subtle block text-right">
              {activeProject.milestones.filter(m => m.completed).length} / {activeProject.milestones.length} milestones
            </span>
          </div>
        </div>
      </div>

      {/* 11 Milestones Checklist */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-theme-secondary">
            11 Standard Project Milestones
          </h4>
          <span className="text-[11px] text-theme-subtle">
            Click to toggle milestone completion
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {activeProject.milestones.map((m) => {
            return (
              <button
                key={m.id}
                onClick={() => toggleProjectMilestone(activeProject.id, m.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 flex items-start space-x-3 group ${
                  m.completed
                    ? 'bg-emerald-500/5 border-emerald-500/30'
                    : 'bg-theme-elevated/40 border-theme-border hover:border-theme-accent/40'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {m.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="w-4 h-4 text-theme-subtle group-hover:text-theme-accent" />
                  )}
                </div>

                <div className="min-w-0">
                  <h5 className={`text-xs font-extrabold leading-tight ${m.completed ? 'text-theme-primary' : 'text-theme-secondary'}`}>
                    {m.title}
                  </h5>
                  <p className="text-[11px] text-theme-subtle mt-0.5 line-clamp-1">
                    {m.description}
                  </p>
                  {m.completedAt && (
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 block mt-1">
                      ✓ Done on {m.completedAt}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Project Quality Rubric Accordion */}
      <div className="rounded-2xl border border-theme-border bg-theme-elevated/30 overflow-hidden">
        <button
          onClick={() => setIsRubricExpanded(!isRubricExpanded)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-theme-elevated/60 transition text-left"
        >
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-4 h-4 text-theme-accent" />
            <span className="text-xs font-extrabold text-theme-primary">
              14. Satisfactory vs Excellent Rubric Matrix (10 Criteria Evaluation)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold text-theme-accent">
              Total Score: {activeProject.qualityScore}/100
            </span>
            {isRubricExpanded ? <ChevronUp className="w-4 h-4 text-theme-subtle" /> : <ChevronDown className="w-4 h-4 text-theme-subtle" />}
          </div>
        </button>

        {isRubricExpanded && (
          <div className="p-5 border-t border-theme-border/60 space-y-3 animate-fade-in bg-theme-surface/70">
            <p className="text-xs text-theme-subtle mb-4">
              Never mark a project complete just because code runs. Evaluate all 10 dimensions:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rubricCriteria.map((c) => {
                const currentVal = (activeProject.rubricScores as any)[c.key] || 8;

                return (
                  <div key={c.key} className="p-3.5 rounded-xl bg-theme-elevated/60 border border-theme-border space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-theme-primary">{c.label}</span>
                      <span className="font-mono text-theme-accent">{currentVal} / 10</span>
                    </div>
                    <p className="text-[11px] text-theme-subtle">{c.desc}</p>
                    <input
                      type="range"
                      min={0}
                      max={10}
                      value={currentVal}
                      onChange={(e) => updateProjectRubric(activeProject.id, c.key, parseInt(e.target.value))}
                      className="w-full accent-theme-accent cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
