import React, { useState } from 'react';
import {
  balanceChemicalEquation,
  parseChemicalFormula,
  formatChemicalFormula,
} from '../utils/equationBalancer';
import {
  Calculator,
  Scale,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Layers,
  BookOpen,
  PieChart,
  RefreshCw,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
}

export function StoichiometryBalancerLab({ onAskTutor }: Props) {
  const [activeTab, setActiveTab] = useState<'balancer' | 'stoichiometry' | 'limiting' | 'empirical'>('balancer');

  // Equation Balancer state
  const [rawEquationInput, setRawEquationInput] = useState<string>('KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2');
  const [balancerResult, setBalancerResult] = useState<any>(() => {
    try {
      return balanceChemicalEquation(
        ['KMnO4', 'HCl'],
        ['KCl', 'MnCl2', 'H2O', 'Cl2']
      );
    } catch {
      return null;
    }
  });
  const [balancerError, setBalancerError] = useState<string | null>(null);

  // Stoichiometry Conversions state
  const [stoichFormula, setStoichFormula] = useState<string>('H2SO4');
  const [stoichInputType, setStoichInputType] = useState<'mass' | 'mole' | 'particles' | 'volume'>('mass');
  const [stoichInputValue, setStoichInputValue] = useState<number>(98);

  // Limiting Reagent state
  const [reagentAFormula, setReagentAFormula] = useState<string>('N2');
  const [reagentAGrams, setReagentAGrams] = useState<number>(28);
  const [reagentACoeff, setReagentACoeff] = useState<number>(1);

  const [reagentBFormula, setReagentBFormula] = useState<string>('H2');
  const [reagentBGrams, setReagentBGrams] = useState<number>(9);
  const [reagentBCoeff, setReagentBCoeff] = useState<number>(3);

  const [productFormula, setProductFormula] = useState<string>('NH3');
  const [productCoeff, setProductCoeff] = useState<number>(2);
  const [actualYieldGrams, setActualYieldGrams] = useState<number>(30);

  // Empirical & Molecular formula state
  const [empElem1, setEmpElem1] = useState<{ symbol: string; percent: number }>({ symbol: 'C', percent: 40.0 });
  const [empElem2, setEmpElem2] = useState<{ symbol: string; percent: number }>({ symbol: 'H', percent: 6.7 });
  const [empElem3, setEmpElem3] = useState<{ symbol: string; percent: number }>({ symbol: 'O', percent: 53.3 });
  const [molecularMassTarget, setMolecularMassTarget] = useState<number>(180);

  // Periodic masses map for quick calculations
  const atomicMasses: Record<string, number> = {
    H: 1.008,
    He: 4.003,
    Li: 6.94,
    Be: 9.012,
    B: 10.81,
    C: 12.011,
    N: 14.007,
    O: 15.999,
    F: 18.998,
    Ne: 20.18,
    Na: 22.99,
    Mg: 24.305,
    Al: 26.982,
    Si: 28.085,
    P: 30.974,
    S: 32.06,
    Cl: 35.45,
    K: 39.098,
    Ca: 40.078,
    Cr: 51.996,
    Mn: 54.938,
    Fe: 55.845,
    Cu: 63.546,
    Zn: 65.38,
    Br: 79.904,
    Ag: 107.87,
    I: 126.9,
    Ba: 137.33,
    Pb: 207.2,
  };

  const calculateMolarMass = (formula: string): number => {
    try {
      const counts = parseChemicalFormula(formula);
      let total = 0;
      for (const [elem, count] of Object.entries(counts)) {
        const mass = atomicMasses[elem] || 12;
        total += mass * count;
      }
      return total || 1;
    } catch {
      return 1;
    }
  };

  // Run generic equation balancer
  const handleBalanceEquation = () => {
    try {
      setBalancerError(null);
      const parts = rawEquationInput.split(/->|=|→/);
      if (parts.length !== 2) {
        throw new Error('An arrow sign in the equation (-> or give =).।');
      }

      const reactants = parts[0]
        .split('+')
        .map((s) => s.trim())
        .filter(Boolean);
      const products = parts[1]
        .split('+')
        .map((s) => s.trim())
        .filter(Boolean);

      if (reactants.length === 0 || products.length === 0) {
        throw new Error('Give the chemical symbols on both the reactant and product sides।');
      }

      const res = balanceChemicalEquation(reactants, products);
      setBalancerResult(res);
    } catch (err: any) {
      setBalancerError(err.message || 'Error balancing equation।');
      setBalancerResult(null);
    }
  };

  // Stoichiometry calculation
  const stoichMolarMass = calculateMolarMass(stoichFormula);
  const NA = 6.022e23;
  let computedMoles = 0;

  if (stoichInputType === 'mass') {
    computedMoles = stoichInputValue / stoichMolarMass;
  } else if (stoichInputType === 'mole') {
    computedMoles = stoichInputValue;
  } else if (stoichInputType === 'particles') {
    computedMoles = stoichInputValue / NA;
  } else if (stoichInputType === 'volume') {
    computedMoles = stoichInputValue / 22.4; // STP volume
  }

  const computedMass = computedMoles * stoichMolarMass;
  const computedParticles = computedMoles * NA;
  const computedVolumeSTP = computedMoles * 22.4;

  // Limiting Reagent calculation
  const molarMassA = calculateMolarMass(reagentAFormula);
  const molarMassB = calculateMolarMass(reagentBFormula);
  const molarMassProd = calculateMolarMass(productFormula);

  const molesA = reagentAGrams / molarMassA;
  const molesB = reagentBGrams / molarMassB;

  const ratioA = molesA / reagentACoeff;
  const ratioB = molesB / reagentBCoeff;

  const isALimiting = ratioA < ratioB;
  const limitingName = isALimiting ? reagentAFormula : reagentBFormula;
  const limitingMoles = isALimiting ? ratioA : ratioB;

  const theoreticalMolesProd = limitingMoles * productCoeff;
  const theoreticalGramsProd = theoreticalMolesProd * molarMassProd;
  const percentYield = theoreticalGramsProd > 0 ? (actualYieldGrams / theoreticalGramsProd) * 100 : 0;

  // Empirical formula calculation
  const moleRatio1 = empElem1.percent / (atomicMasses[empElem1.symbol] || 12);
  const moleRatio2 = empElem2.percent / (atomicMasses[empElem2.symbol] || 1);
  const moleRatio3 = empElem3.percent / (atomicMasses[empElem3.symbol] || 16);

  const minRatio = Math.min(moleRatio1, moleRatio2, moleRatio3) || 1;
  const sub1 = Math.round(moleRatio1 / minRatio);
  const sub2 = Math.round(moleRatio2 / minRatio);
  const sub3 = Math.round(moleRatio3 / minRatio);

  const empiricalFormula = `${empElem1.symbol}${sub1 > 1 ? sub1 : ''}${empElem2.symbol}${sub2 > 1 ? sub2 : ''}${empElem3.symbol}${sub3 > 1 ? sub3 : ''}`;
  const empiricalMolarMass =
    sub1 * (atomicMasses[empElem1.symbol] || 12) +
    sub2 * (atomicMasses[empElem2.symbol] || 1) +
    sub3 * (atomicMasses[empElem3.symbol] || 16);

  const multiplierN = Math.round(molecularMassTarget / empiricalMolarMass) || 1;
  const molecularFormula = `${empElem1.symbol}${sub1 * multiplierN > 1 ? sub1 * multiplierN : ''}${empElem2.symbol}${sub2 * multiplierN > 1 ? sub2 * multiplierN : ''}${empElem3.symbol}${sub3 * multiplierN > 1 ? sub3 * multiplierN : ''}`;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Chemical Equation Balancer and Stoichiometry Engine</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                Stoichiometry & Yield Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Balancing Algebraic Equations, Mole-Mass-Particle Conversion, Limiting Reactants, Percent Products and Gross/Molecular Signals
            </p>
          </div>
        </div>
      </div>

      {/* Mode Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('balancer')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'balancer'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>Equation Balancer</span>
        </button>

        <button
          onClick={() => setActiveTab('stoichiometry')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'stoichiometry'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Mol ↔ mass ↔ particle ↔ Volume calculator</span>
        </button>

        <button
          onClick={() => setActiveTab('limiting')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'limiting'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>Limiting reactants and percentage products (% Yield)</span>
        </button>

        <button
          onClick={() => setActiveTab('empirical')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'empirical'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Detection of macroscopic signals and molecular signals</span>
        </button>
      </div>

      {/* TAB 1: CHEMICAL EQUATION BALANCER */}
      {activeTab === 'balancer' && (
        <div className="flex flex-col gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              <span>Input any chemical equation (algebraic equation):</span>
            </h3>

            {/* Input Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={rawEquationInput}
                onChange={(e) => setRawEquationInput(e.target.value)}
                placeholder="Ex: Fe + H2O -> Fe3O4 + H2 or C3H8 + O2 -> CO2 + H2O"
                className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-700 text-sm text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleBalanceEquation}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Equalize</span>
              </button>
            </div>

            {/* Quick Preset Equations */}
            <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
              <span className="font-semibold">Example equation:</span>
              {[
                'KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2',
                'Fe + H2O -> Fe3O4 + H2',
                'C3H8 + O2 -> CO2 + H2O',
                'Al + H2SO4 -> Al2(SO4)3 + H2',
                'CaCO3 + HCl -> CaCl2 + H2O + CO2',
              ].map((eq) => (
                <button
                  key={eq}
                  onClick={() => {
                    setRawEquationInput(eq);
                    setTimeout(handleBalanceEquation, 50);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-mono text-[11px]"
                >
                  {eq}
                </button>
              ))}
            </div>

            {balancerError && (
              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{balancerError}</span>
              </div>
            )}
          </div>

          {/* Balanced Output Display */}
          {balancerResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">
                  Balanced Chemical Equation
                </span>
                <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 font-mono text-emerald-300 text-base md:text-xl font-bold flex items-center justify-center text-center shadow-inner">
                  {balancerResult.balancedEquation}
                </div>

                {/* Atom Conservation Matrix Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-200">
                    Verification of Atomic Conservation (Law of Conservation of Mass):
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400">
                          <th className="p-2.5">Element</th>
                          <th className="p-2.5">Total atoms on the reactant side</th>
                          <th className="p-2.5">Total atoms on the product side</th>
                          <th className="p-2.5">condition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(balancerResult.elementMatrix).map(([elem, counts]: any) => (
                          <tr key={elem} className="border-b border-slate-850">
                            <td className="p-2.5 font-bold font-mono text-cyan-400">{elem}</td>
                            <td className="p-2.5 font-mono text-slate-200">{counts.reactants}</td>
                            <td className="p-2.5 font-mono text-slate-200">{counts.products}</td>
                            <td className="p-2.5">
                              {counts.reactants === counts.products ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>balanced</span>
                                </span>
                              ) : (
                                <span className="text-rose-400 font-semibold">Asymmetrical</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Mass constancy formula and coefficient</span>
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  No atoms are created or destroyed in a chemical reaction, only atoms are rearranged। So the atomic number of each element is always unchanged before and after the reaction।
                </p>
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-emerald-200">
                  Coefficients express the ratio of molecules or moles।
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MOLE-MASS-PARTICLES-VOLUME CONVERSIONS */}
      {activeTab === 'stoichiometry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Stoichiometry Converter (n = W/M = N/NA = V/22.4)</span>
            </h3>

            {/* Chemical Formula Input */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Chemical Formula:</label>
              <input
                type="text"
                value={stoichFormula}
                onChange={(e) => setStoichFormula(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-cyan-300"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Molecular Mass (Molar Mass, M): <strong>{stoichMolarMass.toFixed(3)} g/mol</strong>
              </span>
            </div>

            {/* Input Type Selector */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 block">Select the input amount:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'mass', label: 'Mass (W, grams)' },
                  { id: 'mole', label: 'number of moles (n)' },
                  { id: 'particles', label: 'Particle Number (N)' },
                  { id: 'volume', label: 'STP-Volume in (V, liters)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setStoichInputType(t.id as any)}
                    className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                      stoichInputType === t.id
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Value */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Enter the input value:</label>
              <input
                type="number"
                value={stoichInputValue}
                onChange={(e) => setStoichInputValue(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-base text-slate-100"
              />
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>results in stoichiometric conversion</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">number of moles (n)</span>
                <div className="text-lg font-black text-cyan-300 font-mono">{computedMoles.toExponential(4)} mol</div>
                <div className="text-[11px] text-slate-400 font-mono">{computedMoles.toFixed(4)} mol</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Mass (W)</span>
                <div className="text-lg font-black text-emerald-300 font-mono">{computedMass.toFixed(3)} g</div>
                <div className="text-[11px] text-slate-400 font-mono">{(computedMass / 1000).toFixed(4)} kg</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Molecules/Atomic Number (N)</span>
                <div className="text-lg font-black text-purple-300 font-mono">{computedParticles.toExponential(4)}</div>
                <div className="text-[11px] text-slate-400 font-mono">Avogadro's product</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">STP-t gaseous volume</span>
                <div className="text-lg font-black text-amber-300 font-mono">{computedVolumeSTP.toFixed(3)} L</div>
                <div className="text-[11px] text-slate-400 font-mono">{(computedVolumeSTP * 1000).toFixed(1)} mL</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <strong>At proof temperature and pressure (STP):</strong> 1 mole of any gas has a molar volume of 22.4 L and contains 6.022 × 10²³ T molecules exist।
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LIMITING REAGENT & % YIELD */}
      {activeTab === 'limiting' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <span>Determine the limiting reactant (${'aA + bB \\rightarrow cC'})</span>
            </h3>

            {/* Reagents Setup */}
            <div className="grid grid-cols-2 gap-4">
              {/* Reagent A */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-cyan-300">Reagent A</span>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Sign and Coefficient (a):</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={reagentACoeff}
                      onChange={(e) => setReagentACoeff(parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center font-mono"
                    />
                    <input
                      type="text"
                      value={reagentAFormula}
                      onChange={(e) => setReagentAFormula(e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Given mass (grams):</label>
                  <input
                    type="number"
                    value={reagentAGrams}
                    onChange={(e) => setReagentAGrams(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 font-mono"
                  />
                </div>
              </div>

              {/* Reagent B */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-rose-300">Reagent B</span>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Sign and Coefficient (b):</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={reagentBCoeff}
                      onChange={(e) => setReagentBCoeff(parseInt(e.target.value) || 1)}
                      className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center font-mono"
                    />
                    <input
                      type="text"
                      value={reagentBFormula}
                      onChange={(e) => setReagentBFormula(e.target.value)}
                      className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Given mass (grams):</label>
                  <input
                    type="number"
                    value={reagentBGrams}
                    onChange={(e) => setReagentBGrams(parseFloat(e.target.value) || 0)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Product & Actual Yield */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Product signal and coefficient (c):</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={productCoeff}
                    onChange={(e) => setProductCoeff(parseInt(e.target.value) || 1)}
                    className="w-14 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-center font-mono"
                  />
                  <input
                    type="text"
                    value={productFormula}
                    onChange={(e) => setProductFormula(e.target.value)}
                    className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Actual Yield (g):</label>
                <input
                  type="number"
                  value={actualYieldGrams}
                  onChange={(e) => setActualYieldGrams(parseFloat(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Limiting Reagent & % Yield Output */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Calculated results and percentage products</span>
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
              <span className="text-[10px] text-emerald-300 font-semibold uppercase">Limiting Reagent</span>
              <div className="text-2xl font-black text-white font-mono">{limitingName}</div>
              <p className="text-[11px] text-slate-300 mt-1">
                The reactant that goes first to complete completion in the reaction determines the amount of product।
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Theoretical Yield</span>
                <span className="text-base font-bold text-cyan-300 font-mono">{theoreticalGramsProd.toFixed(2)} g</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Percent Product (% Yield)</span>
                <span className="text-base font-bold text-amber-300 font-mono">{percentYield.toFixed(1)}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
              Source: % Yield = (Actual Yield / Theoretical Yield) × 100%
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EMPIRICAL & MOLECULAR FORMULA */}
      {activeTab === 'empirical' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Determination of gross and molecular signals from percent correlation</span>
            </h3>

            {/* Elements Percentage Inputs */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-400">Element-1</span>
                <input
                  type="text"
                  value={empElem1.symbol}
                  onChange={(e) => setEmpElem1({ ...empElem1, symbol: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-center"
                />
                <input
                  type="number"
                  value={empElem1.percent}
                  onChange={(e) => setEmpElem1({ ...empElem1, percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-center"
                  placeholder="%"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-400">Element-2</span>
                <input
                  type="text"
                  value={empElem2.symbol}
                  onChange={(e) => setEmpElem2({ ...empElem2, symbol: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-center"
                />
                <input
                  type="number"
                  value={empElem2.percent}
                  onChange={(e) => setEmpElem2({ ...empElem2, percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-center"
                  placeholder="%"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-cyan-400">Element-3</span>
                <input
                  type="text"
                  value={empElem3.symbol}
                  onChange={(e) => setEmpElem3({ ...empElem3, symbol: e.target.value })}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-center"
                />
                <input
                  type="number"
                  value={empElem3.percent}
                  onChange={(e) => setEmpElem3({ ...empElem3, percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2 py-1 rounded bg-slate-900 border border-slate-700 font-mono text-center"
                  placeholder="%"
                />
              </div>
            </div>

            {/* Target Molecular Mass */}
            <div className="text-xs">
              <label className="text-slate-400 block mb-1">Given the molecular mass of the compound (Molar Mass, g/mol):</label>
              <input
                type="number"
                value={molecularMassTarget}
                onChange={(e) => setMolecularMassTarget(parseFloat(e.target.value) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
              />
            </div>
          </div>

          {/* Results Box */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>determined signal</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Empirical Formula</span>
              <div className="text-2xl font-black text-cyan-300 font-mono">{empiricalFormula}</div>
              <div className="text-[11px] text-slate-400">Gross signal mass = {empiricalMolarMass.toFixed(2)} g/mol</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-semibold">
                Molecular signal (Molecular Formula: n = {multiplierN})
              </span>
              <div className="text-3xl font-black text-emerald-300 font-mono">{molecularFormula}</div>
              <div className="text-[11px] text-slate-400">
                molecular signal = (gross signal) $\times n$ (such as glucose $C_6H_{12}O_6$)
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
