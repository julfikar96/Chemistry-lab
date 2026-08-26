import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audio';
import {
  Zap,
  Battery,
  Layers,
  RotateCcw,
  Play,
  Pause,
  BookOpen,
  HelpCircle,
  Activity,
  Flame,
  CheckCircle2,
  Sparkles,
  Info,
  Sliders,
  ChevronRight,
} from 'lucide-react';

interface ElectrodeMaterial {
  id: string;
  name: string;
  banglaName: string;
  symbol: string;
  standardReductionPotential: number; // in Volts (E°)
  colorHex: string;
  colorName: string;
}

const ELECTRODES: ElectrodeMaterial[] = [
  {
    id: 'mg',
    name: 'Magnesium',
    banglaName: 'magnesium (Mg)',
    symbol: 'Mg',
    standardReductionPotential: -2.37,
    colorHex: '#cbd5e1',
    colorName: 'Silver is white',
  },
  {
    id: 'zn',
    name: 'Zinc',
    banglaName: 'Zinc (Zn)',
    symbol: 'Zn',
    standardReductionPotential: -0.76,
    colorHex: '#94a3b8',
    colorName: 'Gray glitter',
  },
  {
    id: 'fe',
    name: 'Iron',
    banglaName: 'Iron / Iron (Fe)',
    symbol: 'Fe',
    standardReductionPotential: -0.44,
    colorHex: '#64748b',
    colorName: 'gray black',
  },
  {
    id: 'pb',
    name: 'Lead',
    banglaName: 'Lead (Pb)',
    symbol: 'Pb',
    standardReductionPotential: -0.13,
    colorHex: '#475569',
    colorName: 'bluish gray',
  },
  {
    id: 'cu',
    name: 'Copper',
    banglaName: 'Copper (Cu)',
    symbol: 'Cu',
    standardReductionPotential: +0.34,
    colorHex: '#b45309',
    colorName: 'Bright reddish-brown',
  },
  {
    id: 'ag',
    name: 'Silver',
    banglaName: 'Silver (Ag)',
    symbol: 'Ag',
    standardReductionPotential: +0.80,
    colorHex: '#f1f5f9',
    colorName: 'Bright silver',
  },
];

interface ElectrochemicalLabProps {
  onAddNotebookEntry?: (entry: any) => void;
  onAskTutor?: (question: string) => void;
  onUnlockAchievement?: (id: string) => void;
}

