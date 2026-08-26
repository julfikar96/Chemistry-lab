import React, { useState } from 'react';
import { getAll118Elements } from '../data/all118Elements';
import { ElementData, ElementCategory } from '../types';
import { Search, Sparkles } from 'lucide-react';
import { Atom3DView } from './Atom3DView';

const ALL_118_ELEMENTS = getAll118Elements();

interface PeriodicTable118Props {
  onAskTutor?: (question: string) => void;
}

export const PeriodicTable118: React.FC<PeriodicTable118Props> = ({ onAskTutor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ElementCategory | 'ALL'>('ALL');
  const [inspectedElement, setInspectedElement] = useState<ElementData | null>(ALL_118_ELEMENTS[0]);

  // Color mapping for element categories
  const getCategoryColor = (cat: ElementCategory) => {
    switch (cat) {
      case 'alkali-metal':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30';
      case 'alkaline-earth':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30';
      case 'transition-metal':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30';
      case 'post-transition-metal':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/30';
      case 'metalloid':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30';
      case 'reactive-nonmetal':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/40 hover:bg-teal-500/30';
      case 'noble-gas':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 hover:bg-purple-500/30';
      case 'lanthanide':
        return 'bg-pink-500/20 text-pink-300 border-pink-500/40 hover:bg-pink-500/30';
      case 'actinide':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40 hover:bg-orange-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Filter elements
  const filteredElements = ALL_118_ELEMENTS.filter((el) => {
    const matchesSearch =
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.banglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.number.toString() === searchQuery;

    const matchesCategory = selectedCategory === 'ALL' || el.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Controls */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>⚛️</span>
              <span>Complete Periodic Table of 118 Elements</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Detailed database based on electron configuration, bonding, atomic mass, phase and group
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="The name, symbol or atomic number of the element..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Category Legend & Filter */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-cyan-500 text-slate-950 font-bold'
                : 'bg-slate-950 text-slate-400 border border-slate-800'
            }`}
          >
            all ({ALL_118_ELEMENTS.length})
          </button>
          {(
            [
              'alkali-metal',
              'alkaline-earth',
              'transition-metal',
              'post-transition-metal',
              'metalloid',
              'reactive-nonmetal',
              'noble-gas',
              'lanthanide',
              'actinide',
            ] as ElementCategory[]
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? 'ALL' : cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-400 text-slate-950 font-bold'
                  : getCategoryColor(cat)
              }`}
            >
              {cat === 'alkali-metal'
                ? 'Alkali metals'
                : cat === 'alkaline-earth'
                ? 'Pottery metal'
                : cat === 'transition-metal'
                ? 'transition metal'
                : cat === 'metalloid'
                ? 'nonmetal'
                : cat === 'reactive-nonmetal'
                ? 'non-metal'
                : cat === 'noble-gas'
                ? 'inert gas'
                : cat === 'lanthanide'
                ? 'Lanthanide'
                : cat === 'actinide'
                ? 'Actinide'
                : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Periodic Grid + Element Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Scrollable Interactive Periodic Table Grid (8 Cols) */}
        <div className="lg:col-span-8 p-4 rounded-3xl bg-slate-900/80 border border-slate-800 overflow-x-auto shadow-2xl">
          <div className="min-w-[760px] flex flex-col gap-1.5">
            {/* Period Rows 1 to 7 */}
            {[1, 2, 3, 4, 5, 6, 7].map((period) => (
              <div key={period} className="flex gap-1">
                <div className="w-5 h-12 flex items-center justify-center text-[10px] font-mono text-slate-500">
                  P{period}
                </div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((group) => {
                  const element = ALL_118_ELEMENTS.find(
                    (e) => e.period === period && e.group === group
                  );

                  if (!element) {
                    return <div key={'spacer-' + group} className="w-10 h-12" />;
                  }

                  const isInspected = inspectedElement?.number === element.number;
                  const isFilteredOut = !filteredElements.find(fe => fe.number === element.number);

                  return (
                    <button
                      key={element.number}
                      onClick={() => setInspectedElement(element)}
                      className={`w-10 h-12 rounded-lg border p-1 flex flex-col items-center justify-between transition-all active:scale-90 ${isFilteredOut ? 'opacity-20 grayscale scale-95' : ''} ${
                        isInspected
                          ? 'ring-2 ring-cyan-400 scale-105 z-10 shadow-lg'
                          : ''
                      } ${getCategoryColor(element.category)}`}
                    >
                      <div className="w-full flex justify-between text-[8px] font-mono leading-none">
                        <span>{element.number}</span>
                      </div>
                      <span className="text-xs font-black leading-none">{element.symbol}</span>
                      <span className="text-[7px] truncate max-w-full leading-none">
                        {element.banglaName}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}

            {/* Lanthanides & Actinides Separate Rows */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col gap-1 pl-6">
              {/* Lanthanides (57-71) */}
              <div className="flex gap-1 items-center">
                <span className="text-[9px] font-bold text-pink-400 w-16">Lanthanides:</span>
                {ALL_118_ELEMENTS.filter((e) => e.number >= 57 && e.number <= 71).map(
                  (element) => (
                    <button
                      key={element.number}
                      onClick={() => setInspectedElement(element)}
                      className={`w-9 h-11 rounded-lg border p-1 flex flex-col items-center justify-between transition-all ${
                        inspectedElement?.number === element.number
                          ? 'ring-2 ring-cyan-400 scale-105 z-10'
                          : ''
                      } ${getCategoryColor(element.category)}`}
                    >
                      <span className="text-[8px] font-mono">{element.number}</span>
                      <span className="text-xs font-bold">{element.symbol}</span>
                    </button>
                  )
                )}
              </div>

              {/* Actinides (89-103) */}
              <div className="flex gap-1 items-center">
                <span className="text-[9px] font-bold text-orange-400 w-16">Actinide:</span>
                {ALL_118_ELEMENTS.filter((e) => e.number >= 89 && e.number <= 103).map(
                  (element) => (
                    <button
                      key={element.number}
                      onClick={() => setInspectedElement(element)}
                      className={`w-9 h-11 rounded-lg border p-1 flex flex-col items-center justify-between transition-all ${
                        inspectedElement?.number === element.number
                          ? 'ring-2 ring-cyan-400 scale-105 z-10'
                          : ''
                      } ${getCategoryColor(element.category)}`}
                    >
                      <span className="text-[8px] font-mono">{element.number}</span>
                      <span className="text-xs font-bold">{element.symbol}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Detailed Element Inspector Card (4 Cols) */}
        <div className="lg:col-span-4">
          {inspectedElement ? (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col gap-4">
              {/* Element Header Card */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-14 h-14 rounded-2xl border flex flex-col items-center justify-center shadow-lg ${getCategoryColor(
                      inspectedElement.category
                    )}`}
                  >
                    <span className="text-[10px] font-mono">{inspectedElement.number}</span>
                    <span className="text-xl font-black">{inspectedElement.symbol}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{inspectedElement.banglaName}</h3>
                    <span className="text-xs text-slate-400">{inspectedElement.name}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {inspectedElement.mass.toFixed(2)} u
                  </span>
                  <span className="text-[10px] text-slate-400">{inspectedElement.banglaState}</span>
                </div>
              </div>

              {/* Electron Configuration & Shell Distribution */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Electron Configuration:</span>
                  <span className="text-[10px] font-mono text-cyan-400">
                    K, L, M, N: {inspectedElement.shellConfig.join(', ')}
                  </span>
                </div>
                <div className="p-2 bg-slate-900 rounded-xl font-mono text-xs text-amber-300 font-semibold overflow-x-auto">
                  {inspectedElement.electronConfig}
                </div>

                {/* Visual 3D Atomic Model Representation */}
                <div className="flex items-center justify-center py-2">
                  <Atom3DView element={inspectedElement} />
                </div>
              </div>

              {/* Element Properties Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[10px] text-slate-400">Stages and Groups:</span>
                  <span className="font-semibold text-slate-200">
                    stage {inspectedElement.period}, group {inspectedElement.group || 'F-Block'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[10px] text-slate-400">Suitable Electrons and Oxidation Values:</span>
                  <span className="font-semibold text-cyan-300 font-mono">
                    {inspectedElement.valenceElectrons} (e⁻), {inspectedElement.oxidationStates}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[10px] text-slate-400">Melting Point:</span>
                  <span className="font-semibold text-slate-200 font-mono">
                    {inspectedElement.meltingPoint ? `${inspectedElement.meltingPoint} °C` : 'N/A'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[10px] text-slate-400">Boiling Point:</span>
                  <span className="font-semibold text-slate-200 font-mono">
                    {inspectedElement.boilingPoint ? `${inspectedElement.boilingPoint} °C` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Bangla Description & Uses */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <p>
                  <strong>Uses and Importance:</strong> {inspectedElement.usesBangla}
                </p>
                {inspectedElement.safetyNoteBangla && (
                  <div className="mt-2 pt-2 border-t border-slate-900 text-[11px] text-amber-400">
                    ⚠️ {inspectedElement.safetyNoteBangla}
                  </div>
                )}
              </div>

              {/* Ask Tutor about this element */}
              <button
                onClick={() =>
                  onAskTutor?.(
                    `${inspectedElement.banglaName} (${inspectedElement.symbol}) Explain in detail its electron configuration, structure and its position in the periodic table।`
                  )
                }
                className="py-3 px-4 rounded-2xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-600/50 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Ask the AI ​​teacher about the element</span>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
