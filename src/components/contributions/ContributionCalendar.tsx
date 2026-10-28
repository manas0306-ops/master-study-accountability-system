import React, { useState, useMemo } from 'react';
import { 
  GitCommit, 
  Flame, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Info,
  Layers,
  Award
} from 'lucide-react';
import { useSystem } from '../../context/SystemContext';

export const ContributionCalendar: React.FC = () => {
  const { contributions, streakDays, longestStreak, totalContributions, currentDate } = useSystem();
  const [filterType, setFilterType] = useState<'all' | 'study-session' | 'git-commit' | 'evidence'>('all');
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number; details: string[] } | null>(null);

  // Group contributions by date
  const dateMap = useMemo(() => {
    const map = new Map<string, { count: number; points: number; details: string[] }>();

    contributions.forEach(c => {
      if (filterType !== 'all' && c.type !== filterType) return;

      const existing = map.get(c.date) || { count: 0, points: 0, details: [] };
      existing.count += 1;
      existing.points += c.points || 1;
      existing.details.push(c.title);
      map.set(c.date, existing);
    });

    return map;
  }, [contributions, filterType]);

  // Generate 52 weeks grid (364 days leading up to today/current date)
  const calendarWeeks = useMemo(() => {
    const weeks: Array<Array<{ dateStr: string; dayIndex: number; count: number; points: number; details: string[] }>> = [];
    const end = new Date(currentDate);
    // align to Saturday
    const currentDayOfWeek = end.getDay();
    const daysSinceSunday = currentDayOfWeek;
    
    // total 52 weeks = 364 days
    const totalDays = 52 * 7;
    const start = new Date(end);
    start.setDate(end.getDate() - (totalDays - 1 - (6 - currentDayOfWeek)));

    let currentWeek: Array<{ dateStr: string; dayIndex: number; count: number; points: number; details: string[] }> = [];

    for (let i = 0; i < totalDays; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const entry = dateMap.get(dateStr) || { count: 0, points: 0, details: [] };

      currentWeek.push({
        dateStr,
        dayIndex: d.getDay(),
        count: entry.count,
        points: entry.points,
        details: entry.details,
      });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [currentDate, dateMap]);

  const getHeatClass = (count: number) => {
    if (count === 0) return 'bg-theme-elevated/70 border-theme-border/50';
    if (count <= 1) return 'bg-[var(--heat-1)] text-white';
    if (count <= 3) return 'bg-[var(--heat-2)] text-white';
    if (count <= 5) return 'bg-[var(--heat-3)] text-white';
    return 'bg-[var(--heat-4)] text-white ring-1 ring-white/30';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="p-6 rounded-3xl bg-theme-surface border border-theme-border shadow-cute space-y-5">
      {/* Header & Streak stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <CalendarIcon className="w-5 h-5 text-theme-accent" />
            <h2 className="text-lg font-extrabold text-theme-primary">
              Accountability Contribution Heatmap
            </h2>
          </div>
          <p className="text-xs text-theme-subtle mt-1">
            Every git commit, study session, problem set, and evidence submission is permanently recorded.
          </p>
        </div>

        {/* Stats Row */}
        <div className="flex items-center space-x-3 text-xs font-bold">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{streakDays} Day Streak</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>Longest: {longestStreak} Days</span>
          </div>

          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-theme-elevated border border-theme-border text-theme-primary font-mono">
            <span>{totalContributions} Total Actions</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between pt-1 border-t border-theme-border/50">
        <div className="flex space-x-2 text-xs font-bold">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-xl transition ${
              filterType === 'all'
                ? 'bg-theme-accent text-white shadow-sm'
                : 'bg-theme-elevated text-theme-secondary hover:bg-theme-muted'
            }`}
          >
            All Activity
          </button>
          <button
            onClick={() => setFilterType('study-session')}
            className={`px-3 py-1 rounded-xl transition ${
              filterType === 'study-session'
                ? 'bg-theme-accent text-white shadow-sm'
                : 'bg-theme-elevated text-theme-secondary hover:bg-theme-muted'
            }`}
          >
            Study Sessions
          </button>
          <button
            onClick={() => setFilterType('git-commit')}
            className={`px-3 py-1 rounded-xl transition ${
              filterType === 'git-commit'
                ? 'bg-theme-accent text-white shadow-sm'
                : 'bg-theme-elevated text-theme-secondary hover:bg-theme-muted'
            }`}
          >
            Git Commits
          </button>
          <button
            onClick={() => setFilterType('evidence')}
            className={`px-3 py-1 rounded-xl transition ${
              filterType === 'evidence'
                ? 'bg-theme-accent text-white shadow-sm'
                : 'bg-theme-elevated text-theme-secondary hover:bg-theme-muted'
            }`}
          >
            Evidence Logs
          </button>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-theme-subtle">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-theme-elevated border border-theme-border" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--heat-1)]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--heat-2)]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--heat-3)]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--heat-4)]" />
          <span>More</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block min-w-full">
          {/* Calendar Squares Grid */}
          <div className="flex space-x-1">
            {calendarWeeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col space-y-1">
                {week.map((day) => {
                  const isCurrentDay = day.dateStr === currentDate;

                  return (
                    <div
                      key={day.dateStr}
                      onMouseEnter={() => setHoveredCell({ date: day.dateStr, count: day.count, details: day.details })}
                      onMouseLeave={() => setHoveredCell(null)}
                      className={`w-3.5 h-3.5 rounded-sm transition-all duration-150 cursor-pointer ${getHeatClass(day.count)} ${
                        isCurrentDay ? 'ring-2 ring-theme-accent ring-offset-1 ring-offset-theme-surface' : ''
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hover Info Tooltip Banner */}
      <div className="min-h-[2.5rem] p-3 rounded-2xl bg-theme-elevated/70 border border-theme-border flex items-center justify-between text-xs">
        {hoveredCell ? (
          <div className="flex items-center space-x-2">
            <span className="font-mono font-bold text-theme-primary">{hoveredCell.date}:</span>
            <span className="font-semibold text-theme-secondary">
              {hoveredCell.count === 0 ? 'No recorded activities' : `${hoveredCell.count} contribution(s)`}
            </span>
            {hoveredCell.details.length > 0 && (
              <span className="text-theme-subtle truncate max-w-md hidden sm:inline">
                ({hoveredCell.details.slice(0, 2).join(' • ')})
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-theme-subtle">
            <Info className="w-3.5 h-3.5 text-theme-accent" />
            <span>Hover over any calendar square to inspect exact daily contributions & commit history.</span>
          </div>
        )}

        <span className="text-[10px] text-theme-subtle font-mono hidden md:inline">
          Active Theme Palette Mapped
        </span>
      </div>

    </div>
  );
};