export const ElectrochemicalLab: React.FC<ElectrochemicalLabProps> = ({
  onAddNotebookEntry,
  onAskTutor,
  onUnlockAchievement,
}) => {
  // Main mode: Galvanic Cell (Voltaic) vs Electrolytic Cell (Electrolysis)
  const [activeMode, setActiveMode] = useState<'galvanic' | 'electrolysis'>('galvanic');

  // --- 1. GALVANIC CELL (DANIELL CELL) STATE ---
  const [anodeElectrode, setAnodeElectrode] = useState<ElectrodeMaterial>(ELECTRODES[1]); // Zinc
  const [cathodeElectrode, setCathodeElectrode] = useState<ElectrodeMaterial>(ELECTRODES[4]); // Copper
  const [isCircuitClosed, setIsCircuitClosed] = useState<boolean>(false);
  const [saltBridgeType, setSaltBridgeType] = useState<'KCl' | 'KNO3'>('KCl');
  const [galvanicTimer, setGalvanicTimer] = useState<number>(0);

  // Computed EMF (Electromotive Force / Cell Potential)
  // E°cell = E°cathode - E°anode
  const computedEMF = cathodeElectrode.standardReductionPotential - anodeElectrode.standardReductionPotential;
  const isSpontaneous = computedEMF > 0;

  // --- 2. ELECTROLYSIS (ELECTROLYTIC CELL) STATE ---
  const [electrolysisSystem, setElectrolysisSystem] = useState<'water' | 'brine' | 'electroplating'>('water');
  const [powerVoltage, setPowerVoltage] = useState<number>(6); // Volts
  const [isPowerOn, setIsPowerOn] = useState<boolean>(false);
  const [h2Volume, setH2Volume] = useState<number>(0); // in mL
  const [o2Volume, setO2Volume] = useState<number>(0); // in mL
  const [cl2Volume, setCl2Volume] = useState<number>(0); // in mL
  const [platedThickness, setPlatedThickness] = useState<number>(0); // in microns
  const [testResultFeedback, setTestResultFeedback] = useState<string | null>(null);

  // Galvanic timer effect
  useEffect(() => {
    let interval: any = null;
    if (isCircuitClosed && isSpontaneous) {
      interval = setInterval(() => {
        setGalvanicTimer((t) => t + 1);
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isCircuitClosed, isSpontaneous]);

  // Electrolysis simulation tick
  useEffect(() => {
    let interval: any = null;
    if (isPowerOn) {
      interval = setInterval(() => {
        const rate = (powerVoltage / 6) * 0.2;
        if (electrolysisSystem === 'water') {
          setH2Volume((prev) => +(prev + rate * 2).toFixed(2));
          setO2Volume((prev) => +(prev + rate * 1).toFixed(2));
        } else if (electrolysisSystem === 'brine') {
          setH2Volume((prev) => +(prev + rate * 1.5).toFixed(2));
          setCl2Volume((prev) => +(prev + rate * 1.5).toFixed(2));
        } else if (electrolysisSystem === 'electroplating') {
          setPlatedThickness((prev) => +(prev + rate * 0.8).toFixed(2));
        }
      }, 400);
    }
    return () => clearInterval(interval);
  }, [isPowerOn, powerVoltage, electrolysisSystem]);

  // Handle Toggle Switch for Galvanic Cell
  const handleToggleGalvanicCircuit = () => {
    setIsCircuitClosed(!isCircuitClosed);
    if (!isCircuitClosed) {
      soundEngine.playSuccessChime();
      onUnlockAchievement?.('electrochem_spark');
    } else {
      soundEngine.playGlassClink();
    }
  };

  // Handle Gas Pop-test / Splint Ignition for Electrolysis
  const handlePerformGasTest = (gas: 'H2' | 'O2' | 'Cl2') => {
    if (gas === 'H2') {
      soundEngine.playPopSound();
      setTestResultFeedback('💥 Pop (Pop) test successful! soft ‘Pop’ The gas burns in a pale blue flame with noise, which is hydrogen (H₂) Undoubted proof of gas।');
    } else if (gas === 'O2') {
      soundEngine.playSizzleSound();
      setTestResultFeedback('🔥 Oxygen test successful! Holding a gently burning stick to the emission mouth causes the stick to burn brightly, which is oxygen (O₂) confirm।');
    } else if (gas === 'Cl2') {
      setTestResultFeedback('🟢 Chlorine Test: A pale yellowish-green inflammable gas which reddens blue litmus and later bleaches it.।');
    }
  };

  // Save to Notebook
  const handleSaveGalvanicToNotebook = () => {
    onAddNotebookEntry?.({
      title: `Galvanic Daniel cell: ${anodeElectrode.symbol} | ${anodeElectrode.symbol}²⁺ || ${cathodeElectrode.symbol}²⁺ | ${cathodeElectrode.symbol}`,
      chemicals: [
        `Anode current: ${anodeElectrode.banglaName} (E° = ${anodeElectrode.standardReductionPotential} V)`,
        `Cathode current: ${cathodeElectrode.banglaName} (E° = ${cathodeElectrode.standardReductionPotential} V)`,
        `Salt Bridge: ${saltBridgeType} the solution`,
      ],
      equation: `${anodeElectrode.symbol}(s) + ${cathodeElectrode.symbol}²⁺(aq) → ${anodeElectrode.symbol}²⁺(aq) + ${cathodeElectrode.symbol}(s)`,
      observations: [
        `Cell evidence potential E°cell = E°cathode - E°anode = ${cathodeElectrode.standardReductionPotential} - (${anodeElectrode.standardReductionPotential}) = ${computedEMF.toFixed(2)} V`,
        `Electron flow: Anode (${anodeElectrode.symbol}) be the cathode (${cathodeElectrode.symbol}) towards।`,
        `Current flow (conventional direction of current flow): from cathode to anode।`,
        `Bulb ignition: ${isSpontaneous ? 'Shining brightly' : 'unexpected (E°cell negative)'}`,
      ],
      temp: 25.0,
      ph: 7.0,
      results: `In a galvanic cell, chemical energy is directly converted into electrical energy। Generated potential ${computedEMF.toFixed(2)} volt।`,
    });
    alert('Galvanic cell data successfully saved in lab notebook!');
    soundEngine.playSuccessChime();
  };

  const handleSaveElectrolysisToNotebook = () => {
    onAddNotebookEntry?.({
      title: `Electrolysis Test: ${
        electrolysisSystem === 'water'
          ? 'Electrolysis of water (2H₂O → 2H₂ + O₂)'
          : electrolysisSystem === 'brine'
          ? 'Electrolysis of Brine (Chlor-Alkali)'
          : 'Copper Electroplating'
      }`,
      chemicals: [
        electrolysisSystem === 'water'
          ? 'Acidified water mixed with mild sulfuric acid'
          : electrolysisSystem === 'brine'
          ? 'Brine Solution'
          : 'Copper sulfate solution (CuSO₄) And copper leaf',
      ],
      equation:
        electrolysisSystem === 'water'
          ? '2H₂O(l) → 2H₂(g)[Cathode] + O₂(g)[Anode]'
          : electrolysisSystem === 'brine'
          ? '2NaCl(aq) + 2H₂O(l) → Cl₂(g) + H₂(g) + 2NaOH(aq)'
          : 'Cu²⁺(aq) + 2e⁻ → Cu(s) [coating on the cathode]',
      observations: [
        `Applied power: ${powerVoltage} V`,
        electrolysisSystem === 'water'
          ? `H produced at the cathode₂ Gas: ${h2Volume.toFixed(2)} mL, O produced at the anode₂ Gas: ${o2Volume.toFixed(2)} mL (ratio 2:1)`
          : electrolysisSystem === 'brine'
          ? `Cl at the anode₂ Gas: ${cl2Volume.toFixed(2)} mL, H at the cathode₂ Gas: ${h2Volume.toFixed(2)} mL`
          : `Density of copper coating deposited on iron: ${platedThickness.toFixed(2)} µm`,
      ],
      temp: 25.0,
      ph: electrolysisSystem === 'brine' ? 12.5 : 7.0,
      results: 'Chemical reactions completed under the influence of electrical energy (electrolysis)।',
    });
    alert('The electrolysis test has been successfully saved in the lab notebook!');
    soundEngine.playSuccessChime();
  };

  return (
    <div id="electrochem-lab-container" className="w-full flex flex-col gap-6">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Electrochemical cell and electroanalytical laboratory</span>
              </h2>
              <p className="text-xs text-slate-400">
                Galvanic Daniel cell (E°cell = 1.10 V), Salt bridge, water electrolysis and electroplating simulator
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveMode('galvanic')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMode === 'galvanic'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Battery className="w-4 h-4" />
            <span>1. Galvanic cell (Daniel cell)</span>
          </button>

          <button
            onClick={() => setActiveMode('electrolysis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeMode === 'electrolysis'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>2. Electrolysis cell</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: GALVANIC CELL (DANIELL CELL)                                      */}
      {/* ========================================================================= */}
      {activeMode === 'galvanic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Electrode Potential Selector & Chemistry Setup (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Selection of prompts and activations</span>
              </span>

              {/* Anode Selection (Oxidation) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5 text-xs">
                <span className="font-bold text-rose-400 flex items-center justify-between">
                  <span>Anode (oxidation half-cell - Oxidation):</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    (-) negative
                  </span>
                </span>
                <select
                  value={anodeElectrode.id}
                  onChange={(e) => {
                    const el = ELECTRODES.find((x) => x.id === e.target.value);
                    if (el) setAnodeElectrode(el);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {ELECTRODES.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.banglaName} | E° = {el.standardReductionPotential > 0 ? '+' : ''}
                      {el.standardReductionPotential} V
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Solution: <strong>1.0 M {anodeElectrode.symbol}SO₄</strong>
                </div>
                <div className="text-[10px] text-rose-300 font-mono">
                  {anodeElectrode.symbol}(s) → {anodeElectrode.symbol}²⁺(aq) + 2e⁻
                </div>
              </div>

              {/* Cathode Selection (Reduction) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5 text-xs">
                <span className="font-bold text-cyan-400 flex items-center justify-between">
                  <span>Cathode (oxidation half-cell - reduction):</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                    (+) positive
                  </span>
                </span>
                <select
                  value={cathodeElectrode.id}
                  onChange={(e) => {
                    const el = ELECTRODES.find((x) => x.id === e.target.value);
                    if (el) setCathodeElectrode(el);
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  {ELECTRODES.map((el) => (
                    <option key={el.id} value={el.id}>
                      {el.banglaName} | E° = {el.standardReductionPotential > 0 ? '+' : ''}
                      {el.standardReductionPotential} V
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Solution: <strong>1.0 M {cathodeElectrode.symbol}SO₄</strong>
                </div>
                <div className="text-[10px] text-cyan-300 font-mono">
                  {cathodeElectrode.symbol}²⁺(aq) + 2e⁻ → {cathodeElectrode.symbol}(s)
                </div>
              </div>

              {/* Salt Bridge (salt bridge) */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1 text-xs">
                <span className="font-semibold text-amber-300">Salt Bridge (Salt Bridge U-tube):</span>
                <div className="flex items-center gap-2 mt-1">
                  {(['KCl', 'KNO3'] as const).map((salt) => (
                    <button
                      key={salt}
                      onClick={() => setSaltBridgeType(salt)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        saltBridgeType === salt
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {salt} jelly
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Salt bridge maintains electrical neutrality in both solutions of the cell।
                </p>
              </div>
            </div>

            {/* EMF Formula Box */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col gap-2">
              <span className="font-bold text-slate-300">Cell viability equation:</span>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300 text-xs font-bold leading-relaxed">
                E°cell = E°cathode - E°anode
                <br />
                = {cathodeElectrode.standardReductionPotential > 0 ? '+' : ''}
                {cathodeElectrode.standardReductionPotential} - ({anodeElectrode.standardReductionPotential > 0 ? '+' : ''}
                {anodeElectrode.standardReductionPotential}) ={' '}
                <span className={computedEMF > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {computedEMF > 0 ? '+' : ''}
                  {computedEMF.toFixed(2)} V
                </span>
              </div>
            </div>
          </div>

          {/* Center Column: Interactive 2D/3D Animated Daniell Cell (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Live Instrument Readout */}
            <div className="grid grid-cols-2 gap-3">
              {/* Digital Voltmeter */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Digital Voltmeter (EMF)</span>
                  <span className="text-2xl font-mono font-black text-cyan-400 mt-0.5">
                    {isCircuitClosed ? `${computedEMF > 0 ? '+' : ''}${computedEMF.toFixed(2)} V` : '0.00 V'}
                  </span>
                </div>
                <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center font-mono font-black text-xs text-cyan-300">
                  V
                </div>
              </div>

              {/* Light Bulb & Power Status */}
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Bulbs and currents</span>
                  <span className="text-xs font-bold text-slate-200 mt-1">
                    {isCircuitClosed && isSpontaneous ? '💡 Light is on (flow active)' : '⚫ Disconnected'}
                  </span>
                </div>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCircuitClosed && isSpontaneous
                      ? 'bg-amber-400 shadow-lg shadow-amber-400/80 animate-pulse text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  ⚡
                </div>
              </div>
            </div>

            {/* Visual Interactive Daniell Cell Stage */}
            <div className="w-full h-[400px] rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-6">
              {/* Overhead Electrical Circuit Wire with Animated Electrons */}
              <div className="w-full flex items-center justify-between px-16 relative z-20">
                {/* Circuit Switch */}
                <button
                  onClick={handleToggleGalvanicCircuit}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all flex items-center gap-2 border ${
                    isCircuitClosed
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-500/30 ring-2 ring-emerald-400/50'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500 hover:bg-rose-500/30'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>{isCircuitClosed ? 'Circuit Switch: ON' : 'Circuit Switch: OFF'}</span>
                </button>

                {/* Voltmeter / Bulb centered in wire */}
                <div className="flex items-center gap-3 bg-slate-950/90 px-3 py-1.5 rounded-2xl border border-slate-700 shadow-md">
                  <span className="text-[10px] text-slate-400 font-mono">Electron flow (e⁻) ➔</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                      isCircuitClosed && isSpontaneous
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/80 animate-bounce'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    💡
                  </div>
                </div>
              </div>

              {/* Animated Connecting Wires */}
              <div className="w-full h-8 relative pointer-events-none">
                <svg className="w-full h-full">
                  <path
                    d="M 100 30 L 100 5 L 450 5 L 450 30"
                    fill="none"
                    stroke={isCircuitClosed && isSpontaneous ? '#38bdf8' : '#475569'}
                    strokeWidth="3"
                    strokeDasharray={isCircuitClosed && isSpontaneous ? '6,6' : 'none'}
                    className={isCircuitClosed && isSpontaneous ? 'animate-pulse' : ''}
                  />
                </svg>
              </div>

              {/* Two Beakers & Salt Bridge in the middle */}
              <div className="w-full flex items-end justify-around relative z-10">
                {/* 1. Anode Beaker (oxidation half-cell) */}
                <div className="w-40 h-52 border-2 border-slate-600 rounded-b-2xl bg-slate-900/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-end p-2 shadow-xl">
                  {/* Liquid (ZnSO4 / Electrolyte) */}
                  <div className="w-full h-36 bg-slate-800/40 border-t border-cyan-400/40 rounded-b-xl relative flex flex-col justify-end">
                    <span className="text-[9px] text-slate-400 font-mono text-center mb-1">
                      1.0 M {anodeElectrode.symbol}SO₄
                    </span>
                  </div>

                  {/* Anode Electrode Rod (Zn) */}
                  <div
                    className="absolute top-2 left-6 w-8 h-40 rounded-t-sm shadow-md border border-slate-400 flex flex-col items-center justify-start pt-2 transition-all"
                    style={{ backgroundColor: anodeElectrode.colorHex }}
                  >
                    <span className="text-[10px] font-black text-slate-950">{anodeElectrode.symbol}</span>
                    <span className="text-[8px] text-slate-900 font-bold">(-)</span>
                    {/* Oxidation dissolving animation */}
                    {isCircuitClosed && isSpontaneous && (
                      <div className="absolute bottom-2 text-[8px] font-mono text-cyan-300 animate-bounce">
                        {anodeElectrode.symbol}²⁺
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Salt Bridge U-Tube (Salt Bridge) in Middle */}
                <div className="w-24 h-40 -mb-4 flex flex-col items-center justify-start relative z-30 pointer-events-none">
                  {/* Inverted U-tube */}
                  <div className="w-20 h-28 border-4 border-b-0 border-amber-400/80 rounded-t-full bg-amber-500/10 backdrop-blur-sm relative flex items-center justify-center shadow-lg">
                    <span className="text-[9px] font-black text-amber-300 bg-slate-950/80 px-1.5 py-0.5 rounded border border-amber-500/40">
                      {saltBridgeType}
                    </span>

                    {/* Ion flow particles inside salt bridge */}
                    {isCircuitClosed && isSpontaneous && (
                      <>
                        <div className="absolute left-1 bottom-1 text-[8px] text-rose-300 animate-pulse font-mono">
                          Cl⁻ ➔
                        </div>
                        <div className="absolute right-1 bottom-1 text-[8px] text-cyan-300 animate-pulse font-mono">
                          ➔ K⁺
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 3. Cathode Beaker (oxidation half-cell) */}
                <div className="w-40 h-52 border-2 border-slate-600 rounded-b-2xl bg-slate-900/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-end p-2 shadow-xl">
                  {/* Liquid (CuSO4 / Electrolyte) */}
                  <div className="w-full h-36 bg-cyan-500/30 border-t border-cyan-300/80 rounded-b-xl relative flex flex-col justify-end">
                    <span className="text-[9px] text-cyan-200 font-mono text-center mb-1">
                      1.0 M {cathodeElectrode.symbol}SO₄
                    </span>
                  </div>

                  {/* Cathode Electrode Rod (Cu) */}
                  <div
                    className="absolute top-2 right-6 w-8 h-40 rounded-t-sm shadow-md border border-amber-700 flex flex-col items-center justify-start pt-2 transition-all"
                    style={{ backgroundColor: cathodeElectrode.colorHex }}
                  >
                    <span className="text-[10px] font-black text-white">{cathodeElectrode.symbol}</span>
                    <span className="text-[8px] text-white font-bold">(+)</span>
                    {/* Reduction plating animation */}
                    {isCircuitClosed && isSpontaneous && (
                      <div className="absolute bottom-2 text-[8px] font-mono text-amber-200 animate-pulse">
                        +2e⁻
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom State Description */}
              <div className="w-full p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs backdrop-blur-md">
                <span className="font-semibold text-slate-300">Cell Status:</span>
                <span className="font-bold text-cyan-300">
                  {isCircuitClosed
                    ? isSpontaneous
                      ? `Spontaneous reaction in progress ($E^\circ_{{cell}} = +${computedEMF.toFixed(2)}\\text{{ V}}$)`
                      : 'Spontaneous Reaction (Negative EMF Potential)'
                    : 'circuit open (switch off)'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Reaction Analysis & Notebook Action (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-3 text-xs">
              <span className="font-bold text-slate-200">Half-Reaction and Overall Equation:</span>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-[11px] text-rose-400 font-semibold">Anode Oxidation:</span>
                <span className="font-mono text-slate-100 font-bold">
                  {anodeElectrode.symbol}(s) → {anodeElectrode.symbol}²⁺(aq) + 2e⁻
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-[11px] text-cyan-400 font-semibold">Cathode oxidation (Reduction):</span>
                <span className="font-mono text-slate-100 font-bold">
                  {cathodeElectrode.symbol}²⁺(aq) + 2e⁻ → {cathodeElectrode.symbol}(s)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
                <span className="text-[11px] text-emerald-400 font-semibold">Overall Cell Reaction:</span>
                <span className="font-mono text-emerald-300 font-bold">
                  {anodeElectrode.symbol}(s) + {cathodeElectrode.symbol}²⁺(aq) → {anodeElectrode.symbol}²⁺(aq) +{' '}
                  {cathodeElectrode.symbol}(s)
                </span>
              </div>
            </div>

            <button
              onClick={handleSaveGalvanicToNotebook}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Saving the Daniel Cell Report</span>
            </button>

            <button
              onClick={() =>
                onAskTutor?.(
                  `Explain the working of galvanic Daniell cell, role of salt bridge and how proof cell potential determination works.।`
                )
              }
              className="w-full py-2.5 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-xs font-bold text-purple-200 transition-all flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>AI Ask the teacher Daniel Sale questions</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: ELECTROLYTIC CELL (ELECTROLYSIS)                                  */}
      {/* ========================================================================= */}
      {activeMode === 'electrolysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: System & Voltage Control (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Electrolysis system selection</span>
              </span>

              {/* System Selector */}
              <div className="flex flex-col gap-1.5">
                {[
                  {
                    id: 'water' as const,
                    name: 'Water Electrolysis',
                    sub: '2H₂O → 2H₂ + O₂ (2:1 gas ratio)',
                  },
                  {
                    id: 'brine' as const,
                    name: 'Electrolysis of Brine (NaCl Brine)',
                    sub: 'Chlor-alkali method (Cl₂ + H₂ + NaOH)',
                  },
                  {
                    id: 'electroplating' as const,
                    name: 'Copper Electroplating',
                    sub: 'Copper or silver plating on iron keys',
                  },
                ].map((sys) => (
                  <button
                    key={sys.id}
                    onClick={() => {
                      setElectrolysisSystem(sys.id);
                      setIsPowerOn(false);
                      setH2Volume(0);
                      setO2Volume(0);
                      setCl2Volume(0);
                      setPlatedThickness(0);
                      setTestResultFeedback(null);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all flex flex-col ${
                      electrolysisSystem === sys.id
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 ring-1 ring-cyan-500/50 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-100">{sys.name}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{sys.sub}</span>
                  </button>
                ))}
              </div>

              {/* DC Power Supply Voltage Slider */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2 mt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">DC Power Supply (DC Voltage):</span>
                  <span className="font-mono font-bold text-amber-300">{powerVoltage} V</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={24}
                  step={1}
                  value={powerVoltage}
                  onChange={(e) => setPowerVoltage(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer"
                />
              </div>

              {/* Power Switch */}
              <button
                onClick={() => {
                  setIsPowerOn(!isPowerOn);
                  if (!isPowerOn) {
                    soundEngine.playSizzleSound();
                    onUnlockAchievement?.('electrochem_spark');
                  }
                }}
                className={`py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all ${
                  isPowerOn
                    ? 'bg-rose-500 text-slate-950 shadow-rose-500/40 animate-pulse'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>{isPowerOn ? 'Turn the power OFF.' : 'Turn the power ON'}</span>
              </button>
            </div>
          </div>

          {/* Center Column: Interactive Hoffman Voltameter / Electroplating Cell (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Live Readouts */}
            <div className="grid grid-cols-3 gap-3">
              {electrolysisSystem === 'water' && (
                <>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Cathode H₂ gas</span>
                    <span className="text-lg font-mono font-black text-cyan-400 mt-0.5">{h2Volume.toFixed(2)} mL</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Anode O₂ gas</span>
                    <span className="text-lg font-mono font-black text-amber-400 mt-0.5">{o2Volume.toFixed(2)} mL</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Volume ratio</span>
                    <span className="text-lg font-mono font-black text-emerald-400 mt-0.5">2 : 1</span>
                  </div>
                </>
              )}

              {electrolysisSystem === 'brine' && (
                <>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Anode Cl₂ gas</span>
                    <span className="text-lg font-mono font-black text-emerald-400 mt-0.5">{cl2Volume.toFixed(2)} mL</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Cathode H₂ gas</span>
                    <span className="text-lg font-mono font-black text-cyan-400 mt-0.5">{h2Volume.toFixed(2)} mL</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Alkali in solution</span>
                    <span className="text-lg font-mono font-black text-rose-400 mt-0.5">NaOH (pH 12.5)</span>
                  </div>
                </>
              )}

              {electrolysisSystem === 'electroplating' && (
                <>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Cathode substrate</span>
                    <span className="text-xs font-bold text-slate-200 mt-1">Iron Key (Fe)</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Copper plating thickness</span>
                    <span className="text-lg font-mono font-black text-amber-500 mt-0.5">
                      {platedThickness.toFixed(2)} µm
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Electrolytes</span>
                    <span className="text-xs font-bold text-cyan-300 mt-1">CuSO₄ the solution</span>
                  </div>
                </>
              )}
            </div>

            {/* Visual Electrolysis Apparatus Container */}
            <div className="w-full h-[400px] rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-6">
              {/* DC Battery representation */}
              <div className="w-full flex items-center justify-between px-16 z-20">
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3 text-xs">
                  <span className="text-rose-400 font-mono font-bold">Anode (+)</span>
                  <div className="w-12 h-6 bg-amber-500 rounded flex items-center justify-center font-bold text-slate-950 text-xs shadow">
                    DC {powerVoltage}V
                  </div>
                  <span className="text-cyan-400 font-mono font-bold">Cathode (-)</span>
                </div>
              </div>

              {/* Hoffman Voltameter Apparatus (2 Graduated Inverted Tubes) */}
              <div className="w-full flex items-end justify-center gap-12 relative z-10">
                {/* Anode Tube (+) */}
                <div className="w-20 h-64 border-2 border-slate-500 rounded-t-full bg-slate-900/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between p-1 shadow-2xl">
                  {/* Gas Volume Collected at top */}
                  <div
                    className="w-full bg-amber-400/20 border-b-2 border-amber-300/80 transition-all rounded-t-full flex items-center justify-center"
                    style={{
                      height: `${Math.min(70, 10 + o2Volume * 4)}%`,
                    }}
                  >
                    <span className="text-[9px] font-black text-amber-300">
                      {electrolysisSystem === 'water' ? 'O₂ gas' : electrolysisSystem === 'brine' ? 'Cl₂ gas' : 'Cu leaves'}
                    </span>
                  </div>

                  {/* Bubbling Electrode at bottom */}
                  <div className="w-full flex flex-col items-center pb-2">
                    {isPowerOn && (
                      <div className="w-2 h-8 bg-amber-400/80 rounded-full animate-bounce mb-1" />
                    )}
                    <div className="w-6 h-12 bg-slate-400 rounded shadow" />
                    <span className="text-[9px] font-bold text-rose-400 mt-1">Anode (+)</span>
                  </div>
                </div>

                {/* Central Reservoir Tube for Water */}
                <div className="w-12 h-44 border-2 border-slate-600 bg-cyan-500/20 rounded-t-lg backdrop-blur-sm flex flex-col justify-end p-1">
                  <div className="w-full h-full bg-cyan-400/30 rounded-t-sm" />
                </div>

                {/* Cathode Tube (-) */}
                <div className="w-20 h-64 border-2 border-slate-500 rounded-t-full bg-slate-900/40 backdrop-blur-md relative overflow-hidden flex flex-col justify-between p-1 shadow-2xl">
                  {/* Gas Volume Collected at top (2x for H2) */}
                  <div
                    className="w-full bg-cyan-400/20 border-b-2 border-cyan-300/80 transition-all rounded-t-full flex items-center justify-center"
                    style={{
                      height: `${Math.min(85, 10 + h2Volume * 4)}%`,
                    }}
                  >
                    <span className="text-[9px] font-black text-cyan-300">
                      {electrolysisSystem === 'electroplating' ? 'copper layer' : 'H₂ Gas (2x)'}
                    </span>
                  </div>

                  {/* Bubbling Electrode at bottom */}
                  <div className="w-full flex flex-col items-center pb-2">
                    {isPowerOn && (
                      <div className="w-2 h-8 bg-cyan-400/80 rounded-full animate-bounce mb-1" />
                    )}
                    <div className="w-6 h-12 bg-slate-400 rounded shadow" />
                    <span className="text-[9px] font-bold text-cyan-400 mt-1">Cathode (-)</span>
                  </div>
                </div>
              </div>

              {/* Bottom Testing Controls */}
              <div className="w-full flex items-center justify-center gap-3">
                {electrolysisSystem === 'water' && (
                  <>
                    <button
                      onClick={() => handlePerformGasTest('H2')}
                      disabled={h2Volume < 1.0}
                      className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500 text-cyan-300 text-xs font-bold transition-all disabled:opacity-40"
                    >
                      💥 Hydrogen Pop Test (Pop-Test)
                    </button>
                    <button
                      onClick={() => handlePerformGasTest('O2')}
                      disabled={o2Volume < 0.5}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500 text-amber-300 text-xs font-bold transition-all disabled:opacity-40"
                    >
                      🔥 Oxygen flame test
                    </button>
                  </>
                )}

                {electrolysisSystem === 'brine' && (
                  <button
                    onClick={() => handlePerformGasTest('Cl2')}
                    disabled={cl2Volume < 1.0}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500 text-emerald-300 text-xs font-bold transition-all disabled:opacity-40"
                  >
                    🟢 Chlorine litmus test
                  </button>
                )}
              </div>
            </div>

            {/* Test result feedback banner */}
            {testResultFeedback && (
              <div className="p-3 rounded-2xl bg-slate-900 border border-cyan-500/40 text-xs text-slate-100 leading-relaxed shadow-lg">
                {testResultFeedback}
              </div>
            )}
          </div>

          {/* Right Column: Chemical Reactions & Save (3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-3 text-xs">
              <span className="font-bold text-slate-200">Feedback and policies:</span>

              {electrolysisSystem === 'water' && (
                <>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-rose-400 font-semibold">Anode oxidation (+):</span>
                    <div className="font-mono text-slate-100 font-bold mt-0.5">2H₂O → O₂ + 4H⁺ + 4e⁻</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-cyan-400 font-semibold">Cathode Discharge (-):</span>
                    <div className="font-mono text-slate-100 font-bold mt-0.5">4H⁺ + 4e⁻ → 2H₂</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-emerald-400 font-semibold">Overall equation:</span>
                    <div className="font-mono text-emerald-300 font-bold mt-0.5">2H₂O(l) → 2H₂(g) + O₂(g)</div>
                  </div>
                </>
              )}

              {electrolysisSystem === 'brine' && (
                <>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-rose-400 font-semibold">Anode oxidation (+):</span>
                    <div className="font-mono text-slate-100 font-bold mt-0.5">2Cl⁻ → Cl₂ + 2e⁻</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] text-cyan-400 font-semibold">Cathode Discharge (-):</span>
                    <div className="font-mono text-slate-100 font-bold mt-0.5">2H₂O + 2e⁻ → H₂ + 2OH⁻</div>
                  </div>
                </>
              )}

              {electrolysisSystem === 'electroplating' && (
                <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[11px] text-amber-400 font-semibold">Copper lining on cathode:</span>
                  <div className="font-mono text-amber-300 font-bold mt-0.5">Cu²⁺(aq) + 2e⁻ → Cu(s)↓</div>
                </div>
              )}
            </div>

            <button
              onClick={handleSaveElectrolysisToNotebook}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Save electrolysis results</span>
            </button>

            <button
              onClick={() =>
                onAskTutor?.(
                  `Explain how electrolysis and electroplating of water works and Farad's law।`
                )
              }
              className="w-full py-2.5 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-xs font-bold text-purple-200 transition-all flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>AI Ask the teacher electrolysis questions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
