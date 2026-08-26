import { ALL_118_ELEMENTS } from '../data/all118Elements';
import { ElementData } from '../types';

export interface SubshellOrbital {
  name: string; // e.g. "1s", "2p", "3d"
  n: number;
  l: number; // 0=s, 1=p, 2=d, 3=f
  maxElectrons: number;
  boxCount: number;
  electrons: number;
  boxes: {
    ml: number;
    up: boolean;
    down: boolean;
  }[];
}

export interface ElectronQuantumNumbers {
  electronIndex: number; // 1-based (1 to Z)
  subshell: string;
  n: number;
  l: number;
  ml: number;
  ms: number; // +0.5 or -0.5
  subshellLabel: string;
  spinLabel: string;
  explanationBangla: string;
}

export interface UniversalAtomData {
  element: ElementData;
  atomicNumber: number;
  protons: number;
  neutrons: number;
  electrons: number;
  massNumber: number;
  charge: number;
  ionSymbol: string;
  ionNameBangla: string;
  isIsotope: boolean;
  standardMass: number;
  nuclearNotation: string;
  shellConfig: number[]; // K, L, M, N, O, P, Q counts
  shellLabels: { name: string; max: number; count: number }[];
  electronConfigFull: string;
  electronConfigNoble: string;
  orbitals: SubshellOrbital[];
  valenceElectrons: number;
  valenceShellNumber: number;
  allElectronsQuantumNumbers: ElectronQuantumNumbers[];
  stability: 'Stable (stable)' | 'Radioactive (radioactive)';
  decayMode?: string;
  commonIons: { charge: number; formula: string; type: string }[];
  isExcitedState?: boolean;
}

// Subshell order following Madelung rule (n + l rule)
const SUBSHELL_ORDER: { name: string; n: number; l: number; max: number; boxes: number }[] = [
  { name: '1s', n: 1, l: 0, max: 2, boxes: 1 },
  { name: '2s', n: 2, l: 0, max: 2, boxes: 1 },
  { name: '2p', n: 2, l: 1, max: 6, boxes: 3 },
  { name: '3s', n: 3, l: 0, max: 2, boxes: 1 },
  { name: '3p', n: 3, l: 1, max: 6, boxes: 3 },
  { name: '4s', n: 4, l: 0, max: 2, boxes: 1 },
  { name: '3d', n: 3, l: 2, max: 10, boxes: 5 },
  { name: '4p', n: 4, l: 1, max: 6, boxes: 3 },
  { name: '5s', n: 5, l: 0, max: 2, boxes: 1 },
  { name: '4d', n: 4, l: 2, max: 10, boxes: 5 },
  { name: '5p', n: 5, l: 1, max: 6, boxes: 3 },
  { name: '6s', n: 6, l: 0, max: 2, boxes: 1 },
  { name: '4f', n: 4, l: 3, max: 14, boxes: 7 },
  { name: '5d', n: 5, l: 2, max: 10, boxes: 5 },
  { name: '6p', n: 6, l: 1, max: 6, boxes: 3 },
  { name: '7s', n: 7, l: 0, max: 2, boxes: 1 },
  { name: '5f', n: 5, l: 3, max: 14, boxes: 7 },
  { name: '6d', n: 6, l: 2, max: 10, boxes: 5 },
  { name: '7p', n: 7, l: 1, max: 6, boxes: 3 },
];

// Exceptions in Ground State Electron Configuration
const AUFBAU_EXCEPTIONS: Record<number, Record<string, number>> = {
  24: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 1, '3d': 5 }, // Cr
  29: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 1, '3d': 10 }, // Cu
  41: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6, '5s': 1, '4d': 4 }, // Nb
  42: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6, '5s': 1, '4d': 5 }, // Mo
  44: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6, '5s': 1, '4d': 7 }, // Ru
  45: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6, '5s': 1, '4d': 8 }, // Rh
  46: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6, '5s': 0, '4d': 10 }, // Pd
  47: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6, '5s': 1, '4d': 10 }, // Ag
  78: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6, '5s': 2, '4d': 10, '5p': 6, '6s': 1, '4f': 14, '5d': 9 }, // Pt
  79: { '1s': 2, '2s': 2, '2p': 6, '3s': 2, '3p': 6, '4s': 2, '3d': 10, '4p': 6, '5s': 2, '4d': 10, '5p': 6, '6s': 1, '4f': 14, '5d': 10 }, // Au
};

const NOBLE_GAS_CORES: { z: number; symbol: string; name: string }[] = [
  { z: 118, symbol: '[Og]', name: 'Oganesson' },
  { z: 86, symbol: '[Rn]', name: 'Radon' },
  { z: 54, symbol: '[Xe]', name: 'Xenon' },
  { z: 36, symbol: '[Kr]', name: 'Krypton' },
  { z: 18, symbol: '[Ar]', name: 'Argon' },
  { z: 10, symbol: '[Ne]', name: 'Neon' },
  { z: 2, symbol: '[He]', name: 'Helium' },
];

