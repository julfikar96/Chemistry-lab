import React, { useState } from 'react';
import {
  Chemical,
  GlasswareType,
  BeakerContentItem,
  ChemicalCategory,
  ReactionCondition,
  ReactionEvaluationResult,
} from '../types';
import { CHEMICAL_DATABASE, getChemicalById, searchChemicals } from '../data/chemicals';
import { evaluateReactionEngine, METAL_REACTIVITY_SERIES } from '../data/reactionEngine';
import { Lab3DThreeView } from './Lab3DThreeView';
import { soundEngine } from '../utils/audio';
import { formatChemicalFormula } from '../utils/equationBalancer';
import {
  Flame,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  Droplet,
  Info,
  Beaker,
  TestTube,
  FlaskConical,
  BookOpen,
  HelpCircle,
  Search,
  Zap,
  Sun,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface LabBenchProps {
  onAddNotebookEntry?: (entry: {
    title: string;
    chemicals: string[];
    equation?: string;
    observations: string[];
    temp?: number;
    ph?: number;
  }) => void;
  onAskTutor?: (question: string) => void;
  onUnlockAchievement?: (id: string) => void;
}

export const LabBench: React.FC<LabBenchProps> = ({
  onAddNotebookEntry,
  onAskTutor,
  onUnlockAchievement,
}) => {
  // Glassware & Container state
  const [activeGlassware, setActiveGlassware] = useState<GlasswareType>('beaker');
  const [contents, setContents] = useState<BeakerContentItem[]>([]);
  const [selectedChemical, setSelectedChemical] = useState<Chemical>(CHEMICAL_DATABASE[0]);
  const [selectedVolume, setSelectedVolume] = useState<number>(10);
  const [categoryFilter, setCategoryFilter] = useState<ChemicalCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Environmental / Reaction Condition
  const [activeCondition, setActiveCondition] = useState<ReactionCondition>('RT');

  // Interactive Tools state
  const [isStirring, setIsStirring] = useState<boolean>(false);
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [pourColor, setPourColor] = useState<string>('#38bdf8');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<'isometric' | 'front' | 'top'>('isometric');
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Chemical info modal
  const [inspectedChemical, setInspectedChemical] = useState<Chemical | null>(null);

  // Max capacity based on glassware
  const maxCapacity = activeGlassware === 'test_tube' ? 50 : activeGlassware === 'conical_flask' ? 250 : 500;
  const currentVolume = contents.reduce((acc, curr) => acc + curr.volume, 0);

  // Evaluate Reaction through the intelligent rule-based engine
  const addedChemicalIds = contents.map((c) => c.chemicalId);
  const reactionResult: ReactionEvaluationResult = evaluateReactionEngine(
    addedChemicalIds,
    isHeating ? 'HEAT' : activeCondition
  );

  // Compute live liquid visual state (color, pH, temperature)
  const computeLiquidState = () => {
    if (contents.length === 0) {
      return {
        colorHex: '#38bdf8',
        ph: 7.0,
        temp: isHeating ? 75.0 : 25.0,
      };
    }

    if (reactionResult.isReacting) {
      const color = reactionResult.colorChange
        ? reactionResult.colorChange.toColorHex
        : reactionResult.precipitate
        ? reactionResult.precipitate.colorHex
        : '#93c5fd';

      return {
        colorHex: color,
        ph: reactionResult.finalPH,
        temp: 25.0 + reactionResult.temperatureDelta + (isHeating ? 35 : 0),
      };
    }

    // Default blend of primary chemical
    const lastChemical = getChemicalById(contents[contents.length - 1].chemicalId);
    return {
      colorHex: lastChemical?.colorHex || '#38bdf8',
      ph: lastChemical?.pH ?? 7.0,
      temp: 25.0 + (isHeating ? 35 : 0),
    };
  };

  const { colorHex: liquidColorHex, ph: currentPH, temp: currentTemp } = computeLiquidState();

  // Pour Chemical into Beaker ("Pour into beaker")
  const handlePourChemical = (chemToPour: Chemical = selectedChemical, vol: number = selectedVolume) => {
    if (currentVolume + vol > maxCapacity) {
      alert(`Caution: Container capacity (${maxCapacity} mL) Will pass!`);
      return;
    }

    setIsPouring(true);
    setPourColor(chemToPour.colorHex);
    soundEngine.playPourSound();

    setTimeout(() => {
      setContents((prev) => [
        ...prev,
        {
          chemicalId: chemToPour.id,
          volume: vol,
          addedAt: Date.now(),
        },
      ]);
      setIsPouring(false);
      soundEngine.playGlassClink();

      // Trigger achievement on first experiment
      onUnlockAchievement?.('first_experiment');

      // Check next state reaction effects
      const nextChemicals = [...addedChemicalIds, chemToPour.id];
      const nextResult = evaluateReactionEngine(nextChemicals, isHeating ? 'HEAT' : activeCondition);
      if (nextResult.isReacting) {
        if (nextResult.reactionTypes.includes('NEUTRALIZATION')) {
          onUnlockAchievement?.('neutralization_master');
        }
        if (nextResult.reactionTypes.includes('REDOX')) {
          onUnlockAchievement?.('redox_explorer');
        }
        if (nextResult.gas) {
          onUnlockAchievement?.('gas_producer');
          soundEngine.playBubblingSound();
        }
        if (nextResult.precipitate) {
          onUnlockAchievement?.('precipitate_artist');
        }
      }
    }, 500);
  };

  // Remove specific chemical from beaker
  const handleRemoveChemicalItem = (index: number) => {
    setContents((prev) => prev.filter((_, i) => i !== index));
    soundEngine.playGlassClink();
  };

  // Stirring handler
  const handleStir = () => {
    setIsStirring(true);
    soundEngine.playGlassClink();
    setTimeout(() => {
      setIsStirring(false);
    }, 1800);
  };

  // Heating toggle
  const handleToggleHeating = () => {
    const nextHeating = !isHeating;
    setIsHeating(nextHeating);
    if (nextHeating) {
      setActiveCondition('HEAT');
      soundEngine.playBurnerSound();
    } else {
      setActiveCondition('RT');
    }
  };

  // Reset/Empty Beaker
  const handleEmptyBeaker = () => {
    setContents([]);
    setIsHeating(false);
    setIsStirring(false);
    setActiveCondition('RT');
    soundEngine.playGlassClink();
  };

  // Save to Notebook
  const handleSaveToNotebook = () => {
    if (contents.length === 0) return;
    const chemicalNames = contents.map((c) => {
      const chem = getChemicalById(c.chemicalId);
      return `${chem?.banglaName || c.chemicalId} (${c.volume} mL)`;
    });

    onAddNotebookEntry?.({
      title: reactionResult.isReacting
        ? reactionResult.reaction?.banglaName || reactionResult.wordEquationBangla
        : 'Virtual lab testing and observation',
      chemicals: chemicalNames,
      equation: reactionResult.balancedEquation,
      observations: reactionResult.observations.length > 0 ? reactionResult.observations : ['Chemical mixing is completed in the beaker।'],
      temp: currentTemp,
      ph: currentPH,
    });
    soundEngine.playSuccessChime();
    alert('Record saved successfully in lab notebook!');
  };

  // Filtered chemicals list based on search and category tab
  const filteredChemicals = CHEMICAL_DATABASE.filter((c) => {
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter;
    if (!matchesCategory) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.banglaName.toLowerCase().includes(q) ||
      c.formula.toLowerCase().includes(q) ||
      (c.commonName && c.commonName.toLowerCase().includes(q)) ||
      (c.iupacName && c.iupacName.toLowerCase().includes(q))
    );
  });

  return (
    <div id="lab-bench-container" className="w-full flex flex-col gap-6">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
        {/* Glassware Selector Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">Pot Selection:</span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="glassware-beaker-btn"
              onClick={() => {
                setActiveGlassware('beaker');
                soundEngine.playGlassClink();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeGlassware === 'beaker'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Beaker className="w-3.5 h-3.5" />
              <span>Beaker (500mL)</span>
            </button>
            <button
              id="glassware-test-tube-btn"
              onClick={() => {
                setActiveGlassware('test_tube');
                soundEngine.playGlassClink();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeGlassware === 'test_tube'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <TestTube className="w-3.5 h-3.5" />
              <span>Test tube (50mL)</span>
            </button>
            <button
              id="glassware-flask-btn"
              onClick={() => {
                setActiveGlassware('conical_flask');
                soundEngine.playGlassClink();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeGlassware === 'conical_flask'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>Conical flask (250mL)</span>
            </button>
          </div>
        </div>

        {/* Reaction Conditions Toolbar */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <span className="text-[11px] font-bold text-slate-400 px-2">Condition:</span>
          <button
            id="condition-rt-btn"
            onClick={() => {
              setActiveCondition('RT');
              setIsHeating(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeCondition === 'RT' && !isHeating
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🌡️ Common (25°C)
          </button>
          <button
            id="condition-heat-btn"
            onClick={handleToggleHeating}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              isHeating || activeCondition === 'HEAT'
                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/50 animate-pulse'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Heat (Heat Δ)</span>
          </button>
          <button
            id="condition-electricity-btn"
            onClick={() => {
              setActiveCondition('ELECTRICITY');
              setIsHeating(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeCondition === 'ELECTRICITY'
                ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3 h-3 text-purple-400" />
            <span>Electrolysis</span>
          </button>
          <button
            id="condition-catalyst-btn"
            onClick={() => {
              setActiveCondition('CATALYST');
              setIsHeating(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              activeCondition === 'CATALYST'
                ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>catalyst (MnO₂)</span>
          </button>
        </div>

        {/* View Angles & Audio */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setCameraPreset('isometric')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                cameraPreset === 'isometric' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              Isometric
            </button>
            <button
              onClick={() => setCameraPreset('front')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                cameraPreset === 'front' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              in front
            </button>
            <button
              onClick={() => setCameraPreset('top')}
              className={`px-2 py-1 rounded-lg font-medium transition-all ${
                cameraPreset === 'top' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400'
              }`}
            >
              on
            </button>
          </div>

          <button
            id="sound-toggle-btn"
            onClick={() => {
              const next = !soundOn;
              setSoundOn(next);
              soundEngine.setSoundEnabled(next);
            }}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200"
            title={soundOn ? 'Turn off the sound' : 'Turn on the sound'}
          >
            {soundOn ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Chemical Catalog & Pouring Controls (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-100">🧪 Chemical Shelf</span>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-800">
                  {CHEMICAL_DATABASE.length} T
                </span>
              </div>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="chemical-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find the chemical name or symbol (e.g. HCl, NaOH, copper)..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-1 pb-1">
              {(
                [
                  'All',
                  'Acid',
                  'Base',
                  'Salt',
                  'Metal',
                  'NonMetal',
                  'Oxide',
                  'Indicator',
                  'Solvent',
                  'Gas',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    categoryFilter === cat
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat === 'All'
                    ? 'all'
                    : cat === 'Acid'
                    ? 'acid'
                    : cat === 'Base'
                    ? 'alkali'
                    : cat === 'Salt'
                    ? 'salt'
                    : cat === 'Metal'
                    ? 'metal'
                    : cat === 'NonMetal'
                    ? 'non-metal'
                    : cat === 'Oxide'
                    ? 'oxide'
                    : cat === 'Indicator'
                    ? 'indicator'
                    : cat === 'Gas'
                    ? 'gas'
                    : 'Solvent'}
                </button>
              ))}
            </div>

            {/* Chemical List Box */}
            <div className="max-h-[320px] overflow-y-auto pr-1 flex flex-col gap-1.5">
              {filteredChemicals.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No chemical components were detected।
                </div>
              ) : (
                filteredChemicals.map((chem) => {
                  const isSelected = selectedChemical.id === chem.id;
                  return (
                    <div
                      key={chem.id}
                      id={`chemical-card-${chem.id}`}
                      onClick={() => setSelectedChemical(chem)}
                      className={`group p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/50'
                          : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Swatch */}
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-600 shadow-inner flex-shrink-0"
                          style={{ backgroundColor: chem.colorHex }}
                        />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                              {chem.banglaName}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-slate-900 px-1 py-0.2 rounded border border-slate-800 flex-shrink-0">
                              {chem.formula}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 truncate">
                            {chem.category} • {chem.colorName} • pH {chem.pH}
                          </span>
                        </div>
                      </div>

                      <button
                        id={`chem-info-btn-${chem.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setInspectedChemical(chem);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-all flex-shrink-0 ml-1"
                        title="Chemical description and safety"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Volume Picker */}
            <div className="mt-1 pt-2.5 border-t border-slate-800 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Size Selection:</span>
                <span className="font-mono text-cyan-400 font-bold">{selectedVolume} mL</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 5, 10, 25, 50].map((v) => (
                  <button
                    key={v}
                    id={`vol-btn-${v}`}
                    onClick={() => setSelectedVolume(v)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-bold border transition-all ${
                      selectedVolume === v
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {v} mL
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Pour Action Button ("Pour into beaker") */}
            <button
              id="pour-chemical-btn"
              onClick={() => handlePourChemical(selectedChemical, selectedVolume)}
              disabled={isPouring || currentVolume >= maxCapacity}
              className="mt-1 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Droplet className="w-4 h-4 fill-slate-950" />
              <span>pour into beaker ({selectedChemical.banglaName} - {selectedVolume} mL)</span>
            </button>
          </div>
        </div>

        {/* Center Column: 3D Simulation Stage & Live Gauges (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Live Instrumentation Top Bar (pH Meter & Thermometer) */}
          <div className="grid grid-cols-2 gap-3">
            {/* pH Meter */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">pH value of the solution</span>
                <span className="text-lg font-mono font-bold text-slate-100">
                  pH {currentPH.toFixed(1)}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">
                  {currentPH < 6.8 ? 'Acidic' : currentPH > 7.2 ? 'Alkaline (Basic)' : 'neutral'}
                </span>
              </div>
              <div
                className="w-8 h-8 rounded-full border-2 border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-slate-950 shadow-inner"
                style={{
                  backgroundColor:
                    currentPH < 3
                      ? '#ef4444'
                      : currentPH < 7
                      ? '#f59e0b'
                      : currentPH === 7
                      ? '#10b981'
                      : currentPH < 11
                      ? '#0ea5e9'
                      : '#8b5cf6',
                }}
              >
                {currentPH.toFixed(0)}
              </div>
            </div>

            {/* Digital Thermometer */}
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">thermometer</span>
                <span className="text-lg font-mono font-bold text-amber-300">
                  {currentTemp.toFixed(1)}°C
                </span>
                <span className="text-[10px] text-slate-400">
                  {reactionResult.temperatureDelta > 0
                    ? `ΔT: +${reactionResult.temperatureDelta.toFixed(1)}°C (heather)`
                    : reactionResult.temperatureDelta < 0
                    ? `ΔT: ${reactionResult.temperatureDelta.toFixed(1)}°C (hot)`
                    : 'constant temperature'}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Flame className={`w-5 h-5 ${isHeating ? 'animate-bounce text-rose-400' : ''}`} />
              </div>
            </div>
          </div>

          {/* 3D Visual Stage */}
          <div className="w-full h-[380px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl relative">
            <Lab3DThreeView
              glassware={activeGlassware}
              volume={currentVolume}
              maxCapacity={maxCapacity}
              liquidColorHex={liquidColorHex}
              isPouring={isPouring}
              pourColorHex={pourColor}
              isStirring={isStirring}
              isHeating={isHeating}
              isBubbling={Boolean(reactionResult.gas)}
              gasInfo={reactionResult.gas}
              precipitateInfo={reactionResult.precipitate}
              temperature={currentTemp}
              ph={currentPH}
              autoRotate={autoRotate}
              cameraPreset={cameraPreset}
            />

            {/* Reaction Status Pill on 3D stage */}
            {reactionResult.isReacting && (
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-slate-900/90 border border-emerald-500/60 px-3 py-1.5 rounded-full backdrop-blur-md shadow-lg">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-emerald-300">Reaction Active</span>
              </div>
            )}
          </div>

          {/* Action Toolbar underneath 3D Canvas */}
          <div className="grid grid-cols-4 gap-2">
            <button
              id="stir-beaker-btn"
              onClick={handleStir}
              disabled={contents.length === 0 || isStirring}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex flex-col items-center gap-1 transition-all active:scale-95 disabled:opacity-40"
            >
              <span className="text-base">🥄</span>
              <span>Stir/mix</span>
            </button>

            <button
              id="heat-toggle-btn"
              onClick={handleToggleHeating}
              disabled={contents.length === 0}
              className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all active:scale-95 disabled:opacity-40 ${
                isHeating
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{isHeating ? 'Fire off' : 'heat up'}</span>
            </button>

            <button
              id="save-notebook-btn"
              onClick={handleSaveToNotebook}
              disabled={contents.length === 0}
              className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex flex-col items-center gap-1 transition-all active:scale-95 disabled:opacity-40"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Save to notebook</span>
            </button>

            <button
              id="empty-beaker-btn"
              onClick={handleEmptyBeaker}
              disabled={contents.length === 0}
              className="py-2.5 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-semibold text-rose-300 flex flex-col items-center gap-1 transition-all active:scale-95 disabled:opacity-40"
            >
              <RotateCcw className="w-4 h-4 text-rose-400" />
              <span>Bikar is empty</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Chemical Contents & Reaction Insight (3 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Current Beaker Contents List */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Beaker Ingredients List:</span>
              <span className="text-xs font-mono font-bold text-cyan-400">
                {currentVolume} / {maxCapacity} mL
              </span>
            </div>

            {contents.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                Bikar is empty। Pour by selecting a chemical from the list on the left।
              </div>
            ) : (
              <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                {contents.map((item, idx) => {
                  const chem = getChemicalById(item.chemicalId);
                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: chem?.colorHex || '#38bdf8' }}
                        />
                        <span className="font-semibold text-slate-200 truncate">{chem?.banglaName}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="font-mono text-cyan-400 font-bold">{item.volume} mL</span>
                        <button
                          onClick={() => handleRemoveChemicalItem(idx)}
                          className="text-slate-500 hover:text-rose-400 text-xs px-1"
                          title="delete"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Dynamic Reaction Insight Card */}
          {reactionResult.isReacting ? (
            <div
              id="reaction-insight-card"
              className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/90 via-slate-900 to-slate-950 border border-indigo-500/50 shadow-2xl flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Reactions are detected and confirmed</span>
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-bold">
                  VERIFIED
                </span>
              </div>

              {/* Reaction Title */}
              <div className="text-sm font-bold text-slate-100 leading-snug">
                {reactionResult.reaction?.banglaName || reactionResult.wordEquationBangla}
              </div>

              {/* Balanced Equation Box */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300 font-bold overflow-x-auto">
                {reactionResult.balancedEquation}
              </div>

              {/* Net Ionic Equation if available */}
              {reactionResult.netIonicEquation && (
                <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] text-cyan-300 font-mono">
                  <span className="text-[10px] text-slate-400 block font-sans">Net ionic equation:</span>
                  {reactionResult.netIonicEquation}
                </div>
              )}

              {/* Reaction Type Badges */}
              <div className="flex flex-wrap gap-1.5">
                {reactionResult.reactionTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40"
                  >
                    {type}
                  </span>
                ))}
                {reactionResult.thermalType === 'EXOTHERMIC' && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    🔥 warm
                  </span>
                )}
                {reactionResult.thermalType === 'ENDOTHERMIC' && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30">
                    ❄️ hot
                  </span>
                )}
                {reactionResult.precipitate && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⬇️ {reactionResult.precipitate.banglaName}
                  </span>
                )}
                {reactionResult.gas && (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    💨 {reactionResult.gas.banglaName}
                  </span>
                )}
              </div>

              {/* Driving Force */}
              {reactionResult.drivingForce && (
                <div className="text-[11px] bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/60 text-slate-300">
                  <strong className="text-indigo-300">Key Driving Force:</strong> {reactionResult.drivingForce}
                </div>
              )}

              {/* Key Observations */}
              {reactionResult.observations.length > 0 && (
                <div className="text-xs text-slate-300 space-y-1 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="font-semibold text-slate-200">Lab Observations:</span>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                    {reactionResult.observations.map((obs, idx) => (
                      <li key={idx}>{obs}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Ask AI Tutor */}
              <button
                id="ask-tutor-reaction-btn"
                onClick={() =>
                  onAskTutor?.(
                    `Current chemical reactions "${reactionResult.balancedEquation}" Explain the detailed scientific explanation of electron exchange and terms।`
                  )
                }
                className="w-full py-2.5 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-xs font-bold text-purple-200 transition-all flex items-center justify-center gap-1.5"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>AI Ask the teacher for this feedback</span>
              </button>
            </div>
          ) : contents.length >= 1 ? (
            /* Educational Non-Reaction Diagnosis */
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex flex-col gap-2.5">
              <div className="flex items-center gap-2 text-slate-200 font-bold">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>Lab status and scientific monitoring</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                {reactionResult.scientificExplanationBangla || reactionResult.reasonIfNoReaction}
              </p>
              {reactionResult.reasonIfNoReaction && (
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-amber-400">
                  ⚠️ {reactionResult.reasonIfNoReaction}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* Chemical Detail Inspection Modal */}
      {inspectedChemical && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full border-2 border-slate-500 shadow-md"
                  style={{ backgroundColor: inspectedChemical.colorHex }}
                />
                <div>
                  <h3 className="text-base font-bold text-slate-100">{inspectedChemical.banglaName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-mono text-cyan-400 font-bold">{inspectedChemical.formula}</span>
                    <span>•</span>
                    <span>{inspectedChemical.name}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setInspectedChemical(null)}
                className="text-slate-400 hover:text-slate-100 text-sm font-bold p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 flex flex-col gap-3">
              <p className="leading-relaxed">
                <strong>Description:</strong> {inspectedChemical.banglaDescription}
              </p>

              <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">IUPAC Name:</span>
                  <span className="font-semibold text-slate-200">{inspectedChemical.iupacName || inspectedChemical.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Common / Trade Name:</span>
                  <span className="font-semibold text-slate-200">{inspectedChemical.commonName || '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Molar Mass:</span>
                  <span className="font-mono text-slate-200">{inspectedChemical.molarMass} g/mol</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Normal pH:</span>
                  <span className="font-mono text-slate-200">{inspectedChemical.pH}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Valency:</span>
                  <span className="font-mono text-slate-200">{inspectedChemical.valency ?? '—'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Solubility Religion:</span>
                  <span className="text-slate-200">{inspectedChemical.solubility || 'Soluble in water'}</span>
                </div>
              </div>

              {/* Safety Guideline Alert */}
              <div className="bg-rose-950/40 p-3 rounded-2xl border border-rose-800/40 text-rose-300 flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <strong className="block text-rose-200 mb-0.5">Safety and Precautions:</strong>
                  <span>{inspectedChemical.banglaSafety}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedChemical(inspectedChemical);
                  setInspectedChemical(null);
                  handlePourChemical(inspectedChemical, selectedVolume);
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Droplet className="w-3.5 h-3.5" />
                <span>Add to cart now</span>
              </button>
              <button
                onClick={() => setInspectedChemical(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all"
              >
                turn off
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
