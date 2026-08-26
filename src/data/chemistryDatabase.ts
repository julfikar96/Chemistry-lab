/**
 * Canonical Chemistry Database
 * Provides shared scientific data across all platform modules:
 * - Polyatomic Ions & Charges
 * - Standard Reduction Potentials
 * - Common Bond Energies
 * - Gas Constants & Physical Constants
 * - Solubility Rules
 * - Organic Functional Groups
 * - Radioactive Isotopes & Decay Data
 * - Common Compounds with Formulas & Molar Masses
 */

export interface PolyatomicIon {
  formula: string;
  name: string;
  banglaName: string;
  charge: number;
  valency: number;
}

export const POLYATOMIC_IONS: PolyatomicIon[] = [
  { formula: 'NH₄⁺', name: 'Ammonium', banglaName: 'Ammonium', charge: +1, valency: 1 },
  { formula: 'H₃O⁺', name: 'Hydronium', banglaName: 'Hydronium', charge: +1, valency: 1 },
  { formula: 'OH⁻', name: 'Hydroxide', banglaName: 'Hydroxide', charge: -1, valency: 1 },
  { formula: 'NO₃⁻', name: 'Nitrate', banglaName: 'Nitrate', charge: -1, valency: 1 },
  { formula: 'NO₂⁻', name: 'Nitrite', banglaName: 'Nitrite', charge: -1, valency: 1 },
  { formula: 'HCO₃⁻', name: 'Bicarbonate (Hydrogen Carbonate)', banglaName: 'Bicarbonate (Hydrogen Carbonate)', charge: -1, valency: 1 },
  { formula: 'HSO₄⁻', name: 'Bisulfate (Hydrogen Sulfate)', banglaName: 'Bisulfate', charge: -1, valency: 1 },
  { formula: 'HSO₃⁻', name: 'Bisulfite', banglaName: 'Bisulfite', charge: -1, valency: 1 },
  { formula: 'MnO₄⁻', name: 'Permanganate', banglaName: 'Permanganate', charge: -1, valency: 1 },
  { formula: 'ClO⁻', name: 'Hypochlorite', banglaName: 'Hypochlorite', charge: -1, valency: 1 },
  { formula: 'ClO₃⁻', name: 'Chlorate', banglaName: 'Chlorate', charge: -1, valency: 1 },
  { formula: 'ClO₄⁻', name: 'Perchlorate', banglaName: 'Perchlorate', charge: -1, valency: 1 },
  { formula: 'CH₃COO⁻', name: 'Acetate (Ethanoate)', banglaName: 'Acetate (Ethanoate)', charge: -1, valency: 1 },
  { formula: 'CN⁻', name: 'Cyanide', banglaName: 'Cyanide', charge: -1, valency: 1 },
  { formula: 'CO₃²⁻', name: 'Carbonate', banglaName: 'Carbonate', charge: -2, valency: 2 },
  { formula: 'SO₄²⁻', name: 'Sulfate', banglaName: 'Sulphate', charge: -2, valency: 2 },
  { formula: 'SO₃²⁻', name: 'Sulfite', banglaName: 'Sulfite', charge: -2, valency: 2 },
  { formula: 'S₂O₃²⁻', name: 'Thiosulfate', banglaName: 'Thiosulfate', charge: -2, valency: 2 },
  { formula: 'CrO₄²⁻', name: 'Chromate', banglaName: 'chromate', charge: -2, valency: 2 },
  { formula: 'Cr₂O₇²⁻', name: 'Dichromate', banglaName: 'Dichromate', charge: -2, valency: 2 },
  { formula: 'PO₄³⁻', name: 'Phosphate', banglaName: 'Phosphate', charge: -3, valency: 3 },
  { formula: 'PO₃³⁻', name: 'Phosphite', banglaName: 'phosphite', charge: -3, valency: 3 },
];

export interface StandardReductionPotential {
  couple: string;
  reaction: string;
  E0: number; // in Volts
  type: 'strong-reducing' | 'moderate' | 'strong-oxidizing';
}

