import React, { useState, useEffect, useRef } from 'react';
import { ALL_118_ELEMENTS } from '../data/all118Elements';
import { RADIOACTIVE_ISOTOPES } from '../data/chemistryDatabase';
import {
  calculateUniversalAtom,
  UniversalAtomData,
  ElectronQuantumNumbers,
} from '../utils/universalChemistryEngine';
import {
  Atom,
  Sparkles,
  Layers,
  Activity,
  Calculator,
  RotateCcw,
  Zap,
  BookOpen,
  Info,
  Clock,
  Radio,
  Search,
  CheckCircle2,
  ChevronRight,
  Filter,
  Eye,
  ArrowRight,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
  onNavigateToBonding?: (formula?: string) => void;
}

export function AtomicStructureLab({ onAskTutor, onNavigateToBonding }: Props) {
  const [selectedZ, setSelectedZ] = useState<number>(6); // Default Carbon (Z=6)
  const [elementSearch, setElementSearch] = useState<string>('');
  const [selectedBlockFilter, setSelectedBlockFilter] = useState<'all' | 's' | 'p' | 'd' | 'f'>('all');
  const [showPeriodicGrid, setShowPeriodicGrid] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'model' | 'orbitals' | 'builder' | 'quantum' | 'isotopes' | 'halflife'>('model');

  // Dynamic Atom Builder subatomic particle overrides
  const [customNeutrons, setCustomNeutrons] = useState<number>(6);
  const [customElectrons, setCustomElectrons] = useState<number>(6);
  const [isExcitedState, setIsExcitedState] = useState<boolean>(false);

  // Selected electron for 4 Quantum Numbers inspection
  const [selectedElectronIndex, setSelectedElectronIndex] = useState<number>(6);

  // Orbital 3D/Vector Visualizer selection
  const [selectedOrbitalType, setSelectedOrbitalType] = useState<'1s' | '2px' | '2py' | '2pz' | '3dxy' | '3dz2' | '4f'>('2pz');

  // Average atomic mass calculation state
  const [iso1Mass, setIso1Mass] = useState<number>(35);
  const [iso1Abundance, setIso1Abundance] = useState<number>(75.77);
  const [iso2Mass, setIso2Mass] = useState<number>(37);
  const [iso2Abundance, setIso2Abundance] = useState<number>(24.23);

  // Half-life decay simulation state
  const [selectedIsoIndex, setSelectedIsoIndex] = useState<number>(0);
  const [initialAmount, setInitialAmount] = useState<number>(100);
  const [elapsedPeriods, setElapsedPeriods] = useState<number>(1);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const orbitalCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Calculate complete universal atomic data using our central engine
  const atomData: UniversalAtomData = calculateUniversalAtom(
    selectedZ,
    customNeutrons,
    customElectrons,
    isExcitedState
  );

  // When element changes, sync neutron and electron counts
  useEffect(() => {
    const currentElem = ALL_118_ELEMENTS.find((e) => e.number === selectedZ) || ALL_118_ELEMENTS[0];
    const standardN = Math.round(currentElem.mass) - selectedZ;
    setCustomNeutrons(standardN);
    setCustomElectrons(selectedZ);
    setIsExcitedState(false);
    setSelectedElectronIndex(selectedZ);
  }, [selectedZ]);

  // Animated 2D/3D Bohr Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const height = (canvas.height = 360);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw background glow
      const bgGlow = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 160);
      bgGlow.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      bgGlow.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw Nucleus
      const nucleusRadius = 24;
      const nucGrad = ctx.createRadialGradient(
        centerX - 4,
        centerY - 4,
        2,
        centerX,
        centerY,
        nucleusRadius
      );
      nucGrad.addColorStop(0, '#f43f5e');
      nucGrad.addColorStop(0.6, '#e11d48');
      nucGrad.addColorStop(1, '#881337');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
      ctx.fillStyle = nucGrad;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.restore();

      // Nucleus label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${atomData.protons}p⁺`, centerX, centerY - 5);
      ctx.fillText(`${atomData.neutrons}n⁰`, centerX, centerY + 7);

      // Draw Electron Shells (Bohr Orbitals: K, L, M, N, O, P, Q)
      const shells = atomData.shellConfig;
      const baseRadius = 38;
      const stepRadius = Math.min(22, (Math.min(width, height) / 2 - 45) / Math.max(1, shells.length));

      shells.forEach((electronCount, shellIdx) => {
        const r = baseRadius + shellIdx * stepRadius;

        // Shell Circle
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle =
          shellIdx === atomData.valenceShellNumber - 1
            ? 'rgba(245, 158, 11, 0.5)'
            : 'rgba(56, 189, 248, 0.25)';
        ctx.lineWidth = shellIdx === atomData.valenceShellNumber - 1 ? 1.8 : 1.2;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.restore();

        // Shell Label
        ctx.fillStyle = shellIdx === atomData.valenceShellNumber - 1 ? '#f59e0b' : 'rgba(148, 163, 184, 0.8)';
        ctx.font = '9px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(atomData.shellLabels[shellIdx]?.name || `n=${shellIdx + 1}`, centerX + r + 4, centerY - 2);

        // Draw Electrons on this shell
        for (let e = 0; e < electronCount; e++) {
          const speed = (shellIdx % 2 === 0 ? 1 : -1) * (0.018 / (shellIdx + 1));
          const electronAngle = (e * (2 * Math.PI)) / electronCount + angle * speed * 30;
          const ex = centerX + r * Math.cos(electronAngle);
          const ey = centerY + r * Math.sin(electronAngle);

          // Electron glow & circle
          ctx.save();
          ctx.beginPath();
          ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = shellIdx === atomData.valenceShellNumber - 1 ? '#f59e0b' : '#38bdf8';
          ctx.shadowColor = shellIdx === atomData.valenceShellNumber - 1 ? '#f59e0b' : '#0284c7';
          ctx.shadowBlur = 8;
          ctx.fill();

          // Electron symbol (-)
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 8px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('-', ex, ey);
          ctx.restore();
        }
      });

      angle += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [atomData]);

  // Orbital Shape 2D/3D Wavefunction visualizer canvas
  useEffect(() => {
    const canvas = orbitalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 280);
    const height = (canvas.height = 200);
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    // Draw Axes
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, cy);
    ctx.lineTo(width - 10, cy);
    ctx.moveTo(cx, 10);
    ctx.lineTo(cx, height - 10);
    ctx.stroke();

    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.font = '9px monospace';
    ctx.fillText('x', width - 15, cy - 5);
    ctx.fillText('y', cx + 5, 15);

    if (selectedOrbitalType === '1s') {
      // s orbital: Spherical
      const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 60);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.9)');
      grad.addColorStop(0.7, 'rgba(6, 182, 212, 0.4)');
      grad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 60, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    } else if (selectedOrbitalType === '2px') {
      // px: Two horizontal lobes with + and - phase
      // Left lobe (-)
      const gradL = ctx.createRadialGradient(cx - 35, cy, 2, cx - 35, cy, 35);
      gradL.addColorStop(0, '#ef4444');
      gradL.addColorStop(1, 'rgba(239, 68, 68, 0.1)');
      ctx.beginPath();
      ctx.ellipse(cx - 35, cy, 35, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradL;
      ctx.fill();

      // Right lobe (+)
      const gradR = ctx.createRadialGradient(cx + 35, cy, 2, cx + 35, cy, 35);
      gradR.addColorStop(0, '#3b82f6');
      gradR.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      ctx.beginPath();
      ctx.ellipse(cx + 35, cy, 35, 22, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradR;
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('-', cx - 35, cy + 4);
      ctx.fillText('+', cx + 35, cy + 4);
    } else if (selectedOrbitalType === '2py') {
      // py: Two vertical lobes
      const gradT = ctx.createRadialGradient(cx, cy - 35, 2, cx, cy - 35, 35);
      gradT.addColorStop(0, '#3b82f6');
      gradT.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      ctx.beginPath();
      ctx.ellipse(cx, cy - 35, 22, 35, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradT;
      ctx.fill();

      const gradB = ctx.createRadialGradient(cx, cy + 35, 2, cx, cy + 35, 35);
      gradB.addColorStop(0, '#ef4444');
      gradB.addColorStop(1, 'rgba(239, 68, 68, 0.1)');
      ctx.beginPath();
      ctx.ellipse(cx, cy + 35, 22, 35, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradB;
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.fillText('+', cx, cy - 35);
      ctx.fillText('-', cx, cy + 35);
    } else if (selectedOrbitalType === '2pz') {
      // pz: Angled 3D lobe
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 4);

      const grad1 = ctx.createRadialGradient(-35, 0, 2, -35, 0, 35);
      grad1.addColorStop(0, '#ef4444');
      grad1.addColorStop(1, 'rgba(239, 68, 68, 0.1)');
      ctx.beginPath();
      ctx.ellipse(-35, 0, 35, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad1;
      ctx.fill();

      const grad2 = ctx.createRadialGradient(35, 0, 2, 35, 0, 35);
      grad2.addColorStop(0, '#3b82f6');
      grad2.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      ctx.beginPath();
      ctx.ellipse(35, 0, 35, 20, 0, 0, Math.PI * 2);
      ctx.fillStyle = grad2;
      ctx.fill();

      ctx.restore();
    } else if (selectedOrbitalType === '3dxy') {
      // dxy: 4 clover-leaf lobes
      const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
      angles.forEach((ang, idx) => {
        const lx = cx + Math.cos(ang) * 35;
        const ly = cy + Math.sin(ang) * 35;
        const isPos = idx % 2 === 0;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        const grad = ctx.createRadialGradient(35, 0, 2, 35, 0, 28);
        grad.addColorStop(0, isPos ? '#3b82f6' : '#ef4444');
        grad.addColorStop(1, isPos ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)');
        ctx.beginPath();
        ctx.ellipse(35, 0, 28, 16, 0, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });
    } else {
      // dz2 or 4f: Dumbbell with donut ring
      const gradT = ctx.createRadialGradient(cx, cy - 35, 2, cx, cy - 35, 35);
      gradT.addColorStop(0, '#3b82f6');
      gradT.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      ctx.beginPath();
      ctx.ellipse(cx, cy - 35, 18, 35, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradT;
      ctx.fill();

      const gradB = ctx.createRadialGradient(cx, cy + 35, 2, cx, cy + 35, 35);
      gradB.addColorStop(0, '#3b82f6');
      gradB.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
      ctx.beginPath();
      ctx.ellipse(cx, cy + 35, 18, 35, 0, 0, Math.PI * 2);
      ctx.fillStyle = gradB;
      ctx.fill();

      // Donut / Torus ring (-)
      ctx.beginPath();
      ctx.ellipse(cx, cy, 32, 10, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.stroke();
    }
  }, [selectedOrbitalType]);

  // Selected electron quantum numbers details
  const selectedQN: ElectronQuantumNumbers =
    atomData.allElectronsQuantumNumbers.find((e) => e.electronIndex === selectedElectronIndex) ||
    atomData.allElectronsQuantumNumbers[atomData.allElectronsQuantumNumbers.length - 1] || {
      electronIndex: 1,
      subshell: '1s',
      n: 1,
      l: 0,
      ml: 0,
      ms: 0.5,
      subshellLabel: '1s (Electron #1)',
      spinLabel: '+½ (Clockwise ↑)',
      explanationBangla: 'Principal Quantum Number n=1, l=0, ml=0, ms=+½',
    };

  // Average atomic mass calculation
  const computedAverageMass =
    (iso1Mass * iso1Abundance + iso2Mass * iso2Abundance) / (iso1Abundance + iso2Abundance);

  // Selected Radioisotope
  const selectedRadio = RADIOACTIVE_ISOTOPES[selectedIsoIndex] || RADIOACTIVE_ISOTOPES[0];
  const remainingFraction = Math.pow(0.5, elapsedPeriods);
  const remainingAmount = initialAmount * remainingFraction;

  // Filter elements for search
  const filteredElements = ALL_118_ELEMENTS.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(elementSearch.toLowerCase()) ||
      e.banglaName.includes(elementSearch) ||
      e.symbol.toLowerCase().includes(elementSearch.toLowerCase()) ||
      String(e.number) === elementSearch;

    const matchBlock = selectedBlockFilter === 'all' || e.block === selectedBlockFilter;
    return matchSearch && matchBlock;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Header Command Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
            <Atom className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Atomic Structure, Quantum Numbers & Universal Atom Engine</span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                118 Elements Quantum Matrix
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete 118 Elements of Periodic Table, Bohr Model, Aufbau-Hund-Pauli Orbital Filling, 4 Quantum Numbers & Isotope Decay
            </p>
          </div>
        </div>

        {/* Action Controls & Element Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setShowPeriodicGrid(!showPeriodicGrid)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
              showPeriodicGrid
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>118 Elements Grid {showPeriodicGrid ? 'Hide' : 'Show'}</span>
          </button>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search 118 Elements (Name, H, 6, Iron)..."
              value={elementSearch}
              onChange={(e) => setElementSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* 118 Elements Full Interactive Grid (Expandable) */}
      {showPeriodicGrid && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-cyan-500/30 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-200">Complete 118 Elements Periodic Table Selector:</span>
              <div className="flex items-center gap-1">
                {(['all', 's', 'p', 'd', 'f'] as const).map((block) => (
                  <button
                    key={block}
                    onClick={() => setSelectedBlockFilter(block)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all ${
                      selectedBlockFilter === block
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {block === 'all' ? 'All Blocks' : `${block}-Block`}
                  </button>
                ))}
              </div>
            </div>
            <span className="text-slate-400 font-mono">Total {filteredElements.length} elements visible</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 lg:grid-cols-18 gap-1.5 max-h-60 overflow-y-auto p-1 scrollbar-thin">
            {filteredElements.map((elem) => (
              <button
                key={elem.number}
                onClick={() => {
                  setSelectedZ(elem.number);
                  setShowPeriodicGrid(false);
                }}
                className={`p-1.5 rounded-xl text-center transition-all flex flex-col items-center justify-center border ${
                  selectedZ === elem.number
                    ? 'bg-cyan-500 text-slate-950 border-cyan-300 font-black shadow-lg shadow-cyan-500/30 scale-105 z-10'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900'
                }`}
              >
                <span className="text-[9px] opacity-70 font-mono">#{elem.number}</span>
                <span className="text-xs font-black">{elem.symbol}</span>
                <span className="text-[8px] truncate max-w-full opacity-80">{elem.banglaName}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Element Carousel Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {filteredElements.slice(0, 20).map((elem) => (
          <button
            key={elem.number}
            onClick={() => setSelectedZ(elem.number)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
              selectedZ === elem.number
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
            }`}
          >
            <span className="text-[10px] opacity-70 font-mono">#{elem.number}</span>
            <span>{elem.symbol}</span>
            <span className="text-[11px] font-normal opacity-90">({elem.banglaName})</span>
          </button>
        ))}
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveSubTab('model')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'model'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Atom className="w-4 h-4" />
          <span>Bohr Atomic Model & Shells</span>
        </button>

        <button
          onClick={() => setActiveSubTab('builder')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'builder'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Dynamic Particle & Ion Builder (p⁺, n⁰, e⁻)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orbitals')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'orbitals'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Aufbau & Hund's Rules (Orbital Box Diagram)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('quantum')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'quantum'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>4 Quantum Numbers & Orbital Shapes (s, p, d, f)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('isotopes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'isotopes'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Isotopes & Average Relative Mass</span>
        </button>

        <button
          onClick={() => setActiveSubTab('halflife')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === 'halflife'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Radioactive Half-lives & Decay (Half-Life)</span>
        </button>
      </div>

      {/* TAB 1: BOHR ATOM MODEL & SHELL ENERGIES */}
      {activeSubTab === 'model' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Canvas View */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 flex flex-col items-center justify-between shadow-xl relative overflow-hidden">
            <div className="w-full flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-200">
                  {atomData.element.name} - 2D Bohr Shell Model
                </span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold">
                Period: {atomData.element.period} | Group: {atomData.element.group} | Block: {atomData.element.block}
              </span>
            </div>

            <div className="w-full h-80 my-2 flex items-center justify-center">
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>

            <div className="w-full grid grid-cols-4 gap-2 text-center text-xs pt-3 border-t border-slate-800 z-10">
              <div className="p-2 rounded-xl bg-slate-950/70 border border-rose-500/20">
                <span className="text-[10px] text-rose-400 font-semibold block">Protons (p⁺)</span>
                <span className="text-base font-bold text-rose-300 font-mono">{atomData.protons}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-500/20">
                <span className="text-[10px] text-slate-400 font-semibold block">Neutrons (n⁰)</span>
                <span className="text-base font-bold text-slate-300 font-mono">{atomData.neutrons}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-cyan-500/20">
                <span className="text-[10px] text-cyan-400 font-semibold block">Electrons (e⁻)</span>
                <span className="text-base font-bold text-cyan-300 font-mono">{atomData.electrons}</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/70 border border-amber-500/20">
                <span className="text-[10px] text-amber-400 font-semibold block">Mass Number (A)</span>
                <span className="text-base font-bold text-amber-300 font-mono">{atomData.massNumber}</span>
              </div>
            </div>
          </div>

          {/* Right Shell Overview & Compound Recommendations */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Shell Configuration (K, L, M, N, O, P, Q) */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Shell Configuration (K, L, M, N, O, P, Q)</span>
                </h3>
                <span className="text-xs text-cyan-400 font-mono font-bold">
                  Valence Electrons = {atomData.valenceElectrons}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {atomData.shellLabels.map((sh, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] text-slate-400 block font-mono">{sh.name}</span>
                    <span className="text-base font-bold text-cyan-300 font-mono">{sh.count} e⁻</span>
                    <span className="text-[9px] text-slate-600 block">max {sh.max}</span>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300">
                <span className="text-cyan-300 font-bold block mb-1">Electron Configuration Summary:</span>
                <p className="font-mono text-cyan-200 font-bold">{atomData.electronConfigNoble}</p>
              </div>
            </div>

            {/* Bridge: Use in Molecule & Compounds Explorer */}
            <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-xs font-bold text-indigo-200">in Chemical Bonding {atomData.element.name}</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                  Valency: {atomData.element.valenceElectrons}
                </span>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed">
                Explore various molecular structures and VSEPR geometry formed with the {atomData.element.name} element:
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {atomData.element.commonCompounds.map((comp) => (
                  <button
                    key={comp}
                    onClick={() => {
                      if (onNavigateToBonding) {
                        onNavigateToBonding(comp);
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-950 hover:bg-indigo-950/80 text-xs font-mono font-bold text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1"
                  >
                    <span>{comp}</span>
                    <ArrowRight className="w-3 h-3 opacity-60" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC ATOM BUILDER (Proton, Neutron, Electron) */}
      {activeSubTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Interactive Sub-atomic Particle Controller (Dynamic Particle Engine)</span>
              </h3>
              <button
                onClick={() => {
                  const standardN = Math.round(atomData.element.mass) - selectedZ;
                  setCustomNeutrons(standardN);
                  setCustomElectrons(selectedZ);
                  setIsExcitedState(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs border border-slate-700"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* 1. Protons Stepper (1 to 118) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-rose-400">Number of Protons (Protons = Z = Atomic Number):</span>
                <span className="font-mono font-bold text-base text-rose-300">{atomData.protons}</span>
              </div>
              <input
                type="range"
                min="1"
                max="118"
                value={selectedZ}
                onChange={(e) => setSelectedZ(parseInt(e.target.value, 10))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>#1 H</span>
                <span>#26 Fe</span>
                <span>#79 Au</span>
                <span>#118 Og</span>
              </div>
            </div>

            {/* 2. Neutrons Stepper (0 to 180) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-600/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Number of Neutrons (Neutrons = N → Isotope Change):</span>
                <span className="font-mono font-bold text-base text-slate-200">{customNeutrons}</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(10, selectedZ * 2 + 10)}
                value={customNeutrons}
                onChange={(e) => setCustomNeutrons(parseInt(e.target.value, 10))}
                className="w-full accent-slate-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0</span>
                <span>Standard: {Math.round(atomData.element.mass) - selectedZ}</span>
                <span>{Math.max(10, selectedZ * 2 + 10)}</span>
              </div>
            </div>

            {/* 3. Electrons Stepper (0 to 118) */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-400">Number of Electrons (Electrons = E → Ion Charge Change):</span>
                <span className="font-mono font-bold text-base text-cyan-300">{customElectrons}</span>
              </div>
              <input
                type="range"
                min="0"
                max={selectedZ + 8}
                value={customElectrons}
                onChange={(e) => setCustomElectrons(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0 (Bare Nucleus)</span>
                <span>Neutral: {selectedZ}</span>
                <span>{selectedZ + 8}</span>
              </div>
            </div>

            {/* State Toggle: Ground vs Excited */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <span className="text-xs font-bold text-slate-300">Electronic State:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsExcitedState(false)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    !isExcitedState
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ground State
                </button>
                <button
                  onClick={() => setIsExcitedState(true)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isExcitedState
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Excited State (*)
                </button>
              </div>
            </div>
          </div>

          {/* Real-time Dynamic Result Inspector */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Big Nuclear Notation Card */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-400 mb-2">Nuclear Symbol & Net Charge</span>
              <div className="flex items-center text-5xl font-black font-mono my-2 p-6 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div className="flex flex-col text-right mr-2 text-xl text-cyan-400 font-bold">
                  <span>{atomData.massNumber}</span>
                  <span className="text-rose-400">{atomData.protons}</span>
                </div>
                <span className="text-6xl text-slate-100 font-black">{atomData.element.symbol}</span>
                {atomData.charge !== 0 && (
                  <div className="text-2xl text-amber-400 font-bold ml-1 self-start">
                    {Math.abs(atomData.charge) > 1 ? Math.abs(atomData.charge) : ''}
                    {atomData.charge > 0 ? '+' : '-'}
                  </div>
                )}
              </div>

              <span className="text-sm font-bold text-slate-200 mt-2">
                {atomData.ionNameBangla}
              </span>
              <span className={`text-xs mt-1 font-semibold ${atomData.stability.includes('Stable') ? 'text-emerald-400' : 'text-rose-400'}`}>
                Stability: {atomData.stability} {atomData.decayMode ? `[${atomData.decayMode}]` : ''}
              </span>
            </div>

            {/* Subatomic breakdown list */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Atomic Number (Z):</span>
                <span className="font-mono font-bold text-slate-200">{atomData.atomicNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Mass Number (A = P + N):</span>
                <span className="font-mono font-bold text-amber-300">{atomData.massNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Net Charge (q = P - E):</span>
                <span className="font-mono font-bold text-cyan-300">
                  {atomData.charge > 0 ? `+${atomData.charge}` : atomData.charge}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Electron Configuration:</span>
                <span className="font-mono font-bold text-cyan-300">{atomData.electronConfigFull}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Isotope Status:</span>
                <span className="font-bold text-slate-200">
                  {atomData.isIsotope ? 'Isotope (Different Neutrons)' : 'Principal Natural Isotope'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AUFBAU PRINCIPLE & ORBITAL BOX DIAGRAM */}
      {activeSubTab === 'orbitals' && (
        <div className="flex flex-col gap-6">
          {/* Electron Configuration Header */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <span className="text-xs text-cyan-400 font-semibold uppercase tracking-wider">
                  Aufbau Principle (1s → 2s → 2p → 3s → 3p → 4s → 3d ...)
                </span>
                <h3 className="text-lg font-bold text-slate-100">
                  {atomData.element.name} (#{atomData.atomicNumber}) Orbital Filling Configuration
                </h3>
              </div>
              <div className="px-4 py-2 rounded-2xl bg-slate-950 border border-cyan-500/30 font-mono text-cyan-300 font-bold text-base">
                {atomData.electronConfigFull}
              </div>
            </div>

            {/* Exceptions Notice */}
            {(selectedZ === 24 || selectedZ === 29 || selectedZ === 42 || selectedZ === 47 || selectedZ === 79) && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Aufbau Exception:</strong> When d-orbitals are half-filled (d⁵) or fully-filled (d¹⁰), the atom gains special stability due to exchange energy and symmetry.
                </span>
              </div>
            )}
          </div>

          {/* Hund's Rule Box Diagrams */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Hund's Rule & Pauli Exclusion Principle (Orbital Spin Box Diagram)</span>
              </h4>
              <span className="text-xs text-slate-400">
                ↑ = Clockwise Spin (+½), ↓ = Anti-Clockwise Spin (-½)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {atomData.orbitals.map((orb) => (
                <div
                  key={orb.name}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center gap-3 shadow-inner"
                >
                  <div className="flex items-center justify-between w-full text-xs">
                    <span className="font-bold text-cyan-400 font-mono text-sm">{orb.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono text-[11px]">
                      {orb.electrons} / {orb.maxElectrons} e⁻
                    </span>
                  </div>

                  {/* Orbital Boxes */}
                  <div className="flex items-center gap-1.5">
                    {orb.boxes.map((box, bIdx) => (
                      <div
                        key={bIdx}
                        className="w-10 h-12 rounded-lg border-2 border-slate-700 bg-slate-900 flex flex-col items-center justify-center gap-0.5 font-mono font-black text-sm"
                      >
                        <div className="flex items-center gap-1">
                          {box.up && <span className="text-cyan-400">↑</span>}
                          {box.down && <span className="text-rose-400">↓</span>}
                          {!box.up && !box.down && <span className="text-slate-700">-</span>}
                        </div>
                        <span className="text-[8px] text-slate-500 font-normal font-sans">
                          {box.ml > 0 ? `+${box.ml}` : box.ml}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Scientific Explanation of Hund's Rule */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 space-y-1 leading-relaxed">
              <strong className="text-cyan-300">Hund's Rule:</strong> Electrons first occupy degenerate orbitals singly with parallel spin (↑) before they start pairing (↓).
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: 4 QUANTUM NUMBERS & 3D ORBITAL SHAPES */}
      {activeSubTab === 'quantum' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: 4 Quantum Numbers Explorer */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>4 Quantum Numbers Calculator (n, l, ml, ms)</span>
              </h3>
              <span className="text-xs text-cyan-400 font-mono">
                Element: {atomData.element.symbol} (Total {atomData.electrons}e⁻)
              </span>
            </div>

            {/* Electron Selector Carousel */}
            <div>
              <label className="text-xs text-slate-400 block mb-2">
                Select specific electron (1 to {atomData.electrons}):
              </label>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
                {atomData.allElectronsQuantumNumbers.map((eq) => (
                  <button
                    key={eq.electronIndex}
                    onClick={() => setSelectedElectronIndex(eq.electronIndex)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap border ${
                      selectedElectronIndex === eq.electronIndex
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20 scale-105'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    e⁻ #{eq.electronIndex} ({eq.subshell})
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Quantum Numbers Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* n */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 text-center">
                <span className="text-[10px] text-slate-400 block">Principal (n)</span>
                <span className="text-2xl font-black text-cyan-300 font-mono my-1 block">
                  n = {selectedQN.n}
                </span>
                <span className="text-[10px] text-cyan-500 block">Shell</span>
              </div>

              {/* l */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 text-center">
                <span className="text-[10px] text-slate-400 block">Azimuthal (l)</span>
                <span className="text-2xl font-black text-indigo-300 font-mono my-1 block">
                  l = {selectedQN.l}
                </span>
                <span className="text-[10px] text-indigo-400 block">
                  {selectedQN.l === 0 ? 's-orbital' : selectedQN.l === 1 ? 'p-orbital' : selectedQN.l === 2 ? 'd-orbital' : 'f-orbital'}
                </span>
              </div>

              {/* ml */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 text-center">
                <span className="text-[10px] text-slate-400 block">Magnetic (ml)</span>
                <span className="text-2xl font-black text-amber-300 font-mono my-1 block">
                  m_l = {selectedQN.ml > 0 ? `+${selectedQN.ml}` : selectedQN.ml}
                </span>
                <span className="text-[10px] text-amber-400 block">3D Orientation</span>
              </div>

              {/* ms */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-rose-500/30 text-center">
                <span className="text-[10px] text-slate-400 block">Spin (ms)</span>
                <span className="text-2xl font-black text-rose-300 font-mono my-1 block">
                  m_s = {selectedQN.ms > 0 ? '+½' : '-½'}
                </span>
                <span className="text-[10px] text-rose-400 block">
                  {selectedQN.ms > 0 ? 'Clockwise ↑' : 'Anti-Clockwise ↓'}
                </span>
              </div>
            </div>

            {/* Explanation box */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-slate-300 leading-relaxed space-y-1">
              <span className="text-cyan-300 font-bold block">Quantum State Explanation:</span>
              <p>{selectedQN.explanationBangla}</p>
            </div>
          </div>

          {/* Right: Orbital Wavefunction 2D/3D Shapes */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>3D Orbital Shapes</span>
              </h4>
            </div>

            {/* Orbital Type Selector */}
            <div className="flex flex-wrap gap-1.5">
              {(['1s', '2px', '2py', '2pz', '3dxy', '3dz2', '4f'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedOrbitalType(type)}
                  className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border ${
                    selectedOrbitalType === type
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Orbital Canvas */}
            <div className="w-full h-52 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
              <canvas ref={orbitalCanvasRef} className="w-full h-full" />
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <span className="text-cyan-300 font-bold block">Node & Phase Info:</span>
              <p className="text-[11px] leading-relaxed">
                {selectedOrbitalType.includes('s') && 's-orbitals are spherical and symmetrical, possessing no nodal planes.'}
                {selectedOrbitalType.includes('p') && 'p-orbitals are dumbbell-shaped with two lobes and 1 nodal plane at the nucleus.'}
                {selectedOrbitalType.includes('d') && 'd-orbitals are mostly cloverleaf-shaped with 2 nodal planes.'}
                {selectedOrbitalType.includes('f') && 'f-orbitals have complex, multi-lobed 3D structures.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ISOTOPES & AVERAGE ATOMIC MASS CALCULATOR */}
      {activeSubTab === 'isotopes' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Average Atomic Mass Calculator */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Average Relative Atomic Mass Calculation (Average Mass = Σ(Mi × %i) / 100)</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {/* Isotope 1 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-300">Isotope-1 (e.g., ³⁵Cl)</span>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Mass Number:</label>
                  <input
                    type="number"
                    value={iso1Mass}
                    onChange={(e) => setIso1Mass(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Natural Abundance (%):</label>
                  <input
                    type="number"
                    value={iso1Abundance}
                    onChange={(e) => setIso1Abundance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                  />
                </div>
              </div>

              {/* Isotope 2 */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-cyan-300">Isotope-2 (e.g., ³⁷Cl)</span>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Mass Number:</label>
                  <input
                    type="number"
                    value={iso2Mass}
                    onChange={(e) => setIso2Mass(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Natural Abundance (%):</label>
                  <input
                    type="number"
                    value={iso2Abundance}
                    onChange={(e) => setIso2Abundance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Result Box */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-cyan-300 block font-semibold">Calculated Average Relative Atomic Mass:</span>
                <span className="text-2xl font-black text-white font-mono">
                  {computedAverageMass.toFixed(3)} amu
                </span>
              </div>
              <button
                onClick={() => {
                  setIso1Mass(35);
                  setIso1Abundance(75.77);
                  setIso2Mass(37);
                  setIso2Abundance(24.23);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700"
              >
                Load Chlorine Example
              </button>
            </div>
          </div>

          {/* Isotope vs Isobar vs Isotone Theory */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>Comparison of Isotopes, Isobars & Isotones</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block">1. Isotope (Same Protons):</strong>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Atoms with the same number of protons but different mass numbers. e.g., ¹H, ²H (Deuterium), ³H (Tritium).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-amber-400 block">2. Isobar (Same Mass Number):</strong>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Atoms with the same mass number (A) but different atomic numbers (Z). e.g., ⁴⁰₁₉K and ⁴⁰₂₀Ca.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-rose-400 block">3. Isotone (Same Neutrons):</strong>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Atoms with the same number of neutrons but different protons and mass numbers. e.g., ¹⁴₆C (8n) and ¹⁶₈O (8n).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: RADIOACTIVE HALF-LIFE SIMULATION */}
      {activeSubTab === 'halflife' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Radioactive Decay Simulator */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Radioactive Half-life Simulator (N(t) = N₀ × (1/2)^(t/t½))</span>
              </h3>
            </div>

            {/* Select Radioisotope */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Select Radioactive Isotope:</label>
              <select
                value={selectedIsoIndex}
                onChange={(e) => setSelectedIsoIndex(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none"
              >
                {RADIOACTIVE_ISOTOPES.map((iso, idx) => (
                  <option key={iso.symbol} value={idx}>
                    {iso.symbol} ({iso.banglaName}) - Half-life: {iso.halfLife} [{iso.decayMode}]
                  </option>
                ))}
              </select>
            </div>

            {/* Decay Equation Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-cyan-500/20 font-mono text-cyan-300 text-xs font-bold flex items-center justify-between">
              <span>{selectedRadio.decayEquation}</span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-200 text-[10px]">
                {selectedRadio.decayMode}
              </span>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Initial Amount ($N_0$):</span>
                  <span className="font-bold text-slate-200">{initialAmount} g</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Number of Half-lives ($n = t/t_{1/2}$):</span>
                  <span className="font-bold text-cyan-400">{elapsedPeriods} Half-lives</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="0.5"
                  value={elapsedPeriods}
                  onChange={(e) => setElapsedPeriods(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400"
                />
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Remaining Fraction</span>
                <span className="text-base font-bold text-cyan-300 font-mono">
                  {(remainingFraction * 100).toFixed(2)}%
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Remaining Mass (N)</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {remainingAmount.toFixed(3)} g
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Decayed Mass</span>
                <span className="text-base font-bold text-rose-400 font-mono">
                  {(initialAmount - remainingAmount).toFixed(3)} g
                </span>
              </div>
            </div>
          </div>

          {/* Practical Uses & Hazards of Radioisotopes */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Uses & Safety Guidelines for the Isotope</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-cyan-400 font-bold block">Real-life Applications:</span>
              <p className="text-slate-300 leading-relaxed">{selectedRadio.usesBangla}</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2 text-rose-300">
              <span className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4" />
                <span>Health Risks & Radiation Warnings:</span>
              </span>
              <p className="text-slate-300 leading-relaxed">{selectedRadio.hazardBangla}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
