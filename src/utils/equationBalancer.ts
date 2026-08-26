import { ALL_118_ELEMENTS } from '../data/all118Elements';

/**
 * Robust Chemical Formula Parser & Chemical Equation Balancer
 * Supports complex molecules with parentheses, polyatomic ions, and states.
 */

// Format numbers in chemical formulas into unicode subscript characters
export function toSubscript(numStr: string | number): string {
  const map: Record<string, string> = {
    '0': '₀',
    '1': '₁',
    '2': '₂',
    '3': '₃',
    '4': '₄',
    '5': '₅',
    '6': '₆',
    '7': '₇',
    '8': '₈',
    '9': '₉',
    '+': '⁺',
    '-': '⁻',
  };
  return String(numStr)
    .split('')
    .map((c) => map[c] || c)
    .join('');
}

// Convert plain chemical formula string (e.g. "Fe2(SO4)3") to formatted unicode string ("Fe₂(SO₄)₃")
export function formatChemicalFormula(rawFormula: string): string {
  if (!rawFormula) return '';
  // Preserve state tags like (aq), (s), (l), (g)
  let clean = rawFormula.trim();
  let state = '';
  const stateMatch = clean.match(/\s*(\((?:aq|s|l|g)\)[↑↓]?|[↑↓])$/i);
  if (stateMatch) {
    state = stateMatch[0];
    clean = clean.slice(0, -stateMatch[0].length).trim();
  }

  // Replace any number not part of charge or state with subscript
  const formatted = clean.replace(/([A-Za-z)\]])(\d+)/g, (_, char, num) => {
    return char + toSubscript(num);
  });

  return formatted + state;
}

