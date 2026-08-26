import React, { useState } from 'react';
import { POLYATOMIC_IONS } from '../data/chemistryDatabase';
import {
  BookOpen,
  Sparkles,
  Layers,
  ArrowRight,
  Search,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
}

interface CommonChemicalTrivial {
  formula: string;
  chemicalName: string;
  trivialName: string;
  banglaTrivial: string;
  usesBangla: string;
}

const COMMON_TRIVIAL_NAMES: CommonChemicalTrivial[] = [
  {
    formula: 'NaHCO₃',
    chemicalName: 'Sodium Hydrogen Carbonate',
    trivialName: 'Baking Soda',
    banglaTrivial: 'Baking soda / baking soda',
    usesBangla: 'Used to leaven cakes and breads and as an antacid।',
  },
  {
    formula: 'Na₂CO₃·10H₂O',
    chemicalName: 'Sodium Carbonate Decahydrate',
    trivialName: 'Washing Soda',
    banglaTrivial: 'Washing Soda / Washing Soda',
    usesBangla: 'Used in detergent and glass industry।',
  },
  {
    formula: 'CuSO₄·5H₂O',
    chemicalName: 'Copper(II) Sulfate Pentahydrate',
    trivialName: 'Blue Vitriol',
    banglaTrivial: 'Mulberry (Blue Vitriol)',
    usesBangla: 'Used in fungicides (Bordeaux mixture) and power cells।',
  },
  {
    formula: 'FeSO₄·7H₂O',
    chemicalName: 'Iron(II) Sulfate Heptahydrate',
    trivialName: 'Green Vitriol',
    banglaTrivial: 'Hiraks (Green Vitriol)',
    usesBangla: 'Used in making ink and medicine for anemia।',
  },
  {
    formula: 'ZnSO₄·7H₂O',
    chemicalName: 'Zinc Sulfate Heptahydrate',
    trivialName: 'White Vitriol',
    banglaTrivial: 'White Vitriol',
    usesBangla: 'Zinc is used in fertilizers and skin ointments।',
  },
  {
    formula: 'CaO',
    chemicalName: 'Calcium Oxide',
    trivialName: 'Quicklime',
    banglaTrivial: 'Quick lime',
    usesBangla: 'In cement making and drinking water purification।',
  },
  {
    formula: 'Ca(OH)₂',
    chemicalName: 'Calcium Hydroxide',
    trivialName: 'Slaked Lime',
    banglaTrivial: 'Lime / slaked lime',
    usesBangla: 'The walls of the house are limed and the acidity of the soil is reduced।',
  },
  {
    formula: 'CaSO₄·2H₂O',
    chemicalName: 'Calcium Sulfate Dihydrate',
    trivialName: 'Gypsum',
    banglaTrivial: 'Gypsum',
    usesBangla: 'To delay the setting of cement and in making plaster of Paris।',
  },
  {
    formula: 'CaSO₄·½H₂O',
    chemicalName: 'Calcium Sulfate Hemihydrate',
    trivialName: 'Plaster of Paris',
    banglaTrivial: 'Plaster of Paris',
    usesBangla: 'In making bandages and idols to fix broken bones।',
  },
  {
    formula: 'NH₄Cl',
    chemicalName: 'Ammonium Chloride',
    trivialName: 'Sal Ammoniac',
    banglaTrivial: 'Nisha Dal',
    usesBangla: 'In dry cell electroanalysis and drug preparation।',
  },
  {
    formula: 'CH₃COOH (6-10%)',
    chemicalName: 'Dilute Ethanoic Acid',
    trivialName: 'Vinegar',
    banglaTrivial: 'Vinegar',
    usesBangla: 'In pickle preservation and food processing।',
  },
  {
    formula: 'N₂O',
    chemicalName: 'Dinitrogen Monoxide',
    trivialName: 'Laughing Gas',
    banglaTrivial: 'Laughing gas',
    usesBangla: 'Used as a mild anesthetic in dentistry।',
  },
];