export const REDUCTION_POTENTIALS_SERIES: StandardReductionPotential[] = [
  { couple: 'Li⁺/Li', reaction: 'Li⁺ + e⁻ → Li', E0: -3.04, type: 'strong-reducing' },
  { couple: 'K⁺/K', reaction: 'K⁺ + e⁻ → K', E0: -2.93, type: 'strong-reducing' },
  { couple: 'Ca²⁺/Ca', reaction: 'Ca²⁺ + 2e⁻ → Ca', E0: -2.87, type: 'strong-reducing' },
  { couple: 'Na⁺/Na', reaction: 'Na⁺ + e⁻ → Na', E0: -2.71, type: 'strong-reducing' },
  { couple: 'Mg²⁺/Mg', reaction: 'Mg²⁺ + 2e⁻ → Mg', E0: -2.37, type: 'strong-reducing' },
  { couple: 'Al³⁺/Al', reaction: 'Al³⁺ + 3e⁻ → Al', E0: -1.66, type: 'strong-reducing' },
  { couple: 'Mn²⁺/Mn', reaction: 'Mn²⁺ + 2e⁻ → Mn', E0: -1.18, type: 'strong-reducing' },
  { couple: 'Zn²⁺/Zn', reaction: 'Zn²⁺ + 2e⁻ → Zn', E0: -0.76, type: 'strong-reducing' },
  { couple: 'Cr³⁺/Cr', reaction: 'Cr³⁺ + 3e⁻ → Cr', E0: -0.74, type: 'moderate' },
  { couple: 'Fe²⁺/Fe', reaction: 'Fe²⁺ + 2e⁻ → Fe', E0: -0.44, type: 'moderate' },
  { couple: 'Ni²⁺/Ni', reaction: 'Ni²⁺ + 2e⁻ → Ni', E0: -0.25, type: 'moderate' },
  { couple: 'Sn²⁺/Sn', reaction: 'Sn²⁺ + 2e⁻ → Sn', E0: -0.14, type: 'moderate' },
  { couple: 'Pb²⁺/Pb', reaction: 'Pb²⁺ + 2e⁻ → Pb', E0: -0.13, type: 'moderate' },
  { couple: '2H⁺/H₂ (SHE)', reaction: '2H⁺ + 2e⁻ → H₂', E0: 0.00, type: 'moderate' },
  { couple: 'Cu²⁺/Cu', reaction: 'Cu²⁺ + 2e⁻ → Cu', E0: +0.34, type: 'moderate' },
  { couple: 'I₂/2I⁻', reaction: 'I₂ + 2e⁻ → 2I⁻', E0: +0.54, type: 'strong-oxidizing' },
  { couple: 'Fe³⁺/Fe²⁺', reaction: 'Fe³⁺ + e⁻ → Fe²⁺', E0: +0.77, type: 'strong-oxidizing' },
  { couple: 'Ag⁺/Ag', reaction: 'Ag⁺ + e⁻ → Ag', E0: +0.80, type: 'strong-oxidizing' },
  { couple: 'Br₂/2Br⁻', reaction: 'Br₂ + 2e⁻ → 2Br⁻', E0: +1.07, type: 'strong-oxidizing' },
  { couple: 'O₂ + 4H⁺/2H₂O', reaction: 'O₂ + 4H⁺ + 4e⁻ → 2H₂O', E0: +1.23, type: 'strong-oxidizing' },
  { couple: 'Cr₂O₇²⁻ + 14H⁺/2Cr³⁺', reaction: 'Cr₂O₇²⁻ + 14H⁺ + 6e⁻ → 2Cr³⁺ + 7H₂O', E0: +1.33, type: 'strong-oxidizing' },
  { couple: 'Cl₂/2Cl⁻', reaction: 'Cl₂ + 2e⁻ → 2Cl⁻', E0: +1.36, type: 'strong-oxidizing' },
  { couple: 'MnO₄⁻ + 8H⁺/Mn²⁺', reaction: 'MnO₄⁻ + 8H⁺ + 5e⁻ → Mn²⁺ + 4H₂O', E0: +1.51, type: 'strong-oxidizing' },
  { couple: 'F₂/2F⁻', reaction: 'F₂ + 2e⁻ → 2F⁻', E0: +2.87, type: 'strong-oxidizing' },
];

