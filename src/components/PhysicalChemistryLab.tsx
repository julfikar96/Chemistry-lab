import React, { useState, useEffect, useRef } from 'react';
import { COMMON_BOND_ENERGIES } from '../data/chemistryDatabase';
import {
  Flame,
  Wind,
  Activity,
  Zap,
  RotateCcw,
  Sparkles,
  Layers,
  Thermometer,
  Gauge,
  ArrowRight,
  TrendingUp,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
}

export function PhysicalChemistryLab({ onAskTutor }: Props) {
  const [activeTab, setActiveTab] = useState<'states' | 'gaslaws' | 'thermo' | 'kinetics' | 'equilibrium'>('states');

  // States of Matter State
  const [temperatureC, setTemperatureC] = useState<number>(25);
  const [substance, setSubstance] = useState<'water' | 'iron' | 'nitrogen'>('water');

  // Gas Laws State
  const [gasLawMode, setGasLawMode] = useState<'boyle' | 'charles' | 'ideal' | 'graham'>('boyle');
  const [gasP, setGasP] = useState<number>(1.0); // atm
  const [gasV, setGasV] = useState<number>(22.4); // L
  const [gasT, setGasT] = useState<number>(298); // K
  const [gasN, setGasN] = useState<number>(1.0); // mol

  // Graham's Law
  const [gas1Name, setGas1Name] = useState<string>('NH3');
  const [gas1Mass, setGas1Mass] = useState<number>(17);
  const [gas2Name, setGas2Name] = useState<string>('HCl');
  const [gas2Mass, setGas2Mass] = useState<number>(36.5);

  // Thermochemistry State
  const [thermoReactionType, setThermoReactionType] = useState<'exo' | 'endo'>('exo');
  const [calorimetryMass, setCalorimetryMass] = useState<number>(100); // g
  const [calorimetrySpecificHeat, setCalorimetrySpecificHeat] = useState<number>(4.184); // J/g.K (water)
  const [calorimetryDeltaT, setCalorimetryDeltaT] = useState<number>(10); // K

  // Kinetics State
  const [tempKinetics, setTempKinetics] = useState<number>(300);
  const [activationEnergyEa, setActivationEnergyEa] = useState<number>(50); // kJ/mol
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(false);

  // Equilibrium (Le Chatelier) State
  const [eqTemp, setEqTemp] = useState<number>(450); // C
  const [eqPressure, setEqPressure] = useState<number>(200); // atm
  const [n2Conc, setN2Conc] = useState<number>(1.0);
  const [h2Conc, setH2Conc] = useState<number>(3.0);
  const [nh3Conc, setNh3Conc] = useState<number>(0.5);

  const statesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pistonCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Determine current phase based on temperature
  let currentPhase = 'Liquid (liquid)';
  let meltingPt = 0;
  let boilingPt = 100;

  if (substance === 'water') {
    meltingPt = 0;
    boilingPt = 100;
  } else if (substance === 'iron') {
    meltingPt = 1538;
    boilingPt = 2862;
  } else if (substance === 'nitrogen') {
    meltingPt = -210;
    boilingPt = -196;
  }

  if (temperatureC < meltingPt) {
    currentPhase = 'Solid (solid - specific shape and volume)';
  } else if (temperatureC < boilingPt) {
    currentPhase = 'Liquid (Liquids - fixed volume, indefinite size)';
  } else if (temperatureC < 1000) {
    currentPhase = 'Gas (gaseous - infinite elasticity)';
  } else {
    currentPhase = 'Plasma (plasma - ionized gas)';
  }

  // Particle Simulation Animation
  useEffect(() => {
    const canvas = statesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const numParticles = 60;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];

    const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    const height = (canvas.height = 240);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: 6,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Container Box
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, width - 20, height - 20);

      // Speed factor depending on temperature
      const speedFactor = Math.max(0.1, (temperatureC + 100) / 120);

      particles.forEach((p, idx) => {
        if (temperatureC < meltingPt) {
          // SOLID: Particles vibrate around fixed lattice positions
          const row = Math.floor(idx / 10);
          const col = idx % 10;
          const latticeX = width / 2 - 100 + col * 20;
          const latticeY = height - 40 - row * 20;
          p.x = latticeX + Math.sin(Date.now() * 0.02 + idx) * (speedFactor * 0.8);
          p.y = latticeY + Math.cos(Date.now() * 0.02 + idx) * (speedFactor * 0.8);
        } else if (temperatureC < boilingPt) {
          // LIQUID: Settle towards bottom with fluid motion
          p.x += p.vx * speedFactor;
          p.y += p.vy * speedFactor + 0.5; // gravity pull

          if (p.x < 20 || p.x > width - 20) p.vx *= -1;
          if (p.y > height - 20) {
            p.y = height - 20;
            p.vy *= -0.7;
          }
          if (p.y < height / 2) {
            p.vy += 0.2;
          }
        } else {
          // GAS: Rapid random motion filling entire container
          p.x += p.vx * speedFactor * 2.2;
          p.y += p.vy * speedFactor * 2.2;

          if (p.x < 20 || p.x > width - 20) p.vx *= -1;
          if (p.y < 20 || p.y > height - 20) p.vy *= -1;
        }

        // Draw particle
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        if (temperatureC < meltingPt) {
          ctx.fillStyle = '#38bdf8'; // Blue for cold/solid
        } else if (temperatureC < boilingPt) {
          ctx.fillStyle = '#06b6d4'; // Cyan for liquid
        } else if (temperatureC < 1000) {
          ctx.fillStyle = '#fb923c'; // Orange for gas
        } else {
          ctx.fillStyle = '#f43f5e'; // Pink/Red for plasma
        }
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [temperatureC, substance, meltingPt, boilingPt]);

  // Calorimetry Calculation (q = mcΔT)
  const calculatedHeatJ = calorimetryMass * calorimetrySpecificHeat * calorimetryDeltaT;
  const calculatedHeatKJ = calculatedHeatJ / 1000;

  // Graham's Law Diffusion Rate Ratio
  const grahamRatio = Math.sqrt(gas2Mass / gas1Mass);

  // Arrhenius rate constant (k = A * e^(-Ea/RT))
  const effectiveEa = hasCatalyst ? activationEnergyEa * 0.55 : activationEnergyEa; // Catalyst lowers Ea
  const R_GAS = 8.314; // J/(mol.K)
  const kRate = 1e5 * Math.exp((-effectiveEa * 1000) / (R_GAS * tempKinetics));

  // Le Chatelier Haber Process Shift Direction
  // N2(g) + 3H2(g) <=> 2NH3(g) + 92.4 kJ
  let equilibriumDirection = 'In Equilibrium';
  let yieldPercentage = 15; // default %

  // High pressure favours forward reaction (4 moles gas -> 2 moles gas)
  // Low temp favours forward reaction (exothermic)
  yieldPercentage += (eqPressure - 100) * 0.15;
  yieldPercentage += (500 - eqTemp) * 0.1;
  yieldPercentage = Math.max(5, Math.min(98, yieldPercentage));

  if (eqPressure > 250 && eqTemp < 450) {
    equilibriumDirection = 'move to the right (advance forward) → More NH₃ the product';
  } else if (eqPressure < 150 || eqTemp > 500) {
    equilibriumDirection = 'Left-facing Sarabe (rearward) → NH₃ will separate';
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-slate-800 shadow-2xl flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Physical Chemistry, Gas Formulas, Thermodynamics and Equilibrium Lab</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30">
                Physical Chemistry & Kinetics
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              States of matter and particle simulation, Boyle-Charles-ideal gas formula, calorimetry ($q=mc\Delta T$), Arrhenius reaction rates and La-Chatelier's principle
            </p>
          </div>
        </div>
      </div>

      {/* Mode Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('states')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'states'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>State of Matter and Particle Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('gaslaws')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'gaslaws'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Wind className="w-4 h-4" />
          <span>Gas formula lab (Boyle, Charles, Ideal, Graham)</span>
        </button>

        <button
          onClick={() => setActiveTab('thermo')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'thermo'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Thermochemistry and Calorimetry ($q = mc\Delta T$)</span>
        </button>

        <button
          onClick={() => setActiveTab('kinetics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'kinetics'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Chemical Kinetics and Effects (Arrhenius)</span>
        </button>

        <button
          onClick={() => setActiveTab('equilibrium')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'equilibrium'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Chemical equilibrium and La-Chatelier's principle</span>
        </button>
      </div>

      {/* TAB 1: STATES OF MATTER & PARTICLE SIMULATOR */}
      {activeTab === 'states' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                Particle and Kinetic Simulation (Kinetic Molecular Theory)
              </span>
              <span className="text-xs font-mono text-cyan-300 font-bold">{currentPhase}</span>
            </div>

            <div className="w-full h-64 rounded-2xl overflow-hidden border border-slate-800">
              <canvas ref={statesCanvasRef} className="w-full h-full" />
            </div>

            {/* Temperature Control */}
            <div className="space-y-2 text-xs pt-2">
              <div className="flex justify-between text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-400" />
                  Temperature
                </span>
                <span className="font-bold text-amber-300 font-mono">
                  {temperatureC}°C ({temperatureC + 273.15} K)
                </span>
              </div>
              <input
                type="range"
                min="-100"
                max="300"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Change of state and thermal processes</span>
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block">Melting and Evaporation:</strong>
                <span className="text-slate-400 text-[11px]">
                  Application of heat increases the kinetic energy of the particles and decreases the intermolecular forces of attraction।
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-purple-400 block">Sublimation:</strong>
                <span className="text-slate-400 text-[11px]">
                  Solids change directly to gas instead of liquid (eg: camphor, Nishadal, etc.). $NH_4Cl$, Iodine $I_2$)।
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-rose-400 block">Plasma Status:</strong>
                <span className="text-slate-400 text-[11px]">
                  At very high temperatures, electrons are stripped from atoms to form an ionized state of positive ions and free electrons।
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GAS LAWS (BOYLE, CHARLES, IDEAL, GRAHAM) */}
      {activeTab === 'gaslaws' && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            {[
              { id: 'boyle', label: "Boyle's formula (P₁V₁ = P₂V₂)" },
              { id: 'charles', label: "Charles' formula (V₁/T₁ = V₂/T₂)" },
              { id: 'ideal', label: "Ideal Gas Equation (PV = nRT)" },
              { id: 'graham', label: "Graham's Diffusion Law (r₁/r₂ = √(M₂/M₁))" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setGasLawMode(m.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                  gasLawMode === m.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {gasLawMode === 'boyle' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span>Boyle's Law Simulator: P at constant temperature ∝ 1/V</span>
                </h3>

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Applied pressure (Pressure, P):</span>
                    <span className="font-bold text-amber-300 font-mono">{gasP.toFixed(2)} atm</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.1"
                    value={gasP}
                    onChange={(e) => {
                      const newP = parseFloat(e.target.value);
                      setGasP(newP);
                      setGasV(22.4 / newP); // Inverse relation
                    }}
                    className="w-full accent-amber-400"
                  />
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Gas Pressure (P)</span>
                    <span className="text-xl font-bold text-cyan-300 font-mono">{gasP.toFixed(2)} atm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Volume of gas (V = k/P)</span>
                    <span className="text-xl font-bold text-emerald-300 font-mono">
                      {(22.4 / gasP).toFixed(2)} L
                    </span>
                  </div>
                </div>

                <p className="text-slate-400 text-[11px] leading-relaxed">
                  <strong>Boyle's formula:</strong> The volume of a given mass of gas at constant temperature is directly proportional to the pressure exerted on it। Doubling the pressure halves the volume।
                </p>
              </div>

              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 text-xs">
                <h4 className="text-sm font-bold text-slate-100">Gas constants and formulas</h4>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 font-mono">
                  <div className="text-amber-300">P₁V₁ = P₂V₂ = k</div>
                  <div className="text-slate-400">The value of the constant k = {(gasP * (22.4 / gasP)).toFixed(2)} L·atm</div>
                </div>
              </div>
            </div>
          )}

          {gasLawMode === 'graham' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Wind className="w-4 h-4 text-cyan-400" />
                  <span>Graham's Law of Gas Diffusion (r₁/r₂ = √(M₂/M₁))</span>
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-bold text-cyan-300">Gas-1 (eg: NH₃)</span>
                    <input
                      type="number"
                      value={gas1Mass}
                      onChange={(e) => setGas1Mass(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 font-mono"
                      placeholder="Molecular mass (g/mol)"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <span className="font-bold text-rose-300">Gas-2 (Ex: HCl)</span>
                    <input
                      type="number"
                      value={gas2Mass}
                      onChange={(e) => setGas2Mass(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded bg-slate-900 border border-slate-700 font-mono"
                      placeholder="Molecular mass (g/mol)"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-cyan-300 block">diffusion rate ratio ($r_1 / r_2$):</span>
                    <span className="text-2xl font-black text-white font-mono">{grahamRatio.toFixed(3)} : 1</span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-semibold">
                    Lighter gases diffuse faster
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 text-xs">
                <h4 className="text-sm font-bold text-slate-100">The classic test tube test</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  At one end of the glass tube $NH_3$ And on the other side $HCl$ If soaked cotton, $NH_3$ (M=17) Fast spreading and relatively heavy $HCl$ (M=36.5) White smoke near the edge $NH_4Cl$ Makes a ring।
                </p>
              </div>
            </div>
          )}

          {gasLawMode === 'ideal' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-amber-400" />
                  <span>The ideal gas equation ($PV = nRT$)</span>
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Number of moles (n):</label>
                    <input
                      type="number"
                      value={gasN}
                      onChange={(e) => setGasN(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Temperature (K):</label>
                    <input
                      type="number"
                      value={gasT}
                      onChange={(e) => setGasT(parseFloat(e.target.value) || 273)}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Pressure (P, atm):</label>
                    <input
                      type="number"
                      value={gasP}
                      onChange={(e) => setGasP(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-1">
                  <span className="text-[10px] text-amber-300 uppercase font-semibold">Determined volume (V = nRT / P):</span>
                  <div className="text-2xl font-black text-white font-mono">
                    {((gasN * 0.0821 * gasT) / gasP).toFixed(3)} L
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    Universal gas constant R = 0.0821 L·atm/(mol·K) = 8.314 J/(mol·K)
                  </span>
                </div>
              </div>

              <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3 text-xs">
                <h4 className="text-sm font-bold text-slate-100">Real Gases vs. Ideal Gases</h4>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Real gases behave like ideal gases at high temperatures and low pressures। The van der Waals equation for real gases is (P + an²/V²)(V - nb) = nRT is used।
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: THERMOCHEMISTRY & CALORIMETRY */}
      {activeTab === 'thermo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Calorimetry and calorimetry ($q = mc\Delta T$)</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Mass (m, grams):</label>
                <input
                  type="number"
                  value={calorimetryMass}
                  onChange={(e) => setCalorimetryMass(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Relative heat (s/c, J/g·°C):</label>
                <input
                  type="number"
                  value={calorimetrySpecificHeat}
                  onChange={(e) => setCalorimetrySpecificHeat(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">temperature change ($\Delta T$, °C):</label>
                <input
                  type="number"
                  value={calorimetryDeltaT}
                  onChange={(e) => setCalorimetryDeltaT(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 rounded bg-slate-950 border border-slate-700 font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-300 font-semibold uppercase">Heat absorbed or released (q):</span>
                <div className="text-2xl font-black text-white font-mono">{calculatedHeatKJ.toFixed(3)} kJ</div>
                <div className="text-[11px] text-slate-400 font-mono">{calculatedHeatJ.toFixed(1)} Joules</div>
              </div>
            </div>

            {/* Bond Energy Table preview */}
            <div className="space-y-2">
              <span className="font-bold text-slate-200 block">from bond strength $\Delta H$ Diagnosis:</span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                ΔH = Σ(strength of broken bonds) - Σ(bond strength)
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100">Tapotpadi vs Taphari reaction</h4>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-1">
              <span className="font-bold text-rose-400 block">1. Exothermic reaction (Exothermic, ΔH &lt; 0):</span>
              <p className="text-slate-400 text-[11px]">
                Heat energy is produced in the reaction and the temperature of the surroundings increases (eg: combustion reaction of methane ΔH = -890 kJ/mol)।
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-1">
              <span className="font-bold text-cyan-400 block">2. Endothermic reactions (endothermic, ΔH &gt; 0):</span>
              <p className="text-slate-400 text-[11px]">
                Heat is absorbed from the environment in the reaction and the temperature decreases (e.g. reaction of nitrogen and oxygen to produce NO ΔH = +180 kJ/mol)।
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CHEMICAL KINETICS & CATALYST */}
      {activeTab === 'kinetics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>Arrhenius equation and activation energy (k = A·e^(-Ea/RT))</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Temperature (K)</span>
                  <span className="font-bold text-white font-mono">{tempKinetics} K</span>
                </div>
                <input
                  type="range"
                  min="250"
                  max="600"
                  step="10"
                  value={tempKinetics}
                  onChange={(e) => setTempKinetics(parseInt(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>activation energy ($E_a$):</span>
                  <span className="font-bold text-white font-mono">{activationEnergyEa} kJ/mol</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  step="5"
                  value={activationEnergyEa}
                  onChange={(e) => setActivationEnergyEa(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Catalyst Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
              <div>
                <span className="font-bold text-slate-200 block">Catalyst Effect:</span>
                <span className="text-slate-400 text-[11px]">Effector increases the speed by decreasing the activation energy of the reaction।</span>
              </div>
              <button
                onClick={() => setHasCatalyst(!hasCatalyst)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  hasCatalyst
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {hasCatalyst ? 'Active' : 'ineffective'}
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-cyan-300 font-semibold uppercase">effective activation energy ($E_a$):</span>
                <div className="text-xl font-bold text-white font-mono">{effectiveEa.toFixed(1)} kJ/mol</div>
              </div>
              <div>
                <span className="text-[10px] text-emerald-300 font-semibold uppercase">relative reaction rate ($k$):</span>
                <div className="text-xl font-bold text-emerald-300 font-mono">{kRate.toExponential(3)}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100">Effectors on reaction rates</h4>
            <div className="space-y-2.5 text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong>Temperature:</strong>
                <span className="text-slate-400">Every 10°C The rate of reaction almost doubles or triples for increasing temperature।</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-300 block">2. Density and Pressure:</strong>
                <span className="text-slate-400">As density increases, the number of effective collisions between particles increases।</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-emerald-300 block">3. Surface Area:</strong>
                <span className="text-slate-400">Crushing solids increases the surface area and speeds up the reaction।</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CHEMICAL EQUILIBRIUM & LE CHATELIER'S PRINCIPLE */}
      {activeTab === 'equilibrium' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>La-Chatelier principle simulator (Heber method $NH_3$ production)</span>
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 font-mono text-amber-300 text-sm font-bold text-center">
              N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + 92.4 kJ (heather)
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>temperature (°C):</span>
                  <span className="font-bold text-white font-mono">{eqTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="600"
                  step="25"
                  value={eqTemp}
                  onChange={(e) => setEqTemp(parseInt(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Pressure (atm):</span>
                  <span className="font-bold text-white font-mono">{eqPressure} atm</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="400"
                  step="25"
                  value={eqPressure}
                  onChange={(e) => setEqPressure(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Equilibrium Direction & Yield */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-2">
              <span className="text-[10px] text-emerald-300 font-semibold uppercase">Shift in direction of equilibrium:</span>
              <div className="text-base font-bold text-emerald-200">{equilibriumDirection}</div>
              <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20">
                <span className="text-slate-300">approx $NH_3$ production yield (% Yield):</span>
                <span className="text-xl font-black text-amber-300 font-mono">{yieldPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100">Optimum Conditions</h4>
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-[11px] text-slate-300">
              <p>
                <strong>1. Temperature:</strong> Yields are higher at lower temperatures, being exothermic, but the optimum temperature for satisfactory rate of reaction <strong>450°C - 550°C</strong>.
              </p>
              <p>
                <strong>2. Pressure:</strong> Since there are 4 moles of reactants and 2 moles of gas in the products, at high pressure (<strong>200 atm</strong>) The equilibrium shifts to the right.
              </p>
              <p>
                <strong>3. Influencer:</strong> fine iron powder ($Fe$) impactor and molybdenum ($Mo$) or $Al_2O_3/K_2O$ Influence is helpful।
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
