import React, { useState } from 'react';
import { 
  GitCommit, 
  GitBranch, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  Copy, 
  Check, 
  Terminal,
  Layers
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const CommitHistoryFeed: React.FC = () => {
  const { gitCommits, recordContribution, currentDate } = useSystem();
  const [commitsList, setCommitsList] = useState(gitCommits);
  const [isAddingCommit, setIsAddingCommit] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [customCategory, setCustomCategory] = useState('Feature');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  const handleSimulateCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg) return;

    const randomHash = Math.random().toString(16).substring(2, 9);
    const newCommit = {
      hash: randomHash,
      message: customMsg,
      date: currentDate,
      author: 'Accountability Engineer',
      category: customCategory,
      points: 4,
    };

    setCommitsList([newCommit, ...commitsList]);
    recordContribution('git-commit', customMsg, 4, randomHash);

    setIsAddingCommit(false);
    setCustomMsg('');
  };

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <GitCommit className="w-5 h-5 text-theme-accent" />
            <h2 className="text-lg font-extrabold text-theme-primary">
              Repository Commits & Contribution Feed
            </h2>
          </div>
          <p className="text-xs text-theme-subtle mt-1">
            "Every commit made, even the smallest, is marked as a contribution and added to your calendar."
          </p>
        </div>

        <button
          onClick={() => setIsAddingCommit(!isAddingCommit)}
          className="px-3 py-1.5 rounded-xl bg-theme-elevated hover:bg-theme-muted border border-theme-border text-xs font-bold text-theme-secondary flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4 text-theme-accent" />
          <span>Record Atomic Commit</span>
        </button>
      </div>

      {/* Add Custom Commit Modal/Form */}
      {isAddingCommit && (
        <form onSubmit={handleSimulateCommit} className="p-4 rounded-2xl bg-theme-elevated border border-theme-accent/30 space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">
                Commit Message (Conventional format)
              </label>
              <input
                type="text"
                placeholder="e.g., feat(networks): add CRC polynomial remainder manual solver test"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">
                Category
              </label>
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-bold text-theme-primary"
              >
                <option value="Core Logic">Core Logic</option>
                <option value="UI/UX Polish">UI/UX Polish</option>
                <option value="Architecture">Architecture</option>
                <option value="Accountability">Accountability Engine</option>
                <option value="Testing">Unit Testing</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingCommit(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-theme-subtle hover:bg-theme-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition shadow-sm"
            >
              Push & Record to Calendar
            </button>
          </div>
        </form>
      )}

      {/* Commit List Feed */}
      <div className="space-y-3">
        {commitsList.map((c) => (
          <div
            key={c.hash}
            className="p-4 rounded-2xl bg-theme-elevated/40 border border-theme-border hover:border-theme-accent/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-theme-accent/10 text-theme-accent font-mono text-xs font-extrabold flex items-center justify-center shrink-0 border border-theme-accent/20">
                <GitCommit className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-xs font-bold text-theme-accent">
                    {c.hash}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-theme-muted text-theme-subtle text-[10px] font-bold uppercase">
                    {c.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                    +{c.points} Contrib Points
                  </span>
                </div>

                <p className="text-xs font-extrabold text-theme-primary">
                  {c.message}
                </p>

                <p className="text-[11px] text-theme-subtle mt-0.5">
                  Author: <span className="font-semibold text-theme-secondary">{c.author}</span> • Committed on {c.date}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
              <button
                onClick={() => handleCopy(c.hash)}
                className="px-2.5 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-muted border border-theme-border text-theme-subtle hover:text-theme-primary text-xs font-mono font-bold flex items-center space-x-1.5 transition"
                title="Copy commit hash"
              >
                {copiedHash === c.hash ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{c.hash}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