export interface BondEnergy {
  bond: string;
  energy: number; // in kJ/mol
  type: 'single' | 'double' | 'triple';
}

export const COMMON_BOND_ENERGIES: BondEnergy[] = [
  { bond: 'H-H', energy: 436, type: 'single' },
  { bond: 'C-H', energy: 414, type: 'single' },
  { bond: 'C-C', energy: 347, type: 'single' },
  { bond: 'C=C', energy: 614, type: 'double' },
  { bond: 'C≡C', energy: 839, type: 'triple' },
  { bond: 'C-O', energy: 358, type: 'single' },
  { bond: 'C=O', energy: 745, type: 'double' },
  { bond: 'C=O (in CO₂)', energy: 799, type: 'double' },
  { bond: 'O-H', energy: 464, type: 'single' },
  { bond: 'O=O', energy: 498, type: 'double' },
  { bond: 'N-H', energy: 391, type: 'single' },
  { bond: 'N-N', energy: 163, type: 'single' },
  { bond: 'N≡N', energy: 945, type: 'triple' },
  { bond: 'H-Cl', energy: 431, type: 'single' },
  { bond: 'H-Br', energy: 366, type: 'single' },
  { bond: 'H-I', energy: 298, type: 'single' },
  { bond: 'Cl-Cl', energy: 243, type: 'single' },
  { bond: 'Br-Br', energy: 193, type: 'single' },
  { bond: 'I-I', energy: 151, type: 'single' },
  { bond: 'C-Cl', energy: 339, type: 'single' },
];

export interface OrganicFunctionalGroup {
  id: string;
  name: string;
  banglaName: string;
  generalFormula: string;
  prefixOrSuffix: string;
  exampleName: string;
  exampleFormula: string;
  exampleBangla: string;
  descriptionBangla: string;
}

