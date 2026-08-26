import React, { useState, useEffect, useRef } from 'react';
import { soundEngine } from '../utils/audio';
import {
  FlaskConical,
  RotateCcw,
  Sparkles,
  Play,
  Pause,
  Droplet,
  Info,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Calculator,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';

interface TitrationPreset {
  id: string;
  name: string;
  banglaName: string;
  analyte: {
    name: string;
    banglaName: string;
    formula: string;
    type: 'ACID' | 'BASE';
    volume: number; // in mL, e.g. 25
    concentration: number; // in M, e.g. 0.1
    colorHex: string;
  };
  titrant: {
    name: string;
    banglaName: string;
    formula: string;
    type: 'ACID' | 'BASE';
    concentration: number; // in M, e.g. 0.1
    colorHex: string;
  };
  equation: string;
  stoichiometryRatio: number; // mol acid / mol base (usually 1)
  equivalencePointVol: number; // mL of titrant needed for equivalence
  defaultIndicator: string;
  descriptionBangla: string;
}

const TITRATION_PRESETS: TitrationPreset[] = [
  {
    id: 'hcl_naoh',
    name: 'Strong Acid - Strong Base (HCl + NaOH)',
    banglaName: 'Strong acid and strong base titration (HCl + NaOH)',
    analyte: {
      name: 'Hydrochloric Acid',
      banglaName: 'Hydrochloric acid',
      formula: 'HCl',
      type: 'ACID',
      volume: 25.0,
      concentration: 0.1,
      colorHex: '#f8fafc',
    },
    titrant: {
      name: 'Sodium Hydroxide',
      banglaName: 'sodium hydroxide solution',
      formula: 'NaOH',
      type: 'BASE',
      concentration: 0.1,
      colorHex: '#f8fafc',
    },
    equation: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)',
    stoichiometryRatio: 1,
    equivalencePointVol: 25.0, // 25 mL * 0.1 M / 0.1 M = 25.0 mL
    defaultIndicator: 'phenolphthalein',
    descriptionBangla: 'Determination of exact concentration of dilute HCl acid of unknown concentration by standard NaOH solution। A steep shift in the neutralization point occurs at pH 7.0।',
  },
  {
    id: 'ch3cooh_naoh',
    name: 'Weak Acid - Strong Base (CH3COOH + NaOH)',
    banglaName: 'Mild acid and strong base titrations (CH₃COOH + NaOH)',
    analyte: {
      name: 'Acetic Acid (Vinegar)',
      banglaName: 'Ethanoic Acid (Vinegar)',
      formula: 'CH₃COOH',
      type: 'ACID',
      volume: 20.0,
      concentration: 0.1,
      colorHex: '#f8fafc',
    },
    titrant: {
      name: 'Sodium Hydroxide',
      banglaName: 'sodium hydroxide solution',
      formula: 'NaOH',
      type: 'BASE',
      concentration: 0.1,
      colorHex: '#f8fafc',
    },
    equation: 'CH₃COOH(aq) + NaOH(aq) → CH₃COONa(aq) + H₂O(l)',
    stoichiometryRatio: 1,
    equivalencePointVol: 20.0,
    defaultIndicator: 'phenolphthalein',
    descriptionBangla: 'Caustic soda titration of vinegar with acetic acid। The pH at the end point is about 8.8 (alkaline) due to alkaline salts।',
  },
  {
    id: 'h2so4_naoh',
    name: 'Diprotic Acid - Strong Base (H2SO4 + NaOH)',
    banglaName: 'Bipolar acid titration (H₂SO₄ + 2NaOH)',
    analyte: {
      name: 'Sulfuric Acid',
      banglaName: 'Sulfuric acid',
      formula: 'H₂SO₄',
      type: 'ACID',
      volume: 20.0,
      concentration: 0.05,
      colorHex: '#f8fafc',
    },
    titrant: {
      name: 'Sodium Hydroxide',
      banglaName: 'sodium hydroxide solution',
      formula: 'NaOH',
      type: 'BASE',
      concentration: 0.1,
      colorHex: '#f8fafc',
    },
    equation: 'H₂SO₄(aq) + 2NaOH(aq) → Na₂SO₄(aq) + 2H₂O(l)',
    stoichiometryRatio: 0.5,
    equivalencePointVol: 20.0,
    defaultIndicator: 'methyl_orange',
    descriptionBangla: 'Two phases of sulfuric acid contain replaceable hydrogens। 1 mole of H in solution₂SO₄ This requires 2 moles of NaOH।',
  },
];

