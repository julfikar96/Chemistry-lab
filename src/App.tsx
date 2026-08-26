import React, { useState, useEffect } from 'react';
import { LabBench } from './components/LabBench';
import { PracticalsLab } from './components/PracticalsLab';
import { TitrationLab } from './components/TitrationLab';
import { ElectrochemicalLab } from './components/ElectrochemicalLab';
import { ReactionEncyclopedia } from './components/ReactionEncyclopedia';
import { PeriodicTable118 } from './components/PeriodicTable118';
import { CompoundsDirectory } from './components/CompoundsDirectory';
import { AiTutorDrawer } from './components/AiTutorDrawer';
import { LabNotebook } from './components/LabNotebook';

// Core Chemistry Labs & Hubs
import { CommandCenterHome } from './components/CommandCenterHome';
import { ExamCenterLab } from './components/ExamCenterLab';
import { GamificationCenter } from './components/GamificationCenter';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AtomicStructureLab } from './components/AtomicStructureLab';
import { ChemicalBondingLab } from './components/ChemicalBondingLab';
import { StoichiometryBalancerLab } from './components/StoichiometryBalancerLab';
import { PhysicalChemistryLab } from './components/PhysicalChemistryLab';
import { SolutionsAcidsRedoxLab } from './components/SolutionsAcidsRedoxLab';
import { OrganicNuclearLab } from './components/OrganicNuclearLab';
import { PeriodicTrendsLab } from './components/PeriodicTrendsLab';
import { NomenclatureHub } from './components/NomenclatureHub';
import { CalculatorHub } from './components/CalculatorHub';

import { INITIAL_ACHIEVEMENTS } from './data/achievements';
import { NotebookEntry, Achievement, ReactionRecord } from './types';
import {
  Beaker,
  BookOpen,
  Sparkles,
  Layers,
  Bot,
  FileSpreadsheet,
  FlaskConical,
  Zap,
  Atom,
  Share2,
  Scale,
  Gauge,
  Droplet,
  TrendingUp,
  Calculator,
  Flame,
  Search,
  Trophy,
  Award,
  Compass,
  Home,
  CheckCircle,
} from 'lucide-react';

export type MasterTabType =
  | 'home'
  | 'lab'
  | 'titration'
  | 'electrochem'
  | 'practicals'
  | 'atomic'
  | 'bonding'
  | 'stoichiometry'
  | 'physical'
  | 'solutions'
  | 'organic'
  | 'trends'
  | 'nomenclature'
  | 'calculator'
  | 'compounds'
  | 'periodic'
  | 'encyclopedia'
  | 'exam'
  | 'gamification'
  | 'tutor'
  | 'notebook';

