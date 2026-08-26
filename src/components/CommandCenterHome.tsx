import React, { useState } from 'react';
import {
  Sparkles,
  Beaker,
  Atom,
  Scale,
  Droplet,
  Zap,
  Flame,
  BatteryCharging,
  Layers,
  BookOpen,
  Award,
  ArrowRight,
  TrendingUp,
  Brain,
  Search,
  CheckCircle2,
  Calculator,
  Compass,
  ChevronRight,
} from 'lucide-react';
import { MasterTabType } from '../App';
import { soundEngine } from '../utils/audio';
import { calculateMolarMassAndComposition } from '../utils/equationBalancer';

interface CommandCenterHomeProps {
  onNavigate: (tab: MasterTabType, payload?: any) => void;
  onOpenSearch: () => void;
  onOpenAiTutor: (initialQuestion?: string) => void;
  totalXP: number;
  streakDays: number;
  onEarnXP: (xp: number) => void;
}

export const CommandCenterHome: React.FC<CommandCenterHomeProps> = ({
  onNavigate,
  onOpenSearch,
  onOpenAiTutor,
  totalXP,
  streakDays,
  onEarnXP,
}) => {
  // Daily Challenge State
  const [dailyAnswered, setDailyAnswered] = useState(false);
  const [dailySelected, setDailySelected] = useState<number | null>(null);

  // Quick Calculator State on Home
  const [quickFormula, setQuickFormula] = useState('H2SO4');
  const [quickResult, setQuickResult] = useState<{ mass: number; elements: string } | null>({
    mass: 98.08,
    elements: 'H: 2.06%, S: 32.69%, O: 65.25%',
  });

  const handleQuickCalculate = (formula: string) => {
    setQuickFormula(formula);
    if (!formula.trim()) {
      setQuickResult(null);
      return;
    }
    const res = calculateMolarMassAndComposition(formula);
    if (res.valid) {
      setQuickResult({
        mass: res.totalMolarMass,
        elements: res.summaryString || `Mass of ${res.formattedFormula} is ${res.totalMolarMass} g/mol`,
      });
    } else {
      setQuickResult({
        mass: 0,
        elements: 'Invalid or incomplete chemical formula. Enter a valid formula (e.g., H2SO4, CaCO3, KMnO4)',
      });
    }
  };

  const handleDailySubmit = (idx: number) => {
    if (dailyAnswered) return;
    setDailySelected(idx);
    setDailyAnswered(true);
    if (idx === 1) {
      soundEngine.playSuccessChime();
      onEarnXP(50);
    } else {
      soundEngine.playPourDrop();
    }
  };

  // Launchpad cards data
  const launchpads = [
    {
      id: 'lab',
      title: 'Virtual 3D Reaction Lab',
      subtitle: 'Virtual 3D Reaction Lab',
      desc: 'Beakers, test tubes, flasks, droppers & realistic chemical mixing simulation',
      badge: 'Interactive Lab',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      icon: Beaker,
      iconColor: 'text-emerald-400',
      gradient: 'from-emerald-950/40 via-slate-900 to-slate-950',
      tab: 'lab' as MasterTabType,
    },
    {
      id: 'periodic',
      title: 'Periodic Table 2.0 (118 Elements)',
      subtitle: 'Periodic Table Intelligence',
      desc: 'Electron configurations, orbitals, 3D atomic structures & periodic properties',
      badge: 'All 118 Elements',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      icon: Atom,
      iconColor: 'text-cyan-400',
      gradient: 'from-cyan-950/40 via-slate-900 to-slate-950',
      tab: 'periodic' as MasterTabType,
    },
    {
      id: 'stoichiometry',
      title: 'Stoichiometry & Equation Balancing',
      subtitle: 'Equation Balancer & Solver',
      desc: 'Algebraic balancing, limiting reactants & percentage yield analysis',
      badge: 'Algebraic Engine',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      icon: Scale,
      iconColor: 'text-amber-400',
      gradient: 'from-amber-950/40 via-slate-900 to-slate-950',
      tab: 'stoichiometry' as MasterTabType,
    },
    {
      id: 'titration',
      title: 'Titration Master Simulator',
      subtitle: 'Titration Lab & pH Curves',
      desc: 'Burette dropper control, indicator color changes & realtime graphs',
      badge: 'Visual Curves',
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      icon: Droplet,
      iconColor: 'text-pink-400',
      gradient: 'from-pink-950/40 via-slate-900 to-slate-950',
      tab: 'titration' as MasterTabType,
    },
    {
      id: 'bonding',
      title: 'Chemical Bonding & 3D VSEPR',
      subtitle: 'Chemical Bonding & 3D Geometry',
      desc: 'Lewis dot structures, hybridization (sp, sp2, sp3), bond angles & molecular geometry',
      badge: '3D Geometry',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      icon: Zap,
      iconColor: 'text-purple-400',
      gradient: 'from-purple-950/40 via-slate-900 to-slate-950',
      tab: 'bonding' as MasterTabType,
    },
    {
      id: 'physical',
      title: 'Physical Chemistry & Gas Laws',
      subtitle: 'Physical Chemistry & Gas Laws',
      desc: 'Boyle-Charles-Ideal gas piston simulation, Hess\'s Law & chemical kinetics',
      badge: 'Gas & Kinetics',
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      icon: Layers,
      iconColor: 'text-blue-400',
      gradient: 'from-blue-950/40 via-slate-900 to-slate-950',
      tab: 'physical' as MasterTabType,
    },
    {
      id: 'electrochem',
      title: 'Electrochemistry & Galvanic Cells',
      subtitle: 'Electrochemistry & Daniell Cell',
      desc: 'Daniell cell animation, electron flow, Nernst equation & electrolysis',
      badge: 'Nernst & Cells',
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      icon: BatteryCharging,
      iconColor: 'text-teal-400',
      gradient: 'from-teal-950/40 via-slate-900 to-slate-950',
      tab: 'electrochem' as MasterTabType,
    },
    {
      id: 'organic',
      title: 'Organic Chemistry & Nuclear Decay',
      subtitle: 'Organic Studio & Nuclear Physics',
      desc: 'IUPAC nomenclature, isomerism, polymers & alpha/beta radioactive decay formulas',
      badge: 'IUPAC & Nuclear',
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      icon: Flame,
      iconColor: 'text-orange-400',
      gradient: 'from-orange-950/40 via-slate-900 to-slate-950',
      tab: 'organic' as MasterTabType,
    },
    {
      id: 'exam',
      title: 'Exam & Olympiad Preparation',
      subtitle: 'Exam & Olympiad Hub',
      desc: 'SSC, HSC & Olympiad question banks with step-by-step explanations',
      badge: 'Practice Bank',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      icon: BookOpen,
      iconColor: 'text-indigo-400',
      gradient: 'from-indigo-950/40 via-slate-900 to-slate-950',
      tab: 'exam' as MasterTabType,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-8 pb-12 animate-in fade-in duration-300">
      {/* Hero Section */}
      <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-2xl overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>World-Class Interactive Chemistry Ecosystem</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight">
              Transform the deepest beauty <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400">
                of chemistry into an experience
              </span>
            </h1>

            <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
              From quantum atomic orbitals to virtual 3D chemical reactions, VSEPR molecular geometry, Nernst cells, and Olympiad preparation—everything connected in one platform.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('lab')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
              >
                <Beaker className="w-4 h-4" />
                <span>Enter Virtual Lab</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-xs transition-all"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Global Search (Ctrl + K)</span>
              </button>

              <button
                onClick={() => onOpenAiTutor('How should I organize my chemistry preparation?')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/50 text-purple-200 font-semibold text-xs transition-all"
              >
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Consult AI Tutor</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="grid grid-cols-2 gap-3 shrink-0 lg:w-72">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Fundamental Elements</span>
              <p className="text-xl font-bold text-slate-100 font-mono">118 Elements</p>
              <span className="text-[10px] text-cyan-400 font-mono">3D Orbitals & Trends</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Chemical Compounds</span>
              <p className="text-xl font-bold text-slate-100 font-mono">80+ Compounds</p>
              <span className="text-[10px] text-purple-400 font-mono">Full Physical Data</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Reactions & Equations</span>
              <p className="text-xl font-bold text-slate-100 font-mono">50+ Reactions</p>
              <span className="text-[10px] text-emerald-400 font-mono">Verified Thermodynamics</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-inner space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Earned Experience</span>
              <p className="text-xl font-bold text-slate-100 font-mono">{totalXP} XP</p>
              <span className="text-[10px] text-amber-400 font-mono">{streakDays} Day Streak 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge & Instant Calculator Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Challenge Card */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Flame className="w-4 h-4" />
                </span>
                <h3 className="text-xs font-bold text-slate-100">Today's Daily Chemistry Challenge</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                +50 XP Reward
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                What is the standard value of heat of neutralization (ΔH) produced in the aqueous neutralization reaction of a strong acid (HCl) and a strong base (NaOH)?
              </p>
              <div className="font-mono text-[11px] text-cyan-400 bg-slate-950 p-2 rounded-xl border border-slate-800/80">
                HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) + Heat
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { label: '-57.34 kJ/mol', isCorrect: true },
                { label: '+57.34 kJ/mol', isCorrect: false },
                { label: '-13.7 kJ/mol', isCorrect: false },
                { label: '0.00 kJ/mol', isCorrect: false },
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleDailySubmit(i)}
                  disabled={dailyAnswered}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition-all text-left flex items-center justify-between ${
                    dailyAnswered
                      ? opt.isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                        : dailySelected === i
                        ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{opt.label}</span>
                  {dailyAnswered && opt.isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              ))}
            </div>
          </div>

          {dailyAnswered && (
            <div className="p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300 flex items-center justify-between animate-in fade-in">
              <span>{dailySelected === 0 ? '🎉 Congratulations! You have earned +50 XP.' : '💡 The correct value is -57.34 kJ/mol (or -13.7 kcal/mol)'}</span>
              <button
                onClick={() => onNavigate('exam')}
                className="text-xs font-bold text-white underline hover:text-emerald-200"
              >
                Play More Quizzes →
              </button>
            </div>
          )}
        </div>

        {/* Quick Calculator Widget */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Calculator className="w-4 h-4" />
              </span>
              <h3 className="text-xs font-bold text-slate-100">Instant Molecular Mass & Composition</h3>
            </div>
            <button
              onClick={() => onNavigate('calculator')}
              className="text-[10px] text-cyan-400 hover:underline font-semibold"
            >
              All Calculators →
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              {['H2SO4', 'H2O', 'C6H12O6', 'NaCl', 'CaCO3'].map((sample) => (
                <button
                  key={sample}
                  onClick={() => handleQuickCalculate(sample)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                    quickFormula === sample
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sample}
                </button>
              ))}
            </div>

            {quickResult && (
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Formula: <strong className="text-slate-200">{quickFormula}</strong></span>
                  <span>Molar Mass: <strong className="text-cyan-400 font-bold">{quickResult.mass} g/mol</strong></span>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-850">
                  Percentage Composition: {quickResult.elements}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core Studio Launchpads Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-slate-100">Chemistry Labs & Virtual Studios</h2>
          </div>
          <span className="text-xs text-slate-400">9 Specialized Simulations & Analyzers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {launchpads.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.tab)}
                className={`group p-6 rounded-3xl bg-gradient-to-b ${item.gradient} border border-slate-800 hover:border-cyan-500/50 shadow-xl hover:shadow-2xl transition-all cursor-pointer flex flex-col justify-between gap-4 relative overflow-hidden`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${item.iconColor} shadow-inner group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                  <span>Enter Module</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