interface IndicatorInfo {
  id: string;
  name: string;
  banglaName: string;
  phRange: string;
  acidColor: string;
  baseColor: string;
  neutralColor: string;
  colorHexAcid: string;
  colorHexBase: string;
  description: string;
}

const INDICATORS: IndicatorInfo[] = [
  {
    id: 'phenolphthalein',
    name: 'Phenolphthalein',
    banglaName: 'Phenolphthalein',
    phRange: '8.2 - 10.0',
    acidColor: 'Colorless',
    baseColor: 'Pink/Magenta',
    neutralColor: 'colorless',
    colorHexAcid: 'rgba(240, 249, 255, 0.25)',
    colorHexBase: '#f43f5e',
    description: 'Colorless in acidic and neutral media, bright pink in alkaline media।',
  },
  {
    id: 'methyl_orange',
    name: 'Methyl Orange',
    banglaName: 'Methyl Orange',
    phRange: '3.1 - 4.4',
    acidColor: 'Red/Pink',
    baseColor: 'Yellow',
    neutralColor: 'Orange',
    colorHexAcid: '#ef4444',
    colorHexBase: '#eab308',
    description: 'Red in acidic medium, orange at endpoint and yellow in alkaline medium।',
  },
  {
    id: 'litmus',
    name: 'Litmus Solution',
    banglaName: 'Litmus solution',
    phRange: '5.0 - 8.0',
    acidColor: 'Red',
    baseColor: 'Blue',
    neutralColor: 'purple',
    colorHexAcid: '#dc2626',
    colorHexBase: '#2563eb',
    description: 'Red in acidic medium and blue in alkaline medium।',
  },
  {
    id: 'bromothymol_blue',
    name: 'Bromothymol Blue',
    banglaName: 'Bromothymol Blue',
    phRange: '6.0 - 7.6',
    acidColor: 'Yellow',
    baseColor: 'Blue',
    neutralColor: 'Green, pH 7.0',
    colorHexAcid: '#eab308',
    colorHexBase: '#0284c7',
    description: 'Yellow in acidic medium, green in neutral medium and blue in alkaline medium।',
  },
];

interface TitrationLabProps {
  onAddNotebookEntry?: (entry: any) => void;
  onAskTutor?: (question: string) => void;
  onUnlockAchievement?: (id: string) => void;
}

