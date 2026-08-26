import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  HelpCircle,
  ChevronRight,
  TrendingUp,
  Brain,
  Zap,
  BookOpen,
  Filter,
  Check,
  ArrowRight,
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export interface ExamQuestion {
  id: string;
  category: 'SSC' | 'HSC' | 'OLYMPIAD' | 'NUMERICAL';
  topicBangla: string;
  questionBangla: string;
  equation?: string;
  options: string[];
  correctIndex: number;
  explanationBangla: string;
  difficulty: 'simple' | 'moderate' | 'higher';
  xp: number;
}

const EXAM_QUESTIONS_DATA: ExamQuestion[] = [
  {
    id: 'q1',
    category: 'SSC',
    topicBangla: 'Mole and chemical calculations',
    questionBangla: 'What is the volume of 44 grams of CO₂ gas in liters at proof temperature and pressure (STP)?',
    equation: 'CO₂ molar mass = 12 + 16×2 = 44 g/mol',
    options: ['11.2 L', '22.4 L', '44.8 L', '224 L'],
    correctIndex: 1,
    explanationBangla: '1 mole molar mass of any gas occupies a volume of 22.4 liters at STP. 44 grams of CO₂ = 1 mole of CO₂, so its volume is 22.4 liters.',
    difficulty: 'simple',
    xp: 20,
  },
  {
    id: 'q2',
    category: 'SSC',
    topicBangla: 'Periodic table and periodic table',
    questionBangla: 'Which of the following elements has the highest electronegativity?',
    options: ['Chlorine (Cl)', 'Oxygen (O)', 'Fluorine (F)', 'Nitrogen (N)'],
    correctIndex: 2,
    explanationBangla: 'Fluorine (F) has the highest electronegativity (4.0) on the Pauling scale. Electronegativity increases as you go from left to right and from bottom to top in the same phase of the periodic table.',
    difficulty: 'simple',
    xp: 20,
  },
  {
    id: 'q3',
    category: 'SSC',
    topicBangla: 'Oxidation and Redox',
    questionBangla: 'What is the oxidation number of manganese (Mn) in the compound KMnO₄?',
    equation: '+1 + x + 4(-2) = 0',
    options: ['+2', '+4', '+6', '+7'],
    correctIndex: 3,
    explanationBangla: 'In potassium permanganate (KMnO₄): oxidation number of K is +1, O is -2. So: (+1) + Mn + 4(-2) = 0 ⇒ Mn - 7 = 0 ⇒ Mn = +7.',
    difficulty: 'moderate',
    xp: 30,
  },
  {
    id: 'q4',
    category: 'HSC',
    topicBangla: 'Environmental chemistry and gas formulas',
    questionBangla: 'How will the volume of a given mass of gas at constant temperature change if its pressure is doubled?',
    equation: "P₁V₁ = P₂V₂ (Boyle's formula)",
    options: ['will double', 'will be half', 'will be fourfold', 'will remain unchanged'],
    correctIndex: 1,
    explanationBangla: "According to Boyle's law, the pressure and volume of a gas at constant temperature are proportional (P ∝ 1/V). Doubling the pressure (2P) halves the volume (V/2).",
    difficulty: 'moderate',
    xp: 30,
  },
  {
    id: 'q5',
    category: 'HSC',
    topicBangla: 'Chemical changes and buffer solutions',
    questionBangla: 'What will be the pH of a buffer solution containing 0.1 M CH₃COOH and 0.1 M CH₃COONa? (Given: pKa of CH₃COOH = 4.74)',
    equation: 'pH = pKa + log([Salt]/[Acid])',
    options: ['3.74', '4.74', '5.74', '7.00'],
    correctIndex: 1,
    explanationBangla: 'According to the Henderson-Hasselbalch equation: pH = pKa + log([salt]/[acid]) = 4.74 + log(0.1 / 0.1) = 4.74 + log(1) = 4.74 + 0 = 4.74.',
    difficulty: 'moderate',
    xp: 35,
  },
  {
    id: 'q6',
    category: 'HSC',
    topicBangla: 'Electrochemistry and Nernst equation',
    questionBangla: 'What is the value of proof cell potential (E°cell) in Daniel cell (Zn|Zn²⁺ || Cu²⁺|Cu)? (E° Zn²⁺/Zn = -0.76V, E° Cu²⁺/Cu = +0.34V)',
    equation: 'E°cell = E°cathode - E°anode = +0.34V - (-0.76V)',
    options: ['0.42 V', '1.10 V', '-1.10 V', '0.76 V'],
    correctIndex: 1,
    explanationBangla: 'E°cell = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = +0.34 V - (-0.76 V) = +0.34 + 0.76 = +1.10 V. The reaction is spontaneous because E°cell is positive.',
    difficulty: 'moderate',
    xp: 35,
  },
  {
    id: 'q7',
    category: 'OLYMPIAD',
    topicBangla: 'Chemical bonding and VSEPR theory',
    questionBangla: 'What is the molecular geometry of SF₄ (sulfur tetrafluoride) molecule?',
    equation: 'Steric Number = 4 bond pairs + 1 lone pair = 5',
    options: ['Tetrahedral', 'See-Saw', 'Square Planar', 'Trigonal bipyramidal'],
    correctIndex: 1,
    explanationBangla: 'The central sulfur in SF₄ has 4 bonded and 1 unpaired electrons (Steric Number = 5, sp³d hybridization). The unpaired electron is in the equatorial position, so the molecule has a see-saw shape.',
    difficulty: 'higher',
    xp: 50,
  },
  {
    id: 'q8',
    category: 'OLYMPIAD',
    topicBangla: "Thermodynamics and Hess' Law",
    questionBangla: 'In any reaction ΔH = -100 kJ/mol and ΔS = -200 J/(mol·K). Below what temperature will the reaction be spontaneous?',
    equation: 'ΔG = ΔH - TΔS < 0 ⇒ T < ΔH/ΔS',
    options: ['100 K', '300 K', '500 K', '1000 K'],
    correctIndex: 2,
    explanationBangla: 'Spontaneity condition ΔG < 0. So, ΔH - TΔS < 0 ⇒ -100,000 J - T(-200) < 0 ⇒ 200T < 100,000 ⇒ T < 500 K. Therefore, below 500 Kelvin the reaction is spontaneous.',
    difficulty: 'higher',
    xp: 50,
  },
  {
    id: 'q9',
    category: 'NUMERICAL',
    topicBangla: 'Stoichiometry and limiting reactants',
    questionBangla: 'What is the maximum number of grams of water (H₂O) produced by the reaction of 4 grams of hydrogen (H₂) and 32 grams of oxygen (O₂)?',
    equation: '2H₂ + O₂ → 2H₂O (4g H₂ + 32g O₂ → 36g H₂O)',
    options: ['18 grams', '36 grams', '54 grams', '72 grams'],
    correctIndex: 1,
    explanationBangla: 'Equation: 2H₂ + O₂ → 2H₂O. 4 grams of H₂ (2 moles) and 32 grams of O₂ (1 mole) react completely to form 2 moles or 36 grams of water (H₂O). There are no limiting reactants, both are present in stoichiometric ratio.',
    difficulty: 'moderate',
    xp: 35,
  },
  {
    id: 'q10',
    category: 'NUMERICAL',
    topicBangla: 'Dissolution and dilution',
    questionBangla: 'If 250 mL of 0.5 M solution is diluted to 1000 mL, what will be the molarity of the new solution?',
    equation: 'S₁V₁ = S₂V₂ ⇒ S₂ = (0.5 × 250) / 1000',
    options: ['0.125 M', '0.25 M', '0.05 M', '1.0 M'],
    correctIndex: 0,
    explanationBangla: 'Dilution formula: S₁V₁ = S₂V₂ ⇒ S₂ = (0.5 × 250) / 1000 = 125 / 1000 = 0.125 M.',
    difficulty: 'simple',
    xp: 25,
  },
];

