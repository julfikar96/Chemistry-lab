import React, { useState, useEffect, useRef } from 'react';
import { ALL_118_ELEMENTS } from '../data/all118Elements';
import {
  analyzeUniversalVSEPR,
  parseUniversalFormula,
  UniversalVSEPRResult,
  VSEPRAtom3D,
} from '../utils/universalChemistryEngine';
import {
  Sparkles,
  Layers,
  Zap,
  Atom,
  Eye,
  Calculator,
  Compass,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  Search,
  RotateCcw,
  Maximize2,
  Plus,
  Trash2,
  Play,
  Pause,
} from 'lucide-react';

interface Props {
  onAskTutor?: (question: string) => void;
  initialFormula?: string;
}

const COMMON_PRESET_FORMULAS = [
  { formula: 'H2O', name: 'Water', geometry: 'Bent (104.5°)' },
  { formula: 'CO2', name: 'Carbon Dioxide', geometry: 'Linear (180°)' },
  { formula: 'NH3', name: 'Ammonia', geometry: 'Trigonal Pyramidal (107°)' },
  { formula: 'CH4', name: 'Methane', geometry: 'Tetrahedral (109.5°)' },
  { formula: 'BF3', name: 'Boron Trifluoride', geometry: 'Trigonal Planar (120°)' },
  { formula: 'PCl5', name: 'Phosphorus Pentachloride', geometry: 'Trigonal Bipyramidal' },
  { formula: 'SF6', name: 'Sulfur Hexafluoride', geometry: 'Octahedral (90°)' },
  { formula: 'SF4', name: 'Sulfur Tetrafluoride', geometry: 'Seesaw (lid)' },
  { formula: 'ClF3', name: 'Chlorine Trifluoride', geometry: 'T-shaped' },
  { formula: 'XeF4', name: 'Xenon Tetrafluoride', geometry: 'Square Planar' },
  { formula: 'XeF2', name: 'Xenon Difluoride', geometry: 'Linear (180°)' },
  { formula: 'SO2', name: 'Sulfur Dioxide', geometry: 'Bent (119°)' },
  { formula: 'SO3', name: 'Sulfur Trioxide', geometry: 'Trigonal Planar' },
  { formula: 'NO3-', name: 'Nitrate Ion', geometry: 'Trigonal Planar' },
  { formula: 'CO3^2-', name: 'Carbonate Ion', geometry: 'Trigonal Planar' },
  { formula: 'NH4+', name: 'Ammonium Ion', geometry: 'Tetrahedral' },
  { formula: 'H2SO4', name: 'Sulfuric Acid', geometry: 'Tetrahedral Core' },
  { formula: 'KMnO4', name: 'Potassium Permanganate', geometry: 'Tetrahedral Core' },
];