export function NomenclatureHub({ onAskTutor }: Props) {
  const [activeTab, setActiveTab] = useState<'generator' | 'trivial' | 'polyatomic'>('generator');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Interactive Name Generator State
  const [selectedCation, setSelectedCation] = useState<string>('Fe3+');
  const [selectedAnion, setSelectedAnion] = useState<string>('SO42-');

  const cationsList = [
    { id: 'Na+', name: 'Sodium', bangla: 'Sodium', valency: 1 },
    { id: 'K+', name: 'Potassium', bangla: 'potassium', valency: 1 },
    { id: 'Mg2+', name: 'Magnesium', bangla: 'magnesium', valency: 2 },
    { id: 'Ca2+', name: 'Calcium', bangla: 'calcium', valency: 2 },
    { id: 'Al3+', name: 'Aluminium', bangla: 'Aluminum', valency: 3 },
    { id: 'Fe2+', name: 'Iron(II) / Ferrous', bangla: 'Iron(II) / Ferrous', valency: 2 },
    { id: 'Fe3+', name: 'Iron(III) / Ferric', bangla: 'Iron(III) / Ferric', valency: 3 },
    { id: 'Cu2+', name: 'Copper(II) / Cupric', bangla: 'Copper(II) / cupric', valency: 2 },
    { id: 'NH4+', name: 'Ammonium', bangla: 'Ammonium', valency: 1 },
  ];

  const anionsList = [
    { id: 'Cl-', name: 'Chloride', bangla: 'Chloride', formula: 'Cl', valency: 1 },
    { id: 'O2-', name: 'Oxide', bangla: 'oxide', formula: 'O', valency: 2 },
    { id: 'SO42-', name: 'Sulfate', bangla: 'Sulphate', formula: 'SO₄', isPoly: true, valency: 2 },
    { id: 'NO3-', name: 'Nitrate', bangla: 'Nitrate', formula: 'NO₃', isPoly: true, valency: 1 },
    { id: 'CO32-', name: 'Carbonate', bangla: 'Carbonate', formula: 'CO₃', isPoly: true, valency: 2 },
    { id: 'PO43-', name: 'Phosphate', bangla: 'Phosphate', formula: 'PO₄', isPoly: true, valency: 3 },
    { id: 'OH-', name: 'Hydroxide', bangla: 'Hydroxide', formula: 'OH', isPoly: true, valency: 1 },
  ];

  // Compound calculation
  const curCat = cationsList.find((c) => c.id === selectedCation) || cationsList[0];
  const curAn = anionsList.find((a) => a.id === selectedAnion) || anionsList[0];

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const div = gcd(curCat.valency, curAn.valency);
  const catSub = curAn.valency / div;
  const anSub = curCat.valency / div;

  const catSymbol = curCat.id.replace(/[0-9\+\-]/g, '');
  const anSymbol = curAn.isPoly && anSub > 1 ? `(${curAn.formula})` : curAn.formula;

  const generatedFormula = `${catSymbol}${catSub > 1 ? catSub : ''}${anSymbol}${anSub > 1 ? anSub : ''}`;
  const generatedCompoundName = `${curCat.name} ${curAn.name}`;
  const generatedCompoundBangla = `${curCat.bangla} ${curAn.bangla}`;

  const filteredTrivial = COMMON_TRIVIAL_NAMES.filter(
    (t) =>
      t.formula.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.trivialName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      t.banglaTrivial.includes(searchFilter) ||
      t.chemicalName.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Chemical nomenclature, signal generator and commercial nomenclature hub</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                Nomenclature & Trivial Names
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Name ionic and covalent compounds $\leftrightarrow$ Signal exchange, stock system (Stock System) and more common trading names
            </p>
          </div>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'generator'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Signal and Name Generator (Cross-Valency)</span>
        </button>

        <button
          onClick={() => setActiveTab('trivial')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'trivial'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Directory of Commercial and Common Names</span>
        </button>

        <button
          onClick={() => setActiveTab('polyatomic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'polyatomic'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Compound and Charge Chart (Polyatomic Ions)</span>
        </button>
      </div>

      {/* TAB 1: FORMULA GENERATOR */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Cross-Over Rule</span>
            </h3>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-300 block">Cation selectivity:</span>
                <select
                  value={selectedCation}
                  onChange={(e) => setSelectedCation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-slate-200"
                >
                  {cationsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id}) [plan: {c.valency}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 block">Anion/compound selection:</span>
                <select
                  value={selectedAnion}
                  onChange={(e) => setSelectedAnion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 font-mono text-slate-200"
                >
                  {anionsList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.formula}) [plan: {a.valency}]
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Result Box */}
            <div className="p-6 rounded-2xl bg-indigo-950/30 border border-indigo-500/40 flex flex-col items-center justify-center gap-3 text-center">
              <span className="text-[10px] text-indigo-300 uppercase font-semibold">Molecular signals of compounds formed:</span>
              <div className="text-3xl font-black text-white font-mono tracking-wider">{generatedFormula}</div>
              <div className="text-sm font-bold text-indigo-200">{generatedCompoundName}</div>
              <div className="text-xs text-slate-400">{generatedCompoundBangla}</div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100">Stock Method (Stock Notation)</h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Metals exhibiting variable composition (eg: $Fe, Cu, Sn, Pb, Cr, Mn$) Its oxidation state is expressed in Roman numerals next to the name:
            </p>
            <div className="space-y-2 text-[11px]">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                <strong className="text-cyan-300">FeCl₂:</strong> Iron(II) chloride (ferrous chloride)
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono">
                <strong className="text-rose-300">FeCl₃:</strong> Iron(III) chloride (ferric chloride)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRIVIAL & COMMERCIAL NAMES */}
      {activeTab === 'trivial' && (
        <div className="flex flex-col gap-4 text-xs">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by trade name or signal (eg: mulberry, baking soda, CuSO4)..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTrivial.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-cyan-300 text-sm font-bold">{item.formula}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold">
                    {item.trivialName}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{item.banglaTrivial}</div>
                <div className="text-[10px] text-slate-400 font-mono">{item.chemicalName}</div>
                <p className="text-[11px] text-slate-300 pt-1 border-t border-slate-800">{item.usesBangla}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: POLYATOMIC IONS */}
      {activeTab === 'polyatomic' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {POLYATOMIC_IONS.map((ion) => (
            <div key={ion.formula} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-black text-indigo-300">{ion.formula}</span>
                <span className="px-2 py-0.5 rounded bg-slate-950 text-slate-400 font-mono text-[10px]">
                  Charges: {ion.charge > 0 ? `+${ion.charge}` : ion.charge} (plan: {ion.valency})
                </span>
              </div>
              <div className="font-bold text-white text-xs">{ion.banglaName}</div>
              <div className="text-[10px] text-slate-400 font-mono">{ion.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
