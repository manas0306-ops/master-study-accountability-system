import React from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  X, 
  Timer, 
  Target, 
  AlertCircle 
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const ActiveSessionBar: React.FC = () => {
  const { 
    activeSession, 
    pauseSession, 
    resumeSession, 
    cancelSession, 
    setIsVerificationModalOpen 
  } = useSystem();

  if (!activeSession) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-bounce-in">
      <div className="p-4 rounded-3xl bg-theme-surface/95 backdrop-blur-xl border-2 border-theme-accent shadow-cute-lg flex items-center justify-between gap-4">
        
        {/* Info */}
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="relative flex items-center justify-center p-3 rounded-2xl bg-theme-accent text-white shadow-cute">
            <Timer className="w-5 h-5 animate-pulse" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded-md bg-theme-accent/15 text-theme-accent font-mono text-[11px] font-black uppercase">
                {activeSession.subjectCode}
              </span>
              <span className="font-mono font-extrabold text-sm text-theme-primary">
                {formatTimer(activeSession.elapsedSeconds)}
              </span>
            </div>

            <p className="text-xs font-semibold text-theme-secondary truncate max-w-xs mt-0.5" title={activeSession.targetDescription}>
              Target: {activeSession.targetDescription} ({activeSession.plannedAmount} items)
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {activeSession.isRunning ? (
            <button
              onClick={pauseSession}
              className="p-2.5 rounded-xl bg-theme-elevated hover:bg-theme-muted border border-theme-border text-theme-secondary transition"
              title="Pause Session Timer"
            >
              <Pause className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={resumeSession}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition shadow-sm"
              title="Resume Session Timer"
            >
              <Play className="w-4 h-4 fill-white" />
            </button>
          )}

          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-cute"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>End & Verify</span>
          </button>

          <button
            onClick={cancelSession}
            className="p-2 rounded-xl text-theme-subtle hover:text-rose-500 hover:bg-theme-muted transition"
            title="Cancel session without verification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
