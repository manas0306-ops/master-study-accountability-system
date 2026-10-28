import React, { useState } from 'react';
import { X, Sun, Moon, Check, Sparkles } from 'lucide-react';
import { useSystem } from '../../context/SystemContext';
import { THEMES } from '../../data/themes';

export const ThemeSelectorModal: React.FC = () => {
  const { theme, setTheme, isThemeModalOpen, setIsThemeModalOpen } = useSystem();
  const [filterMode, setFilterMode] = useState<'all' | 'day' | 'night'>('all');

  if (!isThemeModalOpen) return null;

  const dayThemes = THEMES.filter(t => t.mode === 'day');
  const nightThemes = THEMES.filter(t => t.mode === 'night');

  const displayedThemes = 
    filterMode === 'all' 
      ? THEMES 
      : filterMode === 'day' 
      ? dayThemes 
      : nightThemes;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl bg-theme-surface border border-theme-border shadow-cute-lg flex flex-col transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-theme-border bg-theme-elevated/50">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-theme-accent/15 text-theme-accent">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-theme-primary">
                Aesthetic Theme Sanctuary
              </h2>
              <p className="text-xs text-theme-subtle">
                Choose between 5 adorable Day themes & 5 immersive Night themes
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="p-2 rounded-xl text-theme-subtle hover:text-theme-primary hover:bg-theme-muted transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-theme-border/60 bg-theme-surface">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterMode === 'all'
                  ? 'bg-theme-accent text-white shadow-sm'
                  : 'text-theme-secondary hover:bg-theme-muted'
              }`}
            >
              All 10 Themes
            </button>
            <button
              onClick={() => setFilterMode('day')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                filterMode === 'day'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-theme-secondary hover:bg-theme-muted'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>5 Day Palettes</span>
            </button>
            <button
              onClick={() => setFilterMode('night')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                filterMode === 'night'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-theme-secondary hover:bg-theme-muted'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>5 Night Palettes</span>
            </button>
          </div>

          <div className="text-xs text-theme-subtle font-medium hidden sm:block">
            Instant live preview & automatic persistence
          </div>
        </div>

        {/* Themes Grid */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Day Section */}
          {(filterMode === 'all' || filterMode === 'day') && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Sun className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-theme-secondary">
                  5 Day Themes (Bright, Cheerful & Adorable)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dayThemes.map((item) => {
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id)}
                      className={`relative p-4 rounded-2xl text-left border transition-all duration-200 group flex flex-col justify-between ${
                        isSelected
                          ? 'border-theme-accent bg-theme-accent/5 ring-2 ring-theme-accent/30 shadow-cute'
                          : 'border-theme-border bg-theme-elevated/40 hover:bg-theme-elevated hover:border-theme-accent/50'
                      }`}
                    >
                      {/* Active pill */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-theme-accent text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span className="text-2xl transform group-hover:scale-110 transition-transform">{item.emoji}</span>
                          <div>
                            <h4 className="text-sm font-bold text-theme-primary leading-tight">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                              Day Mode
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-theme-secondary line-clamp-2 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Color Palette Preview Swatches */}
                      <div className="mt-4 pt-3 border-t border-theme-border/50 flex items-center justify-between">
                        <div className="flex space-x-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: item.previewColors.base }}
                            title="Base Background"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: item.previewColors.surface }}
                            title="Surface"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: item.previewColors.accent }}
                            title="Accent"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                            style={{ backgroundColor: item.previewColors.text }}
                            title="Primary Text"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-theme-subtle group-hover:text-theme-accent transition">
                          Apply →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Night Section */}
          {(filterMode === 'all' || filterMode === 'night') && (
            <div>
              <div className="flex items-center space-x-2 mb-3 pt-2">
                <Moon className="w-4 h-4 text-indigo-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-theme-secondary">
                  5 Night Themes (Deep Focus, Cyberpunk & Midnight Glow)
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nightThemes.map((item) => {
                  const isSelected = theme === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTheme(item.id)}
                      className={`relative p-4 rounded-2xl text-left border transition-all duration-200 group flex flex-col justify-between ${
                        isSelected
                          ? 'border-theme-accent bg-theme-accent/5 ring-2 ring-theme-accent/30 shadow-cute'
                          : 'border-theme-border bg-theme-elevated/40 hover:bg-theme-elevated hover:border-theme-accent/50'
                      }`}
                    >
                      {/* Active pill */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-theme-accent text-white text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active</span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center space-x-2 mb-1.5">
                          <span className="text-2xl transform group-hover:scale-110 transition-transform">{item.emoji}</span>
                          <div>
                            <h4 className="text-sm font-bold text-theme-primary leading-tight">
                              {item.name}
                            </h4>
                            <span className="text-[10px] font-semibold text-indigo-500 uppercase tracking-wider">
                              Night Mode
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-theme-secondary line-clamp-2 mt-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Color Palette Preview Swatches */}
                      <div className="mt-4 pt-3 border-t border-theme-border/50 flex items-center justify-between">
                        <div className="flex space-x-1.5">
                          <span
                            className="w-5 h-5 rounded-full border border-white/10 shadow-sm"
                            style={{ backgroundColor: item.previewColors.base }}
                            title="Base Background"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/10 shadow-sm"
                            style={{ backgroundColor: item.previewColors.surface }}
                            title="Surface"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/10 shadow-sm"
                            style={{ backgroundColor: item.previewColors.accent }}
                            title="Accent"
                          />
                          <span
                            className="w-5 h-5 rounded-full border border-white/10 shadow-sm"
                            style={{ backgroundColor: item.previewColors.text }}
                            title="Primary Text"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-theme-subtle group-hover:text-theme-accent transition">
                          Apply →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-theme-border bg-theme-elevated/40 flex items-center justify-between">
          <p className="text-xs text-theme-subtle">
            All themes are calibrated for optimal contrast, readability, and reduced eye fatigue.
          </p>
          <button
            onClick={() => setIsThemeModalOpen(false)}
            className="px-4 py-2 rounded-xl bg-theme-accent hover:bg-theme-accent-hover text-white text-xs font-bold transition shadow-sm"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
