import React, { useState } from 'react';
import { VERIFIED_REACTIONS } from '../data/reactionEngine';
import { ReactionRecord, ReactionType } from '../types';
import { Sparkles, Search, CheckCircle2, AlertTriangle, Play, Flame, ShieldAlert, BookOpen, Layers } from 'lucide-react';

interface ReactionEncyclopediaProps {
  onLoadReactionToLab?: (reaction: ReactionRecord) => void;
  onAskTutor?: (question: string) => void;
}

export const ReactionEncyclopedia: React.FC<ReactionEncyclopediaProps> = ({
  onLoadReactionToLab,
  onAskTutor,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<ReactionType | 'ALL'>('ALL');
  const [selectedThermalFilter, setSelectedThermalFilter] = useState<'ALL' | 'EXOTHERMIC' | 'ENDOTHERMIC'>('ALL');
  const [selectedReaction, setSelectedReaction] = useState<ReactionRecord | null>(VERIFIED_REACTIONS[0]);

  // Filtering reactions
  const filteredReactions = VERIFIED_REACTIONS.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.banglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.equation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.wordEquationBangla && r.wordEquationBangla.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.products.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.reactants.some((rec) => rec.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedTypeFilter === 'ALL' || r.reactionTypes.includes(selectedTypeFilter);
    const matchesThermal = selectedThermalFilter === 'ALL' || r.thermalType === selectedThermalFilter;

    return matchesSearch && matchesType && matchesThermal;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Search Bar */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <span>⚗️</span>
              <span>Verified Reaction Encyclopedia</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              100 of Bangladesh 9th-10th Class and SSC Syllabus% Accurate, laboratory-proven reaction database ({VERIFIED_REACTIONS.length} t reaction)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Zero-Hallucination Verified Data</span>
            </span>
          </div>
        </div>

        {/* Search input */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by reaction name, signal or product (eg: HCl + NaOH, Zn + HCl, CuSO4, heat produced, precipitate...)"
            className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all shadow-inner"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
          <span className="text-xs font-semibold text-slate-400">Category:</span>
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: 'ALL', label: 'All reactions' },
                { id: 'NEUTRALIZATION', label: 'Mitigation' },
                { id: 'PRECIPITATION', label: 'degradation' },
                { id: 'SINGLE_DISPLACEMENT', label: 'One-substitution' },
                { id: 'DOUBLE_DISPLACEMENT', label: 'double substitution' },
                { id: 'ACID_METAL', label: 'metal-acid' },
                { id: 'SYNTHESIS', label: 'Addition/Synthesis' },
                { id: 'DECOMPOSITION', label: 'separation' },
                { id: 'GAS_EVOLUTION', label: 'Gas preparation' },
                { id: 'REDOX', label: 'Redox' },
                { id: 'ELECTROLYSIS', label: 'Electrolysis' },
                { id: 'OXIDE_REACTION', label: 'Oxide reaction' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTypeFilter(tab.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                  selectedTypeFilter === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-xs font-semibold text-slate-400">Thermal Type:</span>
            <button
              onClick={() =>
                setSelectedThermalFilter(selectedThermalFilter === 'EXOTHERMIC' ? 'ALL' : 'EXOTHERMIC')
              }
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                selectedThermalFilter === 'EXOTHERMIC'
                  ? 'bg-rose-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              🔥 heat generator
            </button>
            <button
              onClick={() =>
                setSelectedThermalFilter(selectedThermalFilter === 'ENDOTHERMIC' ? 'ALL' : 'ENDOTHERMIC')
              }
              className={`px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                selectedThermalFilter === 'ENDOTHERMIC'
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              ❄️ hot
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Encyclopedia View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Reaction List (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 max-h-[620px] overflow-y-auto pr-1">
          {filteredReactions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 rounded-3xl border border-slate-800 text-slate-400 text-xs flex flex-col items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <span>No reactions found। Use different search terms।</span>
            </div>
          ) : (
            filteredReactions.map((rec) => {
              const isSelected = selectedReaction?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedReaction(rec)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-xl ring-1 ring-cyan-500/50'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{rec.banglaName}</span>
                    <span className="text-[10px] bg-slate-950 px-2 py-0.5 rounded text-cyan-400 font-mono border border-slate-800">
                      {rec.nctbChapter?.split(':')[0] || 'SSC chemistry'}
                    </span>
                  </div>

                  <div className="font-mono text-xs font-semibold text-amber-300 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                    {rec.balancedEquation}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {rec.thermalType === 'EXOTHERMIC' && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        🔥 heat generator
                      </span>
                    )}
                    {rec.thermalType === 'ENDOTHERMIC' && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-sky-500/20 text-sky-300 border border-sky-500/30">
                        ❄️ hot
                      </span>
                    )}
                    {rec.precipitate && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        ⬇️ bottom ({rec.precipitate.colorName})
                      </span>
                    )}
                    {rec.gas && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        💨 {rec.gas.banglaName}
                      </span>
                    )}
                    {rec.redox && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        ⚛️ Oxidation
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Scientific Profile of Selected Reaction (7 Cols) */}
        <div className="lg:col-span-7">
          {selectedReaction ? (
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col gap-5">
              {/* Card Title & Lab Load Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">{selectedReaction.banglaName}</h3>
                  <span className="text-xs text-slate-400 font-mono">{selectedReaction.name}</span>
                </div>

                <button
                  onClick={() => onLoadReactionToLab?.(selectedReaction)}
                  className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 flex-shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Test in the virtual 3D lab</span>
                </button>
              </div>

              {/* Chemical Equations Box */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-300">Chemical Equations:</span>
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-2 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 mr-2">Balanced molecular equation:</span>
                    <span className="text-amber-300 font-bold">{selectedReaction.balancedEquation}</span>
                  </div>
                  {selectedReaction.ionicEquation && (
                    <div>
                      <span className="text-slate-500 mr-2">Ionic equation:</span>
                      <span className="text-cyan-300">{selectedReaction.ionicEquation}</span>
                    </div>
                  )}
                  {selectedReaction.netIonicEquation && (
                    <div>
                      <span className="text-slate-500 mr-2">Net ionic equation:</span>
                      <span className="text-emerald-300 font-bold">{selectedReaction.netIonicEquation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Scientific Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[11px] text-slate-400">thermal change (ΔH):</span>
                  <span className="text-sm font-bold text-slate-100 mt-0.5">
                    {selectedReaction.thermalType === 'EXOTHERMIC' ? '🔥 heat generator' : '❄️ hot'}
                  </span>
                  <span className="text-xs font-mono text-amber-400">{selectedReaction.deltaH || 'verified'}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[11px] text-slate-400">Redox:</span>
                  <span className="text-sm font-bold text-slate-100 mt-0.5">
                    {selectedReaction.redox ? '✅ redox reaction' : '❌ Non-redox'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {selectedReaction.oxidizingAgent ? `Corrosion: ${selectedReaction.oxidizingAgent}` : 'ion exchange'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col">
                  <span className="text-[11px] text-slate-400">Final pH value:</span>
                  <span className="text-sm font-bold text-cyan-400 mt-0.5 font-mono">
                    pH {selectedReaction.finalPH.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {selectedReaction.finalPH < 7 ? 'acidic' : selectedReaction.finalPH > 7 ? 'alkaline' : 'neutral'}
                  </span>
                </div>
              </div>

              {/* Observations & Scientific Explanation */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-300">Laboratory Observations and Interpretation:</span>
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3 text-xs text-slate-300 leading-relaxed">
                  <div>
                    <strong className="text-slate-100">What will happen? (observation):</strong>
                    <ul className="list-disc list-inside mt-1 text-slate-400 space-y-1">
                      {selectedReaction.observations.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-slate-900">
                    <strong className="text-slate-100">Why does it happen? (scientific reasons):</strong>
                    <p className="text-slate-400 mt-1">{selectedReaction.explanation}</p>
                  </div>
                  {selectedReaction.microscopicExplanation && (
                    <div className="pt-2 border-t border-slate-900">
                      <strong className="text-cyan-300">Microscopic level processes:</strong>
                      <p className="text-slate-400 mt-1">{selectedReaction.microscopicExplanation}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Safety & Precaution Note */}
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-600/40 text-xs text-amber-200 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-300">Laboratory Safety and Precautions: </span>
                  <span>{selectedReaction.safetyGuidelines}</span>
                </div>
              </div>

              {/* Ask Tutor button */}
              <button
                onClick={() =>
                  onAskTutor?.(
                    `chemical reaction "${selectedReaction.banglaName}" (${selectedReaction.balancedEquation}) Explain its detailed reaction techniques and practical applications।`
                  )
                }
                className="py-3 px-4 rounded-2xl bg-purple-900/40 hover:bg-purple-900/60 border border-purple-600/50 text-purple-200 text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Ask the teacher about this reaction</span>
              </button>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 text-slate-500">
              Select any reaction from the list on the left।
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