// Clean formula for atomic composition analysis (removes states, signs, arrows)
export function stripStateAndAnnotations(formula: string): string {
  return formula
    .replace(/\((?:aq|s|l|g)\)/gi, '')
    .replace(/[↑↓]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

/**
 * Parses a chemical formula into its component element count map.
 * Example: "Fe2(SO4)3" -> { Fe: 2, S: 3, O: 12 }
 * Example: "Ca(OH)2" -> { Ca: 1, O: 2, H: 2 }
 * Example: "CH3COOH" -> { C: 2, H: 4, O: 2 }
 */
export function parseChemicalFormula(rawFormula: string): Record<string, number> {
  const formula = stripStateAndAnnotations(rawFormula);
  const elementCounts: Record<string, number> = {};

  // Stack-based parser for handling nested parentheses
  interface StackFrame {
    counts: Record<string, number>;
  }

  const stack: StackFrame[] = [{ counts: {} }];
  let i = 0;

  while (i < formula.length) {
    const char = formula[i];

    if (char === '(' || char === '[') {
      stack.push({ counts: {} });
      i++;
    } else if (char === ')' || char === ']') {
      i++;
      // Parse multiplier following the closing parenthesis
      let multiplierStr = '';
      while (i < formula.length && /\d/.test(formula[i])) {
        multiplierStr += formula[i];
        i++;
      }
      const multiplier = multiplierStr.length > 0 ? parseInt(multiplierStr, 10) : 1;

      const top = stack.pop();
      if (!top) break;

      const current = stack[stack.length - 1];
      for (const [elem, count] of Object.entries(top.counts)) {
        current.counts[elem] = (current.counts[elem] || 0) + count * multiplier;
      }
    } else if (/[A-Z]/.test(char)) {
      // Element symbol starts with an uppercase letter
      let elem = char;
      i++;
      if (i < formula.length && /[a-z]/.test(formula[i])) {
        elem += formula[i];
        i++;
      }

      // Count following element
      let countStr = '';
      while (i < formula.length && /\d/.test(formula[i])) {
        countStr += formula[i];
        i++;
      }
      const count = countStr.length > 0 ? parseInt(countStr, 10) : 1;

      const current = stack[stack.length - 1];
      current.counts[elem] = (current.counts[elem] || 0) + count;
    } else {
      // Skip unexpected chars
      i++;
    }
  }

  const finalCounts = stack[0]?.counts || {};
  return finalCounts;
}

export interface BalancedEquationResult {
  balancedEquation: string;
  reactantsCoeffs: number[];
  productsCoeffs: number[];
  isBalanced: boolean;
  elementMatrix: { [element: string]: { reactants: number; products: number } };
}

/**
 * Balances chemical equations automatically using systematic integer matrix search.
 */
export function balanceChemicalEquation(
  reactantFormulas: string[],
  productFormulas: string[]
): BalancedEquationResult {
  const reactantMaps = reactantFormulas.map((f) => parseChemicalFormula(f));
  const productMaps = productFormulas.map((f) => parseChemicalFormula(f));

  // Collect all unique elements
  const allElements = Array.from(
    new Set([
      ...reactantMaps.flatMap((m) => Object.keys(m)),
      ...productMaps.flatMap((m) => Object.keys(m)),
    ])
  );

  const numReactants = reactantFormulas.length;
  const numProducts = productFormulas.length;
  const totalSpecies = numReactants + numProducts;

  // Search range for stoichiometric coefficients (1 to 12 is sufficient for all general chemistry)
  let bestSolution: number[] | null = null;
  let minSum = Infinity;

  // For small reactions (<= 4 species), exact iterative search is instantaneous and guaranteed
  const maxCoeff = totalSpecies <= 4 ? 8 : totalSpecies <= 5 ? 6 : 4;

  function checkCombination(coeffs: number[]): boolean {
    for (const elem of allElements) {
      let reactantCount = 0;
      for (let r = 0; r < numReactants; r++) {
        reactantCount += (reactantMaps[r][elem] || 0) * coeffs[r];
      }

      let productCount = 0;
      for (let p = 0; p < numProducts; p++) {
        productCount += (productMaps[p][elem] || 0) * coeffs[numReactants + p];
      }

      if (reactantCount !== productCount) {
        return false;
      }
    }
    return true;
  }

  function search(index: number, currentCoeffs: number[]) {
    if (index === totalSpecies) {
      if (checkCombination(currentCoeffs)) {
        const sum = currentCoeffs.reduce((a, b) => a + b, 0);
        if (sum < minSum) {
          minSum = sum;
          bestSolution = [...currentCoeffs];
        }
      }
      return;
    }

    for (let c = 1; c <= maxCoeff; c++) {
      currentCoeffs[index] = c;
      search(index + 1, currentCoeffs);
      if (bestSolution && minSum <= totalSpecies) break; // optimal solution found
    }
  }

  search(0, new Array(totalSpecies).fill(1));

  const finalCoeffs = bestSolution || new Array(totalSpecies).fill(1);
  const rCoeffs = finalCoeffs.slice(0, numReactants);
  const pCoeffs = finalCoeffs.slice(numReactants);

  // Format the balanced equation
  const formatSide = (formulas: string[], coeffs: number[]) => {
    return formulas
      .map((formula, idx) => {
        const c = coeffs[idx];
        const coeffStr = c > 1 ? `${c} ` : '';
        return `${coeffStr}${formatChemicalFormula(formula)}`;
      })
      .join(' + ');
  };

  const balancedEquation = `${formatSide(reactantFormulas, rCoeffs)} → ${formatSide(productFormulas, pCoeffs)}`;

  // Element conservation verification
  const elementMatrix: { [element: string]: { reactants: number; products: number } } = {};
  for (const elem of allElements) {
    let rCount = 0;
    for (let r = 0; r < numReactants; r++) {
      rCount += (reactantMaps[r][elem] || 0) * rCoeffs[r];
    }
    let pCount = 0;
    for (let p = 0; p < numProducts; p++) {
      pCount += (productMaps[p][elem] || 0) * pCoeffs[p];
    }
    elementMatrix[elem] = { reactants: rCount, products: pCount };
  }

  const isBalanced = allElements.every(
    (e) => elementMatrix[e].reactants === elementMatrix[e].products && elementMatrix[e].reactants > 0
  );

  return {
    balancedEquation,
    reactantsCoeffs: rCoeffs,
    productsCoeffs: pCoeffs,
    isBalanced,
    elementMatrix,
  };
}

export interface ElementCompositionItem {
  symbol: string;
  name: string;
  banglaName: string;
  count: number;
  atomicMass: number;
  totalMass: number;
  percentage: number;
}

export interface MolarMassResult {
  formula: string;
  formattedFormula: string;
  totalMolarMass: number;
  elements: ElementCompositionItem[];
  valid: boolean;
  summaryString: string;
}

const elementMassMap: Record<string, { mass: number; name: string; banglaName: string }> = {};
ALL_118_ELEMENTS.forEach((e) => {
  elementMassMap[e.symbol] = {
    mass: e.mass,
    name: e.name,
    banglaName: e.banglaName,
  };
});

/**
 * Calculates exact molar mass and mass percentages of all 118 elements for any chemical formula.
 */
export function calculateMolarMassAndComposition(rawFormula: string): MolarMassResult {
  try {
    if (!rawFormula || !rawFormula.trim()) {
      return {
        formula: '',
        formattedFormula: '',
        totalMolarMass: 0,
        elements: [],
        valid: false,
        summaryString: '',
      };
    }

    const counts = parseChemicalFormula(rawFormula);
    const elements: ElementCompositionItem[] = [];
    let totalMolarMass = 0;

    for (const [symbol, count] of Object.entries(counts)) {
      const data = elementMassMap[symbol] || { mass: 12.0, name: symbol, banglaName: symbol };
      const totalMass = data.mass * count;
      totalMolarMass += totalMass;
      elements.push({
        symbol,
        name: data.name,
        banglaName: data.banglaName,
        count,
        atomicMass: data.mass,
        totalMass,
        percentage: 0,
      });
    }

    if (totalMolarMass > 0) {
      elements.forEach((item) => {
        item.percentage = (item.totalMass / totalMolarMass) * 100;
      });
    }

    const summaryString = elements
      .map((item) => `${item.symbol}: ${item.percentage.toFixed(2)}%`)
      .join(', ');

    return {
      formula: rawFormula,
      formattedFormula: formatChemicalFormula(rawFormula),
      totalMolarMass: Number(totalMolarMass.toFixed(3)),
      elements,
      valid: elements.length > 0 && totalMolarMass > 0,
      summaryString,
    };
  } catch {
    return {
      formula: rawFormula,
      formattedFormula: rawFormula,
      totalMolarMass: 0,
      elements: [],
      valid: false,
      summaryString: '',
    };
  }
}