export const ORGANIC_FUNCTIONAL_GROUPS: OrganicFunctionalGroup[] = [
  {
    id: 'alkane',
    name: 'Alkane',
    banglaName: 'Alkanes (saturated hydrocarbons)',
    generalFormula: 'C_n H_{2n+2}',
    prefixOrSuffix: '-ane (-others)',
    exampleName: 'Methane (methane)',
    exampleFormula: 'CH₄',
    exampleBangla: 'The main component of natural gas',
    descriptionBangla: 'A saturated hydrocarbon with carbon-carbon single bonds। Also known as paraffin।',
  },
  {
    id: 'alkene',
    name: 'Alkene',
    banglaName: 'alkyne (unsaturated double bond)',
    generalFormula: 'C_n H_{2n}',
    prefixOrSuffix: '-ene (-in)',
    exampleName: 'Ethene (ethene)',
    exampleFormula: 'C₂H₄ / CH₂=CH₂',
    exampleBangla: 'Used for ripening fruits and making polythene',
    descriptionBangla: 'Carbon-carbon is an unsaturated hydrocarbon with at least one double bond (C=C).। known as olefins।',
  },
  {
    id: 'alkyne',
    name: 'Alkyne',
    banglaName: 'Alkynes (unsaturated triple bonds)',
    generalFormula: 'C_n H_{2n-2}',
    prefixOrSuffix: '-yne (-law)',
    exampleName: 'Ethyne / Acetylene (acetylene)',
    exampleFormula: 'C₂H₂ / HC≡CH',
    exampleBangla: 'Used in metal welding in oxygen-acetylene flame',
    descriptionBangla: 'carbon-carbon triple bond (C≡C) A highly reactive unsaturated hydrocarbon।',
  },
  {
    id: 'alcohol',
    name: 'Alcohol',
    banglaName: 'Alcohol (-OH group)',
    generalFormula: 'R-OH (C_n H_{2n+1}OH)',
    prefixOrSuffix: '-ol (-all)',
    exampleName: 'Ethanol (ethanol)',
    exampleFormula: 'C₂H₅OH',
    exampleBangla: 'Hand sanitizers and organic solvents',
    descriptionBangla: 'A compound in which one or more hydrogen atoms of a hydrocarbon is replaced by a hydroxyl (-OH) radical।',
  },
  {
    id: 'aldehyde',
    name: 'Aldehyde',
    banglaName: 'Aldehyde (-CHO group)',
    generalFormula: 'R-CHO',
    prefixOrSuffix: '-al (-ale)',
    exampleName: 'Methanal / Formaldehyde (formalin)',
    exampleFormula: 'HCHO',
    exampleBangla: 'In preservation of organism specimens (40% aqueous solution)',
    descriptionBangla: 'A functional radical with at least one hydrogen attached to the carbonyl carbon (-CHO)।',
  },
  {
    id: 'ketone',
    name: 'Ketone',
    banglaName: 'ketone (>C=O group)',
    generalFormula: 'R-CO-R\'',
    prefixOrSuffix: '-one (-he)',
    exampleName: 'Propanone / Acetone (acetone)',
    exampleFormula: 'CH₃COCH₃',
    exampleBangla: 'Nail polish remover and laboratory solvent',
    descriptionBangla: 'of the carbonyl group (>C=O) Compounds with alkyl or aryl radicals on both sides।',
  },
  {
    id: 'carboxylic_acid',
    name: 'Carboxylic Acid',
    banglaName: 'Carboxylic acid (-COOH group)',
    generalFormula: 'R-COOH',
    prefixOrSuffix: '-oic acid (-(oic acid)',
    exampleName: 'Ethanoic Acid / Acetic Acid (vinegar)',
    exampleFormula: 'CH₃COOH',
    exampleBangla: 'In ritual and food preservation (6-10% vinegar)',
    descriptionBangla: 'Weak organic acids with a carboxyl (-COOH) group are partial H in aqueous solution⁺ ion gives।',
  },
  {
    id: 'ester',
    name: 'Ester',
    banglaName: 'Ester (-COO- group)',
    generalFormula: 'R-COO-R\'',
    prefixOrSuffix: '-oate (-ayet)',
    exampleName: 'Ethyl ethanoate (ethyl ethanoate)',
    exampleFormula: 'CH₃COOC₂H₅',
    exampleBangla: 'Sweet scented artificial flavors and perfumes',
    descriptionBangla: 'A sweet-smelling organic compound produced by the reduction reaction of acids and alcohols।',
  },
  {
    id: 'ether',
    name: 'Ether',
    banglaName: 'Ether (-O- group)',
    generalFormula: 'R-O-R\'',
    prefixOrSuffix: 'alkoxy alkane',
    exampleName: 'Diethyl ether ((di-ethyl ether)',
    exampleFormula: 'C₂H₅-O-C₂H₅',
    exampleBangla: 'Anesthetics and solvents',
    descriptionBangla: 'Compounds with two alkyl groups attached to an oxygen atom।',
  },
  {
    id: 'amine',
    name: 'Amine',
    banglaName: 'Amine (-NH₂ group)',
    generalFormula: 'R-NH₂',
    prefixOrSuffix: '-amine (-amine)',
    exampleName: 'Methylamine (methylamine)',
    exampleFormula: 'CH₃NH₂',
    exampleBangla: 'Used in making medicine and dyes',
    descriptionBangla: 'Ammonia (NH₃) from one or more hydrogen substituted alkaline organic compounds।',
  },
  {
    id: 'haloalkane',
    name: 'Haloalkane',
    banglaName: 'Haloalkane / Alkyl Halide (-X)',
    generalFormula: 'R-X (X = F, Cl, Br, I)',
    prefixOrSuffix: 'halo-',
    exampleName: 'Chloroform (trichloromethane)',
    exampleFormula: 'CHCl₃',
    exampleBangla: 'Antipsychotics and solvents',
    descriptionBangla: 'Compounds in which hydrogen from alkanes is substituted by halides।',
  },
];

