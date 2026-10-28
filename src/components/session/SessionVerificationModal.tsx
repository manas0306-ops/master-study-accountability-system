import React, { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Flame, 
  FileText, 
  Star, 
  Link as LinkIcon,
  ShieldCheck
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { MasteryLevel } from '../../types';

export const SessionVerificationModal: React.FC = () => {
  const { 
    activeSession, 
    isVerificationModalOpen, 
    setIsVerificationModalOpen, 
    submitSessionVerification 
  } = useSystem();

  const [completedWork, setCompletedWork] = useState('');
  const [completedAmount, setCompletedAmount] = useState<number>(8);
  const [correctAmount, setCorrectAmount] = useState<number>(6);
  const [questionsSolvedDetails, setQuestionsSolvedDetails] = useState('');
  const [mistakesMade, setMistakesMade] = useState('');
  const [unfinishedWork, setUnfinishedWork] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState<number>(7);
  const [evidenceUrlOrText, setEvidenceUrlOrText] = useState('');
  const [masteryLevel, setMasteryLevel] = useState<MasteryLevel>('practiced');

  useEffect(() => {
    if (activeSession) {
      setCompletedAmount(activeSession.plannedAmount);
      setCorrectAmount(Math.max(1, Math.round(activeSession.plannedAmount * 0.8)));
    }
  }, [activeSession]);

  if (!isVerificationModalOpen || !activeSession) return null;

  const planned = activeSession.plannedAmount || 1;
  const completionPct = Math.min(100, Math.round((completedAmount / planned) * 100));
  const accuracyPct = completedAmount > 0 ? Math.min(100, Math.round((correctAmount / completedAmount) * 100)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitSessionVerification({
      taskId: activeSession.taskId,
      subjectCode: activeSession.subjectCode,
      targetDescription: activeSession.targetDescription,
      completedWork,
      plannedAmount: planned,
      completedAmount,
      questionsSolvedDetails,
      mistakesMade,
      unfinishedWork,
      confidenceLevel,
      evidenceUrlOrText,
      completionPercentage: completionPct,
      accuracyPercentage: accuracyPct,
      masteryLevel,
      durationMinutes: Math.max(1, Math.round(activeSession.elapsedSeconds / 60)),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-theme-surface border border-theme-border shadow-cute-lg overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-theme-border bg-theme-elevated/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-theme-primary">
                7. Session Completion Verification Protocol
              </h2>
              <p className="text-xs text-theme-subtle">
                Subject: <span className="font-bold text-theme-accent">{activeSession.subjectCode}</span> • Target: {activeSession.targetDescription}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsVerificationModalOpen(false)}
            className="p-1.5 rounded-xl text-theme-subtle hover:text-theme-primary hover:bg-theme-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">

          {/* Real-time Math Verification Pill */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-theme-elevated/80 border border-theme-border text-center">
            <div>
              <span className="text-[10px] font-bold text-theme-subtle uppercase">Planned</span>
              <p className="font-mono text-base font-extrabold text-theme-primary">{planned}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-theme-subtle uppercase">Completed</span>
              <p className="font-mono text-base font-extrabold text-theme-primary">{completedAmount}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-theme-subtle uppercase">Completion %</span>
              <p className={`font-mono text-base font-extrabold ${completionPct >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>
                {completionPct}%
              </p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-theme-subtle uppercase">Accuracy %</span>
              <p className={`font-mono text-base font-extrabold ${accuracyPct >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {accuracyPct}%
              </p>
            </div>
          </div>

          {/* 1. What did you complete? */}
          <div>
            <label className="text-xs font-bold text-theme-secondary block mb-1">
              1. What did you complete?
            </label>
            <textarea
              rows={2}
              placeholder="e.g., Solved 8 CRC-16 polynomial division problems manually and cross-checked remainders."
              value={completedWork}
              onChange={(e) => setCompletedWork(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-primary focus:outline-none focus:ring-2 focus:ring-theme-accent"
              required
            />
          </div>

          {/* 2. Numerical amounts: Completed vs Correct */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-theme-secondary block mb-1">
                2a. Problems Completed (out of {planned} planned)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={completedAmount}
                onChange={(e) => setCompletedAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs font-mono text-theme-primary"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-theme-secondary block mb-1">
                2b. Correct / Accurate Solutions
              </label>
              <input
                type="number"
                min={0}
                max={completedAmount}
                value={correctAmount}
                onChange={(e) => setCorrectAmount(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs font-mono text-theme-primary"
                required
              />
            </div>
          </div>

          {/* 3. Questions / Problems solved */}
          <div>
            <label className="text-xs font-bold text-theme-secondary block mb-1">
              3. What questions / problems did you solve?
            </label>
            <input
              type="text"
              placeholder="e.g., CRC-CCITT divisor x^16 + x^12 + x^5 + 1 with dataword 1101011"
              value={questionsSolvedDetails}
              onChange={(e) => setQuestionsSolvedDetails(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-primary"
            />
          </div>

          {/* 4. Mistakes Made */}
          <div>
            <label className="text-xs font-bold text-theme-secondary block mb-1 flex items-center space-x-1">
              <span className="text-rose-500">4. What mistakes did you make?</span>
              <span className="text-[10px] text-theme-subtle font-normal">(Recorded directly to Mistake Log)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Made XOR subtraction error on line 4 of problem 3"
              value={mistakesMade}
              onChange={(e) => setMistakesMade(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-primary"
            />
          </div>

          {/* 5. What remains unfinished? */}
          <div>
            <label className="text-xs font-bold text-theme-secondary block mb-1 flex items-center space-x-1">
              <span className="text-amber-500">5. What remains unfinished?</span>
              <span className="text-[10px] text-theme-subtle font-normal">(Auto-transferred to Backlog)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 2 Subnetting questions with variable length mask remaining"
              value={unfinishedWork}
              onChange={(e) => setUnfinishedWork(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-primary"
            />
          </div>

          {/* 6. Confidence Level & Mastery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-theme-secondary block mb-1">
                6. Confidence Level: {confidenceLevel} / 10
              </label>
              <input
                type="range"
                min={1}
                max={10}
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(parseInt(e.target.value))}
                className="w-full accent-theme-accent cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-theme-subtle mt-0.5">
                <span>1 (Clueless)</span>
                <span>5 (Shaky)</span>
                <span>10 (Absolute Mastery)</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-theme-secondary block mb-1">
                Mastery Level Classification
              </label>
              <select
                value={masteryLevel}
                onChange={(e) => setMasteryLevel(e.target.value as MasteryLevel)}
                className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs font-bold text-theme-primary"
              >
                <option value="started">🟡 Started (Began learning)</option>
                <option value="studied">🔵 Studied (Understands theory)</option>
                <option value="practiced">🟠 Practiced (Solved exercises)</option>
                <option value="mastered">🟢 Mastered (Can explain & solve independently)</option>
              </select>
            </div>
          </div>

          {/* 7. Evidence */}
          <div>
            <label className="text-xs font-bold text-theme-secondary block mb-1 flex items-center space-x-1">
              <LinkIcon className="w-3 h-3 text-theme-accent" />
              <span>7. Evidence / Output (Screenshot, Notes Link, Git Commit, Code)</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Solved worksheet photo uploaded / Git commit hash / Notion notes URL"
              value={evidenceUrlOrText}
              onChange={(e) => setEvidenceUrlOrText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-primary"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-theme-border">
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-theme-subtle hover:bg-theme-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition flex items-center space-x-2 shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Record Verified Progress</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