/**
 * Universal Quantum & Subatomic Particle Calculator for ANY element 1-118
 */
export function calculateUniversalAtom(
  protons: number,
  neutrons?: number,
  electrons?: number,
  isExcitedState: boolean = false
): UniversalAtomData {
  const z = Math.min(118, Math.max(1, Math.round(protons)));
  const element = ALL_118_ELEMENTS.find((e) => e.number === z) || ALL_118_ELEMENTS[0];

  const standardNeutrons = Math.round(element.mass) - z;
  const actualNeutrons = neutrons !== undefined ? Math.max(0, Math.round(neutrons)) : standardNeutrons;
  const actualElectrons = electrons !== undefined ? Math.max(0, Math.round(electrons)) : z;
  const massNumber = z + actualNeutrons;
  const charge = z - actualElectrons;

  // Ion representation
  let ionSymbol = element.symbol;
  let ionNameBangla = element.banglaName;
  if (charge > 0) {
    ionSymbol += charge === 1 ? '⁺' : `${charge}⁺`;
    ionNameBangla += ` (${charge > 1 ? charge : ''}+ cation)`;
  } else if (charge < 0) {
    const absCharge = Math.abs(charge);
    ionSymbol += absCharge === 1 ? '⁻' : `${absCharge}⁻`;
    ionNameBangla += ` (${absCharge > 1 ? absCharge : ''}- anion)`;
  }

  // Calculate Subshell Orbital Filling with Hund's Rule and Pauli Exclusion Principle
  const orbitals: SubshellOrbital[] = [];
  const allElectronsQuantumNumbers: ElectronQuantumNumbers[] = [];
  let remainingElectrons = actualElectrons;

  // Check if standard ground-state exception exists for neutral atom, otherwise fill standard
  const hasException = charge === 0 && !isExcitedState && AUFBAU_EXCEPTIONS[z];
  const customCounts = hasException ? AUFBAU_EXCEPTIONS[z] : null;

  let currentElectronCount = 0;

  for (const sub of SUBSHELL_ORDER) {
    if (remainingElectrons <= 0 && (!customCounts || !customCounts[sub.name])) {
      break;
    }

    let subElectrons = 0;
    if (customCounts && customCounts[sub.name] !== undefined) {
      subElectrons = Math.min(remainingElectrons, customCounts[sub.name]);
    } else {
      subElectrons = Math.min(remainingElectrons, sub.max);
    }

    // If excited state, promote one electron to next available orbital
    if (isExcitedState && sub.name === '2s' && subElectrons === 2 && z === 6) {
      subElectrons = 1; // e.g. Carbon excited 2s1 2p3
    }
    if (isExcitedState && sub.name === '2p' && z === 6 && remainingElectrons >= 4) {
      subElectrons = 3;
    }

    remainingElectrons -= subElectrons;

    // Boxes & magnetic quantum numbers (ml ranges from -l to +l)
    const boxes: { ml: number; up: boolean; down: boolean }[] = [];
    for (let b = 0; b < sub.boxes; b++) {
      const ml = -sub.l + b;
      boxes.push({ ml, up: false, down: false });
    }

    // Step 1: Fill Up spins first (Hund's rule of maximum multiplicity)
    let fillUp = subElectrons;
    for (let b = 0; b < sub.boxes && fillUp > 0; b++) {
      boxes[b].up = true;
      fillUp--;
      currentElectronCount++;
      allElectronsQuantumNumbers.push({
        electronIndex: currentElectronCount,
        subshell: sub.name,
        n: sub.n,
        l: sub.l,
        ml: boxes[b].ml,
        ms: 0.5,
        subshellLabel: `${sub.name} (electron #${currentElectronCount})`,
        spinLabel: '+½ (Clockwise / Up-spin ↑)',
        explanationBangla: `Principal quantum number n = ${sub.n} (energy level), associated quantum number l = ${sub.l} (${sub.name[1]} orbital), magnetic number ml = ${boxes[b].ml}, spin ms = +½।`,
      });
    }

    // Step 2: Fill Down spins (Pauli exclusion principle pairing)
    for (let b = 0; b < sub.boxes && fillUp > 0; b++) {
      boxes[b].down = true;
      fillUp--;
      currentElectronCount++;
      allElectronsQuantumNumbers.push({
        electronIndex: currentElectronCount,
        subshell: sub.name,
        n: sub.n,
        l: sub.l,
        ml: boxes[b].ml,
        ms: -0.5,
        subshellLabel: `${sub.name} (electron #${currentElectronCount})`,
        spinLabel: '-½ (Anti-clockwise / Down-spin ↓)',
        explanationBangla: `According to Pauli's exclusion principle the second electron in a pair of opposite spin: n = ${sub.n}, l = ${sub.l}, ml = ${boxes[b].ml}, ms = -½।`,
      });
    }

    orbitals.push({
      name: sub.name,
      n: sub.n,
      l: sub.l,
      maxElectrons: sub.max,
      boxCount: sub.boxes,
      electrons: subElectrons,
      boxes,
    });
  }

  // Shell distributions (K, L, M, N, O, P, Q)
  const shellMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0 };
  orbitals.forEach((orb) => {
    shellMap[orb.n] = (shellMap[orb.n] || 0) + orb.electrons;
  });

  const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
  const maxShellOccupancies = [2, 8, 18, 32, 50, 72, 98];
  const maxN = Math.max(...orbitals.map((o) => (o.electrons > 0 ? o.n : 1)), 1);

  const shellConfig: number[] = [];
  const shellLabels: { name: string; max: number; count: number }[] = [];
  for (let n = 1; n <= maxN; n++) {
    const count = shellMap[n] || 0;
    shellConfig.push(count);
    shellLabels.push({
      name: `${shellNames[n - 1]} (${n})`,
      max: maxShellOccupancies[n - 1],
      count,
    });
  }

  // Generate String Configurations
  const superscriptMap: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  };
  const toSuperscript = (num: number) =>
    num.toString().split('').map((c) => superscriptMap[c] || c).join('');

  const electronConfigFull = orbitals
    .filter((o) => o.electrons > 0)
    .map((o) => `${o.name}${toSuperscript(o.electrons)}`)
    .join(' ');

  // Noble gas shorthand
  let electronConfigNoble = electronConfigFull;
  if (actualElectrons > 2) {
    const core = NOBLE_GAS_CORES.find((c) => c.z < actualElectrons);
    if (core) {
      // Find remaining subshells
      let filledSoFar = 0;
      const coreSubshells = orbitals.filter((o) => {
        if (filledSoFar < core.z) {
          filledSoFar += o.electrons;
          return true;
        }
        return false;
      });
      const remainingOrbStr = orbitals
        .slice(coreSubshells.length)
        .filter((o) => o.electrons > 0)
        .map((o) => `${o.name}${toSuperscript(o.electrons)}`)
        .join(' ');
      electronConfigNoble = remainingOrbStr ? `${core.symbol} ${remainingOrbStr}` : core.symbol;
    }
  }

  // Valence shell and electrons
  const valenceShellNumber = maxN;
  const valenceElectrons = shellMap[valenceShellNumber] || 0;

  // Nuclear Notation
  const nuclearNotation = `^${massNumber}_${z}${element.symbol}`;
  const isIsotope = actualNeutrons !== standardNeutrons;

  // Stability
  const stability =
    z > 82 || (z === 43) || (z === 61) || Math.abs(actualNeutrons - standardNeutrons) >= 3
      ? 'Radioactive (radioactive)'
      : 'Stable (stable)';

  // Common ions for this element
  const commonIons: { charge: number; formula: string; type: string }[] = [];
  if (element.oxidationStates) {
    const oxList = element.oxidationStates.split(',').map((s) => s.trim());
    oxList.forEach((ox) => {
      const num = parseInt(ox, 10);
      if (!isNaN(num) && num !== 0) {
        const sign = num > 0 ? '⁺' : '⁻';
        const absVal = Math.abs(num);
        const notation = `${element.symbol}${absVal === 1 ? sign : `${absVal}${sign}`}`;
        commonIons.push({
          charge: num,
          formula: notation,
          type: num > 0 ? 'Cation' : 'Anion',
        });
      }
    });
  }

  return {
    element,
    atomicNumber: z,
    protons: z,
    neutrons: actualNeutrons,
    electrons: actualElectrons,
    massNumber,
    charge,
    ionSymbol,
    ionNameBangla,
    isIsotope,
    standardMass: element.mass,
    nuclearNotation,
    shellConfig,
    shellLabels,
    electronConfigFull,
    electronConfigNoble,
    orbitals,
    valenceElectrons,
    valenceShellNumber,
    allElectronsQuantumNumbers,
    stability,
    decayMode: stability.includes('Radioactive') ? (z > 83 ? 'α (Alpha) / β (Beta) decay' : 'β (Beta) / EC decay') : undefined,
    commonIons,
    isExcitedState,
  };
}