export const TitrationLab: React.FC<TitrationLabProps> = ({
  onAddNotebookEntry,
  onAskTutor,
  onUnlockAchievement,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<TitrationPreset>(TITRATION_PRESETS[0]);
  const [selectedIndicator, setSelectedIndicator] = useState<IndicatorInfo>(INDICATORS[0]);
  
  // Burette state
  const [buretteVolumeAdded, setBuretteVolumeAdded] = useState<number>(0); // 0 to 50 mL
  const [isFlowing, setIsFlowing] = useState<boolean>(false);
  const [flowRate, setFlowRate] = useState<number>(0.2); // mL per tick
  const [isStirring, setIsStirring] = useState<boolean>(true);
  
  // Readings log
  const [readingsLog, setReadingsLog] = useState<{ vAdded: number; ph: number; colorDesc: string }[]>([]);
  const [initialReading] = useState<number>(0.0);
  const [finalReading, setFinalReading] = useState<number | null>(null);

  // Unknown calculation interactive modal
  const [calculatedMolarity, setCalculatedMolarity] = useState<string>('');
  const [calculationFeedback, setCalculationFeedback] = useState<string | null>(null);

  // Canvas ref for titration curve graph
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute live pH based on volume added
  const computePH = (vAdded: number): number => {
    const vEq = selectedPreset.equivalencePointVol;
    const vAnalyte = selectedPreset.analyte.volume;
    const cAnalyte = selectedPreset.analyte.concentration;
    const cTitrant = selectedPreset.titrant.concentration;

    if (selectedPreset.id === 'hcl_naoh') {
      // Strong acid + Strong Base
      const molesAcidInitial = (vAnalyte * cAnalyte) / 1000;
      const molesBaseAdded = (vAdded * cTitrant) / 1000;
      const totalVolL = (vAnalyte + vAdded) / 1000;

      if (vAdded < vEq - 0.05) {
        const remainingAcid = molesAcidInitial - molesBaseAdded;
        const hConc = Math.max(1e-7, remainingAcid / totalVolL);
        return Math.min(6.5, Math.max(1.0, -Math.log10(hConc)));
      } else if (Math.abs(vAdded - vEq) <= 0.05) {
        return 7.0;
      } else {
        const excessBase = molesBaseAdded - molesAcidInitial;
        const ohConc = Math.max(1e-7, excessBase / totalVolL);
        const pOH = -Math.log10(ohConc);
        return Math.max(7.5, Math.min(13.5, 14 - pOH));
      }
    } else if (selectedPreset.id === 'ch3cooh_naoh') {
      // Weak acid + Strong Base
      if (vAdded <= 0.1) return 2.88;
      if (vAdded < vEq - 0.1) {
        // Buffer region: pH = pKa + log([A-]/[HA])
        const pKa = 4.76;
        const fraction = Math.min(0.99, Math.max(0.01, vAdded / vEq));
        return Math.min(7.0, Math.max(3.0, pKa + Math.log10(fraction / (1 - fraction))));
      } else if (Math.abs(vAdded - vEq) <= 0.1) {
        return 8.85; // Equivalence point is basic
      } else {
        const excessV = vAdded - vEq;
        const totalV = vAnalyte + vAdded;
        const ohConc = (excessV * cTitrant) / totalV;
        return Math.min(13.2, 14 + Math.log10(ohConc));
      }
    } else {
      // H2SO4 + NaOH
      const vEq2 = selectedPreset.equivalencePointVol;
      if (vAdded < vEq2 - 0.1) {
        return Math.min(6.0, Math.max(1.2, 1.2 + (vAdded / vEq2) * 3.5));
      } else if (Math.abs(vAdded - vEq2) <= 0.1) {
        return 7.0;
      } else {
        return Math.min(13.5, 7.0 + (vAdded - vEq2) * 1.5);
      }
    }
  };

  const currentPH = computePH(buretteVolumeAdded);

  // Compute live solution color in the conical flask based on indicator & pH
  const computeFlaskLiquidColor = (): { colorHex: string; description: string } => {
    if (selectedIndicator.id === 'phenolphthalein') {
      if (currentPH < 8.2) {
        return { colorHex: '#e0f2fe', description: 'Completely colorless (acidic solution)' };
      } else if (currentPH >= 8.2 && currentPH < 9.0) {
        return { colorHex: '#f472b6', description: 'Light Pink (End Point)' };
      } else {
        return { colorHex: '#e11d48', description: 'Dark magenta pink (excess alkali)' };
      }
    } else if (selectedIndicator.id === 'methyl_orange') {
      if (currentPH < 3.1) {
        return { colorHex: '#ef4444', description: 'Red color (strong acidic solution)' };
      } else if (currentPH >= 3.1 && currentPH <= 4.4) {
        return { colorHex: '#f97316', description: 'Orange color (mitigation transition / termination point)' };
      } else {
        return { colorHex: '#eab308', description: 'Yellow color (moderate or alkaline)' };
      }
    } else if (selectedIndicator.id === 'litmus') {
      if (currentPH < 6.0) {
        return { colorHex: '#ef4444', description: 'red color (acidic)' };
      } else if (currentPH >= 6.0 && currentPH <= 7.5) {
        return { colorHex: '#a855f7', description: 'purple color (neutral)' };
      } else {
        return { colorHex: '#3b82f6', description: 'blue color (alkaline)' };
      }
    } else {
      // Bromothymol blue
      if (currentPH < 6.0) {
        return { colorHex: '#eab308', description: 'Yellow color (acidic)' };
      } else if (currentPH >= 6.0 && currentPH <= 7.6) {
        return { colorHex: '#10b981', description: 'Green color (neutral endpoint)' };
      } else {
        return { colorHex: '#0284c7', description: 'blue color (alkaline)' };
      }
    }
  };

  const flaskColorState = computeFlaskLiquidColor();

  // Continuous drop flow timer
  useEffect(() => {
    let interval: any = null;
    if (isFlowing) {
      interval = setInterval(() => {
        setBuretteVolumeAdded((prev) => {
          if (prev >= 50.0) {
            setIsFlowing(false);
            return 50.0;
          }
          const next = +(prev + flowRate).toFixed(2);
          soundEngine.playPourSound();
          return next;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isFlowing, flowRate]);

  // Log readings at intervals
  useEffect(() => {
    setReadingsLog((prev) => {
      // Keep unique rounded recordings
      const last = prev[prev.length - 1];
      if (!last || Math.abs(last.vAdded - buretteVolumeAdded) >= 0.5) {
        return [
          ...prev,
          {
            vAdded: buretteVolumeAdded,
            ph: currentPH,
            colorDesc: flaskColorState.description,
          },
        ].slice(-30);
      }
      return prev;
    });

    // Check achievement if reached equivalence point accurately (within +-0.2 mL)
    if (Math.abs(buretteVolumeAdded - selectedPreset.equivalencePointVol) <= 0.2) {
      onUnlockAchievement?.('titration_master');
    }
  }, [buretteVolumeAdded, currentPH]);

  // Draw real-time titration curve on Canvas
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    // Padding
    const pLeft = 40;
    const pRight = 20;
    const pTop = 20;
    const pBottom = 30;
    const graphW = width - pLeft - pRight;
    const graphH = height - pTop - pBottom;

    // Grid lines & Axis
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = '#94a3b8';

    // pH grid (0, 2, 4, 6, 7, 8, 10, 12, 14)
    for (let phVal = 0; phVal <= 14; phVal += 2) {
      const y = pTop + graphH - (phVal / 14) * graphH;
      ctx.beginPath();
      ctx.moveTo(pLeft, y);
      ctx.lineTo(width - pRight, y);
      ctx.stroke();
      ctx.fillText(`${phVal}`, 15, y + 3);
    }

    // Neutral line (pH 7.0 dashed)
    const y7 = pTop + graphH - (7 / 14) * graphH;
    ctx.strokeStyle = '#10b98188';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pLeft, y7);
    ctx.lineTo(width - pRight, y7);
    ctx.stroke();
    ctx.setLineDash([]);

    // Volume axis ticks (0, 10, 20, 30, 40, 50 mL)
    ctx.strokeStyle = '#334155';
    for (let v = 0; v <= 50; v += 10) {
      const x = pLeft + (v / 50) * graphW;
      ctx.beginPath();
      ctx.moveTo(x, pTop);
      ctx.lineTo(x, pTop + graphH);
      ctx.stroke();
      ctx.fillText(`${v} mL`, x - 12, height - 10);
    }

    // Draw theoretical curve
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let v = 0; v <= 50; v += 0.5) {
      const ph = computePH(v);
      const x = pLeft + (v / 50) * graphW;
      const y = pTop + graphH - (ph / 14) * graphH;
      if (v === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Draw Current Position Point on graph
    const currX = pLeft + (buretteVolumeAdded / 50) * graphW;
    const currY = pTop + graphH - (currentPH / 14) * graphH;

    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(currX, currY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Equivalence line
    const eqX = pLeft + (selectedPreset.equivalencePointVol / 50) * graphW;
    ctx.strokeStyle = '#fbbf24';
    ctx.setLineDash([2, 2]);
    ctx.beginPath();
    ctx.moveTo(eqX, pTop);
    ctx.lineTo(eqX, pTop + graphH);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`endpoint (${selectedPreset.equivalencePointVol} mL)`, eqX - 35, pTop + 12);
  }, [buretteVolumeAdded, currentPH, selectedPreset]);

  // Handle single drop add
  const handleAddDrop = (amount: number) => {
    if (buretteVolumeAdded + amount > 50.0) return;
    setBuretteVolumeAdded((prev) => +(prev + amount).toFixed(2));
    soundEngine.playPourSound();
  };

  // Reset Titration
  const handleResetTitration = () => {
    setIsFlowing(false);
    setBuretteVolumeAdded(0);
    setFinalReading(null);
    setReadingsLog([]);
    setCalculationFeedback(null);
    setCalculatedMolarity('');
    soundEngine.playGlassClink();
  };

  // Record reading
  const handleRecordReading = () => {
    setFinalReading(buretteVolumeAdded);
    soundEngine.playSuccessChime();
  };

  // Calculate Molarity Check
  const handleCheckMolarity = () => {
    const userVal = parseFloat(calculatedMolarity);
    if (isNaN(userVal)) {
      setCalculationFeedback('Please enter a correct number।');
      return;
    }

    // Formula: S_analyte = (V_titrant * S_titrant * ratio) / V_analyte
    const trueMolarity =
      (selectedPreset.equivalencePointVol *
        selectedPreset.titrant.concentration *
        selectedPreset.stoichiometryRatio) /
      selectedPreset.analyte.volume;

    const diff = Math.abs(userVal - trueMolarity);
    if (diff <= 0.005) {
      setCalculationFeedback(`✅ Excellent and accurate! The calculation is correct। unknown ${selectedPreset.analyte.banglaName} Its molarity = ${trueMolarity.toFixed(3)} M`);
      soundEngine.playSuccessChime();
      onUnlockAchievement?.('titration_master');
    } else {
      setCalculationFeedback(`❌ There was an error in the calculation। Correct formula: S₁V₁ = S₂V₂ => S₁ = (${buretteVolumeAdded.toFixed(1)} × ${selectedPreset.titrant.concentration}) / ${selectedPreset.analyte.volume} ≈ ${trueMolarity.toFixed(3)} M`);
      soundEngine.playGlassClink();
    }
  };

  // Save to Notebook
  const handleSaveToNotebook = () => {
    onAddNotebookEntry?.({
      title: `Acid-base titration: ${selectedPreset.banglaName}`,
      chemicals: [
        `${selectedPreset.analyte.banglaName} (${selectedPreset.analyte.volume} mL)`,
        `${selectedPreset.titrant.banglaName} (Add from burette: ${buretteVolumeAdded.toFixed(2)} mL)`,
        `Indicator: ${selectedIndicator.banglaName}`,
      ],
      equation: selectedPreset.equation,
      observations: [
        `Burette initial reading: ${initialReading.toFixed(2)} mL`,
        `Burette Final Reading: ${buretteVolumeAdded.toFixed(2)} mL`,
        `Volume of titrant used (V₂): ${buretteVolumeAdded.toFixed(2)} mL`,
        `Final pH: ${currentPH.toFixed(2)}`,
        `Color Change: ${flaskColorState.description}`,
      ],
      temp: 25.0,
      ph: currentPH,
      results: `Source: S₁V₁ = S₂V₂ Molarity determined by applying: ${((buretteVolumeAdded * selectedPreset.titrant.concentration) / selectedPreset.analyte.volume).toFixed(4)} M`,
    });
    alert('The titration experiment has been successfully saved in the lab notebook!');
    soundEngine.playSuccessChime();
  };

  return (
    <div id="titration-lab-container" className="w-full flex flex-col gap-6">
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <span>Acid-Base Titration Lab</span>
              </h2>
              <p className="text-xs text-slate-400">
                Molarity with burette, conical flask and indicator ($S_1 V_1 = S_2 V_2$) and determining the mitigation point
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Preset Selector */}
          <select
            value={selectedPreset.id}
            onChange={(e) => {
              const preset = TITRATION_PRESETS.find((p) => p.id === e.target.value);
              if (preset) {
                setSelectedPreset(preset);
                handleResetTitration();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            {TITRATION_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                🧪 {p.banglaName}
              </option>
            ))}
          </select>

          <button
            onClick={handleResetTitration}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all"
            title="Reset the titration"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main 3-Column Interactive Apparatus View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Reagent Setup & Indicator Selection (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Apparatus Specifications Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Description of apparatus and solution</span>
            </span>

            {/* Burette Titrant Info */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Stored in burette (Titrant):</span>
                <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-800">
                  {selectedPreset.titrant.formula}
                </span>
              </div>
              <div className="font-bold text-slate-100">{selectedPreset.titrant.banglaName}</div>
              <div className="text-[11px] text-cyan-300 font-mono">
                density $S_2$: <strong>{selectedPreset.titrant.concentration} M</strong> (standard solution)
              </div>
            </div>

            {/* Conical Flask Analyte Info */}
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>(Analyte) stored in the flask:</span>
                <span className="text-[10px] font-mono bg-amber-950 text-amber-400 px-1.5 py-0.5 rounded border border-amber-800">
                  {selectedPreset.analyte.formula}
                </span>
              </div>
              <div className="font-bold text-slate-100">{selectedPreset.analyte.banglaName}</div>
              <div className="text-[11px] text-amber-300 font-mono">
                volume $V_1$: <strong>{selectedPreset.analyte.volume} mL</strong> | Unknown concentration $S_1$
              </div>
            </div>

            {/* Indicator Selector */}
            <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Selection of appropriate indicators:</span>
              <div className="grid grid-cols-1 gap-1.5">
                {INDICATORS.map((ind) => (
                  <button
                    key={ind.id}
                    onClick={() => setSelectedIndicator(ind)}
                    className={`p-2 rounded-xl text-left text-xs border transition-all flex flex-col ${
                      selectedIndicator.id === ind.id
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200 shadow-md ring-1 ring-cyan-500/50'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{ind.banglaName.split(' ')[0]}</span>
                      <span className="text-[10px] font-mono text-slate-500">pH {ind.phRange}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 truncate mt-0.5">
                      acid: {ind.acidColor} → Alkali: {ind.baseColor}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stoichiometry Equation Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs flex flex-col gap-2">
            <span className="font-bold text-slate-300">Mitigation Chemical Equation:</span>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-amber-300 text-xs font-bold break-all">
              {selectedPreset.equation}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {selectedPreset.descriptionBangla}
            </p>
          </div>
        </div>

        {/* Center Column: 2D/3D Animated Burette & Conical Flask Apparatus (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Instrumentation readout */}
          <div className="grid grid-cols-2 gap-3">
            {/* Burette Volume Added */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col">
              <span className="text-[10px] font-bold uppercase text-slate-400">Add (Volume) from Burette</span>
              <span className="text-xl font-mono font-black text-cyan-400 mt-0.5">
                {buretteVolumeAdded.toFixed(2)} mL
              </span>
              <span className="text-[10px] text-slate-500">
                Remaining: {(50.0 - buretteVolumeAdded).toFixed(2)} mL
              </span>
            </div>

            {/* Live pH Sensor */}
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-slate-400">Digital pH meter</span>
                <span className="text-xl font-mono font-black text-amber-300 mt-0.5">
                  pH {currentPH.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-400">
                  {currentPH < 6.8 ? 'acidic' : currentPH > 7.2 ? 'alkaline' : 'Neutral'}
                </span>
              </div>
              <div
                className="w-8 h-8 rounded-full border-2 border-slate-600 shadow-inner flex items-center justify-center text-xs font-bold text-slate-950"
                style={{ backgroundColor: flaskColorState.colorHex }}
              >
                pH
              </div>
            </div>
          </div>

          {/* Visual Interactive Apparatus Stage */}
          <div className="w-full h-[460px] rounded-3xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between p-4">
            {/* Stand clamp support */}
            <div className="absolute top-0 right-16 w-3 h-full bg-slate-800/60 rounded-full border-r border-slate-700 pointer-events-none" />
            <div className="absolute top-16 right-12 w-28 h-2 bg-slate-700 rounded pointer-events-none" />
            <div className="absolute top-52 right-12 w-28 h-2 bg-slate-700 rounded pointer-events-none" />

            {/* 1. Burette Assembly */}
            <div className="relative w-16 h-60 flex flex-col items-center z-10">
              {/* Burette Top Cap */}
              <div className="w-8 h-2 bg-slate-600 rounded-t-sm" />
              
              {/* Burette Glass Column */}
              <div className="w-6 flex-1 bg-slate-800/40 border-2 border-slate-500/80 rounded-b-sm relative backdrop-blur-sm overflow-hidden flex flex-col justify-end shadow-lg">
                {/* Graduated markings */}
                <div className="absolute inset-0 flex flex-col justify-between py-1 px-0.5 pointer-events-none opacity-60">
                  {[0, 10, 20, 30, 40, 50].map((tick) => (
                    <div key={tick} className="w-full flex items-center justify-between text-[8px] text-slate-400 font-mono">
                      <div className="w-1.5 h-[1px] bg-slate-300" />
                      <span>{tick}</span>
                    </div>
                  ))}
                </div>

                {/* Liquid Level in Burette */}
                <div
                  className="w-full bg-cyan-400/50 transition-all duration-300 relative border-t-2 border-cyan-300/80"
                  style={{
                    height: `${((50.0 - buretteVolumeAdded) / 50.0) * 100}%`,
                  }}
                >
                  {/* Meniscus Curve */}
                  <div className="w-full h-1 bg-cyan-200/80 rounded-b-full shadow-sm" />
                </div>
              </div>

              {/* Stopcock valve */}
              <div className="w-8 h-4 bg-slate-700 border border-slate-500 rounded flex items-center justify-center my-0.5 shadow-md">
                <button
                  onClick={() => setIsFlowing(!isFlowing)}
                  className={`w-5 h-2 rounded transition-all transform ${
                    isFlowing ? 'bg-emerald-400 rotate-90' : 'bg-rose-500 rotate-0'
                  }`}
                  title={isFlowing ? 'Close the stopcock' : 'Open the stopcock'}
                />
              </div>

              {/* Burette Tip nozzle */}
              <div className="w-1.5 h-6 bg-slate-500/80 rounded-b-full relative">
                {/* Dripping stream when flowing */}
                {isFlowing && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-16 bg-cyan-400/80 animate-pulse rounded-full" />
                )}
                {!isFlowing && (
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-2 h-2.5 rounded-full bg-cyan-400/90 animate-bounce" />
                )}
              </div>
            </div>

            {/* 2. Conical Flask (Erlenmeyer Flask) Assembly */}
            <div className="relative w-48 h-44 flex flex-col items-center justify-end z-10">
              {/* Flask Neck */}
              <div className="w-12 h-10 border-x-2 border-slate-400/80 bg-slate-900/30 backdrop-blur-sm" />
              
              {/* Flask Body Triangle */}
              <div className="relative w-44 h-32 border-2 border-slate-400/80 rounded-b-3xl bg-slate-900/40 backdrop-blur-md overflow-hidden flex flex-col justify-end shadow-2xl">
                {/* Liquid Volume inside Flask */}
                <div
                  className="w-full transition-all duration-500 relative flex items-center justify-center"
                  style={{
                    height: `${Math.min(90, 30 + (buretteVolumeAdded / 50) * 45)}%`,
                    backgroundColor: flaskColorState.colorHex,
                    opacity: 0.85,
                  }}
                >
                  {/* Liquid Surface Ripple & Swirl */}
                  {isStirring && (
                    <div className="absolute top-0 w-full h-2 bg-white/30 animate-pulse rounded-full" />
                  )}

                  {/* Magnetic Stirrer Bar */}
                  {isStirring && (
                    <div className="absolute bottom-2 w-8 h-2 bg-white rounded-full shadow-md animate-spin" />
                  )}
                </div>

                {/* pH electrode dipped into flask */}
                <div className="absolute top-0 right-10 w-2 h-24 bg-slate-600 border border-slate-400 rounded-b-full shadow">
                  <div className="w-full h-3 bg-amber-400/80 rounded-b-full animate-pulse" />
                </div>
              </div>

              {/* Magnetic Stirrer Base Plate */}
              <div className="w-52 h-4 bg-slate-800 border border-slate-700 rounded-t-lg shadow-md flex items-center justify-between px-4 text-[9px] text-slate-400 font-mono">
                <span>STIRRER</span>
                <span className={isStirring ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}>● ON</span>
              </div>
            </div>

            {/* Current State Status Banner */}
            <div className="w-full p-2 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs backdrop-blur-md">
              <span className="font-semibold text-slate-300">Current state of the flask:</span>
              <span className="font-bold text-cyan-300">{flaskColorState.description}</span>
            </div>
          </div>

          {/* Real-time Titration Controls Bar */}
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleAddDrop(0.1)}
              disabled={buretteVolumeAdded >= 50.0}
              className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-300 flex flex-col items-center gap-0.5 active:scale-95 disabled:opacity-40 shadow-sm"
            >
              <Droplet className="w-4 h-4 text-cyan-400" />
              <span>+0.1 ml drop</span>
            </button>

            <button
              onClick={() => handleAddDrop(1.0)}
              disabled={buretteVolumeAdded >= 50.0}
              className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-cyan-300 flex flex-col items-center gap-0.5 active:scale-95 disabled:opacity-40 shadow-sm"
            >
              <span className="text-sm font-black">+1.0</span>
              <span>+1.0 ml fast</span>
            </button>

            <button
              onClick={() => setIsFlowing(!isFlowing)}
              disabled={buretteVolumeAdded >= 50.0}
              className={`py-2.5 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 active:scale-95 disabled:opacity-40 transition-all ${
                isFlowing
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500 hover:bg-emerald-500/30'
              }`}
            >
              {isFlowing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isFlowing ? 'stop the flow' : 'constant flow'}</span>
            </button>

            <button
              onClick={() => setIsStirring(!isStirring)}
              className={`py-2.5 px-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 active:scale-95 transition-all ${
                isStirring
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              <span className="text-base">🌪️</span>
              <span>{isStirring ? 'Steerer on' : 'stop stirring'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Graph, Readings & Molarity Calculation (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Titration Curve Graph Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                <span>Titration Curve (pH vs Volume Added)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">0 - 50 mL</span>
            </div>

            <canvas
              ref={graphCanvasRef}
              width={340}
              height={170}
              className="w-full h-[170px] bg-slate-950 rounded-xl border border-slate-800 shadow-inner"
            />
          </div>

          {/* Interactive Concentration Calculator ($S_1 V_1 = S_2 V_2$) */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span>Determination of unknown concentrations (S₁V₁ = S₂V₂)</span>
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex flex-col gap-1">
              <div>
                <strong>S_acid × V_acid = S_base × V_base</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                S₁ × {selectedPreset.analyte.volume} mL = {selectedPreset.titrant.concentration} M × {buretteVolumeAdded.toFixed(2)} mL
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.001"
                placeholder="Your determined molarity (M)..."
                value={calculatedMolarity}
                onChange={(e) => setCalculatedMolarity(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleCheckMolarity}
                className="px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow"
              >
                verify
              </button>
            </div>

            {calculationFeedback && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 leading-relaxed">
                {calculationFeedback}
              </div>
            )}
          </div>

          {/* Action Buttons: Record & Save */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSaveToNotebook}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>Saving titration results in lab notebook</span>
            </button>

            <button
              onClick={() =>
                onAskTutor?.(
                  `Explain in detail the scientific principle of end point, equivalence point and choice of indicator in acid-base titration.।`
                )
              }
              className="w-full py-2.5 px-3 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/40 text-xs font-bold text-purple-200 transition-all flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>AI Ask the teacher about titration</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
