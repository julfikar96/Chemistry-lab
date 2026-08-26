import React, { useState } from 'react';
import { ALL_118_ELEMENTS } from '../data/all118Elements';
import {
  TrendingUp,
  Activity,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
}

export function PeriodicTrendsLab({ onAskTutor }: Props) {
  const [selectedProperty, setSelectedProperty] = useState<'radius' | 'electronegativity' | 'ionization' | 'electronAffinity'>('radius');
  const [selectedPeriod, setSelectedPeriod] = useState<number>(3); // Period 3 (Na to Ar)

  // Reactivity Displacement Simulator State
  const [metalA, setMetalA] = useState<string>('Zn');
  const [metalBSalt, setMetalBSalt] = useState<string>('CuSO4');

  // Reactivity series hierarchy (Higher index = higher reactivity)
  const reactivityHierarchy: Record<string, { rank: number; name: string; standardE0: number }> = {
    K: { rank: 14, name: 'Potassium (K)', standardE0: -2.93 },
    Na: { rank: 13, name: 'Sodium (Na)', standardE0: -2.71 },
    Ca: { rank: 12, name: 'Calcium (Ca)', standardE0: -2.87 },
    Mg: { rank: 11, name: 'magnesium (Mg)', standardE0: -2.37 },
    Al: { rank: 10, name: 'Aluminum (Al)', standardE0: -1.66 },
    Zn: { rank: 9, name: 'Zinc (Zn)', standardE0: -0.76 },
    Fe: { rank: 8, name: 'Iron (Fe)', standardE0: -0.44 },
    Pb: { rank: 7, name: 'Lead (Pb)', standardE0: -0.13 },
    H: { rank: 6, name: 'Hydrogen (H)', standardE0: 0.00 },
    Cu: { rank: 5, name: 'Copper (Cu)', standardE0: +0.34 },
    Ag: { rank: 4, name: 'Silver (Ag)', standardE0: +0.80 },
    Au: { rank: 3, name: 'Gold (Au)', standardE0: +1.50 },
  };

  const periodElements = ALL_118_ELEMENTS.filter((e) => e.period === selectedPeriod).sort((a, b) => a.group - b.group);

  // Metal Displacement Evaluation
  const metalBMatch = metalBSalt.match(/^[A-Z][a-z]?/);
  const metalBSymbol = metalBMatch ? metalBMatch[0] : 'Cu';

  const rankA = reactivityHierarchy[metalA]?.rank || 0;
  const rankB = reactivityHierarchy[metalBSymbol]?.rank || 0;

  const isDisplacementPossible = rankA > rankB;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-teal-950/40 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Periodical Religions and Metals Activism Series Lab</span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold border border-teal-500/30">
                Periodic Trends & Reactivity
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Atomic size, electronegativity, ionization energy, electron affinity and substitution reaction simulation of metals
            </p>
          </div>
        </div>
      </div>

      {/* Property Selectors */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { id: 'radius', label: 'Atomic Radius', unit: 'pm' },
          { id: 'electronegativity', label: 'Electronegativity (Pauling Scale)', unit: '' },
          { id: 'ionization', label: '1st Ionization Energy', unit: 'kJ/mol' },
          { id: 'electronAffinity', label: 'Electron Affinity', unit: 'kJ/mol' },
        ].map((prop) => (
          <button
            key={prop.id}
            onClick={() => setSelectedProperty(prop.id as any)}
            className={`p-3.5 rounded-2xl text-left border transition-all ${
              selectedProperty === prop.id
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-lg'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className="text-xs font-bold block">{prop.label}</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">{prop.unit}</span>
          </button>
        ))}
      </div>

      {/* Period Selector & Trend Chart */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              <span>Graph of periodic changes along the period (Period {selectedPeriod})</span>
            </h3>
            <span className="text-xs text-slate-400">A definite change in religion as one proceeds from left to right</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 mr-1">Phase:</span>
            {[1, 2, 3, 4, 5, 6].map((p) => (
              <button
                key={p}
                onClick={() => setSelectedPeriod(p)}
                className={`w-8 h-8 rounded-xl font-mono text-xs font-bold border transition-all ${
                  selectedPeriod === p
                    ? 'bg-teal-500 text-slate-950 border-teal-400'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-900'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-64 flex items-end gap-3 pt-6 px-2 overflow-x-auto">
          {periodElements.map((elem) => {
            let val = 0;
            if (selectedProperty === 'radius') val = elem.atomicRadius || 100;
            else if (selectedProperty === 'electronegativity') val = (elem.electronegativity || 1) * 40;
            else if (selectedProperty === 'ionization') val = (elem.ionizationEnergy || 500) / 10;
            else if (selectedProperty === 'electronAffinity') val = Math.max(10, elem.electronAffinity || 50);

            const displayVal =
              selectedProperty === 'radius'
                ? `${elem.atomicRadius} pm`
                : selectedProperty === 'electronegativity'
                ? elem.electronegativity
                : selectedProperty === 'ionization'
                ? `${elem.ionizationEnergy} kJ`
                : `${elem.electronAffinity} kJ`;

            const maxBarHeight = 180;
            const barHeight = Math.min(maxBarHeight, Math.max(20, val * 0.8));

            return (
              <div key={elem.number} className="flex-1 flex flex-col items-center gap-2 min-w-[48px]">
                <span className="text-[10px] text-teal-300 font-mono font-bold whitespace-nowrap">{displayVal}</span>
                <div
                  style={{ height: `${barHeight}px` }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-teal-600 to-teal-400 shadow-lg shadow-teal-500/20 transition-all hover:brightness-125"
                />
                <div className="text-center pt-1 border-t border-slate-800 w-full">
                  <span className="font-bold text-xs text-white font-mono block">{elem.symbol}</span>
                  <span className="text-[9px] text-slate-400 block">{elem.banglaName}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trend Summary Description */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
          {selectedProperty === 'radius' && (
            <p>
              <strong>Trends in Atomic Radius:</strong> As the number of protons in the nucleus increases from left to right in the same phase, the effective nuclear charge increases, but no new energy levels are added.। As a result the electrons are strongly attracted towards the nucleus and the size of the atom decreases।
            </p>
          )}
          {selectedProperty === 'electronegativity' && (
            <p>
              <strong>Tendency to Electronegativity:</strong> The ability of a covalent bond to attract electron pairs towards itself is called electronegativity। As the size decreases from left to right at the same stage, the attraction of the nucleus increases and the electronegativity increases (maximum value of 3.98 for fluorine).।
            </p>
          )}
          {selectedProperty === 'ionization' && (
            <p>
              <strong>Trends in Ionization Energy:</strong> The energy required to remove 1 electron from the valence shell of an atom in the gaseous state to form a single positive ion। At the same level the attraction of the nucleus increases as the size decreases, hence the ionization energy increases (exception: half filled/full orbitals).।
            </p>
          )}
          {selectedProperty === 'electronAffinity' && (
            <p>
              <strong>Tendency of electron attachment:</strong> The amount of energy released to add 1 electron to the outermost layer of a gaseous atom to form a negative ion। Halogens (Group 17) have the highest electron affinity (chlorine &gt; fluorine)।
            </p>
          )}
        </div>
      </div>

      {/* REACTIVITY SERIES & SINGLE DISPLACEMENT SIMULATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" />
            <span>Metal activation series and substitution reaction simulator</span>
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Free Metal (Metal A):</label>
              <select
                value={metalA}
                onChange={(e) => setMetalA(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-200"
              >
                {Object.keys(reactivityHierarchy).map((k) => (
                  <option key={k} value={k}>
                    {reactivityHierarchy[k].name} (E° = {reactivityHierarchy[k].standardE0}V)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Salt solution (Metal B Salt):</label>
              <select
                value={metalBSalt}
                onChange={(e) => setMetalBSalt(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-200"
              >
                <option value="CuSO4">CuSO₄ (copper sulfate solution)</option>
                <option value="AgNO3">AgNO₃ (silver nitrate solution)</option>
                <option value="FeSO4">FeSO₄ ((iron sulfate solution)</option>
                <option value="ZnSO4">ZnSO₄ (zinc sulfate solution)</option>
                <option value="HCl">2HCl (hydrochloric acid)</option>
              </select>
            </div>
          </div>

          {/* Reaction Simulation Box */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isDisplacementPossible
              ? 'bg-teal-950/30 border-teal-500/40 text-teal-200'
              : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
          }`}>
            <span className="text-[10px] uppercase font-semibold block">Predict the reaction equation:</span>
            <div className="text-lg font-bold font-mono my-1">
              {isDisplacementPossible ? (
                <span>
                  {metalA} + {metalBSalt} → {metalA}
                  {metalBSalt.includes('SO4') ? 'SO₄' : metalBSalt.includes('NO3') ? '(NO₃)₂' : 'Cl₂'} + {metalBSymbol}
                </span>
              ) : (
                <span>{metalA} + {metalBSalt} → No Reaction</span>
              )}
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {isDisplacementPossible
                ? `✅ ${metalA} In metal activation series ${metalBSymbol} It is from the salt as it is located above ${metalBSymbol}-Who will replace।`
                : `❌ ${metalA} As the metal is less active it is from salt ${metalBSymbol}-Can't replace who।`}
            </p>
          </div>
        </div>

        {/* Reactivity Hierarchy List */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 text-xs">
          <h4 className="text-sm font-bold text-slate-100">Activity Order of Metals (Master List)</h4>
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 font-mono leading-relaxed">
            K &gt; Na &gt; Ca &gt; Mg &gt; Al &gt; Zn &gt; Fe &gt; Pb &gt; [H] &gt; Cu &gt; Ag &gt; Au
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            <strong>Rhythm to remember:</strong> K (K) Na (Na) Ca (Ca) Ma (Mg) Al (Al) John (Zn) Fele (Fe) Pabe (Pb) Ha (H) Kulangar (Cu) Az (Ag) Patay (Pt) Me (Au)।
          </p>
        </div>
      </div>
    </div>
  );
}
