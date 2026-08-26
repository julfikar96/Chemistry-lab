import React, { useState } from 'react';
import { SOLUBILITY_RULES, REDUCTION_POTENTIALS_SERIES } from '../data/chemistryDatabase';
import {
  Droplet,
  Zap,
  FlaskConical,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Info,
  Scale,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
}

export function SolutionsAcidsRedoxLab({ onAskTutor }: Props) {
  const [activeTab, setActiveTab] = useState<'solutions' | 'acids' | 'redox' | 'solubility'>('solutions');

  // Solution concentrations state
  const [soluteWeight, setSoluteWeight] = useState<number>(5.85); // grams (NaCl)
  const [soluteMolarMass, setSoluteMolarMass] = useState<number>(58.5); // g/mol
  const [solutionVolumeML, setSolutionVolumeML] = useState<number>(500); // mL

  // Dilution formula state (M1V1 = M2V2)
  const [m1, setM1] = useState<number>(1.0);
  const [v1, setV1] = useState<number>(100);
  const [v2, setV2] = useState<number>(500);

  // pH and buffer state
  const [acidBaseType, setAcidBaseType] = useState<'strong_acid' | 'strong_base' | 'weak_acid' | 'buffer'>('strong_acid');
  const [acidConcentration, setAcidConcentration] = useState<number>(0.01);
  const [pKa, setPKa] = useState<number>(4.76); // acetic acid
  const [saltConc, setSaltConc] = useState<number>(0.1);
  const [acidConcBuffer, setAcidConcBuffer] = useState<number>(0.1);

  // Redox Oxidation Number input
  const [redoxFormula, setRedoxFormula] = useState<string>('KMnO4');

  // Ksp state
  const [cationConc, setCationConc] = useState<number>(0.001);
  const [anionConc, setAnionConc] = useState<number>(0.001);
  const [kspValue, setKspValue] = useState<number>(1.8e-10); // AgCl Ksp

  // Concentration calculations
  const moles = soluteWeight / (soluteMolarMass || 1);
  const molarityM = (soluteWeight * 1000) / ((soluteMolarMass || 1) * (solutionVolumeML || 1));
  const ppm = (soluteWeight / ((solutionVolumeML || 1) * 1)) * 1e6; // assuming density 1 g/mL
  const massPercent = (soluteWeight / ((solutionVolumeML || 1) + soluteWeight)) * 100;

  // Dilution M2
  const m2 = (m1 * v1) / (v2 || 1);

  // pH calculation
  let calculatedPH = 7.0;
  let calculatedPOH = 7.0;

  if (acidBaseType === 'strong_acid') {
    calculatedPH = -Math.log10(acidConcentration || 1e-7);
    calculatedPOH = 14 - calculatedPH;
  } else if (acidBaseType === 'strong_base') {
    calculatedPOH = -Math.log10(acidConcentration || 1e-7);
    calculatedPH = 14 - calculatedPOH;
  } else if (acidBaseType === 'weak_acid') {
    // [H+] = sqrt(Ka * C)
    const Ka = Math.pow(10, -pKa);
    const hPlus = Math.sqrt(Ka * acidConcentration);
    calculatedPH = -Math.log10(hPlus || 1e-7);
    calculatedPOH = 14 - calculatedPH;
  } else if (acidBaseType === 'buffer') {
    // Henderson-Hasselbalch: pH = pKa + log([Salt]/[Acid])
    calculatedPH = pKa + Math.log10((saltConc || 1e-4) / (acidConcBuffer || 1e-4));
    calculatedPOH = 14 - calculatedPH;
  }

  // Automatic oxidation number calculator for common compounds
  const getOxidationNumbers = (formula: string) => {
    const f = formula.trim();
    if (f === 'KMnO4') {
      return { element: 'Mn', state: '+7', calculation: 'K(+1) + Mn(x) + 4×O(-2) = 0 ⇒ 1 + x - 8 = 0 ⇒ x = +7' };
    }
    if (f === 'K2Cr2O7') {
      return { element: 'Cr', state: '+6', calculation: '2×K(+1) + 2×Cr(x) + 7×O(-2) = 0 ⇒ 2 + 2x - 14 = 0 ⇒ x = +6' };
    }
    if (f === 'H2SO4') {
      return { element: 'S', state: '+6', calculation: '2×H(+1) + S(x) + 4×O(-2) = 0 ⇒ 2 + x - 8 = 0 ⇒ x = +6' };
    }
    if (f === 'HNO3') {
      return { element: 'N', state: '+5', calculation: 'H(+1) + N(x) + 3×O(-2) = 0 ⇒ 1 + x - 6 = 0 ⇒ x = +5' };
    }
    if (f === 'H2O2') {
      return { element: 'O', state: '-1 (peroxide)', calculation: '2×H(+1) + 2×O(x) = 0 ⇒ 2 + 2x = 0 ⇒ x = -1' };
    }
    if (f === 'OF2') {
      return { element: 'O', state: '+2 (exception)', calculation: 'O(x) + 2×F(-1) = 0 ⇒ x - 2 = 0 ⇒ x = +2' };
    }
    if (f === 'KO2') {
      return { element: 'O', state: '-½ (superoxide)', calculation: 'K(+1) + 2×O(x) = 0 ⇒ 1 + 2x = 0 ⇒ x = -½' };
    }
    if (f === 'Fe3O4') {
      return { element: 'Fe', state: '+8/3 (fraction)', calculation: 'FeO·Fe₂O₃ Mixed oxides: Fe(+2) and 2×Fe(+3) mixture of' };
    }
    return { element: 'Central Atom', state: '+N', calculation: 'Algebraic solution considering the total charge of the compound to be zero।' };
  };

  const oxidationInfo = getOxidationNumbers(redoxFormula);

  // Ksp check (Qsp vs Ksp)
  const qsp = cationConc * anionConc;
  const isPrecipitateFormed = qsp > kspValue;

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-purple-950/40 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-500/10">
            <Droplet className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Solutions, Acid-base (pH/Buffer), Oxidation and Solubility Lab</span>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
                Solutions, pH, Buffer & Redox
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Molarity (M), dilution (M₁V₁ = M₂V₂), Henderson-Hasselbalch buffer equation, oxidation number calculation and K_sp fraction prediction
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('solutions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'solutions'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Concentration and dilution of solution (M₁V₁ = M₂V₂)</span>
        </button>

        <button
          onClick={() => setActiveTab('acids')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'acids'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Acid-base, pH, pOH and buffer solutions</span>
        </button>

        <button
          onClick={() => setActiveTab('redox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'redox'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Oxidation number determination and electrochemical series</span>
        </button>

        <button
          onClick={() => setActiveTab('solubility')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'solubility'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Solubility coefficient (K_sp) and precipitation (Q_sp)</span>
        </button>
      </div>

      {/* TAB 1: SOLUTION CONCENTRATION & DILUTION */}
      {activeTab === 'solutions' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-purple-400" />
              <span>Calculate molarity (S = (W × 1000) / (M × V_mL))</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Mass of the solution (W, grams):</label>
                <input
                  type="number"
                  value={soluteWeight}
                  onChange={(e) => setSoluteWeight(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Molecular mass (M, g/mol):</label>
                <input
                  type="number"
                  value={soluteMolarMass}
                  onChange={(e) => setSoluteMolarMass(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Volume of solution (V, mL):</label>
                <input
                  type="number"
                  value={solutionVolumeML}
                  onChange={(e) => setSolutionVolumeML(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40">
                <span className="text-[10px] text-purple-300 uppercase font-semibold block">Molarity (Molarity, M)</span>
                <span className="text-2xl font-black text-white font-mono">{molarityM.toFixed(4)} M</span>
                <span className="text-[11px] text-slate-400 block mt-0.5">mol/L</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">ppm density</span>
                <span className="text-xl font-bold text-cyan-300 font-mono">{ppm.toFixed(1)} ppm</span>
                <span className="text-[11px] text-slate-500 block mt-0.5">mg/L</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-cyan-400" />
              <span>The solution dilution formula ($M_1V_1 = M_2V_2$)</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Initial molarity ($M_1$):</label>
                <input
                  type="number"
                  value={m1}
                  onChange={(e) => setM1(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">initial volume ($V_1$, mL):</label>
                <input
                  type="number"
                  value={v1}
                  onChange={(e) => setV1(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">final volume ($V_2$, mL):</label>
                <input
                  type="number"
                  value={v2}
                  onChange={(e) => setV2(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40">
              <span className="text-[10px] text-cyan-300 uppercase font-semibold block">reduced density ($M_2$):</span>
              <span className="text-2xl font-black text-white font-mono">{m2.toFixed(4)} M</span>
              <span className="text-[11px] text-slate-400 block mt-1">
                Volume of water added = <strong>{Math.max(0, v2 - v1)} mL</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ACIDS, BASES, PH & BUFFER */}
      {activeTab === 'acids' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
            <div className="flex items-center gap-2">
              {[
                { id: 'strong_acid', label: 'strong acid (HCl)' },
                { id: 'strong_base', label: 'strong alkali (NaOH)' },
                { id: 'weak_acid', label: 'Mild acid (CH₃COOH)' },
                { id: 'buffer', label: 'Buffer solution' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setAcidBaseType(t.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all ${
                    acidBaseType === t.id
                      ? 'bg-purple-500 text-slate-950 border-purple-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {acidBaseType === 'buffer' ? (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">of acid $pK_a$:</label>
                  <input
                    type="number"
                    value={pKa}
                    onChange={(e) => setPKa(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">[salt] (M):</label>
                  <input
                    type="number"
                    value={saltConc}
                    onChange={(e) => setSaltConc(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">[acid] (M):</label>
                  <input
                    type="number"
                    value={acidConcBuffer}
                    onChange={(e) => setAcidConcBuffer(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-slate-400 block mb-1">Molar Concentration (C):</label>
                <input
                  type="number"
                  step="0.001"
                  value={acidConcentration}
                  onChange={(e) => setAcidConcentration(parseFloat(e.target.value) || 0)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>
            )}

            {/* pH Meter Output */}
            <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/40 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] text-purple-300 font-semibold uppercase block">pH Value:</span>
                <span className="text-3xl font-black text-white font-mono">{calculatedPH.toFixed(2)}</span>
                <span className="text-[11px] text-slate-300 block mt-1">
                  {calculatedPH < 7 ? 'Acidic' : calculatedPH > 7 ? 'Alkaline (Basic)' : 'neutral'}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">pOH Value:</span>
                <span className="text-3xl font-black text-cyan-300 font-mono">{calculatedPOH.toFixed(2)}</span>
                <span className="text-[11px] text-slate-400 block mt-1">pH + pOH = 14 (at 25°C)</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100">Henderson-Hasselbalch equation</h4>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] text-slate-300 leading-relaxed font-mono">
              <span className="text-purple-400 font-bold block text-sm font-sans">
                pH = pKa + log([salt] / [acid])
              </span>
              <p className="font-sans text-slate-400 pt-1">
                <strong>Buffer solution:</strong> A solution to which a small amount of acid or base is added does not change the pH value of the solution (e.g. the pH of the bicarbonate buffer of human blood). ≈ 7.4)।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REDOX & OXIDATION NUMBERS */}
      {activeTab === 'redox' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              <span>Automatic Oxidation State Engine (Oxidation State Engine)</span>
            </h3>

            <div className="flex gap-2">
              {['KMnO4', 'K2Cr2O7', 'H2SO4', 'HNO3', 'H2O2', 'OF2', 'KO2'].map((f) => (
                <button
                  key={f}
                  onClick={() => setRedoxFormula(f)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                    redoxFormula === f
                      ? 'bg-purple-500 text-slate-950 border-purple-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-900'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <div className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-300 font-semibold">Central atom:</span>
                <span className="text-xl font-black text-white font-mono">
                  {oxidationInfo.element} = {oxidationInfo.state}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-[11px]">
                {oxidationInfo.calculation}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100">Modern electronic concept of oxidation</h4>
            <div className="space-y-2 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block">Oxidation = e⁻ exclusion):</strong>
                <span className="text-slate-400">Electron release process; It increases the oxidation number।</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-rose-400 block">Oxidation (Reduction = e⁻ acceptance):</strong>
                <span className="text-slate-400">Electron acceptance process; It reduces the oxidation number।</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SOLUBILITY RULES & KSP */}
      {activeTab === 'solubility' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Solubility coefficient (K_sp) and precipitation conditions (Q_sp vs K_sp)</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">[Ag⁺] (M):</label>
                <input
                  type="number"
                  step="1e-5"
                  value={cationConc}
                  onChange={(e) => setCationConc(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">[Cl⁻] (M):</label>
                <input
                  type="number"
                  step="1e-5"
                  value={anionConc}
                  onChange={(e) => setAnionConc(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">AgCl K_sp Value:</label>
                <input
                  type="number"
                  value={kspValue}
                  onChange={(e) => setKspValue(parseFloat(e.target.value) || 1e-10)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">Ionic coefficient (Q_sp):</span>
                <span className="text-xl font-bold text-cyan-300 font-mono">{qsp.toExponential(3)}</span>
              </div>
              <div className={`px-4 py-2 rounded-xl font-bold text-xs ${isPrecipitateFormed ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}>
                {isPrecipitateFormed ? '⚠️ Precipitate Formed: Qsp > Ksp)' : '✅ will remain soluble (Qsp ≤ Ksp)'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100">General Solubility Rules</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {SOLUBILITY_RULES.map((rule, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-purple-300 font-bold block">{rule.category}</span>
                  <span className="text-slate-400 text-[10px] block">{rule.banglaRule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