export function App() {
  const [activeTab, setActiveTab] = useState<MasterTabType>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Gamification & XP State
  const [totalXP, setTotalXP] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('legendary_chem_xp');
      return saved ? parseInt(saved, 10) : 150;
    } catch {
      return 150;
    }
  });

  const [streakDays, setStreakDays] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('legendary_chem_streak');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  // Notebook state persisted in localStorage
  const [notebookEntries, setNotebookEntries] = useState<NotebookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('legendary_chem_lab_notebook');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Achievements state persisted in localStorage
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('legendary_chem_lab_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  // Pass-through query for AI tutor
  const [tutorInitialQuery, setTutorInitialQuery] = useState<string | null>(null);
  const [bondingInitialFormula, setBondingInitialFormula] = useState<string | undefined>(undefined);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('legendary_chem_xp', totalXP.toString());
    } catch {}
  }, [totalXP]);

  useEffect(() => {
    try {
      localStorage.setItem('legendary_chem_streak', streakDays.toString());
    } catch {}
  }, [streakDays]);

  useEffect(() => {
    try {
      localStorage.setItem('legendary_chem_lab_notebook', JSON.stringify(notebookEntries));
    } catch {}
  }, [notebookEntries]);

  useEffect(() => {
    try {
      localStorage.setItem('legendary_chem_lab_achievements', JSON.stringify(achievements));
    } catch {}
  }, [achievements]);

  // Global keyboard shortcut: Ctrl+K or Cmd+K to open Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleEarnXP = (xp: number) => {
    setTotalXP((prev) => prev + xp);
  };

  // Add notebook entry
  const handleAddNotebookEntry = (entry: any) => {
    const newEntry: NotebookEntry = {
      id: 'entry_' + Date.now(),
      title: entry.title,
      timestamp: Date.now(),
      chemicals: entry.chemicals || [],
      equation: entry.equation,
      observations: entry.observations || [],
      temperature: entry.temp,
      ph: entry.ph,
      notes: entry.results,
    };
    setNotebookEntries((prev) => [newEntry, ...prev]);
    handleEarnXP(20);
  };

  // Unlock achievement
  const handleUnlockAchievement = (achId: string) => {
    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === achId && !a.unlocked) {
          handleEarnXP(a.xpReward);
          return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return a;
      })
    );
  };

  // Handle Ask Tutor from other tabs
  const handleAskTutor = (question: string) => {
    setTutorInitialQuery(question);
    setActiveTab('tutor');
  };

  // Load reaction into lab
  const handleLoadReactionToLab = (_rec: ReactionRecord) => {
    setActiveTab('lab');
  };

  const handleNavigateFromSearch = (tab: MasterTabType, _payload?: any) => {
    setActiveTab(tab);
  };

  // Navigation categories
  const navCategories = [
    {
      id: 'core',
      label: 'Main Dashboard',
      items: [
        { id: 'home', label: 'Home Command Center', icon: Home, color: 'text-cyan-400' },
        { id: 'exam', label: 'Exams & Olympiads', icon: Award, color: 'text-purple-400' },
        { id: 'gamification', label: 'Progress & Badges', icon: Trophy, color: 'text-amber-400' },
      ],
    },
    {
      id: 'labs',
      label: 'Virtual Labs',
      items: [
        { id: 'lab', label: '3D Reaction Lab', icon: Beaker, color: 'text-cyan-400' },
        { id: 'titration', label: 'Titration Lab', icon: FlaskConical, color: 'text-emerald-400' },
        { id: 'electrochem', label: 'Electrochemistry', icon: Zap, color: 'text-amber-400' },
        { id: 'practicals', label: 'SSC Practicals', icon: Layers, color: 'text-blue-400' },
      ],
    },
    {
      id: 'structure',
      label: 'Atoms & Bonding',
      items: [
        { id: 'atomic', label: 'Atomic Structure & Quantum', icon: Atom, color: 'text-violet-400' },
        { id: 'bonding', label: 'Chemical Bonding & VSEPR', icon: Share2, color: 'text-pink-400' },
        { id: 'trends', label: 'Periodic Trends & Reactivity', icon: TrendingUp, color: 'text-teal-400' },
      ],
    },
    {
      id: 'quant',
      label: 'Calculations & Stoichiometry',
      items: [
        { id: 'stoichiometry', label: 'Equation Balancing & Limiting', icon: Scale, color: 'text-emerald-400' },
        { id: 'solutions', label: 'Solutions, pH, Buffers & Redox', icon: Droplet, color: 'text-purple-400' },
        { id: 'physical', label: 'Gas Laws & Kinetics', icon: Gauge, color: 'text-amber-400' },
        { id: 'calculator', label: 'Chemistry Calculator Hub', icon: Calculator, color: 'text-sky-400' },
      ],
    },
    {
      id: 'specialized',
      label: 'Organic & Nuclear',
      items: [
        { id: 'organic', label: 'Organic Chemistry & Nuclear', icon: Flame, color: 'text-rose-400' },
        { id: 'nomenclature', label: 'Nomenclature & Formulas', icon: BookOpen, color: 'text-indigo-400' },
      ],
    },
    {
      id: 'ref',
      label: 'Reference & Aids',
      items: [
        { id: 'periodic', label: 'Periodic Table (118)', icon: FileSpreadsheet, color: 'text-cyan-400' },
        { id: 'compounds', label: 'Compounds & Radicals (3D)', icon: FlaskConical, color: 'text-teal-400' },
        { id: 'encyclopedia', label: 'Reaction Encyclopedia', icon: Sparkles, color: 'text-amber-400' },
        { id: 'notebook', label: `Notebook (${notebookEntries.length})`, icon: BookOpen, color: 'text-slate-300' },
        { id: 'tutor', label: 'AI Tutor', icon: Bot, color: 'text-purple-300' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigateFromSearch}
      />

      {/* Top Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-2.5 flex flex-col gap-2 shadow-2xl">
        {/* Brand Header Row */}
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <FlaskConical className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-100 tracking-tight group-hover:text-cyan-300 transition-colors">
                  LEGENDARY CHEMISTRY
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                  v2.0 World-Class
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Interactive Chemistry Learning, Simulation & Quantum Ecosystem
              </p>
            </div>
          </div>

          {/* Quick Hub Controls */}
          <div className="flex items-center gap-2">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-700 transition-all shadow-inner"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Global Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700 hidden sm:inline">
                ⌘K
              </kbd>
            </button>

            {/* XP & Streak Status */}
            <button
              onClick={() => setActiveTab('gamification')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-300 hover:bg-amber-900/30 transition-all"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-mono font-bold">{streakDays}d</span>
              <span className="text-slate-600">|</span>
              <span className="font-mono font-bold">{totalXP} XP</span>
            </button>

            {/* AI Tutor Quick Access */}
            <button
              onClick={() => setActiveTab('tutor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeTab === 'tutor'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                  : 'bg-purple-950/40 text-purple-300 border-purple-800/50 hover:bg-purple-900/40'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Tutor</span>
            </button>

            {/* Lab Notebook Quick Access */}
            <button
              onClick={() => setActiveTab('notebook')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeTab === 'notebook'
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Notebook</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px]">{notebookEntries.length}</span>
            </button>
          </div>
        </div>

        {/* Master Categorized Navigation Bar */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto scrollbar-thin">
          {navCategories.map((category) => (
            <div key={category.id} className="flex items-center gap-1 border-r border-slate-800/80 pr-2 mr-1 last:border-r-0 last:pr-0 last:mr-0">
              <span className="text-[10px] uppercase font-bold text-slate-500 px-1 hidden md:inline tracking-wider">
                {category.label}
              </span>
              {category.items.map((item) => {
                const Icon = item.icon;
                const isSelected = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as MasterTabType)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : item.color}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>
      </header>

      {/* Main Viewport Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col">
        {/* Command Center Homepage */}
        {activeTab === 'home' && (
          <CommandCenterHome
            onNavigate={(tab, payload) => handleNavigateFromSearch(tab, payload)}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenAiTutor={handleAskTutor}
            totalXP={totalXP}
            streakDays={streakDays}
            onEarnXP={handleEarnXP}
          />
        )}

        {/* Core Labs */}
        {activeTab === 'lab' && (
          <LabBench
            onAddNotebookEntry={handleAddNotebookEntry}
            onAskTutor={handleAskTutor}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}

        {activeTab === 'titration' && (
          <TitrationLab
            onAddNotebookEntry={handleAddNotebookEntry}
            onAskTutor={handleAskTutor}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}

        {activeTab === 'electrochem' && (
          <ElectrochemicalLab
            onAddNotebookEntry={handleAddNotebookEntry}
            onAskTutor={handleAskTutor}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}

        {activeTab === 'practicals' && (
          <PracticalsLab
            onAddNotebookEntry={handleAddNotebookEntry}
            onAskTutor={handleAskTutor}
            onUnlockAchievement={handleUnlockAchievement}
          />
        )}

        {/* Structure & Bonding Labs */}
        {activeTab === 'atomic' && (
          <AtomicStructureLab
            onAskTutor={handleAskTutor}
            onNavigateToBonding={(formula) => {
              if (formula) setBondingInitialFormula(formula);
              setActiveTab('bonding');
            }}
          />
        )}

        {activeTab === 'bonding' && (
          <ChemicalBondingLab
            onAskTutor={handleAskTutor}
            initialFormula={bondingInitialFormula}
          />
        )}

        {activeTab === 'trends' && (
          <PeriodicTrendsLab onAskTutor={handleAskTutor} />
        )}

        {/* Quantitative & Physical Chemistry Labs */}
        {activeTab === 'stoichiometry' && (
          <StoichiometryBalancerLab onAskTutor={handleAskTutor} />
        )}

        {activeTab === 'solutions' && (
          <SolutionsAcidsRedoxLab onAskTutor={handleAskTutor} />
        )}

        {activeTab === 'physical' && (
          <PhysicalChemistryLab onAskTutor={handleAskTutor} />
        )}

        {activeTab === 'calculator' && (
          <CalculatorHub onAskTutor={handleAskTutor} />
        )}

        {/* Specialized & Organic Labs */}
        {activeTab === 'organic' && (
          <OrganicNuclearLab onAskTutor={handleAskTutor} />
        )}

        {activeTab === 'nomenclature' && (
          <NomenclatureHub onAskTutor={handleAskTutor} />
        )}

        {/* Exam & Gamification */}
        {activeTab === 'exam' && (
          <ExamCenterLab
            onEarnXP={handleEarnXP}
            onAskTutor={handleAskTutor}
          />
        )}

        {activeTab === 'gamification' && (
          <GamificationCenter
            totalXP={totalXP}
            streakDays={streakDays}
            achievements={achievements}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* Reference & Tutoring */}
        {activeTab === 'compounds' && (
          <CompoundsDirectory />
        )}

        {activeTab === 'periodic' && (
          <PeriodicTable118 onAskTutor={handleAskTutor} />
        )}

        {activeTab === 'encyclopedia' && (
          <ReactionEncyclopedia
            onLoadReactionToLab={handleLoadReactionToLab}
            onAskTutor={handleAskTutor}
          />
        )}

        {activeTab === 'tutor' && (
          <AiTutorDrawer
            initialQuestion={tutorInitialQuery}
            onClearInitialQuestion={() => setTutorInitialQuery(null)}
            onSaveToNotebook={(title, notes) =>
              handleAddNotebookEntry({ title, results: notes, chemicals: [], observations: [] })
            }
          />
        )}

        {activeTab === 'notebook' && (
          <LabNotebook
            entries={notebookEntries}
            achievements={achievements}
            onDeleteEntry={(id) => setNotebookEntries(notebookEntries.filter((e) => e.id !== id))}
            onClearAll={() => setNotebookEntries([])}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900/90 py-4 px-6 text-center text-xs text-slate-500 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full">
        <div>
          Interactive Chemistry Learning & Simulation Platform © 2026 | SSC/HSC & Olympiad Companion
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>WebGL 3D Accelerated</span>
          <span>•</span>
          <span>Zero-Hallucination Reaction Engine</span>
          <span>•</span>
          <span>Real Scientific Mathematics</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