export function ChemicalBondingLab({ onAskTutor, initialFormula }: Props) {
  const [activeTab, setActiveTab] = useState<'vsepr' | 'builder' | 'ionic' | 'covalent' | 'coordinate' | 'metallic'>('vsepr');
  const [inputFormula, setInputFormula] = useState<string>(initialFormula || 'H2O');
  const [activeFormula, setActiveFormula] = useState<string>(initialFormula || 'H2O');
  const [viewStyle, setViewStyle] = useState<'ball-and-stick' | 'space-filling' | 'wireframe'>('ball-and-stick');
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [selectedAtomIn3D, setSelectedAtomIn3D] = useState<VSEPRAtom3D | null>(null);

  // Dynamic Molecule Builder Custom Inputs
  const [builderCentral, setBuilderCentral] = useState<string>('C');
  const [builderLigands, setBuilderLigands] = useState<{ symbol: string; count: number }[]>([
    { symbol: 'H', count: 4 },
  ]);
  const [builderCharge, setBuilderCharge] = useState<number>(0);

  // Ionic bond simulator state
  const [cationChoice, setCationChoice] = useState<'Na+' | 'Mg2+' | 'Al3+' | 'Ca2+' | 'K+'>('Na+');
  const [anionChoice, setAnionChoice] = useState<'Cl-' | 'O2-' | 'N3-' | 'F-' | 'Br-'>('Cl-');

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ionicCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Rotation angles for 3D viewer
  const rotRef = useRef<{ angleY: number; angleX: number; zoom: number }>({
    angleY: 0,
    angleX: 0.25,
    zoom: 1,
  });

  // Calculate dynamic VSEPR analysis using universal engine
  const vseprData: UniversalVSEPRResult = analyzeUniversalVSEPR(activeFormula);

  // Sync initial formula if passed via props
  useEffect(() => {
    if (initialFormula) {
      setInputFormula(initialFormula);
      setActiveFormula(initialFormula);
    }
  }, [initialFormula]);

  // Set default selected atom to central atom when formula updates
  useEffect(() => {
    if (vseprData.atoms3D.length > 0) {
      setSelectedAtomIn3D(vseprData.atoms3D[0]);
    }
  }, [activeFormula]);

  // Interactive 3D Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      rotRef.current.angleY += dx * 0.01;
      rotRef.current.angleX += dy * 0.01;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const height = (canvas.height = 340);
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Rotate 3D spatial points
      const radY = rotRef.current.angleY;
      const radX = rotRef.current.angleX;
      const zoom = rotRef.current.zoom;

      const projectedAtoms = vseprData.atoms3D.map((atom, idx) => {
        // Rotate around Y
        const x1 = atom.x * Math.cos(radY) + atom.z * Math.sin(radY);
        const z1 = -atom.x * Math.sin(radY) + atom.z * Math.cos(radY);
        // Rotate around X
        const y1 = atom.y * Math.cos(radX) - z1 * Math.sin(radX);
        const z2 = atom.y * Math.sin(radX) + z1 * Math.cos(radX);

        // Perspective scale
        const scale = (300 / (300 + z2)) * zoom;
        return {
          ...atom,
          idx,
          projX: cx + x1 * scale,
          projY: cy - y1 * scale,
          projZ: z2,
          projScale: scale,
        };
      });

      // Sort atoms back to front for realistic 3D depth occlusion
      projectedAtoms.sort((a, b) => a.projZ - b.projZ);

      // 1. Draw Bonds (Ball-and-stick or Wireframe)
      if (viewStyle !== 'space-filling') {
        vseprData.bonds3D.forEach((bond) => {
          const a1 = projectedAtoms.find((a) => a.idx === bond.fromIndex);
          const a2 = projectedAtoms.find((a) => a.idx === bond.toIndex);
          if (!a1 || !a2) return;

          ctx.save();
          if (bond.order === 2) {
            // Double bond: 2 parallel lines
            const dx = a2.projX - a1.projX;
            const dy = a2.projY - a1.projY;
            const len = Math.hypot(dx, dy) || 1;
            const offset = 4;
            const px = (-dy / len) * offset;
            const py = (dx / len) * offset;

            ctx.lineWidth = viewStyle === 'wireframe' ? 1.5 : 3.5;
            ctx.strokeStyle = '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(a1.projX + px, a1.projY + py);
            ctx.lineTo(a2.projX + px, a2.projY + py);
            ctx.moveTo(a1.projX - px, a1.projY - py);
            ctx.lineTo(a2.projX - px, a2.projY - py);
            ctx.stroke();
          } else if (bond.order === 3) {
            // Triple bond: 3 parallel lines
            ctx.lineWidth = viewStyle === 'wireframe' ? 1.2 : 2.5;
            ctx.strokeStyle = '#94a3b8';
            ctx.beginPath();
            ctx.moveTo(a1.projX, a1.projY);
            ctx.lineTo(a2.projX, a2.projY);
            ctx.stroke();
          } else {
            // Single bond
            ctx.lineWidth = viewStyle === 'wireframe' ? 1.5 : 4;
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
            ctx.beginPath();
            ctx.moveTo(a1.projX, a1.projY);
            ctx.lineTo(a2.projX, a2.projY);
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      // 2. Draw Atoms (Spheres with radial highlight glow)
      projectedAtoms.forEach((atom) => {
        let baseRadius = atom.radius;
        if (viewStyle === 'space-filling') {
          baseRadius = atom.element === 'H' ? 22 : 32;
        } else if (viewStyle === 'wireframe') {
          baseRadius = 8;
        }
        const radius = baseRadius * atom.projScale;

        const isSelected = selectedAtomIn3D?.element === atom.element && selectedAtomIn3D.isCentral === atom.isCentral;

        ctx.save();
        const grad = ctx.createRadialGradient(
          atom.projX - radius * 0.35,
          atom.projY - radius * 0.35,
          radius * 0.1,
          atom.projX,
          atom.projY,
          radius
        );
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, atom.color);
        grad.addColorStop(1, '#090d16');

        ctx.beginPath();
        ctx.arc(atom.projX, atom.projY, radius, 0, Math.PI * 2);
        ctx.fillStyle = viewStyle === 'wireframe' ? 'rgba(30, 41, 59, 0.9)' : grad;
        ctx.shadowColor = atom.color;
        ctx.shadowBlur = isSelected ? 20 : 10;
        ctx.fill();

        if (isSelected || viewStyle === 'wireframe') {
          ctx.lineWidth = isSelected ? 2.5 : 1.5;
          ctx.strokeStyle = isSelected ? '#38bdf8' : atom.color;
          ctx.stroke();
        }

        // Atom Label
        ctx.fillStyle = atom.element === 'H' ? '#0f172a' : '#ffffff';
        ctx.font = `bold ${Math.max(9, Math.round(11 * atom.projScale))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.element, atom.projX, atom.projY);
        ctx.restore();
      });

      if (autoRotate && !isDragging) {
        rotRef.current.angleY += 0.012;
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [vseprData, viewStyle, autoRotate, selectedAtomIn3D]);

  // Ionic bond canvas animation
  useEffect(() => {
    const canvas = ionicCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 360);
      const height = (canvas.height = 180);
      ctx.clearRect(0, 0, width, height);

      const cy = height / 2;
      const leftX = width * 0.28;
      const rightX = width * 0.72;

      // Cation Sphere
      ctx.save();
      const catGrad = ctx.createRadialGradient(leftX - 8, cy - 8, 2, leftX, cy, 32);
      catGrad.addColorStop(0, '#f8fafc');
      catGrad.addColorStop(0.4, '#8b5cf6');
      catGrad.addColorStop(1, '#2e1065');
      ctx.beginPath();
      ctx.arc(leftX, cy, 32, 0, Math.PI * 2);
      ctx.fillStyle = catGrad;
      ctx.shadowColor = '#8b5cf6';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cationChoice, leftX, cy);
      ctx.restore();

      // Anion Sphere
      ctx.save();
      const anGrad = ctx.createRadialGradient(rightX - 10, cy - 10, 2, rightX, cy, 42);
      anGrad.addColorStop(0, '#f8fafc');
      anGrad.addColorStop(0.4, '#10b981');
      anGrad.addColorStop(1, '#064e3b');
      ctx.beginPath();
      ctx.arc(rightX, cy, 42, 0, Math.PI * 2);
      ctx.fillStyle = anGrad;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(anionChoice, rightX, cy);
      ctx.restore();

      // Electron transfer pulse
      const progress = (t % 120) / 120;
      const eX = leftX + (rightX - leftX) * progress;
      const eY = cy - Math.sin(progress * Math.PI) * 35;

      ctx.save();
      ctx.beginPath();
      ctx.arc(eX, eY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('e⁻', eX, eY);
      ctx.restore();

      t++;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [cationChoice, anionChoice]);

  // Handle custom dynamic formula submit
  const handleFormulaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputFormula.trim()) {
      setActiveFormula(inputFormula.trim());
    }
  };

  // Build formula from Dynamic Molecule Builder
  const handleBuildCustomMolecule = () => {
    let constructed = builderCentral;
    builderLigands.forEach((lig) => {
      constructed += `${lig.symbol}${lig.count > 1 ? lig.count : ''}`;
    });
    if (builderCharge > 0) {
      constructed += builderCharge === 1 ? '+' : `^${builderCharge}+`;
    } else if (builderCharge < 0) {
      const absC = Math.abs(builderCharge);
      constructed += absC === 1 ? '-' : `^${absC}-`;
    }
    setInputFormula(constructed);
    setActiveFormula(constructed);
    setActiveTab('vsepr');
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>Chemical bonding, Lewis structure and universal VSEPR 3D engine</span>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
                Universal Molecular Geometry
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Calculation of free-bond pairs, geometry, hybridization from any chemical signal($sp, sp^2, sp^3, sp^3d, sp^3d^2$) And real 3D view
            </p>
          </div>
        </div>

        {/* Universal Chemical Formula Input */}
        <form onSubmit={handleFormulaSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" />
            <input
              type="text"
              placeholder="Enter signal (H2O, SF6, NO3-, PCl5)..."
              value={inputFormula}
              onChange={(e) => setInputFormula(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
          >
            Generate
          </button>
        </form>
      </div>

      {/* Preset Library Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
        {COMMON_PRESET_FORMULAS.map((preset) => (
          <button
            key={preset.formula}
            onClick={() => {
              setInputFormula(preset.formula);
              setActiveFormula(preset.formula);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all whitespace-nowrap border ${
              activeFormula === preset.formula
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/20 scale-105'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
            }`}
          >
            <span>{preset.formula}</span>
            <span className="text-[10px] font-normal opacity-80 font-sans">({preset.geometry})</span>
          </button>
        ))}
      </div>

      {/* Navigation Sub-tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab('vsepr')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'vsepr'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>VSEPR Molecular Geometry and 3D Lab</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'builder'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Dynamic Molecule Builder (118 modules)</span>
        </button>

        <button
          onClick={() => setActiveTab('covalent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'covalent'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Covalent Bonding and Hybridization</span>
        </button>

        <button
          onClick={() => setActiveTab('ionic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ionic'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>ionic bond simulator (ΔEN {'>'} 1.7)</span>
        </button>

        <button
          onClick={() => setActiveTab('coordinate')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'coordinate'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Insertion Coordinate Bond</span>
        </button>

        <button
          onClick={() => setActiveTab('metallic')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'metallic'
              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Atom className="w-4 h-4" />
          <span>Electron Sea Model</span>
        </button>
      </div>

      {/* TAB 1: VSEPR & 3D INTERACTIVE MOLECULE LAB */}
      {activeTab === 'vsepr' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D Canvas Viewport */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Top Toolbar */}
            <div className="w-full flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100 font-mono">
                  {vseprData.formula} — {vseprData.banglaMolecularGeometry}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${
                    autoRotate
                      ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                  title="Auto Rotate"
                >
                  {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                  {(['ball-and-stick', 'space-filling', 'wireframe'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setViewStyle(style)}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                        viewStyle === style
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {style === 'ball-and-stick' ? 'Ball-Stick' : style === 'space-filling' ? 'Space-Fill' : 'Wireframe'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3D Interactive Canvas */}
            <div className="w-full h-80 my-2 flex items-center justify-center cursor-grab active:cursor-grabbing">
              <canvas ref={canvasRef} className="w-full h-full" />
            </div>

            {/* Interactive Atom Click Inspector inside 3D model */}
            <div className="w-full pt-3 border-t border-slate-800 z-10 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400"> Select the atoms in the model:</span>
                <span className="text-indigo-400 font-mono">Rotate by dragging the mouse</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {vseprData.atoms3D.map((atom, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedAtomIn3D(atom)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                      selectedAtomIn3D === atom
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30 scale-105'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{ backgroundColor: atom.color }}
                    />
                    <span>{atom.element} {atom.isCentral ? '(Central Atom)' : ''}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Detailed Analysis Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* VSEPR Core Matrix Parameters Card */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  <span>VSEPR parameters and geometry</span>
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 font-bold border border-indigo-500/30">
                  {vseprData.hybridization}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Central Atom (Central Atom)</span>
                  <span className="text-base font-bold text-indigo-300 font-mono">{vseprData.centralAtom}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total valence electrons (Valence e⁻)</span>
                  <span className="text-base font-bold text-cyan-300 font-mono">{vseprData.totalValenceElectrons} e⁻</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Bonding Domains</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{vseprData.bondingDomains} pairs</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block"> Lone Pairs on Central</span>
                  <span className="text-base font-bold text-amber-400 font-mono">{vseprData.lonePairsOnCentral} pairs</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Electron Geometry:</span>
                  <span className="font-bold text-slate-200">{vseprData.banglaElectronGeometry}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Molecular Geometry:</span>
                  <span className="font-bold text-indigo-300">{vseprData.banglaMolecularGeometry}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400"> Ideal Bond Angle:</span>
                  <span className="font-mono font-bold text-amber-300">{vseprData.bondAngle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Polarity and Dipole Moment:</span>
                  <span className={`font-bold ${vseprData.polarity.includes('Polar') ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {vseprData.polarity}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Bond formation (σ and π bonds):</span>
                  <span className="font-mono font-bold text-slate-200">
                    {vseprData.sigmaBonds} σ + {vseprData.piBonds} π
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Atom Inspector Card */}
            {selectedAtomIn3D && (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Atom className="w-4 h-4" />
                    <span>Atom data: {selectedAtomIn3D.name} ({selectedAtomIn3D.banglaName})</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-200 font-mono text-[10px]">
                    {selectedAtomIn3D.isCentral ? 'Central' : 'Ligand'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block"> Planar Electron</span>
                    <span className="text-slate-200 font-bold">{selectedAtomIn3D.valenceElectrons}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Free Pair (LP)</span>
                    <span className="text-amber-300 font-bold">{selectedAtomIn3D.lonePairs}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[9px] text-slate-400 block">Formal charge</span>
                    <span className="text-cyan-300 font-bold">{selectedAtomIn3D.formalCharge}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC MOLECULE BUILDER (ALL 118 ELEMENTS) */}
      {activeTab === 'builder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>Custom Molecule Builder (build molecules with any element)</span>
            </h3>

            {/* 1. Pick Central Atom */}
            <div>
              <label className="text-xs text-slate-400 block mb-1.5">
                1. Select Central Atom:
              </label>
              <select
                value={builderCentral}
                onChange={(e) => setBuilderCentral(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
              >
                {ALL_118_ELEMENTS.map((elem) => (
                  <option key={elem.symbol} value={elem.symbol}>
                    #{elem.number} {elem.symbol} — {elem.name} ({elem.banglaName}) [Eligibility: {elem.valenceElectrons}]
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Add Ligand Atoms */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-slate-400">2. Ligand Atoms:</label>
                <button
                  type="button"
                  onClick={() =>
                    setBuilderLigands([...builderLigands, { symbol: 'F', count: 1 }])
                  }
                  className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Ligand</span>
                </button>
              </div>

              {builderLigands.map((lig, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <select
                    value={lig.symbol}
                    onChange={(e) => {
                      const updated = [...builderLigands];
                      updated[idx].symbol = e.target.value;
                      setBuilderLigands(updated);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                  >
                    {ALL_118_ELEMENTS.map((elem) => (
                      <option key={elem.symbol} value={elem.symbol}>
                        {elem.symbol} ({elem.banglaName})
                      </option>
                    ))}
                  </select>

                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-400">Quantity:</span>
                    <input
                      type="number"
                      min="1"
                      max="8"
                      value={lig.count}
                      onChange={(e) => {
                        const updated = [...builderLigands];
                        updated[idx].count = parseInt(e.target.value, 10) || 1;
                        setBuilderLigands(updated);
                      }}
                      className="w-14 px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 text-center font-mono"
                    />
                  </div>

                  {builderLigands.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setBuilderLigands(builderLigands.filter((_, i) => i !== idx))}
                      className="p-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-500/30"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* 3. Net Charge */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                3. net charge(Net Charge): {builderCharge > 0 ? `+${builderCharge}` : builderCharge}
              </label>
              <input
                type="range"
                min="-3"
                max="3"
                value={builderCharge}
                onChange={(e) => setBuilderCharge(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-500"
              />
            </div>

            {/* Build Button */}
            <button
              onClick={handleBuildCustomMolecule}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>See molecular structure and VSEPR geometry</span>
            </button>
          </div>

          <div className="lg:col-span-6 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>VSEPR formula and steric number rule</span>
            </h4>
            <div className="space-y-3 text-slate-300 leading-relaxed text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-indigo-400 block mb-1">Steric Quantity (Steric Number SN):</strong>
                <p>
                  SN = Bond Pairs + Lone Pairs।
                  Hybridization is determined based on steric quantity(2 → sp, 3 → sp², 4 → sp³, 5 → sp³d, 6 → sp³d²)।
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-amber-400 block mb-1">VSEPR Repulsion Order:</strong>
                <p>
                  Lone Pair - Lone Pair {'>'} Lone Pair - Bond Pair {'>'} Bond Pair - Bond Pair।
                  As a result, the presence of lone pairs reduces bond angles from ideal values (e.g., 109.5° in Methane, but 104.5° in Water due to 2 lone pairs).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COVALENT BONDING & HYBRIDIZATION THEORY */}
      {activeTab === 'covalent' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Covalent bonds and sigma (σ) versus pi (π) bonds</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-indigo-400 block">1. Sigma (σ) Bonds:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Two atoms face to face or axially on the same axis(Head-on / Axial overlap) Strong bonds formed as a result of orbital overlap। Every single bond is a sigma bond।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-bold text-amber-400 block">2. Pi (π) Bonds:</span>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  Pi bonds are formed by the lateral (sideways) overlap of parallel unhybridized p-orbitals after a sigma bond is formed. Pi bonds are weaker than sigma bonds.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-2 text-indigo-300">
                <span className="font-bold block">Hybridization Matrix:</span>
                <ul className="list-disc list-inside text-[11px] space-y-1 text-slate-300">
                  <li><strong>sp:</strong> 180° Linear (e.g., BeCl₂, C₂H₂, CO₂)</li>
                  <li><strong>sp²:</strong> 120° Trigonal Planar (e.g., BF₃, C₂H₄, SO₃)</li>
                  <li><strong>sp³:</strong> 109.5° Tetrahedral (e.g., CH₄, NH₃, H₂O)</li>
                  <li><strong>sp³d:</strong> 90° & 120° Trigonal Bipyramidal (e.g., PCl₅, SF₄)</li>
                  <li><strong>sp³d²:</strong> 90° Octahedral (e.g., SF₆, XeF₄)</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Lewis Octet Rules</span>
            </h4>
            <div className="space-y-3 text-slate-300 leading-relaxed text-[11px]">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block mb-1">Step 1: Count Total Valence Electrons</strong>
                <p>Add the valence electrons of all atoms, add the charge for anions, and subtract the charge for cations.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block mb-1">Step 2: Central Atom and Skeleton</strong>
                <p>Place the least electronegative atom in the center and connect with single bonds.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <strong className="text-cyan-400 block mb-1">Step 3: Octet Fulfillment & Formal Charge</strong>
                <p>Complete the octets of terminal atoms first, place remaining electrons on the center, and form double bonds if the octet is incomplete.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: IONIC BONDING SIMULATOR */}
      {activeTab === 'ionic' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-400" />
                <span>Electron Transfer & Ionic Bond Simulator</span>
              </h3>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Cation Metal (Electron Donor):</label>
                <select
                  value={cationChoice}
                  onChange={(e) => setCationChoice(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Na+">Na⁺ (Sodium)</option>
                  <option value="Mg2+">Mg²⁺ (Magnesium)</option>
                  <option value="Al3+">Al³⁺ (Aluminum)</option>
                  <option value="Ca2+">Ca²⁺ (Calcium)</option>
                  <option value="K+">K⁺ (Potassium)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Anion Non-Metal (Electron Acceptor):</label>
                <select
                  value={anionChoice}
                  onChange={(e) => setAnionChoice(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Cl-">Cl⁻ (Chloride)</option>
                  <option value="O2-">O²⁻ (Oxide)</option>
                  <option value="N3-">N³⁻ (Nitride)</option>
                  <option value="F-">F⁻ (Fluoride)</option>
                  <option value="Br-">Br⁻ (Bromide)</option>
                </select>
              </div>
            </div>

            {/* Canvas Animation */}
            <div className="w-full h-48 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-2">
              <canvas ref={ionicCanvasRef} className="w-full h-full" />
            </div>
          </div>

          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Fajan's Rules</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Fajan's rules are used to determine the degree of covalent character in ionic compounds:
            </p>
            <ul className="list-disc list-inside text-[11px] space-y-2 text-slate-300">
              <li><strong>Small Cation Size:</strong> The smaller the cation, the greater its polarizing power.</li>
              <li><strong>Large Anion Size:</strong> The larger the anion, the higher its tendency to be polarized (distorted).</li>
              <li><strong>High Charge:</strong> Higher charge on cation or anion increases covalent character (e.g., AlCl₃ is more covalent than NaCl).</li>
            </ul>
          </div>
        </div>
      )}

      {/* TAB 5: COORDINATE COVALENT BONDING */}
      {activeTab === 'coordinate' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Coordinate Covalent Bond (Dative Bond)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <strong className="text-indigo-400 block text-sm">1. Ammonium Ion (NH₄⁺) Formation:</strong>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                The nitrogen atom in ammonia (NH₃) donates its lone pair of electrons to a proton (H⁺) to form a coordinate covalent bond:
                <br />
                <span className="font-mono text-cyan-300 font-bold block my-1">
                  H₃N: + H⁺ → [H₃N → H]⁺
                </span>
                Once formed, all 4 N—H bonds become completely identical.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <strong className="text-amber-400 block text-sm">2. Lewis Acid-Base Adduct (BF₃ · NH₃):</strong>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Since Boron Trifluoride has an incomplete octet (Lewis acid), it accepts the lone pair from ammonia to form a coordinate bond:
                <br />
                <span className="font-mono text-amber-300 font-bold block my-1">
                  F₃B + :NH₃ → F₃B ← :NH₃
                </span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: METALLIC BONDING (ELECTRON SEA MODEL) */}
      {activeTab === 'metallic' && (
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-5">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Atom className="w-4 h-4 text-indigo-400" />
            <span>Metallic Bonding & Electron Sea Model</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
              <span className="font-bold text-indigo-300 block">1. Electrical & Thermal Conductivity</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Metals are excellent conductors of heat and electricity due to the rapid movement of free delocalized electrons.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
              <span className="font-bold text-amber-300 block">2. Malleability & Ductility</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                When struck, layers of atoms in a metallic lattice can slide over each other without breaking bonds, thanks to the electron sea.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-center">
              <span className="font-bold text-emerald-300 block">3. Metallic Luster</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Free surface electrons absorb and instantly re-emit light, giving metals their shiny appearance.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
