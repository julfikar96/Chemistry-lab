import React, { useState } from 'react';
import { NCTB_CLASS_9_10_PRACTICALS } from '../data/practicals';
import { PracticalExperiment, PracticalStep } from '../types';
import { Lab3DThreeView } from './Lab3DThreeView';
import { soundEngine } from '../utils/audio';
import { getChemicalById } from '../data/chemicals';
import {
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Award,
  FileText,
  AlertCircle,
  ArrowRight,
  Check,
} from 'lucide-react';

interface PracticalsLabProps {
  initialExperimentId?: string;
  onAddNotebookEntry?: (entry: any) => void;
  onAskTutor?: (question: string) => void;
  onUnlockAchievement?: (id: string) => void;
}

export const PracticalsLab: React.FC<PracticalsLabProps> = ({
  initialExperimentId,
  onAddNotebookEntry,
  onAskTutor,
  onUnlockAchievement,
}) => {
  const [selectedExp, setSelectedExp] = useState<PracticalExperiment>(
    initialExperimentId ? (NCTB_CLASS_9_10_PRACTICALS.find(e => e.id === initialExperimentId) || NCTB_CLASS_9_10_PRACTICALS[0]) : NCTB_CLASS_9_10_PRACTICALS[0]
  );
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // 3D Canvas visual simulation state for current practical
  const [currentVolume, setCurrentVolume] = useState<number>(0);
  const [liquidColor, setLiquidColor] = useState<string>('#38bdf8');
  const [isPouring, setIsPouring] = useState<boolean>(false);
  const [isStirring, setIsStirring] = useState<boolean>(false);
  const [isHeating, setIsHeating] = useState<boolean>(false);
  const [isBubbling, setIsBubbling] = useState<boolean>(false);
  const [currentTemp, setCurrentTemp] = useState<number>(25.0);
  const [currentPH, setCurrentPH] = useState<number>(7.0);

  // Quiz state
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  const currentStep: PracticalStep | undefined = selectedExp.steps[currentStepIndex];

  React.useEffect(() => {
    if (initialExperimentId) {
      const exp = NCTB_CLASS_9_10_PRACTICALS.find(e => e.id === initialExperimentId);
      if (exp) handleSelectPractical(exp);
    }
  }, [initialExperimentId]);

  // Switch practical
  const handleSelectPractical = (exp: PracticalExperiment) => {
    setSelectedExp(exp);
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setIsCompleted(false);
    setCurrentVolume(0);
    setLiquidColor('#38bdf8');
    setIsBubbling(false);
    setIsHeating(false);
    setCurrentTemp(25.0);
    setCurrentPH(7.0);
    setSelectedQuizAnswers({});
    setShowQuizResult(false);
  };

  // Perform step action in 3D simulator
  const handleExecuteStep = () => {
    if (!currentStep) return;

    if (currentStep.actionType === 'ADD_CHEMICAL' && currentStep.chemicalToAdd) {
      const chem = getChemicalById(currentStep.chemicalToAdd.chemicalId);
      setIsPouring(true);
      soundEngine.playPourSound();

      setTimeout(() => {
        setIsPouring(false);
        setCurrentVolume((prev) => prev + (currentStep.chemicalToAdd?.volume || 20));
        if (chem) {
          setLiquidColor(chem.colorHex);
          setCurrentPH(chem.pH);
        }
        soundEngine.playGlassClink();

        // Check if gas or precipitate reaction in practical
        if (selectedExp.id === 'exp_h2_gas_prep' && currentStep.stepNumber === 2) {
          setIsBubbling(true);
          soundEngine.playBubblingSound();
        }
        if (selectedExp.id === 'exp_neutralization' && currentStep.stepNumber === 3) {
          setCurrentTemp(29.5);
          setCurrentPH(7.0);
        }
        if (selectedExp.id === 'exp_fe_cuso4_displacement' && currentStep.stepNumber === 3) {
          setLiquidColor('#86efac'); // turns light green FeSO4
        }
        if (selectedExp.id === 'exp_precipitation_agno3_nacl' && currentStep.stepNumber === 2) {
          setLiquidColor('#ffffff'); // Curdy white
        }

        markStepComplete();
      }, 700);
    } else if (currentStep.actionType === 'STIR') {
      setIsStirring(true);
      soundEngine.playGlassClink();
      setTimeout(() => {
        setIsStirring(false);
        markStepComplete();
      }, 1200);
    } else if (currentStep.actionType === 'TEST_GAS') {
      soundEngine.playBubblingSound();
      setTimeout(() => {
        soundEngine.playBurnerSound();
        markStepComplete();
      }, 800);
    } else {
      markStepComplete();
    }
  };

  const markStepComplete = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }

    if (currentStepIndex < selectedExp.steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setIsCompleted(true);
      soundEngine.playSuccessChime();
      onUnlockAchievement?.('practical_ace');
    }
  };

  // Reset current practical
  const handleReset = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setIsCompleted(false);
    setCurrentVolume(0);
    setLiquidColor('#38bdf8');
    setIsBubbling(false);
    setIsHeating(false);
    setCurrentTemp(25.0);
    setCurrentPH(7.0);
  };

  // Save report to notebook
  const handleGenerateReport = () => {
    onAddNotebookEntry?.({
      title: `${selectedExp.title} (NCTB lab report)`,
      chemicals: selectedExp.chemicals.map((c) => c.requiredAmount),
      equation: selectedExp.equations[0],
      observations: selectedExp.observations,
      temp: currentTemp,
      ph: currentPH,
      results: selectedExp.result,
    });
    setShowReportModal(true);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Top Practical Header */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold border border-cyan-500/30">
                {selectedExp.nctbClass}
              </span>
              <span className="text-xs text-slate-400 font-mono">{selectedExp.chapter}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 mt-1">{selectedExp.title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAskTutor?.(`${selectedExp.title} Explain the basic theory of the test and necessary precautions।`)}
              className="py-2 px-3 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>AI Ask the teacher for help</span>
            </button>
          </div>
        </div>

        {/* Practical Switcher Ribbon */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-800">
          {NCTB_CLASS_9_10_PRACTICALS.map((exp) => (
            <button
              key={exp.id}
              onClick={() => handleSelectPractical(exp)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                selectedExp.id === exp.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span>🔬</span>
              <span>{exp.banglaTitle.split('(')[0].slice(0, 26)}...</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3-Column Practical Laboratory Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Apparatus & Chemicals Required (3.5 Cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                📌 Apparatus
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedExp.apparatus.map((app, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                🧪 Chemicals
              </h3>
              <div className="space-y-2">
                {selectedExp.chemicals.map((chem, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between"
                  >
                    <span className="font-semibold text-slate-200">{chem.requiredAmount}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                📖 The main theory & Principle)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{selectedExp.theory}</p>
              <div className="mt-2 p-2 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-amber-300">
                {selectedExp.principle}
              </div>
            </div>
          </div>
        </div>

        {/* Center Column: 3D Interactive Workbench (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="w-full h-[380px]">
            <Lab3DThreeView
              glassware="beaker"
              volume={currentVolume}
              maxCapacity={500}
              liquidColorHex={liquidColor}
              experimentId={selectedExp.id}
              isPouring={isPouring}
              pourColorHex={liquidColor}
              isStirring={isStirring}
              isHeating={isHeating}
              isBubbling={isBubbling}
              temperature={currentTemp}
              ph={currentPH}
              autoRotate={false}
              cameraPreset="isometric"
            />
          </div>

          {/* Interactive Step Execution Bar */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400">
                step {currentStepIndex + 1} / {selectedExp.steps.length}: {currentStep?.title}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Progress: {Math.round(((completedSteps.length) / selectedExp.steps.length) * 100)}%
              </span>
            </div>

            <p className="text-xs font-medium text-slate-200 bg-slate-950 p-3 rounded-2xl border border-slate-800">
              {currentStep?.instruction}
            </p>

            <div className="flex items-center gap-2 pt-1">
              {!isCompleted ? (
                <button
                  onClick={handleExecuteStep}
                  disabled={isPouring || isStirring}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>complete step ({currentStep?.actionType})</span>
                </button>
              ) : (
                <button
                  onClick={handleGenerateReport}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>Practical done! Generate lab reports</span>
                </button>
              )}

              <button
                onClick={handleReset}
                className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-all"
                title="Practical resume"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Step Checklist & Observations (3.5 Cols) */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Step Sequence checklist */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Procedure steps
            </h3>

            <div className="space-y-2">
              {selectedExp.steps.map((step, idx) => {
                const isCurrent = currentStepIndex === idx && !isCompleted;
                const isDone = completedSteps.includes(idx) || isCompleted;

                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-xl border text-xs flex items-start gap-2.5 transition-all ${
                      isCurrent
                        ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/40'
                        : isDone
                        ? 'bg-slate-950/80 border-emerald-800/40 text-slate-300'
                        : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        isDone
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                          ? 'bg-cyan-400 text-slate-950 font-bold text-[10px]'
                          : 'bg-slate-800 text-slate-500 text-[10px]'
                      }`}
                    >
                      {isDone ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-200">{step.title}</span>
                      <span className="text-[10px] text-slate-400">{step.observationHint}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Observations Box */}
          <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-slate-200">🔍 Results and observations</h3>
            <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
              {selectedExp.observations.map((obs, idx) => (
                <li key={idx}>{obs}</li>
              ))}
            </ul>
            <div className="mt-2 p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300">
              <strong>Conclusion:</strong> {selectedExp.result}
            </div>
          </div>
        </div>
      </div>

      {/* Viva & Quiz Assessment Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* Viva Questions Accordion */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>🗣️</span>
            <span>Oral Examination and Viva-Voce</span>
          </h3>

          <div className="space-y-3">
            {selectedExp.vivaQuestions.map((v, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-1.5">
                <span className="text-xs font-bold text-cyan-300">question {idx + 1}: {v.question}</span>
                <span className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                  <strong>Answer:</strong> {v.answer}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Practical MCQ Quiz */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col gap-4">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span>📝</span>
            <span>Practice Based Quiz Review</span>
          </h3>

          <div className="space-y-4">
            {selectedExp.quizQuestions.map((q) => {
              const userAns = selectedQuizAnswers[q.id];
              return (
                <div key={q.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col gap-3">
                  <span className="text-xs font-bold text-slate-200">{q.question}</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = userAns === optIdx;
                      const isCorrect = optIdx === q.correctIndex;
                      let btnClass = 'bg-slate-900 text-slate-300 border-slate-800';

                      if (userAns !== undefined) {
                        if (isCorrect) {
                          btnClass = 'bg-emerald-950/80 text-emerald-300 border-emerald-500 font-bold';
                        } else if (isChosen) {
                          btnClass = 'bg-rose-950/80 text-rose-300 border-rose-500';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() =>
                            setSelectedQuizAnswers({
                              ...selectedQuizAnswers,
                              [q.id]: optIdx,
                            })
                          }
                          className={`p-2.5 rounded-xl text-xs text-left border transition-all ${btnClass}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {userAns !== undefined && (
                    <div className="text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-800/40">
                      💡 <strong>Explanation:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lab Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100">Official Lab Report</h3>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-4 font-sans">
              <div className="text-center border-b border-slate-800 pb-3">
                <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  Bangladesh Board of Secondary and Higher Secondary Education - Practical Chemistry
                </h4>
                <span className="text-xs text-cyan-400 font-semibold">{selectedExp.title}</span>
              </div>

              <div>
                <strong>Objective:</strong>
                <p className="text-slate-400 mt-0.5">{selectedExp.objective}</p>
              </div>

              <div>
                <strong>Theory and equation (Theory & Equation):</strong>
                <p className="text-slate-400 mt-0.5">{selectedExp.theory}</p>
                <div className="p-2 bg-slate-900 rounded font-mono text-amber-300 mt-1">
                  {selectedExp.equations.join(' ; ')}
                </div>
              </div>

              <div>
                <strong>Observations and data collection (Observations):</strong>
                <ul className="list-disc list-inside text-slate-400 mt-1 space-y-0.5">
                  {selectedExp.observations.map((obs, i) => (
                    <li key={i}>{obs}</li>
                  ))}
                </ul>
              </div>

              {selectedExp.calculations && (
                <div>
                  <strong>Calculations:</strong>
                  <pre className="p-2 bg-slate-900 rounded text-slate-300 font-mono text-[11px] whitespace-pre-wrap mt-1">
                    {selectedExp.calculations}
                  </pre>
                </div>
              )}

              <div>
                <strong>Conclusion:</strong>
                <p className="text-emerald-300 font-semibold mt-0.5">{selectedExp.result}</p>
              </div>

              <div>
                <strong>Precautions:</strong>
                <ul className="list-disc list-inside text-slate-400 mt-1 space-y-0.5">
                  {selectedExp.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all"
              >
                🖨️ Print / Save PDF
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
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