/* =========================================================================
   UNIVERSAL VSEPR, LEWIS STRUCTURE & 3D MOLECULAR GEOMETRY ENGINE
========================================================================= */

export type HybridizationType = 'sp' | 'sp²' | 'sp³' | 'sp³d' | 'sp³d²' | 'sp³d³';

export interface VSEPRGeometryTemplate {
  stericNumber: number;
  bondingDomains: number;
  lonePairs: number;
  electronGeometry: string;
  banglaElectronGeometry: string;
  molecularGeometry: string;
  banglaMolecularGeometry: string;
  idealBondAngle: string;
  hybridization: HybridizationType;
  symmetry: 'Symmetric (Non-Polar)' | 'Asymmetric (Polar)';
}

export interface VSEPRAtom3D {
  element: string;
  name: string;
  banglaName: string;
  x: number;
  y: number;
  z: number;
  color: string;
  radius: number;
  isCentral: boolean;
  formalCharge: number;
  valenceElectrons: number;
  lonePairs: number;
  bondCount: number;
  hybridization: string;
  oxidationState?: string;
}

export interface VSEPRBond3D {
  fromIndex: number;
  toIndex: number;
  order: 1 | 2 | 3;
  type: 'covalent' | 'polar-covalent' | 'ionic' | 'coordinate';
  sigma: number;
  pi: number;
}

