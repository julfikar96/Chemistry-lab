import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Atom, FlaskConical, Beaker, Calculator, Sparkles, BookOpen, ArrowRight, Zap, Flame, Droplet, Gauge } from 'lucide-react';
import { getAll118Elements } from '../data/all118Elements';
import { CHEMICAL_DATABASE } from '../data/chemicals';
import { VERIFIED_REACTIONS } from '../data/reactions';
import { MasterTabType } from '../App';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: MasterTabType, payload?: any) => void;
}

interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  category: 'element' | 'compound' | 'reaction' | 'lab' | 'calculator' | 'topic';
  icon: React.ComponentType<{ className?: string }>;
  tab: MasterTabType;
  payload?: any;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build searchable database
  const allSearchableItems: SearchResultItem[] = useMemo(() => {
    const items: SearchResultItem[] = [];

    // 1. Elements
    getAll118Elements().forEach((el) => {
      items.push({
        id: `el_${el.number}`,
        title: `${el.name} (${el.symbol}) - ${el.banglaName}`,
        subtitle: `Atomic Number: ${el.number} | Mass: ${el.mass.toFixed(2)} | Group: ${el.group}, Period: ${el.period} | ${el.electronConfig}`,
        badge: 'Element',
        category: 'element',
        icon: Atom,
        tab: 'periodic',
        payload: el,
      });
    });

    // 2. Compounds / Chemicals
    CHEMICAL_DATABASE.forEach((c) => {
      items.push({
        id: `chem_${c.id}`,
        title: `${c.formula} - ${c.banglaName} (${c.name})`,
        subtitle: `Molar Mass: ${c.molarMass} g/mol | pH: ${c.pH} | Category: ${c.category} | ${c.banglaDescription.slice(0, 60)}...`,
        badge: 'Chemical Compound',
        category: 'compound',
        icon: FlaskConical,
        tab: 'compounds',
        payload: c,
      });
    });

    // 3. Reactions
    VERIFIED_REACTIONS.forEach((r) => {
      items.push({
        id: `rxn_${r.id}`,
        title: `${r.banglaName}: ${r.balancedEquation}`,
        subtitle: `Type: ${r.reactionTypes.join(', ')} | Thermal State: ${r.thermalType} | ${r.explanation.slice(0, 70)}...`,
        badge: 'Reaction',
        category: 'reaction',
        icon: Sparkles,
        tab: 'encyclopedia',
        payload: r,
      });
    });

    // 4. Calculators
    const calculators = [
      { id: 'calc_molar', title: 'Molar Mass & % Composition Calculator', tab: 'calculator' as MasterTabType },
      { id: 'calc_dilution', title: 'Molarity Dilution Formula (M1V1 = M2V2)', tab: 'solutions' as MasterTabType },
      { id: 'calc_nernst', title: 'Nernst Equation & Cell Potential Calculator (Ecell)', tab: 'calculator' as MasterTabType },
      { id: 'calc_gas', title: 'Ideal Gas Equation & Boyle-Charles Simulator (PV=nRT)', tab: 'physical' as MasterTabType },
      { id: 'calc_ph_buffer', title: 'pH Scale & Henderson-Hasselbalch Buffer Equation', tab: 'solutions' as MasterTabType },
      { id: 'calc_yield', title: 'Limiting Reagent & % Yield Calculator', tab: 'stoichiometry' as MasterTabType },
      { id: 'calc_ksp', title: 'Solubility Product (Ksp) & Precipitation Conditions (Qsp vs Ksp)', tab: 'solutions' as MasterTabType },
      { id: 'calc_half_life', title: 'Nuclear Decay & Half-life Calculator', tab: 'organic' as MasterTabType },
    ];

    calculators.forEach((c) => {
      items.push({
        id: c.id,
        title: c.title,
        subtitle: 'Interactive Scientific Calculator & Parameter Simulation',
        badge: 'Calculator',
        category: 'calculator',
        icon: Calculator,
        tab: c.tab,
      });
    });

    // 5. Labs & Studios
    items.push(
      {
        id: 'lab_bench',
        title: 'Virtual 3D Reaction Lab',
        subtitle: 'Beakers, test tubes, flasks, temperature, pH & realistic color change simulation',
        badge: 'Laboratory',
        category: 'lab',
        icon: Beaker,
        tab: 'lab',
      },
      {
        id: 'lab_titration',
        title: 'Titration Master Simulator (Lab & Curves)',
        subtitle: 'Burette dropper, indicators (Phenolphthalein, Methyl Orange), pH graph & unknown concentration determination',
        badge: 'Laboratory',
        category: 'lab',
        icon: Droplet,
        tab: 'titration',
      },
      {
        id: 'lab_atomic',
        title: 'Atomic Structure & Quantum Lab (Bohr Model & Quantum Orbitals)',
        subtitle: 'Proton-neutron-electron builder, Bohr orbits, Aufbau & Hund\'s rule orbital filling',
        badge: 'Quantum Lab',
        category: 'lab',
        icon: Atom,
        tab: 'atomic',
      },
      {
        id: 'lab_bonding',
        title: 'Chemical Bonding & VSEPR 3D Studio (Molecular 3D)',
        subtitle: 'Lewis dot structures, hybridization (sp, sp2, sp3), bond angles & 3D molecule visualizer',
        badge: 'Bonding Studio',
        category: 'lab',
        icon: Zap,
        tab: 'bonding',
      },
      {
        id: 'lab_electro',
        title: 'Electrochemical Cells & Galvanic Daniell Cell (Electrochemistry Lab)',
        subtitle: 'Anode, cathode, salt bridge, electron flow & Faraday\'s laws of electrolysis',
        badge: 'Electrochemistry Lab',
        category: 'lab',
        icon: Zap,
        tab: 'electrochem',
      },
      {
        id: 'lab_organic',
        title: 'Organic Chemistry, IUPAC Nomenclature & Nuclear Decay (Organic & Nuclear Studio)',
        subtitle: 'Functional groups, Isomerism, polymers & Alpha-Beta-Gamma radioactivity',
        badge: 'Organic & Nuclear',
        category: 'lab',
        icon: Flame,
        tab: 'organic',
      }
    );

    return items;
  }, []);

  // Filter items based on query
  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      // Return top highlights when query is empty
      return allSearchableItems.slice(0, 10);
    }

    const q = query.toLowerCase().trim();
    return allSearchableItems
      .filter((item) => {
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.badge.toLowerCase().includes(q)
        );
      })
      .slice(0, 15);
  }, [query, allSearchableItems]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === 'Enter' && filteredResults[selectedIndex]) {
        e.preventDefault();
        handleSelect(filteredResults[selectedIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  const handleSelect = (item: SearchResultItem) => {
    onNavigate(item.tab, item.payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/80 backdrop-blur-md transition-all animate-in fade-in">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] border-slate-700 ring-1 ring-cyan-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search for any element, compound, reaction, equation, or calculator (e.g. NaCl, Boyle, pH, HCl, H2O, Zn)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded-lg bg-slate-800 text-[11px] text-slate-400 font-mono border border-slate-700 hover:bg-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 scrollbar-thin divide-y divide-slate-800/40">
          {filteredResults.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Search className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-slate-300">No results found</p>
              <p className="text-[11px] text-slate-500 mt-1">Search using another chemical formula, element name, or topic</p>
            </div>
          ) : (
            filteredResults.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full p-3 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-3 text-left ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-800/90 border border-cyan-500/40 shadow-md'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-800 text-cyan-400 border border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-100 truncate">{item.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-slate-800/90 text-cyan-300 border border-slate-700">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-cyan-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <div className="flex items-center gap-3">
            <span><strong className="text-slate-300">↑↓</strong> Navigation</span>
            <span><strong className="text-slate-300">Enter</strong> Select</span>
            <span><strong className="text-slate-300">Esc</strong> Close</span>
          </div>
          <span className="text-cyan-400/80 text-[10px]">Unified Chemistry Search</span>
        </div>
      </div>
    </div>
  );
};
