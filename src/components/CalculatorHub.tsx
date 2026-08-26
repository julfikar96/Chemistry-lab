import React, { useState } from 'react';
import { calculateMolarMassAndComposition } from '../utils/equationBalancer';
import {
  Calculator,
  Zap,
  Sparkles,
  Layers,
  Thermometer,
  Gauge,
  Droplet,
  Radio,
  ArrowRight,
  RefreshCw,
  Scale,
  Activity,
  Wind,
  Flame,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
}

export function CalculatorHub({ onAskTutor }: Props) {
  const [selectedCalc, setSelectedCalc] = useState<string>('mass');

  // 1. Formula Mass & % Composition State
  const [formulaInput, setFormulaInput] = useState<string>('C6H12O6');
  const formulaResult = calculateMolarMassAndComposition(formulaInput);

  // 2. Nernst Equation State
  const [nernstE0, setNernstE0] = useState<number>(1.10);
  const [nernstN, setNernstN] = useState<number>(2);
  const [nernstAnion, setNernstAnion] = useState<number>(0.01);
  const [nernstCation, setNernstCation] = useState<number>(1.0);
  const qRatio = nernstAnion / (nernstCation || 1e-5);
  const nernstEcell = nernstE0 - (0.0592 / (nernstN || 1)) * Math.log10(qRatio || 1);

  // 3. Molarity & Solution Preparation State: W = (S * M * V) / 1000
  const [molFormula, setMolFormula] = useState<string>('NaCl');
  const [targetMolarity, setTargetMolarity] = useState<number>(0.5); // M (mol/L)
  const [targetVolumeML, setTargetVolumeML] = useState<number>(250); // mL
  const molMassData = calculateMolarMassAndComposition(molFormula);
  const soluteMolarMass = molMassData.valid ? molMassData.totalMolarMass : 58.44;
  const requiredWeightGrams = (targetMolarity * soluteMolarMass * targetVolumeML) / 1000;
  const requiredMoles = requiredWeightGrams / (soluteMolarMass || 1);

  // 4. Dilution M1V1 = M2V2
  const [dilM1, setDilM1] = useState<number>(2.0); // M stock
  const [dilV1, setDilV1] = useState<number>(50); // mL stock
  const [dilM2, setDilM2] = useState<number>(0.5); // M target
  const calculatedV2 = (dilM1 * dilV1) / (dilM2 || 1e-4);
  const waterToAddML = Math.max(0, calculatedV2 - dilV1);

  // 5. pH & pOH
  const [phMode, setPhMode] = useState<'strong_acid' | 'strong_base' | 'weak_acid'>('strong_acid');
  const [acidBaseConc, setAcidBaseConc] = useState<number>(0.01);
  const [weakAcidKa, setWeakAcidKa] = useState<number>(1.8e-5); // Acetic acid Ka
  let calcPH = 7.0;
  let calcPOH = 7.0;
  let hConc = 1e-7;
  let ohConc = 1e-7;

  if (phMode === 'strong_acid') {
    hConc = Math.max(1e-14, acidBaseConc);
    calcPH = -Math.log10(hConc);
    calcPOH = 14 - calcPH;
    ohConc = Math.pow(10, -calcPOH);
  } else if (phMode === 'strong_base') {
    ohConc = Math.max(1e-14, acidBaseConc);
    calcPOH = -Math.log10(ohConc);
    calcPH = 14 - calcPOH;
    hConc = Math.pow(10, -calcPH);
  } else if (phMode === 'weak_acid') {
    hConc = Math.sqrt((weakAcidKa || 1e-5) * (acidBaseConc || 1e-3));
    calcPH = -Math.log10(hConc || 1e-7);
    calcPOH = 14 - calcPH;
    ohConc = Math.pow(10, -calcPOH);
  }

  // 6. Buffer Henderson-Hasselbalch: pH = pKa + log([Salt]/[Acid])
  const [bufPKa, setBufPKa] = useState<number>(4.76);
  const [bufAcidConc, setBufAcidConc] = useState<number>(0.1);
  const [bufSaltConc, setBufSaltConc] = useState<number>(0.15);
  const bufferPH = bufPKa + Math.log10((bufSaltConc || 1e-4) / (bufAcidConc || 1e-4));

  // 7. Ideal Gas Law: PV = nRT (R = 0.0821 L·atm/(mol·K))
  const [gasSolveFor, setGasSolveFor] = useState<'P' | 'V' | 'n' | 'T'>('P');
  const [gasP, setGasP] = useState<number>(1.0); // atm
  const [gasV, setGasV] = useState<number>(22.4); // L
  const [gasN, setGasN] = useState<number>(1.0); // mol
  const [gasT, setGasT] = useState<number>(273.15); // K
  const R_CONST = 0.08206; // L*atm/(mol*K)

  let idealGasAnswer = 0;
  let idealGasUnit = '';
  if (gasSolveFor === 'P') {
    idealGasAnswer = (gasN * R_CONST * gasT) / (gasV || 1e-3);
    idealGasUnit = 'atm';
  } else if (gasSolveFor === 'V') {
    idealGasAnswer = (gasN * R_CONST * gasT) / (gasP || 1e-3);
    idealGasUnit = 'L (liter)';
  } else if (gasSolveFor === 'n') {
    idealGasAnswer = (gasP * gasV) / (R_CONST * (gasT || 1));
    idealGasUnit = 'mol';
  } else if (gasSolveFor === 'T') {
    idealGasAnswer = (gasP * gasV) / (R_CONST * (gasN || 1e-3));
    idealGasUnit = 'K (Kelvin)';
  }

  // 8. Graham's Law of Diffusion & Density: r1/r2 = sqrt(M2/M1)
  const [grahM1, setGrahM1] = useState<number>(17.03); // NH3
  const [grahM2, setGrahM2] = useState<number>(36.46); // HCl
  const grahRatio = Math.sqrt((grahM2 || 1) / (grahM1 || 1));
  const stpDensity1 = grahM1 / 22.4;
  const stpDensity2 = grahM2 / 22.4;

  // 9. Radioactive Half-Life Decay: N(t) = N0 * (1/2)^(t / t1/2)
  const [hlN0, setHlN0] = useState<number>(100);
  const [hlHalfLife, setHlHalfLife] = useState<number>(5730); // C-14
  const [hlTimeElapsed, setHlTimeElapsed] = useState<number>(11460); // 2 half-lives
  const hlNumDecays = hlTimeElapsed / (hlHalfLife || 1);
  const hlRemainingAmount = hlN0 * Math.pow(0.5, hlNumDecays);
  const hlDecayedAmount = hlN0 - hlRemainingAmount;

  // 10. Thermochemistry Calorimetry: q = m * c * ΔT
  const [calMass, setCalMass] = useState<number>(200); // g
  const [calSpecificHeat, setCalSpecificHeat] = useState<number>(4.184); // J/g·°C
  const [calDeltaT, setCalDeltaT] = useState<number>(15.5); // °C
  const calJoules = calMass * calSpecificHeat * calDeltaT;
  const calKiloJoules = calJoules / 1000;

  const calculatorsList = [
    { id: 'mass', name: 'Molecular Mass and Molar Mass', icon: Calculator, color: 'text-cyan-400' },
    { id: 'molarity', name: 'Molarity and Solution Preparation (Molarity)', icon: Droplet, color: 'text-emerald-400' },
    { id: 'dilution', name: 'Solvent dilution formula (M₁V₁ = M₂V₂)', icon: RefreshCw, color: 'text-blue-400' },
    { id: 'ph', name: 'pH to pH Change (pH, pH & Ka)', icon: Activity, color: 'text-purple-400' },
    { id: 'buffer', name: "Orfer's solution (Henderson-Hasselbalch)", icon: Layers, color: 'text-pink-400' },
    { id: 'idealgas', name: 'Ideal Gas Equation (PV = nRT)', icon: Gauge, color: 'text-amber-400' },
    { id: 'graham', name: "Graham's diffusion and gas density (Graham)", icon: Wind, color: 'text-teal-400' },
    { id: 'nernst', name: 'Nernst Equation (Nernst Potential E_cell)', icon: Zap, color: 'text-yellow-400' },
    { id: 'thermo', name: 'Calorimetry Thermal energy (q = mcΔT)', icon: Flame, color: 'text-rose-400' },
    { id: 'halflife', name: 'Radioactive half-life (Half-life Decay)', icon: Radio, color: 'text-violet-400' },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Chemistry Calculator Master Hub</span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-500/30">
                10-in-1 Scientific Chemistry Solvers
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Molecular mass, molarity, dilution, pH, pH, PV=nRT, Automatic Mathematical Solution of Graham's diffusion, Nernst cell potential, thermal energy and radioactive half-life
            </p>
          </div>
        </div>

        {onAskTutor && (
          <button
            onClick={() => onAskTutor('Explain to me various mathematical formulas in chemistry and their uses in brief.')}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>AI mathematical assistant</span>
          </button>
        )}
      </div>

      {/* Select Calculator Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {calculatorsList.map((c) => {
          const Icon = c.icon;
          const isSelected = selectedCalc === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCalc(c.id)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col gap-2 ${
                isSelected
                  ? 'bg-sky-500/20 text-sky-200 border-sky-500/50 shadow-lg shadow-sky-500/10 scale-102'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center ${isSelected ? 'text-sky-300' : c.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold leading-snug">{c.name}</span>
            </button>
          );
        })}
      </div>

      {/* 1. FORMULA MASS CALCULATOR */}
      {selectedCalc === 'mass' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Molar Mass & Percentage Composition</span>
            </h3>

            <div>
              <label className="text-slate-400 block mb-1 font-semibold">Enter any chemical symbol (118 elements and brackets supported):</label>
              <input
                type="text"
                value={formulaInput}
                onChange={(e) => setFormulaInput(e.target.value)}
                placeholder="Eg: C6H12O6, H2SO4, Fe2(SO4)3, Ca(OH)2, KMnO4..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-base text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[11px] text-slate-500 block mt-1">
                Formatted signal: <span className="font-mono text-cyan-300 font-bold">{formulaResult.formattedFormula || formulaInput}</span>
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-1">
              <span className="text-[10px] text-cyan-300 uppercase font-semibold block tracking-wider">Total Molecular / Signal Mass:</span>
              <div className="text-3xl font-black text-white font-mono">{formulaResult.totalMolarMass.toFixed(3)} g/mol</div>
              <p className="text-[11px] text-slate-400">{formulaResult.summaryString}</p>
            </div>

            {/* Breakdown Table */}
            {formulaResult.elements.length > 0 && (
              <div className="space-y-2">
                <span className="font-bold text-slate-200 block">Individual atomic mass and percent valence (%) of elements:</span>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                        <th className="p-2.5"> Fundamentals</th>
                        <th className="p-2.5"> Name (English)</th>
                        <th className="p-2.5">Atomic number</th>
                        <th className="p-2.5">unit mass</th>
                        <th className="p-2.5">total mass</th>
                        <th className="p-2.5">Percent moderation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formulaResult.elements.map((item) => (
                        <tr key={item.symbol} className="border-b border-slate-800/60 hover:bg-slate-850/50">
                          <td className="p-2.5 font-bold font-mono text-cyan-400">{item.symbol}</td>
                          <td className="p-2.5 text-slate-300">{item.banglaName}</td>
                          <td className="p-2.5 font-mono">{item.count}</td>
                          <td className="p-2.5 font-mono text-slate-400">{item.atomicMass.toFixed(3)} g</td>
                          <td className="p-2.5 font-mono text-slate-200">{item.totalMass.toFixed(3)} g</td>
                          <td className="p-2.5 font-mono font-bold text-emerald-400">
                            {item.percentage.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <span>The formula for determining percentage adjustment</span>
            </h4>
            <div className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-cyan-300 border border-slate-800">
              Percentage adjustment= (The total atomic mass of the element× 100) / Total molecular mass
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              The percent concentration is the mass of each element present in a 100 gram sample of any compound। gross signal(Empirical Formula) and molecular signaling(Molecular Formula) This is the first step in diagnosis।
            </p>
          </div>
        </div>
      )}

      {/* 2. MOLARITY & SOLUTION PREPARATION */}
      {selectedCalc === 'molarity' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Droplet className="w-4 h-4 text-emerald-400" />
              <span>Formula for molarity and solution preparation: W = (S × M × V) / 1000</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Chemical signal of the product:</label>
                <input
                  type="text"
                  value={molFormula}
                  onChange={(e) => setMolFormula(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
                <span className="text-[10px] text-emerald-400 mt-1 block">Molar mass M: {soluteMolarMass.toFixed(2)} g/mol</span>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Desired Molarity (S Or C, mol/L):</label>
                <input
                  type="number"
                  step="0.05"
                  value={targetMolarity}
                  onChange={(e) => setTargetMolarity(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Volume of solution required (V, mL):</label>
                <input
                  type="number"
                  value={targetVolumeML}
                  onChange={(e) => setTargetVolumeML(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-1">
              <span className="text-[10px] text-emerald-300 uppercase font-semibold block"> Mass of required material (Weight, W):</span>
              <div className="text-3xl font-black text-white font-mono">{requiredWeightGrams.toFixed(4)} grams (g)</div>
              <span className="text-[11px] text-slate-400 block mt-1">
                number of moles(n) = {requiredMoles.toFixed(4)} mol
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-emerald-400 block">Laboratory Preparation Instructions:</span>
              <p>1. Weigh exactly <strong>{requiredWeightGrams.toFixed(4)} grams of {molFormula}</strong> using a digital balance.</p>
              <p>2. Dissolve the solute in a little distilled water in a {targetVolumeML} mL volumetric flask.</p>
              <p>3. Add distilled water up to the mark, shake well, and prepare a homogeneous {targetMolarity} M solution.</p>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>Molarity Definition & Unit</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Molarity is the number of moles of solute dissolved per 1 liter (1000 mL) of solution at a constant temperature. Its unit is mol/L or Molar (M). Since volume changes with temperature, molarity also changes with temperature.
            </p>
          </div>
        </div>
      )}

      {/* 3. DILUTION M1V1 = M2V2 */}
      {selectedCalc === 'dilution' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span>Dilution Law (M₁V₁ = M₂V₂)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Initial Molarity of Stock (M₁):</label>
                <input
                  type="number"
                  step="0.1"
                  value={dilM1}
                  onChange={(e) => setDilM1(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Volume of Stock Used (V₁, mL):</label>
                <input
                  type="number"
                  value={dilV1}
                  onChange={(e) => setDilV1(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Desired Diluted Molarity (M₂):</label>
                <input
                  type="number"
                  step="0.05"
                  value={dilM2}
                  onChange={(e) => setDilM2(parseFloat(e.target.value) || 0.001)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-2">
              <span className="text-[10px] text-blue-300 uppercase font-semibold block">Total Final Volume (V₂):</span>
              <div className="text-3xl font-black text-white font-mono">{calculatedV2.toFixed(2)} mL</div>
              <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/30 mt-2">
                <span className="text-emerald-400 font-bold block">Volume of water to add:</span>
                <span className="text-lg font-mono font-black text-slate-100">{waterToAddML.toFixed(2)} mL distilled water</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Principle of Dilution</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Adding more solvent (water) keeps the total moles of solute constant (n₁ = n₂), but increases total volume, thereby decreasing concentration (molarity).
            </p>
          </div>
        </div>
      )}

      {/* 4. pH & pOH CALCULATOR */}
      {selectedCalc === 'ph' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>pH, pOH & Hydrogen Ion Concentration Calculator</span>
            </h3>

            <div className="flex gap-2">
              {[
                { id: 'strong_acid', label: 'Strong Acid (HCl, HNO₃)' },
                { id: 'strong_base', label: 'Strong Base (NaOH, KOH)' },
                { id: 'weak_acid', label: 'Weak Acid (CH₃COOH)' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPhMode(m.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    phMode === m.id
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Concentration (C, mol/L):</label>
                <input
                  type="number"
                  step="0.001"
                  value={acidBaseConc}
                  onChange={(e) => setAcidBaseConc(parseFloat(e.target.value) || 0.001)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              {phMode === 'weak_acid' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Dissociation Constant (K_a):</label>
                  <input
                    type="number"
                    step="1e-6"
                    value={weakAcidKa}
                    onChange={(e) => setWeakAcidKa(parseFloat(e.target.value) || 1.8e-5)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/40">
                <span className="text-[10px] text-purple-300 uppercase font-semibold block">Solution pH Value:</span>
                <div className="text-3xl font-black text-white font-mono">{calcPH.toFixed(2)}</div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {calcPH < 7 ? '🔴 Acidic (Acidic)' : calcPH === 7 ? '⚪ Neutral (Neutral)' : '🔵 Basic (Basic)'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">pOH Value:</span>
                <div className="text-3xl font-black text-slate-200 font-mono">{calcPOH.toFixed(2)}</div>
                <span className="text-[11px] text-slate-500 mt-1 block">[H⁺] = {hConc.toExponential(2)} M</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-purple-400" />
              <span>Relationship between pH & pOH</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              At 25°C, the autoionization constant of water is Kw = 1.0 × 10⁻¹⁴ M². Hence, in any aqueous solution: <strong>pH + pOH = 14</strong>.
            </p>
          </div>
        </div>
      )}

      {/* 5. BUFFER CALCULATOR */}
      {selectedCalc === 'buffer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-pink-400" />
              <span>Henderson-Hasselbalch Buffer Equation</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Acid pK_a Value:</label>
                <input
                  type="number"
                  step="0.01"
                  value={bufPKa}
                  onChange={(e) => setBufPKa(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Concentration of mild acid [Acid], M:</label>
                <input
                  type="number"
                  step="0.01"
                  value={bufAcidConc}
                  onChange={(e) => setBufAcidConc(parseFloat(e.target.value) || 0.01)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Salt Conc. [Salt], M:</label>
                <input
                  type="number"
                  step="0.01"
                  value={bufSaltConc}
                  onChange={(e) => setBufSaltConc(parseFloat(e.target.value) || 0.01)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-pink-950/30 border border-pink-500/40 space-y-1">
              <span className="text-[10px] text-pink-300 uppercase font-semibold block">Calculated Buffer pH:</span>
              <div className="text-3xl font-black text-white font-mono">{bufferPH.toFixed(3)}</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Equation: pH = {bufPKa} + log({bufSaltConc} / {bufAcidConc}) = {bufferPH.toFixed(3)}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-pink-400" />
              <span>Buffer Capacity</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Buffer solutions resist changes in pH upon addition of small amounts of acid or base. Human blood pH is maintained around 7.4 by buffer systems (carbonic acid and bicarbonate).
            </p>
          </div>
        </div>
      )}

      {/* 6. IDEAL GAS LAW PV = nRT */}
      {selectedCalc === 'idealgas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>Ideal Gas Law (PV = nRT)</span>
            </h3>

            <div className="flex gap-2">
              <span className="text-slate-400 font-semibold my-auto">Solve for:</span>
              {(['P', 'V', 'n', 'T'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setGasSolveFor(v)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                    gasSolveFor === v
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  {v === 'P' ? 'Pressure (P)' : v === 'V' ? 'Volume (V)' : v === 'n' ? 'Moles (n)' : 'Temperature (T)'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {gasSolveFor !== 'P' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Pressure (P, atm):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={gasP}
                    onChange={(e) => setGasP(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                  />
                </div>
              )}

              {gasSolveFor !== 'V' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Volume (V, L):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={gasV}
                    onChange={(e) => setGasV(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                  />
                </div>
              )}

              {gasSolveFor !== 'n' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Number of Moles (n, mol):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={gasN}
                    onChange={(e) => setGasN(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                  />
                </div>
              )}

              {gasSolveFor !== 'T' && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Absolute Temperature (T, K):</label>
                  <input
                    type="number"
                    step="1"
                    value={gasT}
                    onChange={(e) => setGasT(parseFloat(e.target.value) || 273.15)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                  />
                </div>
              )}
            </div>

            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-1">
              <span className="text-[10px] text-amber-300 uppercase font-semibold block">Result:</span>
              <div className="text-3xl font-black text-white font-mono">
                {idealGasAnswer.toFixed(3)} {idealGasUnit}
              </div>
              <span className="text-[11px] text-slate-400 block mt-1">
                Molar gas constant R = 0.08206 L·atm/(mol·K)
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Combination of Boyle's, Charles', & Avogadro's Laws</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Combining Boyle's (V ∝ 1/P), Charles' (V ∝ T), and Avogadro's (V ∝ n) laws establishes the ideal gas equation PV = nRT.
            </p>
          </div>
        </div>
      )}

      {/* 7. GRAHAM'S LAW & DENSITY */}
      {selectedCalc === 'graham' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Wind className="w-4 h-4 text-teal-400" />
              <span>Graham's Law of Effusion & Gas Density (r₁/r₂ = √(M₂/M₁))</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Molar Mass of Gas 1 (M₁, g/mol):</label>
                <input
                  type="number"
                  value={grahM1}
                  onChange={(e) => setGrahM1(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
                <span className="text-[10px] text-teal-400 mt-1 block">STP Density ρ₁: {stpDensity1.toFixed(3)} g/L</span>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Molar Mass of Gas 2 (M₂, g/mol):</label>
                <input
                  type="number"
                  value={grahM2}
                  onChange={(e) => setGrahM2(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
                <span className="text-[10px] text-teal-400 mt-1 block">STP Density ρ₂: {stpDensity2.toFixed(3)} g/L</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-teal-950/30 border border-teal-500/40 space-y-1">
              <span className="text-[10px] text-teal-300 uppercase font-semibold block">Relative Effusion Rate Ratio (r₁ / r₂):</span>
              <div className="text-3xl font-black text-white font-mono">{grahRatio.toFixed(3)} times</div>
              <p className="text-[11px] text-slate-400 mt-1">
                The first gas will effuse <strong>{grahRatio.toFixed(2)} times faster</strong> than the second gas.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-400" />
              <span>Significance of Graham's Law</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              At constant temperature and pressure, the effusion rate is inversely proportional to the square root of its density (or molar mass). Lighter gases effuse faster.
            </p>
          </div>
        </div>
      )}

      {/* 8. NERNST EQUATION */}
      {selectedCalc === 'nernst' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Nernst Equation (E_cell = E°_cell - (0.0592/n)·log Q)</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Standard Cell Potential (E°_cell, V):</label>
                <input
                  type="number"
                  step="0.01"
                  value={nernstE0}
                  onChange={(e) => setNernstE0(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Number of Transferred Electrons (n):</label>
                <input
                  type="number"
                  value={nernstN}
                  onChange={(e) => setNernstN(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Anode Ion Concentration ([Anode], M):</label>
                <input
                  type="number"
                  step="0.001"
                  value={nernstAnion}
                  onChange={(e) => setNernstAnion(parseFloat(e.target.value) || 0.001)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Cathode Ion Concentration ([Cathode], M):</label>
                <input
                  type="number"
                  step="0.001"
                  value={nernstCation}
                  onChange={(e) => setNernstCation(parseFloat(e.target.value) || 0.001)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-yellow-950/30 border border-yellow-500/40 space-y-1">
              <span className="text-[10px] text-yellow-300 uppercase font-semibold block">Cell Potential (E_cell):</span>
              <div className="text-3xl font-black text-white font-mono">{nernstEcell.toFixed(4)} Volts</div>
              <p className="text-[11px] text-slate-400 mt-1">
                {nernstEcell > 0 ? '✅ Spontaneous Reaction (ΔG < 0)' : '❌ Non-spontaneous Reaction'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100">Significance of the Nernst Equation</h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              At 25°C, it relates ion concentration to cell potential in non-standard conditions. Increasing anode concentration decreases cell potential, while increasing cathode concentration increases it.
            </p>
          </div>
        </div>
      )}

      {/* 9. THERMOCHEMISTRY CALORIMETRY */}
      {selectedCalc === 'thermo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Calorimetry Heat Energy Calculation (q = m × c × ΔT)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Mass of Sample (m, g):</label>
                <input
                  type="number"
                  value={calMass}
                  onChange={(e) => setCalMass(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Specific Heat Capacity (c, J/g·°C):</label>
                <input
                  type="number"
                  step="0.01"
                  value={calSpecificHeat}
                  onChange={(e) => setCalSpecificHeat(parseFloat(e.target.value) || 4.184)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Specific heat of water = 4.184</span>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Temperature Change (ΔT, °C or K):</label>
                <input
                  type="number"
                  step="0.5"
                  value={calDeltaT}
                  onChange={(e) => setCalDeltaT(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-1">
              <span className="text-[10px] text-rose-300 uppercase font-semibold block">Absorbed / Released Heat Energy (q):</span>
              <div className="text-3xl font-black text-white font-mono">{calKiloJoules.toFixed(3)} kJ</div>
              <span className="text-[11px] text-slate-400 block mt-1">Or {calJoules.toFixed(1)} Joules</span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-400" />
              <span>Exothermic vs. Endothermic Reactions</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              If heat is released, temperature increases (Exothermic, ΔH &lt; 0). If heat is absorbed, surroundings cool down (Endothermic, ΔH &gt; 0).
            </p>
          </div>
        </div>
      )}

      {/* 10. HALF-LIFE DECAY */}
      {selectedCalc === 'halflife' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Radio className="w-4 h-4 text-violet-400" />
              <span>Radioactive Decay & Half-life (N(t) = N₀ · (1/2)^(t/T))</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Initial Amount (N₀, g or %):</label>
                <input
                  type="number"
                  value={hlN0}
                  onChange={(e) => setHlN0(parseFloat(e.target.value) || 100)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Half-life (t_1/2, years/days/hours):</label>
                <input
                  type="number"
                  value={hlHalfLife}
                  onChange={(e) => setHlHalfLife(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Elapsed Time (t, same unit):</label>
                <input
                  type="number"
                  value={hlTimeElapsed}
                  onChange={(e) => setHlTimeElapsed(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-violet-950/30 border border-violet-500/40 space-y-1">
              <span className="text-[10px] text-violet-300 uppercase font-semibold block">Remaining Undecayed Amount N(t):</span>
              <div className="text-3xl font-black text-white font-mono">{hlRemainingAmount.toFixed(4)}</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Elapsed half-lives = <strong>{hlNumDecays.toFixed(2)} half-lives</strong> | Decayed amount: <strong>{hlDecayedAmount.toFixed(2)}</strong>
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-violet-400" />
              <span>Carbon Dating & Radioactive Half-life</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Radioactive half-life is a first-order decay process. Carbon-14 has a half-life of 5730 years, used for determining the age of ancient fossils (Radiocarbon dating).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