export interface UniversalVSEPRResult {
  formula: string;
  formattedFormula: string;
  name: string;
  banglaName: string;
  centralAtom: string;
  ligands: { symbol: string; count: number; name: string }[];
  totalValenceElectrons: number;
  bondingDomains: number;
  lonePairsOnCentral: number;
  stericNumber: number;
  electronGeometry: string;
  banglaElectronGeometry: string;
  molecularGeometry: string;
  banglaMolecularGeometry: string;
  bondAngle: string;
  hybridization: HybridizationType;
  sigmaBonds: number;
  piBonds: number;
  polarity: 'Polar (polar)' | 'Non-Polar (apolar)';
  formalChargesSummary: string;
  resonanceNotes?: string;
  lewisAscii: string;
  atoms3D: VSEPRAtom3D[];
  bonds3D: VSEPRBond3D[];
  valid: boolean;
  unsupportedReason?: string;
}

// Element standard CPK colors and covalent radii (pm)
const CPK_COLORS: Record<string, string> = {
  H: '#ffffff',
  He: '#d9ffff',
  Li: '#cc80ff',
  Be: '#c2ff00',
  B: '#ffb5b5',
  C: '#334155',
  N: '#3b82f6',
  O: '#ef4444',
  F: '#22c55e',
  Ne: '#b3e3f5',
  Na: '#8b5cf6',
  Mg: '#8ae600',
  Al: '#bfa6a6',
  Si: '#f0c8a0',
  P: '#f97316',
  S: '#eab308',
  Cl: '#10b981',
  Ar: '#80d1e3',
  K: '#a855f7',
  Ca: '#6366f1',
  Fe: '#d97706',
  Cu: '#b45309',
  Zn: '#7d80b0',
  Br: '#991b1b',
  I: '#6b21a8',
  Xe: '#0284c7',
};

const ELEMENT_VALENCE_MAP: Record<string, number> = {
  H: 1, He: 2, Li: 1, Be: 2, B: 3, C: 4, N: 5, O: 6, F: 7, Ne: 8,
  Na: 1, Mg: 2, Al: 3, Si: 4, P: 5, S: 6, Cl: 7, Ar: 8,
  K: 1, Ca: 2, Ga: 3, Ge: 4, As: 5, Se: 6, Br: 7, Kr: 8,
  Rb: 1, Sr: 2, In: 3, Sn: 4, Sb: 5, Te: 6, I: 7, Xe: 8,
  Cs: 1, Ba: 2, Tl: 3, Pb: 4, Bi: 5, Po: 6, At: 7, Rn: 8,
};

const ELEMENT_EN_MAP: Record<string, number> = {
  F: 3.98, O: 3.44, Cl: 3.16, N: 3.04, Br: 2.96, I: 2.66, S: 2.58,
  C: 2.55, Se: 2.55, P: 2.19, H: 2.20, B: 2.04, Si: 1.90, As: 2.18,
  Xe: 2.60, Te: 2.10, Sb: 2.05, Ge: 2.01, Al: 1.61, Be: 1.57,
  Mg: 1.31, Ca: 1.00, Li: 0.98, Na: 0.93, K: 0.82, Rb: 0.82, Cs: 0.79,
};

/**
 * Universal Formula Parser that parses chemical formulas with polyatomic ions, charges, and nested parentheses.
 */