interface ExamCenterLabProps {
  onEarnXP?: (xp: number) => void;
  onAskTutor?: (question: string) => void;
}

export const ExamCenterLab: React.FC<ExamCenterLabProps> = ({ onEarnXP, onAskTutor }) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'SSC' | 'HSC' | 'OLYMPIAD' | 'NUMERICAL'>('ALL');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [earnedXP, setEarnedXP] = useState(0);

  // Filtered pool of questions
  const filteredQuestions = EXAM_QUESTIONS_DATA.filter(
    (q) => selectedCategory === 'ALL' || q.category === selectedCategory
  );

  const activeQuestion = filteredQuestions[currentQuestionIndex] || filteredQuestions[0];

  // Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    setIsAnswerSubmitted(true);
    setTotalAnswered((prev) => prev + 1);

    if (selectedOption === activeQuestion.correctIndex) {
      soundEngine.playSuccessChime();
      setScore((prev) => prev + 1);
      setEarnedXP((prev) => prev + activeQuestion.xp);
      onEarnXP?.(activeQuestion.xp);
    } else {
      soundEngine.playPourDrop();
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      // Completed test
      setIsTimerRunning(false);
    }
  };

  const handleResetExam = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setTotalAnswered(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header & Dashboard Stats */}
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Brain className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              Chemistry Test and Olympiad Preparation Center(Exam & Olympiad Hub)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            SSC, HSC, Medical/Engineering Admission and Olympiad Standard Question Bank with detailed explanation
          </p>
        </div>

        {/* Live Scorecard & Timer */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="font-mono font-bold text-slate-100">{formatTime(timerSeconds)}</span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-2 text-xs text-emerald-300">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Score:<strong className="text-white font-mono">{score}/{totalAnswered}</strong></span>
          </div>

          <div className="px-3.5 py-2 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex items-center gap-2 text-xs text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>+<strong className="text-white font-mono">{earnedXP}</strong> XP</span>
          </div>

          <button
            onClick={handleResetExam}
            title="Restart the test"
            className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { id: 'ALL', label: 'All Questions (All Topics)' },
          { id: 'SSC', label: 'SSC Chemistry (SSC)' },
          { id: 'HSC', label: 'HSC 1st & 2nd Paper (HSC)' },
          { id: 'OLYMPIAD', label: 'Olympiad Standard' },
          { id: 'NUMERICAL', label: 'Mathematical problems (Numerical)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setSelectedCategory(tab.id as any);
              setCurrentQuestionIndex(0);
              setSelectedOption(null);
              setIsAnswerSubmitted(false);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 border ${
              selectedCategory === tab.id
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/20'
                : 'bg-slate-900/90 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Question Arena */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Question Progress & Meta */}
            <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] border border-purple-500/30 uppercase">
                  {activeQuestion.category}
                </span>
                <span className="font-semibold text-slate-300">{activeQuestion.topicBangla}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  question: <strong className="text-slate-200">{currentQuestionIndex + 1}</strong> / {filteredQuestions.length}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-400 border border-slate-700">
                  {activeQuestion.difficulty}
                </span>
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-100 leading-relaxed">
                {activeQuestion.questionBangla}
              </h3>
              {activeQuestion.equation && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-cyan-300">
                  {activeQuestion.equation}
                </div>
              )}
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3 pt-2">
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeQuestion.correctIndex;
                let optionStyle =
                  'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 font-semibold';
                  } else {
                    optionStyle = 'bg-slate-950/30 border-slate-850 text-slate-500 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-purple-950/40 border-purple-500 text-purple-200 font-bold shadow-md';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-2xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-[11px] shrink-0 ${
                          isSelected
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => onAskTutor?.(`Let me explain this question in detail:"${activeQuestion.questionBangla}"`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-purple-300 text-xs hover:bg-purple-900/40 transition-all font-semibold"
            >
              <Brain className="w-3.5 h-3.5" />
              <span>Ask the AI ​​teacher</span>
            </button>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOption === null}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-lg ${
                  selectedOption !== null
                    ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                Check answer
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-cyan-500/20"
              >
                <span>{currentQuestionIndex < filteredQuestions.length - 1 ? 'Next question' : 'View the results'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Explanation & Learning Card Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Step-by-Step Explanation</span>
            </h4>

            {isAnswerSubmitted ? (
              <div className="space-y-3 animate-in fade-in">
                <div
                  className={`p-3.5 rounded-2xl border ${
                    selectedOption === activeQuestion.correctIndex
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <span className="font-bold block text-xs">
                    {selectedOption === activeQuestion.correctIndex
                      ? '🎉 Congratulations! Your answer is correct.'
                      : `❌ Sorry! correct answer: (${String.fromCharCode(65 + activeQuestion.correctIndex)}) ${
                          activeQuestion.options[activeQuestion.correctIndex]
                        }`}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300 leading-relaxed text-[11px]">
                  <strong className="text-cyan-400 block text-xs font-semibold">Science Logic and Key Formulas:</strong>
                  <p>{activeQuestion.explanationBangla}</p>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                <HelpCircle className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                <p>By selecting an option and pressing 'Check Answer', the scientific explanation will be unlocked immediately.</p>
              </div>
            )}
          </div>

          {/* Quick Learning Tip */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800/80 shadow-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-indigo-300 font-bold">
              <BookOpen className="w-4 h-4" />
              <span>Chemistry Olympiad Tips</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Use the Steric Number method to determine the symmetry of any chemical molecule:
              <br />
              <strong className="text-slate-200">SN = (Number of valence electrons of central atom + Number of monovalent atoms - Cation charge + Anion charge) ÷ 2</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
