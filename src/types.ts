export type ReactionType =
  | 'SYNTHESIS'
  | 'DECOMPOSITION'
  | 'SINGLE_DISPLACEMENT'
  | 'DOUBLE_DISPLACEMENT'
  | 'NEUTRALIZATION'
  | 'PRECIPITATION'
  | 'REDOX'
  | 'COMBUSTION'
  | 'GAS_EVOLUTION'
  | 'COMPLEX_FORMATION'
  | 'THERMAL_DECOMPOSITION'
  | 'ELECTROLYSIS'
  | 'OXIDE_REACTION'
  | 'ACID_METAL'
  | 'ACID_CARBONATE';

export type ThermalType = 'EXOTHERMIC' | 'ENDOTHERMIC' | 'THERMONEUTRAL';

export type ReactionCondition = 'RT' | 'HEAT' | 'ELECTRICITY' | 'CATALYST' | 'LIGHT';

export type ElementCategory =
  | 'alkali-metal'
  | 'alkaline-earth'
  | 'transition-metal'
  | 'post-transition-metal'
  | 'metalloid'
  | 'reactive-nonmetal'
  | 'noble-gas'
  | 'lanthanide'
  | 'actinide'
  | 'unknown';

export interface ElementData {
  number: number;
  symbol: string;
  name: string;
  banglaName: string;
  mass: number;
  category: ElementCategory;
  period: number;
  group: number;
  block: 's' | 'p' | 'd' | 'f';
  electronConfig: string;
  shellConfig: number[];
  stateAtSTP: 'Solid' | 'Liquid' | 'Gas';
  banglaState: 'difficult' | 'liquid' | 'aerial';
  meltingPoint?: number; // Kelvin or Celsius
  boilingPoint?: number;
  density?: number;
  electronegativity?: number;
  atomicRadius?: number; // pm
  ionizationEnergy?: number; // kJ/mol
  electronAffinity?: number; // kJ/mol
  valenceElectrons: number;
  oxidationStates: string;
  discoveryYear?: string;
  discoveredBy?: string;
  usesBangla: string;
  commonCompounds: string[];
  safetyNoteBangla?: string;
}

export type ChemicalCategory =
  | 'Acid'
  | 'Base'
  | 'Salt'
  | 'Metal'
  | 'NonMetal'
  | 'Indicator'
  | 'Solvent'
  | 'Gas'
  | 'Oxide';

export interface Chemical {
  id: string;
  formula: string;
  name: string;
  banglaName: string;
  commonName?: string;
  iupacName?: string;
  category: ChemicalCategory;
  state: 'aq' | 's' | 'l' | 'g';
  colorHex: string;
  fluidOpacity: number; // 0 to 1
  pH: number;
  molarMass: number;
  density?: number; // g/mL
  concentration?: string;
  valency?: number | string;
  solubility?: string;
  reactivityRank?: number; // lower number = higher reactivity (e.g. K=1, Na=2, etc.)
  ions?: {
    cation?: string;
    anion?: string;
  };
  hazards: ('CORROSIVE' | 'FLAMMABLE' | 'TOXIC' | 'OXIDIZER' | 'IRRITANT' | 'SAFE' | 'EXPLOSIVE')[];
  banglaDescription: string;
  banglaSafety: string;
  colorName: string;
}

export interface PrecipitateInfo {
  formula: string;
  name: string;
  banglaName: string;
  colorHex: string;
  colorName: string;
  solubilityNote: string;
}

export interface GasInfo {
  formula: string;
  name: string;
  banglaName: string;
  colorName: string;
  testMethod: string;
  smell: string;
}

export interface ReactionRecord {
  id: string;
  name: string;
  banglaName: string;
  reactants: string[]; // Chemical IDs required
  products: string[];
  equation: string;
  balancedEquation: string;
  wordEquationBangla?: string;
  ionicEquation?: string;
  netIonicEquation?: string;
  reactionTypes: ReactionType[];
  thermalType: ThermalType;
  deltaH?: string; // e.g. "-57.1 kJ/mol"
  deltaHVerified: boolean;
  requiredCondition?: ReactionCondition;
  redox: boolean;
  oxidizedSpecies?: string;
  reducedSpecies?: string;
  oxidizingAgent?: string;
  reducingAgent?: string;
  displacement?: boolean;
  displacedSpecies?: string;
  replacingSpecies?: string;
  precipitate?: PrecipitateInfo;
  gas?: GasInfo;
  colorChange?: {
    fromColorHex: string;
    toColorHex: string;
    descriptionBangla: string;
  };
  temperatureDelta?: number; // Celsius change
  finalPH?: number;
  drivingForce?: string;
  observations: string[];
  explanation: string;
  microscopicExplanation?: string;
  safetyGuidelines: string;
  nctbChapter?: string;
  verificationStatus: 'VERIFIED' | 'VERIFICATION_REQUIRED';
}

export interface ReactionEvaluationResult {
  isReacting: boolean;
  reaction: ReactionRecord | null;
  reasonIfNoReaction?: string;
  scientificExplanationBangla?: string;
  reactionTypes: ReactionType[];
  balancedEquation: string;
  wordEquationBangla: string;
  netIonicEquation?: string;
  drivingForce?: string;
  thermalType: ThermalType;
  temperatureDelta: number;
  finalPH: number;
  precipitate?: PrecipitateInfo;
  gas?: GasInfo;
  colorChange?: {
    fromColorHex: string;
    toColorHex: string;
    descriptionBangla: string;
  };
  observations: string[];
  explanation: string;
  microscopicExplanation?: string;
  safetyGuidelines?: string;
  nctbChapter?: string;
}

export interface PracticalStep {
  stepNumber: number;
  title: string;
  instruction: string;
  apparatusNeeded?: string;
  chemicalToAdd?: {
    chemicalId: string;
    volume: number;
  };
  actionType: 'ADD_CHEMICAL' | 'HEAT' | 'STIR' | 'COOL' | 'TEST_GAS' | 'TEST_PH' | 'OBSERVE';
  observationHint: string;
  expectedResult: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PracticalExperiment {
  id: string;
  title: string;
  banglaTitle: string;
  nctbClass: string;
  chapter: string;
  objective: string;
  theory: string;
  principle: string;
  apparatus: string[];
  chemicals: {
    chemicalId: string;
    requiredAmount: string;
  }[];
  steps: PracticalStep[];
  observations: string[];
  calculations?: string;
  equations: string[];
  result: string;
  precautions: string[];
  vivaQuestions: VivaQuestion[];
  quizQuestions: QuizQuestion[];
}

export type GlasswareType =
  | 'beaker'
  | 'test_tube'
  | 'conical_flask'
  | 'measuring_cylinder'
  | 'burette';

export interface GlasswareConfig {
  id: GlasswareType;
  name: string;
  banglaName: string;
  capacity: number; // in mL
  heightRatio: number;
}

export interface BeakerContentItem {
  chemicalId: string;
  volume: number;
  concentration?: string;
  addedAt: number;
}

export interface NotebookEntry {
  id: string;
  title: string;
  timestamp: number;
  chemicals: string[];
  equation?: string;
  observations: string[];
  temperature?: number;
  ph?: number;
  notes?: string;
}

export interface LabNotebookLog {
  id: string;
  timestamp: string;
  experimentTitle: string;
  chemicals: string[];
  equation?: string;
  observations: string[];
  tempRecorded?: number;
  phRecorded?: number;
  userNotes: string;
  conclusion: string;
}

export interface Achievement {
  id: string;
  title: string;
  banglaTitle: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}