export function parseUniversalFormula(rawFormula: string): {
  elements: Record<string, number>;
  netCharge: number;
  cleanFormula: string;
} {
  let str = rawFormula.trim();
  let netCharge = 0;

  // Extract explicit charge like NO3-, CO3^2-, NH4+, Fe3+
  const chargeMatch = str.match(/[\^]?([0-9]*)([+\-])$/);
  if (chargeMatch) {
    const magnitude = chargeMatch[1] ? parseInt(chargeMatch[1], 10) : 1;
    const sign = chargeMatch[2] === '+' ? 1 : -1;
    netCharge = magnitude * sign;
    str = str.replace(/[\^]?([0-9]*)[+\-]$/, '');
  }

  // Handle parentheses expansion e.g. Ca(OH)2 -> CaO2H2, Al2(SO4)3 -> Al2S3O12
  while (str.includes('(') && str.includes(')')) {
    str = str.replace(/\(([^()]+)\)(\d*)/g, (_, inner, countStr) => {
      const factor = countStr ? parseInt(countStr, 10) : 1;
      const innerCounts = parseUniversalFormula(inner).elements;
      let expanded = '';
      for (const [elem, cnt] of Object.entries(innerCounts)) {
        expanded += `${elem}${cnt * factor}`;
      }
      return expanded;
    });
  }

  // Standard element symbol parsing
  const regex = /([A-Z][a-z]*)(\d*)/g;
  const elements: Record<string, number> = {};
  let match;
  while ((match = regex.exec(str)) !== null) {
    const elem = match[1];
    const count = match[2] ? parseInt(match[2], 10) : 1;
    elements[elem] = (elements[elem] || 0) + count;
  }

  return {
    elements,
    netCharge,
    cleanFormula: str,
  };
}

/**
 * Dynamic VSEPR Geometry Analyzer & 3D Structure Generator
 */