export interface RadioactiveIsotope {
  symbol: string;
  name: string;
  banglaName: string;
  halfLife: string;
  halfLifeSeconds: number;
  decayMode: 'Alpha (α)' | 'Beta (β⁻)' | 'Beta (β⁺)' | 'Gamma (γ)' | 'Fission';
  decayEquation: string;
  usesBangla: string;
  hazardBangla: string;
}

export const RADIOACTIVE_ISOTOPES: RadioactiveIsotope[] = [
  {
    symbol: '¹⁴C',
    name: 'Carbon-14',
    banglaName: 'Carbon-14',
    halfLife: '5,730 year',
    halfLifeSeconds: 5730 * 365.25 * 86400,
    decayMode: 'Beta (β⁻)',
    decayEquation: '¹⁴₆C → ¹⁴₇N + ⁰₋₁e + ν̄',
    usesBangla: 'Radiocarbon Dating of Ancient Fossils, Archeological Artifacts and Mummies।',
    hazardBangla: 'Mild beta emitter, internal penetration hazard।',
  },
  {
    symbol: '⁶⁰Co',
    name: 'Cobalt-60',
    banglaName: 'Cobalt-60',
    halfLife: '5.27 year',
    halfLifeSeconds: 5.27 * 365.25 * 86400,
    decayMode: 'Beta (β⁻)',
    decayEquation: '⁶⁰₂₇Co → ⁶⁰₂₈Ni + ⁰₋₁e + 2γ (high energy gamma rays)',
    usesBangla: 'Destruction of cancer tumors (radiotherapy) and sterilization of surgical instruments।',
    hazardBangla: 'Emitters of high energy gamma rays that cause severe damage to living organisms।',
  },
  {
    symbol: '¹³¹I',
    name: 'Iodine-131',
    banglaName: 'Iodine-131',
    halfLife: '8.02 day',
    halfLifeSeconds: 8.02 * 86400,
    decayMode: 'Beta (β⁻)',
    decayEquation: '¹³¹₅₃I → ¹³¹₅₄Xe + ⁰₋₁e + γ',
    usesBangla: 'Tracers used in the diagnosis and treatment of thyroid cancer and goitre।',
    hazardBangla: 'May accumulate in the thyroid and cause damage।',
  },
  {
    symbol: '⁹⁹ᵐTc',
    name: 'Technetium-99m',
    banglaName: 'Technetium-99M',
    halfLife: '6.0 bell',
    halfLifeSeconds: 6 * 3600,
    decayMode: 'Gamma (γ)',
    decayEquation: '⁹⁹ᵐ₄₃Tc → ⁹⁹₄₃Tc + γ (140 keV)',
    usesBangla: 'The most widely used isotope in the world for heart, brain, lung and bone scans and diagnosis।',
    hazardBangla: 'Relatively safe for the patient due to short life span।',
  },
  {
    symbol: '²³⁵U',
    name: 'Uranium-235',
    banglaName: 'Uranium-235',
    halfLife: '7.04 × 10⁸ year',
    halfLifeSeconds: 7.04e8 * 365.25 * 86400,
    decayMode: 'Alpha (α)',
    decayEquation: '²³⁵₉₂U + ¹₀n → ¹⁴¹₅₆Ba + ⁹²₃₆Kr + 3¹₀n + 200 MeV',
    usesBangla: 'Electricity generation at Rooppur Nuclear Power Station and Nuclear Reactor।',
    hazardBangla: 'Alpha emitters and deadly radioactive heavy metals।',
  },
  {
    symbol: '²³⁸U',
    name: 'Uranium-238',
    banglaName: 'Uranium-238',
    halfLife: '4.468 × 10⁹ year',
    halfLifeSeconds: 4.468e9 * 365.25 * 86400,
    decayMode: 'Alpha (α)',
    decayEquation: '²³⁸₉₂U → ²³⁴₉₀Th + ⁴₂He',
    usesBangla: "Used to determine Earth's rocks and geological age।",
    hazardBangla: 'Long-lived radioactive material।',
  },
  {
    symbol: '²²⁶Ra',
    name: 'Radium-226',
    banglaName: 'Radium-226',
    halfLife: '1,600 year',
    halfLifeSeconds: 1600 * 365.25 * 86400,
    decayMode: 'Alpha (α)',
    decayEquation: '²²⁶₈₈Ra → ²²²₈₆Rn + ⁴₂He + γ',
    usesBangla: 'Discovered by Madame Curie; Historically, radioluminescent clocks were used।',
    hazardBangla: 'As calcium accumulates in the bones, it causes serious cancer।',
  },
  {
    symbol: '³H (Tritium)',
    name: 'Tritium (Hydrogen-3)',
    banglaName: 'Tritium (Hydrogen-3)',
    halfLife: '12.32 year',
    halfLifeSeconds: 12.32 * 365.25 * 86400,
    decayMode: 'Beta (β⁻)',
    decayEquation: '³₁H → ³₂He + ⁰₋₁e',
    usesBangla: 'Self-illuminated emergency signage and fuel in nuclear fusion research।',
    hazardBangla: 'emits low-energy beta।',
  },
];

