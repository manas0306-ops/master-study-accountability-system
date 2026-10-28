import React, { useState } from 'react';
import { 
  FolderArchive, 
  FileCheck2, 
  Plus, 
  CheckCircle2, 
  ExternalLink, 
  Code, 
  Image, 
  FileText, 
  GitCommit, 
  Sparkles,
  Search
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { EvidenceItem } from '../../types';

export const EvidenceLogView: React.FC = () => {
  const { evidenceList, addEvidence, currentDate } = useSystem();
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [subjectOrProject, setSubjectOrProject] = useState('CSE306 Computer Networks');
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EvidenceItem['type']>('solved-questions');
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');

  const filtered = evidenceList.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.subjectOrProject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    addEvidence({
      date: currentDate,
      subjectOrProject,
      title,
      type,
      evidenceContent: content,
      result: result || 'Verified manual problem output without external solution keys.',
      verified: true,
    });

    setIsAdding(false);
    setTitle('');
    setContent('');
    setResult('');
  };

  const getTypeIcon = (evType: EvidenceItem['type']) => {
    switch (evType) {
      case 'github-commit':
        return <GitCommit className="w-4 h-4 text-purple-500" />;
      case 'code':
        return <Code className="w-4 h-4 text-blue-500" />;
      case 'screenshot':
      case 'diagram':
      case 'wireframe':
        return <Image className="w-4 h-4 text-emerald-500" />;
      default:
        return <FileText className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <FolderArchive className="w-5 h-5 text-theme-accent" />
            <h2 className="text-lg font-extrabold text-theme-primary">
              10. Verifiable Evidence Log Repository
            </h2>
          </div>
          <p className="text-xs text-theme-subtle mt-1">
            Never falsely claim completion without tangible proof. Screenshots, Git commits, worksheets & diagrams.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-theme-subtle" />
            <input
              type="text"
              placeholder="Search evidence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-theme-elevated border border-theme-border text-xs text-theme-primary focus:outline-none focus:ring-1 focus:ring-theme-accent w-44"
            />
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold flex items-center space-x-1.5 transition shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Evidence</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-theme-elevated border border-theme-accent/30 space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Subject / Project</label>
              <input
                type="text"
                placeholder="e.g., CSE306 or Master Accountability"
                value={subjectOrProject}
                onChange={(e) => setSubjectOrProject(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Evidence Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs font-bold text-theme-primary"
              >
                <option value="solved-questions">Solved Numerical Worksheet</option>
                <option value="github-commit">Git Commit & Code Push</option>
                <option value="screenshot">Simulator / Terminal Screenshot</option>
                <option value="wireframe">Figma / Design Wireframe</option>
                <option value="sentence-practice">Japanese Sentence Drill</option>
                <option value="notes">Structured Proof Notes</option>
                <option value="quiz-score">Quiz / Test Result</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-theme-secondary block mb-1">Evidence Title</label>
              <input
                type="text"
                placeholder="e.g., 8 CRC-16 Polynomial Division Solutions"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-theme-secondary block mb-1">Evidence Details / URL / Raw Log</label>
            <textarea
              rows={2}
              placeholder="e.g., Paper solved calculations uploaded, CRC divisor x^4+x+1 with remainder 001. No external help."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
              required
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-theme-secondary block mb-1">Verification Result & Accuracy</label>
            <input
              type="text"
              placeholder="e.g., 7 out of 8 problems correct (87.5% accuracy)"
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme-border text-xs text-theme-primary"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-theme-subtle hover:bg-theme-muted transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition shadow-sm"
            >
              Submit Evidence Record
            </button>
          </div>
        </form>
      )}

      {/* Evidence Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-theme-border/80 text-theme-subtle uppercase text-[10px] font-black tracking-wider">
              <th className="py-3 px-3">Date</th>
              <th className="py-3 px-3">Subject / Project</th>
              <th className="py-3 px-3">Evidence Description</th>
              <th className="py-3 px-3">Result / Accuracy</th>
              <th className="py-3 px-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-theme-border/50">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-theme-elevated/40 transition">
                <td className="py-3.5 px-3 font-mono text-theme-secondary whitespace-nowrap">
                  {item.date}
                </td>
                <td className="py-3.5 px-3">
                  <div className="flex items-center space-x-2">
                    <span className="p-1 rounded-lg bg-theme-muted">
                      {getTypeIcon(item.type)}
                    </span>
                    <span className="font-extrabold text-theme-primary">
                      {item.subjectOrProject}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-theme-primary">{item.title}</div>
                  <div className="text-[11px] text-theme-subtle line-clamp-1 mt-0.5">
                    {item.evidenceContent}
                  </div>
                </td>
                <td className="py-3.5 px-3 text-theme-secondary">
                  <span className="font-semibold">{item.result}</span>
                </td>
                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