export function analyzeUniversalVSEPR(rawFormula: string): UniversalVSEPRResult {
  const { elements, netCharge } = parseUniversalFormula(rawFormula);
  const elementKeys = Object.keys(elements);

  if (elementKeys.length === 0) {
    return {
      formula: rawFormula,
      formattedFormula: rawFormula,
      name: 'Unknown signal',
      banglaName: 'Unknown signal',
      centralAtom: 'C',
      ligands: [],
      totalValenceElectrons: 0,
      bondingDomains: 0,
      lonePairsOnCentral: 0,
      stericNumber: 0,
      electronGeometry: 'Unknown',
      banglaElectronGeometry: 'unknown',
      molecularGeometry: 'Unknown',
      banglaMolecularGeometry: 'unknown',
      bondAngle: '0°',
      hybridization: 'sp³',
      sigmaBonds: 0,
      piBonds: 0,
      polarity: 'Non-Polar (apolar)',
      formalChargesSummary: '',
      lewisAscii: '',
      atoms3D: [],
      bonds3D: [],
      valid: false,
      unsupportedReason: 'No valid component signals were found।',
    };
  }

  // Total Valence Electrons
  let totalValence = -netCharge;
  for (const [elem, count] of Object.entries(elements)) {
    const v = ELEMENT_VALENCE_MAP[elem] || 4;
    totalValence += v * count;
  }

  // Determine Central Atom (Least electronegative, non-hydrogen)
  let central = elementKeys[0];
  if (elementKeys.length > 1) {
    const nonH = elementKeys.filter((e) => e !== 'H');
    if (nonH.length > 0) {
      // Find element with lowest electronegativity, or if counts differ, usually the single atom
      nonH.sort((a, b) => {
        const countA = elements[a];
        const countB = elements[b];
        if (countA !== countB) return countA - countB; // Single atom preferred
        const enA = ELEMENT_EN_MAP[a] || 2.5;
        const enB = ELEMENT_EN_MAP[b] || 2.5;
        return enA - enB; // Lower EN preferred
      });
      central = nonH[0];
    }
  }

  // Calculate ligands
  const ligands: { symbol: string; count: number; name: string }[] = [];
  let totalLigandsCount = 0;
  for (const [elem, count] of Object.entries(elements)) {
    const actualCount = elem === central ? count - 1 : count;
    if (actualCount > 0) {
      const data = ALL_118_ELEMENTS.find((e) => e.symbol === elem);
      ligands.push({
        symbol: elem,
        count: actualCount,
        name: data?.name || elem,
      });
      totalLigandsCount += actualCount;
    }
  }

  // Fallback if diatomic like N2, O2, Cl2, H2
  if (elementKeys.length === 1 && elements[central] === 2) {
    totalLigandsCount = 1;
  }

  // Bonding Domains & Lone Pairs on Central Atom
  const bondingDomains = Math.max(1, totalLigandsCount);
  const centralValence = ELEMENT_VALENCE_MAP[central] || 4;

  // Electrons used in single bonds to ligands
  let electronsInSkeleton = bondingDomains * 2;
  // Terminal octets
  let terminalLoneElectrons = 0;
  ligands.forEach((l) => {
    const terminalV = ELEMENT_VALENCE_MAP[l.symbol] || 7;
    const required = l.symbol === 'H' ? 0 : 8 - 2; // 6 non-bonding electrons for full octet
    terminalLoneElectrons += required * l.count;
  });

  let remainingForCentral = Math.max(0, totalValence - electronsInSkeleton - terminalLoneElectrons);
  let lonePairsOnCentral = Math.floor(remainingForCentral / 2);

  // Correction for known geometries (SF4, SF6, XeF4, ClF3, PCl5, NH3, H2O, CO2, etc.)
  if (central === 'S' && totalLigandsCount === 4 && ligands[0]?.symbol === 'F') lonePairsOnCentral = 1; // SF4
  if (central === 'S' && totalLigandsCount === 6) lonePairsOnCentral = 0; // SF6
  if (central === 'Xe' && totalLigandsCount === 4) lonePairsOnCentral = 2; // XeF4
  if (central === 'Xe' && totalLigandsCount === 2) lonePairsOnCentral = 3; // XeF2
  if (central === 'Cl' && totalLigandsCount === 3) lonePairsOnCentral = 2; // ClF3
  if (central === 'I' && totalLigandsCount === 3) lonePairsOnCentral = 2; // IF3
  if (central === 'Br' && totalLigandsCount === 5) lonePairsOnCentral = 1; // BrF5
  if (central === 'P' && totalLigandsCount === 5) lonePairsOnCentral = 0; // PCl5
  if (central === 'N' && totalLigandsCount === 3 && ligands[0]?.symbol === 'H') lonePairsOnCentral = 1; // NH3
  if (central === 'O' && totalLigandsCount === 2 && ligands[0]?.symbol === 'H') lonePairsOnCentral = 2; // H2O
  if (central === 'C' && totalLigandsCount === 2 && ligands[0]?.symbol === 'O') lonePairsOnCentral = 0; // CO2
  if (central === 'C' && totalLigandsCount === 4) lonePairsOnCentral = 0; // CH4

  const stericNumber = Math.min(7, Math.max(2, bondingDomains + lonePairsOnCentral));

  // Determine VSEPR Geometry Matrix
  let electronGeometry = 'Tetrahedral';
  let banglaElectronGeometry = 'Quaternary';
  let molecularGeometry = 'Tetrahedral';
  let banglaMolecularGeometry = 'Tetrahedral';
  let bondAngle = '109.5°';
  let hybridization: HybridizationType = 'sp³';
  let polarity: 'Polar (polar)' | 'Non-Polar (apolar)' = 'Non-Polar (apolar)';

  if (stericNumber === 2) {
    electronGeometry = 'Linear';
    banglaElectronGeometry = 'linear';
    molecularGeometry = 'Linear';
    banglaMolecularGeometry = 'Linear';
    bondAngle = '180°';
    hybridization = 'sp';
    polarity = 'Non-Polar (apolar)';
  } else if (stericNumber === 3) {
    electronGeometry = 'Trigonal Planar';
    banglaElectronGeometry = 'triangular plane';
    hybridization = 'sp²';
    if (lonePairsOnCentral === 0) {
      molecularGeometry = 'Trigonal Planar';
      banglaMolecularGeometry = 'Trigonal Planar';
      bondAngle = '120°';
      polarity = 'Non-Polar (apolar)';
    } else {
      molecularGeometry = 'Bent (V-shaped)';
      banglaMolecularGeometry = 'Bent / V-shaped';
      bondAngle = '~118°';
      polarity = 'Polar (polar)';
    }
  } else if (stericNumber === 4) {
    electronGeometry = 'Tetrahedral';
    banglaElectronGeometry = 'Quaternary';
    hybridization = 'sp³';
    if (lonePairsOnCentral === 0) {
      molecularGeometry = 'Tetrahedral';
      banglaMolecularGeometry = 'Tetrahedral';
      bondAngle = '109.5°';
      polarity = 'Non-Polar (apolar)';
    } else if (lonePairsOnCentral === 1) {
      molecularGeometry = 'Trigonal Pyramidal';
      banglaMolecularGeometry = 'Trigonal Pyramidal';
      bondAngle = '~107°';
      polarity = 'Polar (polar)';
    } else {
      molecularGeometry = 'Bent (V-shaped)';
      banglaMolecularGeometry = 'Bent / V-shaped';
      bondAngle = '~104.5°';
      polarity = 'Polar (polar)';
    }
  } else if (stericNumber === 5) {
    electronGeometry = 'Trigonal Bipyramidal';
    banglaElectronGeometry = 'Trigonal bipyramidal';
    hybridization = 'sp³d';
    if (lonePairsOnCentral === 0) {
      molecularGeometry = 'Trigonal Bipyramidal';
      banglaMolecularGeometry = 'Trigonal Bipyramidal .';
      bondAngle = '90°, 120°';
      polarity = 'Non-Polar (apolar)';
    } else if (lonePairsOnCentral === 1) {
      molecularGeometry = 'Seesaw';
      banglaMolecularGeometry = 'Seesaw';
      bondAngle = '~102°, ~173°';
      polarity = 'Polar (polar)';
    } else if (lonePairsOnCentral === 2) {
      molecularGeometry = 'T-shaped';
      banglaMolecularGeometry = 'T-shape (T-shaped)';
      bondAngle = '~87.5°';
      polarity = 'Polar (polar)';
    } else {
      molecularGeometry = 'Linear';
      banglaMolecularGeometry = 'Linear';
      bondAngle = '180°';
      polarity = 'Non-Polar (apolar)';
    }
  } else if (stericNumber === 6) {
    electronGeometry = 'Octahedral';
    banglaElectronGeometry = 'Octagonal';
    hybridization = 'sp³d²';
    if (lonePairsOnCentral === 0) {
      molecularGeometry = 'Octahedral';
      banglaMolecularGeometry = 'Octahedral';
      bondAngle = '90°';
      polarity = 'Non-Polar (apolar)';
    } else if (lonePairsOnCentral === 1) {
      molecularGeometry = 'Square Pyramidal';
      banglaMolecularGeometry = 'Square Pyramidal';
      bondAngle = '~84.8°';
      polarity = 'Polar (polar)';
    } else {
      molecularGeometry = 'Square Planar';
      banglaMolecularGeometry = 'Square Planar';
      bondAngle = '90°';
      polarity = 'Non-Polar (apolar)';
    }
  } else if (stericNumber >= 7) {
    electronGeometry = 'Pentagonal Bipyramidal';
    banglaElectronGeometry = 'pentagonal bipyramidal';
    molecularGeometry = 'Pentagonal Bipyramidal';
    banglaMolecularGeometry = 'pentagonal bipyramidal (IF₇)';
    bondAngle = '72°, 90°';
    hybridization = 'sp³d³';
    polarity = 'Non-Polar (apolar)';
  }

  // If ligands are different elements (e.g. CH3Cl), molecular polarity is polar
  if (ligands.length > 1) {
    polarity = 'Polar (polar)';
  }

  // Calculate Sigma & Pi Bonds
  let sigmaBonds = bondingDomains;
  let piBonds = 0;
  if (central === 'C' && totalLigandsCount === 2 && ligands[0]?.symbol === 'O') piBonds = 2; // CO2: O=C=O
  if (central === 'S' && totalLigandsCount === 3 && ligands[0]?.symbol === 'O') piBonds = 3; // SO3
  if (central === 'S' && totalLigandsCount === 2 && ligands[0]?.symbol === 'O') piBonds = 2; // SO2

  // Generate Exact 3D Spatial Vector Coordinates for Ball-and-Stick Rendering
  const atoms3D: VSEPRAtom3D[] = [];
  const bonds3D: VSEPRBond3D[] = [];

  const centralData = ALL_118_ELEMENTS.find((e) => e.symbol === central);
  const centralColor = CPK_COLORS[central] || '#64748b';

  // Central Atom at (0, 0, 0)
  atoms3D.push({
    element: central,
    name: centralData?.name || central,
    banglaName: centralData?.banglaName || central,
    x: 0,
    y: 0,
    z: 0,
    color: centralColor,
    radius: 18,
    isCentral: true,
    formalCharge: 0,
    valenceElectrons: centralValence,
    lonePairs: lonePairsOnCentral,
    bondCount: bondingDomains + piBonds,
    hybridization,
    oxidationState: centralData?.oxidationStates?.split(',')[0],
  });

  // Calculate 3D Direction Vectors according to Geometry
  const vectors: [number, number, number][] = [];
  const BOND_DIST = 55;

  if (stericNumber === 2) {
    // Linear (180°) along X axis
    vectors.push([-BOND_DIST, 0, 0], [BOND_DIST, 0, 0]);
  } else if (stericNumber === 3) {
    // Trigonal planar (120°) in XY plane
    vectors.push(
      [0, BOND_DIST, 0],
      [-BOND_DIST * Math.cos(Math.PI / 6), -BOND_DIST * Math.sin(Math.PI / 6), 0],
      [BOND_DIST * Math.cos(Math.PI / 6), -BOND_DIST * Math.sin(Math.PI / 6), 0]
    );
  } else if (stericNumber === 4) {
    // Tetrahedral (109.5°)
    vectors.push(
      [0, BOND_DIST, 0],
      [-BOND_DIST * 0.94, -BOND_DIST * 0.33, -BOND_DIST * 0.54],
      [BOND_DIST * 0.94, -BOND_DIST * 0.33, -BOND_DIST * 0.54],
      [0, -BOND_DIST * 0.33, BOND_DIST * 0.94]
    );
  } else if (stericNumber === 5) {
    // Trigonal Bipyramidal (Axial: +Y, -Y; Equatorial: 120° in XZ)
    vectors.push(
      [0, BOND_DIST * 1.1, 0], // Axial top
      [0, -BOND_DIST * 1.1, 0], // Axial bottom
      [BOND_DIST, 0, 0], // Equatorial 1
      [-BOND_DIST * 0.5, 0, BOND_DIST * 0.866], // Equatorial 2
      [-BOND_DIST * 0.5, 0, -BOND_DIST * 0.866] // Equatorial 3
    );
  } else if (stericNumber === 6) {
    // Octahedral (±X, ±Y, ±Z)
    vectors.push(
      [0, BOND_DIST, 0],
      [0, -BOND_DIST, 0],
      [BOND_DIST, 0, 0],
      [-BOND_DIST, 0, 0],
      [0, 0, BOND_DIST],
      [0, 0, -BOND_DIST]
    );
  } else {
    // 7 Pentagonal Bipyramidal
    vectors.push(
      [0, BOND_DIST, 0],
      [0, -BOND_DIST, 0],
      [BOND_DIST, 0, 0],
      [BOND_DIST * 0.309, 0, BOND_DIST * 0.951],
      [-BOND_DIST * 0.809, 0, BOND_DIST * 0.587],
      [-BOND_DIST * 0.809, 0, -BOND_DIST * 0.587],
      [BOND_DIST * 0.309, 0, -BOND_DIST * 0.951]
    );
  }

  // Populate ligand atoms at geometric positions
  let vecIdx = 0;
  ligands.forEach((lig) => {
    const ligData = ALL_118_ELEMENTS.find((e) => e.symbol === lig.symbol);
    const color = CPK_COLORS[lig.symbol] || '#94a3b8';
    const radius = lig.symbol === 'H' ? 10 : 14;

    for (let c = 0; c < lig.count; c++) {
      const pos = vectors[vecIdx] || [50, 0, 0];
      vecIdx++;

      const atomIndex = atoms3D.length;
      atoms3D.push({
        element: lig.symbol,
        name: ligData?.name || lig.symbol,
        banglaName: ligData?.banglaName || lig.symbol,
        x: Math.round(pos[0]),
        y: Math.round(pos[1]),
        z: Math.round(pos[2]),
        color,
        radius,
        isCentral: false,
        formalCharge: 0,
        valenceElectrons: ELEMENT_VALENCE_MAP[lig.symbol] || 1,
        lonePairs: lig.symbol === 'H' ? 0 : 3,
        bondCount: 1,
        hybridization: 's',
      });

      bonds3D.push({
        fromIndex: 0,
        toIndex: atomIndex,
        order: piBonds > 0 && c === 0 ? 2 : 1,
        type: 'covalent',
        sigma: 1,
        pi: piBonds > 0 && c === 0 ? 1 : 0,
      });
    }
  });

  // Dynamic ASCII Lewis Structure
  let lewisAscii = '';
  if (stericNumber === 4 && lonePairsOnCentral === 2) {
    lewisAscii = `  ..\n${ligands[0]?.symbol || 'H'}—${central}—${ligands[0]?.symbol || 'H'}\n  ..`;
  } else if (stericNumber === 4 && lonePairsOnCentral === 1) {
    lewisAscii = `  ..\n${ligands[0]?.symbol || 'H'}—${central}—${ligands[0]?.symbol || 'H'}\n  |\n  ${ligands[0]?.symbol || 'H'}`;
  } else if (stericNumber === 4 && lonePairsOnCentral === 0) {
    lewisAscii = `   ${ligands[0]?.symbol || 'H'}\n   |\n${ligands[0]?.symbol || 'H'}—${central}—${ligands[0]?.symbol || 'H'}\n   |\n   ${ligands[0]?.symbol || 'H'}`;
  } else if (stericNumber === 2) {
    lewisAscii = `${ligands[0]?.symbol || 'O'}=${central}=${ligands[0]?.symbol || 'O'}`;
  } else if (stericNumber === 3) {
    lewisAscii = `   ${ligands[0]?.symbol || 'F'}\n   |\n${ligands[0]?.symbol || 'F'}—${central}—${ligands[0]?.symbol || 'F'}`;
  } else {
    lewisAscii = `  [${central}] (${bondingDomains} bonds, ${lonePairsOnCentral} lone pairs)`;
  }

  const nameBangla = centralData ? `${centralData.banglaName} compounds` : rawFormula;

  return {
    formula: rawFormula,
    formattedFormula: rawFormula,
    name: centralData ? `${centralData.name} Compound` : rawFormula,
    banglaName: nameBangla,
    centralAtom: central,
    ligands,
    totalValenceElectrons: totalValence,
    bondingDomains,
    lonePairsOnCentral,
    stericNumber,
    electronGeometry,
    banglaElectronGeometry,
    molecularGeometry,
    banglaMolecularGeometry,
    bondAngle,
    hybridization,
    sigmaBonds,
    piBonds,
    polarity,
    formalChargesSummary: `${central}: 0, ligands: 0`,
    resonanceNotes: piBonds > 0 ? 'Delocalized pi-electrons and resonance structures exist।' : undefined,
    lewisAscii,
    atoms3D,
    bonds3D,
    valid: true,
  };
}
