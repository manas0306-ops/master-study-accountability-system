import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Terminal, 
  Sparkles, 
  Trash2, 
  HelpCircle, 
  Play, 
  AlertCircle, 
  BarChart3,
  Flame,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const CommandCenter: React.FC = () => {
  const { chatMessages, sendUserMessage, clearChat } = useSystem();
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const quickCommands = [
    "Start today's plan",
    "What should I do now?",
    "Start CSE306",
    "End session",
    "Show backlog",
    "Show weekly report",
    "I missed today's session",
  ];

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendUserMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickCommand = (cmd: string) => {
    sendUserMessage(cmd);
  };

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-4 flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-theme-border/70 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-theme-accent to-purple-500 flex items-center justify-center text-white shadow-cute">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-theme-primary flex items-center space-x-1.5">
              <span>Personal Accountability Partner</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h2>
            <p className="text-[11px] text-theme-subtle">
              Strict, objective truth-teller. Enforces measurable targets & 0% flattery.
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="p-1.5 rounded-xl text-theme-subtle hover:text-theme-primary hover:bg-theme-muted transition"
          title="Clear Chat Log"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Command Pills */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <span className="text-[10px] uppercase font-black text-theme-subtle flex items-center space-x-1 shrink-0 mr-1">
          <Terminal className="w-3 h-3 text-theme-accent" />
          <span>Commands:</span>
        </span>
        {quickCommands.map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleQuickCommand(cmd)}
            className="px-2.5 py-1 rounded-xl bg-theme-elevated hover:bg-theme-muted border border-theme-border text-theme-secondary hover:text-theme-primary whitespace-nowrap text-[11px] font-semibold transition"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-theme-accent/15 text-theme-accent flex items-center justify-center shrink-0 text-xs font-black border border-theme-accent/20">
                  🤖
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-1.5 ${
                  isUser
                    ? 'bg-theme-accent text-white shadow-cute font-medium'
                    : 'bg-theme-elevated border border-theme-border text-theme-primary shadow-sm'
                }`}
              >
                {!isUser && msg.badge && (
                  <div className="flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-theme-accent pb-1 border-b border-theme-border/40">
                    <Sparkles className="w-3 h-3" />
                    <span>{msg.badge}</span>
                  </div>
                )}

                <div className="whitespace-pre-wrap font-sans">
                  {msg.content}
                </div>

                <div className={`text-[10px] font-mono text-right ${isUser ? 'text-white/70' : 'text-theme-subtle'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="pt-2 border-t border-theme-border/70 flex items-center space-x-2">
        <input
          type="text"
          placeholder="Type a command or query (e.g. What should I do now?, Start today's plan)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-theme-elevated border border-theme-border text-xs text-theme-primary placeholder:text-theme-subtle focus:outline-none focus:ring-2 focus:ring-theme-accent"
        />

        <button
          type="submit"
          className="p-2.5 rounded-2xl bg-theme-accent hover:bg-theme-accent-hover text-white transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
