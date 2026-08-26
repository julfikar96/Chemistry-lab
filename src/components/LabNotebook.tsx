import React from 'react';
import { NotebookEntry, Achievement } from '../types';
import { BookOpen, Award, Trash2, Printer, Plus, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface LabNotebookProps {
  entries: NotebookEntry[];
  achievements: Achievement[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
}

export const LabNotebook: React.FC<LabNotebookProps> = ({
  entries,
  achievements,
  onDeleteEntry,
  onClearAll,
}) => {
  const totalXp = achievements.filter((a) => a.unlocked).reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="w-full flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <span>Laboratory Notebook and Progress (Lab Notebook & Progress)</span>
              </h2>
              <p className="text-xs text-slate-400">
                Your saved exams, observations, earned badges and SSC practical history
              </p>
            </div>
          </div>

          {/* Gamified XP pill */}
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
            <Award className="w-5 h-5 text-amber-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Lab XP Score</span>
              <span className="text-sm font-bold text-amber-300 font-mono">{totalXp} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Gallery Ribbon */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Laboratory Badges and Achievements</span>
          </span>
          <span className="text-xs text-cyan-400 font-mono">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-3 rounded-2xl border flex flex-col items-center text-center gap-1.5 transition-all ${
                ach.unlocked
                  ? 'bg-amber-950/30 border-amber-500/60 shadow-lg'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-40 grayscale'
              }`}
            >
              <div className="text-2xl">{ach.icon}</div>
              <span className="text-xs font-bold text-slate-200 leading-tight">{ach.title}</span>
              <span className="text-[9px] text-amber-400 font-mono font-bold">+{ach.xpReward} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Notebook Entries */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <span>📝</span>
            <span>Saved lab notes ({entries.length} {entries.length === 1 ? "entry" : "entries"})</span>
          </span>

          <div className="flex items-center gap-2">
            {entries.length > 0 && (
              <>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Want to delete all lab notes?')) {
                      onClearAll();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-xs text-rose-300 font-medium flex items-center gap-1.5 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>delete all</span>
                </button>
              </>
            )}
          </div>
        </div>

        {entries.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <BookOpen className="w-8 h-8 text-slate-700" />
            <span>No lab notes have been saved yet।</span>
            <span>Perform any test in the virtual lab "Save to notebook" Press the button।</span>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{entry.title}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(entry.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Chemicals & Equation */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Ingredients Used: </strong>
                    {entry.chemicals.join(', ')}
                  </div>
                  {entry.equation && (
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-amber-300 text-xs">
                      {entry.equation}
                    </div>
                  )}
                </div>

                {/* Observations */}
                {entry.observations && entry.observations.length > 0 && (
                  <div className="text-xs text-slate-300 bg-slate-900/50 p-3 rounded-xl">
                    <strong>Observation:</strong>
                    <ul className="list-disc list-inside text-slate-400 mt-1 space-y-0.5">
                      {entry.observations.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