export interface SolubilityRule {
  category: string;
  soluble: string;
  exceptions: string;
  banglaRule: string;
}

export const SOLUBILITY_RULES: SolubilityRule[] = [
  {
    category: 'Group-1 and ammonium salts',
    soluble: 'All Li⁺, Na⁺, K⁺, Rb⁺, Cs⁺ and NH₄⁺ salt',
    exceptions: 'No common exceptions (always soluble)',
    banglaRule: 'All salts of alkali metals (Group 1) and ammonium ions are completely soluble in water।',
  },
  {
    category: 'Nitrate and Acetate',
    soluble: 'All NO₃⁻, CH₃COO⁻ and ClO₄⁻',
    exceptions: 'There are no exceptions',
    banglaRule: 'All salts containing nitrate and acetate are highly soluble in water।',
  },
  {
    category: 'Halide (Cl⁻, Br⁻, I⁻)',
    soluble: 'Most chlorides, bromides and iodides',
    exceptions: 'Ag⁺, Pb²⁺, Hg₂²⁺ (Eg: AgCl, PbI₂ (water-insoluble precipitates)',
    banglaRule: 'AgCl (white), PbI₂ (bright yellow) and AgI precipitates down as insoluble।',
  },
  {
    category: 'Sulfate (SO₄²⁻)',
    soluble: 'Most sulfates are salts',
    exceptions: 'BaSO₄, PbSO₄, CaSO₄, SrSO₄, Ag₂SO₄ (insoluble in water)',
    banglaRule: 'Barium sulfate (BaSO₄) Forms a heavy white precipitate which is also insoluble in acid।',
  },
  {
    category: 'Carbonate and Phosphate (CO₃²⁻, PO₄³⁻)',
    soluble: 'Group-1 and NH only₄⁺ Its salts are soluble',
    exceptions: 'All other metal carbonates and phosphates are insoluble (eg CaCO₃, BaCO₃)',
    banglaRule: 'Calcium carbonate (CaCO₃ / Limestone) white bottom insoluble in water।',
  },
  {
    category: 'Hydroxides and oxides (OH⁻, O²⁻)',
    soluble: 'Group-I, Ba(OH)₂, Sr(OH)₂ soluble; Ca(OH)₂ Mildly soluble',
    exceptions: 'Fe(OH)₃ (reddish brown), Cu(OH)₂ (light blue), Al(OH)₃ (white glue)',
    banglaRule: 'Hydroxides of most transition metals form colored insoluble precipitates।',
  },
  {
    category: 'Sulfide (S²⁻)',
    soluble: 'Group-1, Group-2 and NH₄⁺ Its sulphide',
    exceptions: 'ZnS (White), CuS (Black), PbS (Black), FeS (Black)',
    banglaRule: 'Heavy metal sulfides form dark colored insoluble precipitates।',
  },
];
