import React, { useState, useEffect } from 'react';
import { 
  X, 
  Target, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const PreSessionModal: React.FC = () => {
  const { 
    isPreSessionModalOpen, 
    setIsPreSessionModalOpen, 
    preSessionSubjectCode, 
    subjects,
    startSession 
  } = useSystem();

  const [selectedSubject, setSelectedSubject] = useState<string>('CSE306');
  const [targetDescription, setTargetDescription] = useState<string>('');
  const [plannedAmount, setPlannedAmount] = useState<number>(8);
  const [errorMsg, setErrorMsg] = useState<string>('');

  useEffect(() => {
    if (preSessionSubjectCode) {
      setSelectedSubject(preSessionSubjectCode);
    }
  }, [preSessionSubjectCode]);

  if (!isPreSessionModalOpen) return null;

  const currentSubjectObj = subjects.find(s => s.code === selectedSubject) || subjects[0];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = targetDescription.trim().toLowerCase();

    // Strict validation: forbid passive claims like "just reading", "studied", "learning"
    if (trimmed.length < 8) {
      setErrorMsg('Target description is too short. State the exact problem set or exercise.');
      return;
    }
    if (trimmed === 'studied' || trimmed === 'reading' || trimmed === 'learn theory') {
      setErrorMsg('❌ Vague intent rejected. Accountability rule: state measurable problem count (e.g., "Solve 8 CRC exercises manually").');
      return;
    }
    if (plannedAmount <= 0) {
      setErrorMsg('Please specify a positive target quantity.');
      return;
    }

    setErrorMsg('');
    startSession(
      selectedSubject,
      `Session: ${selectedSubject} Target Practice`,
      targetDescription,
      plannedAmount
    );
    setIsPreSessionModalOpen(false);
    setTargetDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-3xl bg-theme-surface border border-theme-border shadow-cute-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-theme-border bg-theme-elevated/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-theme-accent/15 text-theme-accent">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-theme-primary">
                6. Pre-Session Target Contract
              </h2>
              <p className="text-xs text-theme-subtle">
                Define measurable output before starting. Passive reading is prohibited.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPreSessionModalOpen(false)}
            className="p-1.5 rounded-xl text-theme-subtle hover:text-theme-primary hover:bg-theme-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleStart} className="p-6 space-y-4">
          
          {/* Subject Picker */}
          <div>
            <label className="text-xs font-bold text-theme-secondary block mb-1.5">
              Subject Focus
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-theme-elevated border border-theme-border text-sm font-bold text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
            >
              {subjects.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.code} – {s.name} ({s.priority.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Context pill */}
          <div className="p-3 rounded-xl bg-theme-elevated/70 border border-theme-border text-xs text-theme-secondary flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-theme-accent shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-theme-primary">Key Topics for {currentSubjectObj.code}: </span>
              <span className="text-theme-subtle">{currentSubjectObj.topics.slice(0, 4).join(', ')}.</span>
            </div>
          </div>

          {/* Target Description */}
          <div>
            <label className="text-xs font-bold text-theme-secondary block mb-1.5">
              What specific output will you produce?
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Solve 10 CRC polynomial division problems manually and record mistakes into the log."
              value={targetDescription}
              onChange={(e) => setTargetDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-primary placeholder:text-theme-subtle focus:outline-none focus:ring-2 focus:ring-theme-accent leading-relaxed"
              required
            />
          </div>

          {/* Planned Quantity */}
          <div>
            <label className="text-xs font-bold text-theme-secondary block mb-1.5">
              Target Quantity (Problems / Exercises / Sentences)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={plannedAmount}
              onChange={(e) => setPlannedAmount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 rounded-xl bg-theme-elevated border border-theme-border text-sm font-mono text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
              required
            />
          </div>

          {/* Measurable examples box */}
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 space-y-1">
            <div className="font-bold flex items-center space-x-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Measurable Contract Rule:</span>
            </div>
            <p>❌ <em>"I studied Computer Networks."</em></p>
            <p>✅ <em>"I solved 10 CRC problems and checked binary remainders manually."</em></p>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-600 dark:text-rose-400 font-semibold flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setIsPreSessionModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-theme-subtle hover:bg-theme-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition flex items-center space-x-2 shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Commit & Start Session</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
