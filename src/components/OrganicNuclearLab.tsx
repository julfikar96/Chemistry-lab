import React, { useState } from 'react';
import { ORGANIC_FUNCTIONAL_GROUPS, RADIOACTIVE_ISOTOPES } from '../data/chemistryDatabase';
import {
  Sparkles,
  Layers,
  Atom,
  Radio,
  BookOpen,
  ArrowRight,
  Calculator,
  Flame,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
}

export function OrganicNuclearLab({ onAskTutor }: Props) {
  const [activeTab, setActiveTab] = useState<'functional' | 'iupac' | 'isomerism' | 'polymers' | 'nuclear'>('functional');
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);

  // IUPAC Interactive Builder State
  const [carbonChainLength, setCarbonChainLength] = useState<number>(3); // Prop-
  const [bondType, setBondType] = useState<'single' | 'double' | 'triple'>('single');
  const [functionalGroupChoice, setFunctionalGroupChoice] = useState<'none' | 'ol' | 'al' | 'one' | 'oic'>('none');

  // Nuclear Binding Energy State
  const [massDefectAmu, setMassDefectAmu] = useState<number>(0.0304); // He-4 mass defect approx

  const selectedGroup = ORGANIC_FUNCTIONAL_GROUPS[selectedGroupIdx];

  // IUPAC Name Generator
  const chainRoots: Record<number, { root: string; banglaRoot: string }> = {
    1: { root: 'Meth', banglaRoot: 'the myth' },
    2: { root: 'Eth', banglaRoot: 'Eth' },
    3: { root: 'Prop', banglaRoot: 'Prop' },
    4: { root: 'But', banglaRoot: 'Beaut' },
    5: { root: 'Pent', banglaRoot: 'the paint' },
    6: { root: 'Hex', banglaRoot: 'hex' },
    7: { root: 'Hept', banglaRoot: 'Hept' },
    8: { root: 'Oct', banglaRoot: 'Oct' },
  };

  const currentRoot = chainRoots[carbonChainLength] || chainRoots[3];
  let generatedIUPAC = '';
  let generatedFormula = '';

  if (functionalGroupChoice === 'none') {
    if (bondType === 'single') {
      generatedIUPAC = `${currentRoot.root}ane`;
      generatedFormula = `C${carbonChainLength}H${2 * carbonChainLength + 2}`;
    } else if (bondType === 'double') {
      generatedIUPAC = `${currentRoot.root}ene`;
      generatedFormula = `C${carbonChainLength}H${2 * carbonChainLength}`;
    } else {
      generatedIUPAC = `${currentRoot.root}yne`;
      generatedFormula = `C${carbonChainLength}H${2 * carbonChainLength - 2}`;
    }
  } else if (functionalGroupChoice === 'ol') {
    generatedIUPAC = `${currentRoot.root}an-1-ol`;
    generatedFormula = `C${carbonChainLength}H${2 * carbonChainLength + 1}OH`;
  } else if (functionalGroupChoice === 'al') {
    generatedIUPAC = `${currentRoot.root}anal`;
    generatedFormula = `C${carbonChainLength - 1}H${2 * (carbonChainLength - 1) + 1}CHO`;
  } else if (functionalGroupChoice === 'one') {
    generatedIUPAC = `${currentRoot.root}an-2-one`;
    generatedFormula = `C${carbonChainLength}H${2 * carbonChainLength}O`;
  } else if (functionalGroupChoice === 'oic') {
    generatedIUPAC = `${currentRoot.root}anoic acid (${currentRoot.banglaRoot}anoic acid)`;
    generatedFormula = `C${carbonChainLength - 1}H${2 * (carbonChainLength - 1) + 1}COOH`;
  }

  // Nuclear binding energy calculation (E = Δm × 931.5 MeV)
  const bindingEnergyMeV = massDefectAmu * 931.5;
  const bindingEnergyJoules = bindingEnergyMeV * 1.602e-13;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-rose-950/40 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
            <Atom className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Organic Chemistry, IUPAC Nomenclature, Polymer and Nuclear Chemistry Lab</span>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30">
                Organic & Nuclear Hub
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Functional elements, isomerism, polymerization, alpha-beta-gamma radioactive decay and nuclear fission/fusion ($E=\Delta mc^2$)
            </p>
          </div>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('functional')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'functional'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Functional Groups</span>
        </button>

        <button
          onClick={() => setActiveTab('iupac')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'iupac'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>IUPAC Naming generators and conventions</span>
        </button>

        <button
          onClick={() => setActiveTab('isomerism')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'isomerism'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Isomerism Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('polymers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'polymers'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Chemistry of polymers and monomers</span>
        </button>

        <button
          onClick={() => setActiveTab('nuclear')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'nuclear'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Nuclear reactions and mass defects ($E=\Delta mc^2$)</span>
        </button>
      </div>

      {/* TAB 1: FUNCTIONAL GROUPS */}
      {activeTab === 'functional' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Functional Groups Selector */}
          <div className="lg:col-span-5 p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 max-h-[460px] overflow-y-auto">
            {ORGANIC_FUNCTIONAL_GROUPS.map((grp, idx) => (
              <button
                key={grp.id}
                onClick={() => setSelectedGroupIdx(idx)}
                className={`w-full p-3.5 rounded-2xl text-left transition-all border flex items-center justify-between ${
                  selectedGroupIdx === idx
                    ? 'bg-rose-500/20 text-rose-200 border-rose-500/40 shadow-md'
                    : 'bg-slate-950/70 text-slate-300 border-slate-800 hover:bg-slate-900'
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">{grp.name} ({grp.generalFormula})</span>
                  <span className="text-[11px] text-slate-400">{grp.banglaName}</span>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{grp.prefixOrSuffix}</span>
              </button>
            ))}
          </div>

          {/* Group Details */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-rose-400 uppercase font-semibold tracking-wider text-[10px]">Functional analysis</span>
                <h3 className="text-lg font-bold text-white">{selectedGroup.name} — {selectedGroup.banglaName}</h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-950 font-mono text-cyan-300 font-bold text-sm border border-slate-800">
                {selectedGroup.generalFormula}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Definition and Scientific Introduction:</span>
              <p className="text-slate-200 leading-relaxed">{selectedGroup.descriptionBangla}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Example compound (Example):</span>
                <div className="text-base font-bold text-cyan-300 font-mono">{selectedGroup.exampleFormula}</div>
                <div className="text-[11px] text-slate-200">{selectedGroup.exampleName}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-semibold">Application in real life:</span>
                <p className="text-[11px] text-emerald-300">{selectedGroup.exampleBangla}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: IUPAC NOMENCLATURE GENERATOR */}
      {activeTab === 'iupac' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Interactive IUPAC name and symbol generator</span>
            </h3>

            {/* Carbon Chain Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Length of Carbon Chain (Principal Carbon Chain):</span>
                <span className="font-bold text-rose-300 font-mono">
                  C{carbonChainLength} ({currentRoot.root}- / {currentRoot.banglaRoot})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={carbonChainLength}
                onChange={(e) => setCarbonChainLength(parseInt(e.target.value))}
                className="w-full accent-rose-400"
              />
            </div>

            {/* Bond Type */}
            <div className="space-y-1.5">
              <label className="text-slate-400">Bond Type:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'single', label: 'Single bond (-ane / alkane)' },
                  { id: 'double', label: 'double bond (-ene / alkyne)' },
                  { id: 'triple', label: 'Triple bond (-yne / alkyne)' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBondType(b.id as any)}
                    className={`p-2.5 rounded-xl border text-center font-bold transition-all ${
                      bondType === b.id
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Functional Group Choice */}
            <div className="space-y-1.5">
              <label className="text-slate-400">Main Functionality:</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'Hydrocarbons' },
                  { id: 'ol', label: '-OH (alcohol)' },
                  { id: 'al', label: '-CHO (aldehyde)' },
                  { id: 'one', label: '>C=O (ketones)' },
                  { id: 'oic', label: '-COOH (acid)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFunctionalGroupChoice(f.id as any)}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition-all ${
                      functionalGroupChoice === f.id
                        ? 'bg-rose-500 text-slate-950 border-rose-400'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Output */}
            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-rose-300 uppercase font-semibold">IUPAC Name:</span>
                <span className="text-xl font-black text-white">{generatedIUPAC}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-rose-500/20">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Molecular signaling:</span>
                <span className="text-lg font-bold text-cyan-300 font-mono">{generatedFormula}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100">IUPAC 5 Golden Rules of Naming</h4>
            <div className="space-y-2.5 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-rose-300 block">1. Select the longest carbon chain:</strong>
                <span className="text-slate-400">Choose the longest chain that includes functional radicals or multi-bonds।</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-300 block">2. Lowest Locant Rule:</strong>
                <span className="text-slate-400">The functional root or branch gets the smallest number when calculating from the side।</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-amber-300 block">3. Alphabetical Order:</strong>
                <span className="text-slate-400">Arrange the substituents alphabetically (eg: Ethyl &gt; Methyl)।</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ISOMERISM SIMULATOR */}
      {activeTab === 'isomerism' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-400" />
              <span>Types of Isomerism of Organic Compounds</span>
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-300 text-xs block">1. Chain Isomerism (Chain Isomerism - C₄H₁₀):</span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-900 text-slate-200">
                    <strong>n-Butane:</strong> CH₃-CH₂-CH₂-CH₃
                  </div>
                  <div className="p-2 rounded bg-slate-900 text-slate-200">
                    <strong>Isobutane:</strong> CH₃-CH(CH₃)-CH₃
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-emerald-300 text-xs block">2. Functional Equivalence (C₂H₆O):</span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-900 text-slate-200">
                    <strong>Ethanol:</strong> CH₃CH₂OH (alcohol)
                  </div>
                  <div className="p-2 rounded bg-slate-900 text-slate-200">
                    <strong>Dimethyl Ether:</strong> CH₃-O-CH₃ (ether)
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-purple-300 text-xs block">3. Geometric equivalence (Cis-Trans - C₄H₈):</span>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-900 text-slate-200">
                    <strong>Cis-2-butene:</strong> methyl group on the same side
                  </div>
                  <div className="p-2 rounded bg-slate-900 text-slate-200">
                    <strong>Trans-2-butene:</strong> Methyl group on opposite side
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100">Photoequilibrium and chiral carbons</h4>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] text-slate-300 leading-relaxed">
              <p>
                <strong>Chiral Center:</strong> A carbon atom with four different atoms attached to it is called an asymmetric or chiral carbon।
              </p>
              <p>
                <strong>Enantiomers:</strong> Non-reversible mirror images of each other (eg: d-lactic acid and l-lactic acid)।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: POLYMERS */}
      {activeTab === 'polymers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-12 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Chemistry of important commercial polymers and monomers</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-300 text-sm block">Polythene</span>
                <div className="text-[11px] font-mono text-slate-400">Monomer: ethene (CH₂=CH₂)</div>
                <div className="p-2 rounded bg-slate-900 text-slate-200 font-mono text-[10px]">
                  n(CH₂=CH₂) → [-CH₂-CH₂-]ₙ
                </div>
                <p className="text-[11px] text-slate-400">Uses: Polythene bags, plastic bottles, wrappers।</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-rose-300 text-sm block">PVC (PVC - Polyvinyl Chloride)</span>
                <div className="text-[11px] font-mono text-slate-400">Monomer: Vinyl chloride (CH₂=CHCl)</div>
                <div className="p-2 rounded bg-slate-900 text-slate-200 font-mono text-[10px]">
                  n(CH₂=CHCl) → [-CH₂-CH(Cl)-]ₙ
                </div>
                <p className="text-[11px] text-slate-400">Uses: water pipes, electrical wire insulation।</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-300 text-sm block">Teflon (Teflon - PTFE)</span>
                <div className="text-[11px] font-mono text-slate-400">Monomer: Tetrafluoroethene (CF₂=CF₂)</div>
                <div className="p-2 rounded bg-slate-900 text-slate-200 font-mono text-[10px]">
                  n(CF₂=CF₂) → [-CF₂-CF₂-]ₙ
                </div>
                <p className="text-[11px] text-slate-400">Usage: Coating of non-stick cookware।</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NUCLEAR REACTIONS & MASS DEFECT */}
      {activeTab === 'nuclear' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-rose-400" />
              <span>Mass Error and Nuclear Bond Strength Calculator ($E = \Delta m c^2$)</span>
            </h3>

            <div>
              <label className="text-slate-400 block mb-1">mass error ($\Delta m$, amu):</label>
              <input
                type="number"
                step="0.001"
                value={massDefectAmu}
                onChange={(e) => setMassDefectAmu(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
              />
            </div>

            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-2">
              <span className="text-[10px] text-rose-300 uppercase font-semibold block">
                Nuclear binding energy (Binding Energy):
              </span>
              <div className="text-2xl font-black text-white font-mono">{bindingEnergyMeV.toFixed(3)} MeV</div>
              <div className="text-[11px] text-cyan-300 font-mono">{bindingEnergyJoules.toExponential(3)} Joules</div>
            </div>

            {/* Nuclear Fission Equation */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="font-bold text-amber-300 block">Nuclear Fission Reaction (Ruppur Power Station):</span>
              <div className="font-mono text-cyan-300 text-[11px] font-bold">
                ²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + 3¹₀n + 200 MeV
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100">Radioactive decay formula and 3 radiations</h4>
            <div className="space-y-2 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-rose-400 block">1. alpha decay (α = ⁴₂He):</strong>
                <span className="text-slate-400">Mass number decreases by 4 and atomic number decreases by 2।</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block">2. beta decay (β⁻ = ⁰₋₁e):</strong>
                <span className="text-slate-400">Neutrons are converted into protons; Atomic number increases by 1।</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-purple-400 block">3. gamma radiation (γ):</strong>
                <span className="text-slate-400">High frequency electromagnetic waves; Neither charge nor mass changes।</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
