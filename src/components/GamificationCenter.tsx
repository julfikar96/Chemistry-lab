import React, { useState } from 'react';
import {
  Trophy,
  Flame,
  Sparkles,
  Award,
  Target,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Brain,
  Zap,
  BookOpen,
  FlaskConical,
  Beaker,
  Atom,
} from 'lucide-react';
import { Achievement } from '../types';
import { MasterTabType } from '../App';

interface GamificationCenterProps {
  totalXP: number;
  streakDays: number;
  achievements: Achievement[];
  onNavigate: (tab: MasterTabType) => void;
}

export const GamificationCenter: React.FC<GamificationCenterProps> = ({
  totalXP,
  streakDays,
  achievements,
  onNavigate,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'achievements' | 'learning_path'>('overview');

  // Calculate Student Level
  const getLevelInfo = (xp: number) => {
    if (xp < 100) return { level: 1, title: 'Apprentice Chemist', nextXP: 100, minXP: 0 };
    if (xp < 250) return { level: 2, title: 'Laboratory Technician (Lab Technician)', nextXP: 250, minXP: 100 };
    if (xp < 500) return { level: 3, title: 'Stoichiometry Specialist', nextXP: 500, minXP: 250 };
    if (xp < 900) return { level: 4, title: 'Reaction Master', nextXP: 900, minXP: 500 };
    if (xp < 1500) return { level: 5, title: 'Quantum and VSEPR Analyst (Quantum Analyst)', nextXP: 1500, minXP: 900 };
    return { level: 6, title: 'Nobel Laureate Chemist (Legendary Chemist)', nextXP: 3000, minXP: 1500 };
  };

  const levelInfo = getLevelInfo(totalXP);
  const xpInCurrentLevel = totalXP - levelInfo.minXP;
  const xpNeededForNext = levelInfo.nextXP - levelInfo.minXP;
  const progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  // Recommended Personalized Learning Path
  const learningPathSteps = [
    {
      step: 1,
      title: 'Atomic structure and quantum number',
      desc: "Orbital filling according to Bohr's model, Aufbau and Hund's principle",
      tab: 'atomic' as MasterTabType,
      icon: Atom,
      status: 'completed',
      xpReward: 50,
    },
    {
      step: 2,
      title: 'Periodic religion and radical activism',
      desc: 'Changes in electronegativity, atomic radius and ionization energy',
      tab: 'trends' as MasterTabType,
      icon: TrendingUp,
      status: 'completed',
      xpReward: 60,
    },
    {
      step: 3,
      title: 'Chemical bonding and VSEPR 3D geometry',
      desc: 'Lewis dot signal, bond angle and 3D molecular shape',
      tab: 'bonding' as MasterTabType,
      icon: Zap,
      status: 'in_progress',
      xpReward: 80,
    },
    {
      step: 4,
      title: 'Stoichiometry and Equation Balancing',
      desc: 'Calculating moles, limiting reactants and percentage products (% Yield) solution',
      tab: 'stoichiometry' as MasterTabType,
      icon: Target,
      status: 'recommended',
      xpReward: 100,
    },
    {
      step: 5,
      title: 'Buffer solutions, pH and titration curves',
      desc: 'Henderson equation and indicator color change simulation',
      tab: 'titration' as MasterTabType,
      icon: FlaskConical,
      status: 'locked',
      xpReward: 120,
    },
    {
      step: 6,
      title: 'Galvanic cell and Nernst equation',
      desc: "Calculation of Cell Potential, Oxidation Potential and Farad's Law",
      tab: 'electrochem' as MasterTabType,
      icon: Sparkles,
      status: 'locked',
      xpReward: 150,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              Gamified Learning and Progress Hub (Gamified Learning & Mastery)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track your earned experience (XP), daily streak, badges and personalized chemistry learning
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-center gap-2 text-xs text-amber-300">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            <span>Daily streak: <strong className="text-white font-mono font-bold">{streakDays} day</strong></span>
          </div>

          <div className="px-4 py-2 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center gap-2 text-xs text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Total XP: <strong className="text-white font-mono font-bold">{totalXP}</strong></span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'overview', label: '📊 Overall dashboard' },
          { id: 'learning_path', label: '🎯 Personalized learning path' },
          { id: 'achievements', label: `🏆 Badges and Achievements Earned (${unlockedCount}/${achievements.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              activeSubTab === tab.id
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Level Progress Card */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider block">
                  level {levelInfo.level}
                </span>
                <h3 className="text-lg font-bold text-slate-100">{levelInfo.title}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">
                  Requirements for next level: <strong className="text-white font-mono">{levelInfo.nextXP - totalXP} XP</strong>
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>{levelInfo.minXP} XP</span>
                <span>{progressPercent}% complete</span>
                <span>{levelInfo.nextXP} XP</span>
              </div>
            </div>
          </div>

          {/* Mastery Radar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Atomic and quantum chemistry', mastery: '85%', status: 'High efficiency', color: 'text-cyan-400', bar: 'w-[85%]' },
              { title: 'Stoichiometry and Equilibration', mastery: '72%', status: 'good possession', color: 'text-emerald-400', bar: 'w-[72%]' },
              { title: 'Acid-base and buffer solutions', mastery: '58%', status: 'Practice is required', color: 'text-amber-400', bar: 'w-[58%]' },
              { title: 'Gas Formulas and Dynamics', mastery: '80%', status: 'High efficiency', color: 'text-blue-400', bar: 'w-[80%]' },
              { title: 'Electrochemistry and Nernst', mastery: '65%', status: 'middle level', color: 'text-purple-400', bar: 'w-[65%]' },
              { title: 'Organic Chemistry and Equivalence', mastery: '90%', status: 'Excellent skills', color: 'text-rose-400', bar: 'w-[90%]' },
            ].map((m, i) => (
              <div key={i} className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-200">{m.title}</h4>
                  <span className={`text-xs font-mono font-bold ${m.color}`}>{m.mastery}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 ${m.bar}`} />
                </div>
                <span className="text-[10px] text-slate-400 block">{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Path Tab */}
      {activeSubTab === 'learning_path' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-100">Track your personalized learning</h3>
            <p className="text-xs text-slate-400">
              Follow our AI learning path to master the weak chapters sequentially
            </p>
          </div>

          <div className="space-y-4">
            {learningPathSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.status === 'completed'
                      ? 'bg-slate-950/60 border-slate-800'
                      : item.status === 'in_progress'
                      ? 'bg-gradient-to-r from-purple-950/40 to-slate-900 border-purple-500/50 shadow-md ring-1 ring-purple-500/20'
                      : item.status === 'recommended'
                      ? 'bg-cyan-950/30 border-cyan-500/40'
                      : 'bg-slate-950/20 border-slate-850 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        item.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : item.status === 'in_progress'
                          ? 'bg-purple-500 text-white shadow-lg'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : item.step}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-slate-100">{item.title}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-slate-800 text-purple-300">
                          +{item.xpReward} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate(item.tab)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shrink-0 self-start sm:self-auto"
                  >
                    <span>{item.status === 'completed' ? 'Revision' : 'Go to module'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements Gallery */}
      {activeSubTab === 'achievements' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all space-y-2 ${
                  ach.unlocked
                    ? 'bg-gradient-to-b from-amber-950/20 to-slate-900/80 border-amber-500/40 shadow-lg'
                    : 'bg-slate-950/40 border-slate-850 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl">{ach.icon}</div>
                  {ach.unlocked ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                      unlocked
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-100">{ach.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{ach.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Award: <strong className="text-amber-400 font-mono">+{ach.xpReward} XP</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
