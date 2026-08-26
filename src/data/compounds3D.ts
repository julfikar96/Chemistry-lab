import { MoleculeData } from '../components/Molecule3DView';

export const COMMON_COMPOUNDS_3D: MoleculeData[] = [
  {
    id: 'h2o', formula: 'H₂O', name: 'Water', banglaName: 'the water',
    atoms: [
      { elem: 'O', pos: [0, 0.3, 0] },
      { elem: 'H', pos: [-0.8, -0.4, 0] },
      { elem: 'H', pos: [0.8, -0.4, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }, { from: 0, to: 2, type: 1 }]
  },
  {
    id: 'co2', formula: 'CO₂', name: 'Carbon Dioxide', banglaName: 'carbon dioxide',
    atoms: [
      { elem: 'C', pos: [0, 0, 0] },
      { elem: 'O', pos: [-1.2, 0, 0] },
      { elem: 'O', pos: [1.2, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 2 }]
  },
  {
    id: 'nh3', formula: 'NH₃', name: 'Ammonia', banglaName: 'Ammonia',
    atoms: [
      { elem: 'N', pos: [0, 0.4, 0] },
      { elem: 'H', pos: [-0.8, -0.2, 0.46] },
      { elem: 'H', pos: [0.8, -0.2, 0.46] },
      { elem: 'H', pos: [0, -0.2, -0.92] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }]
  },
  {
    id: 'ch4', formula: 'CH₄', name: 'Methane', banglaName: 'methane',
    atoms: [
      { elem: 'C', pos: [0, 0, 0] },
      { elem: 'H', pos: [0, 1.09, 0] },
      { elem: 'H', pos: [1.03, -0.36, 0] },
      { elem: 'H', pos: [-0.51, -0.36, -0.89] },
      { elem: 'H', pos: [-0.51, -0.36, 0.89] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }, { from: 0, to: 4, type: 1 }]
  },
  {
    id: 'so4', formula: 'SO₄²⁻', name: 'Sulfate Radical', banglaName: 'Sulfate compounds',
    atoms: [
      { elem: 'S', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.4, 0] },
      { elem: 'O', pos: [1.3, -0.5, 0] },
      { elem: 'O', pos: [-0.65, -0.5, -1.1] },
      { elem: 'O', pos: [-0.65, -0.5, 1.1] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 2 }, { from: 0, to: 3, type: 1 }, { from: 0, to: 4, type: 1 }]
  },
  {
    id: 'no3', formula: 'NO₃⁻', name: 'Nitrate Radical', banglaName: 'Nitrate compounds',
    atoms: [
      { elem: 'N', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.2, 0] },
      { elem: 'O', pos: [-1.04, -0.6, 0] },
      { elem: 'O', pos: [1.04, -0.6, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }]
  },
  {
    id: 'co3', formula: 'CO₃²⁻', name: 'Carbonate Radical', banglaName: 'Carbonate compounds',
    atoms: [
      { elem: 'C', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.2, 0] },
      { elem: 'O', pos: [-1.04, -0.6, 0] },
      { elem: 'O', pos: [1.04, -0.6, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }]
  },
  {
    id: 'hcl', formula: 'HCl', name: 'Hydrochloric Acid', banglaName: 'Hydrochloric acid',
    atoms: [
      { elem: 'H', pos: [-1, 0, 0] },
      { elem: 'Cl', pos: [0.5, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }]
  },
  {
    id: 'nacl', formula: 'NaCl', name: 'Sodium Chloride', banglaName: 'Sodium chloride',
    atoms: [
      { elem: 'Na', pos: [-1, 0, 0] },
      { elem: 'Cl', pos: [1, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }]
  },
  {
    id: 'c2h5oh', formula: 'C₂H₅OH', name: 'Ethanol', banglaName: 'Ethanol',
    atoms: [
      { elem: 'C', pos: [-0.6, -0.2, 0] },
      { elem: 'C', pos: [0.6, 0.4, 0] },
      { elem: 'O', pos: [1.8, -0.4, 0] },
      { elem: 'H', pos: [-0.6, -1.2, 0] },
      { elem: 'H', pos: [-1.2, 0.2, 0.8] },
      { elem: 'H', pos: [-1.2, 0.2, -0.8] },
      { elem: 'H', pos: [0.6, 1.0, 0.8] },
      { elem: 'H', pos: [0.6, 1.0, -0.8] },
      { elem: 'H', pos: [2.5, 0.2, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 }, { from: 1, to: 2, type: 1 },
      { from: 0, to: 3, type: 1 }, { from: 0, to: 4, type: 1 }, { from: 0, to: 5, type: 1 },
      { from: 1, to: 6, type: 1 }, { from: 1, to: 7, type: 1 },
      { from: 2, to: 8, type: 1 }
    ]
  },
  {
    id: 'h2so4', formula: 'H₂SO₄', name: 'Sulfuric Acid', banglaName: 'Sulfuric acid',
    atoms: [
      { elem: 'S', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.4, 0] },
      { elem: 'O', pos: [0, -1.4, 0] },
      { elem: 'O', pos: [1.2, 0, 0] },
      { elem: 'O', pos: [-1.2, 0, 0] },
      { elem: 'H', pos: [1.9, 0.5, 0] },
      { elem: 'H', pos: [-1.9, -0.5, 0] }
    ],
    bonds: [
      { from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 2 }, 
      { from: 0, to: 3, type: 1 }, { from: 0, to: 4, type: 1 },
      { from: 3, to: 5, type: 1 }, { from: 4, to: 6, type: 1 }
    ]
  },
  {
    id: 'oh', formula: 'OH⁻', name: 'Hydroxide Radical', banglaName: 'Hydroxide compounds',
    atoms: [
      { elem: 'O', pos: [-0.4, 0, 0] },
      { elem: 'H', pos: [0.5, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }]
  },
  {
    id: 'nh4', formula: 'NH₄⁺', name: 'Ammonium Radical', banglaName: 'Ammonium compounds',
    atoms: [
      { elem: 'N', pos: [0, 0, 0] },
      { elem: 'H', pos: [0, 1.09, 0] },
      { elem: 'H', pos: [1.03, -0.36, 0] },
      { elem: 'H', pos: [-0.51, -0.36, -0.89] },
      { elem: 'H', pos: [-0.51, -0.36, 0.89] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }, { from: 0, to: 4, type: 1 }]
  },
  {
    id: 'hco3', formula: 'HCO₃⁻', name: 'Bicarbonate Radical', banglaName: 'Bicarbonate compounds',
    atoms: [
      { elem: 'C', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.2, 0] },
      { elem: 'O', pos: [-1.04, -0.6, 0] },
      { elem: 'O', pos: [1.04, -0.6, 0] },
      { elem: 'H', pos: [1.8, -0.1, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }, { from: 3, to: 4, type: 1 }]
  },
  {
    id: 'po4', formula: 'PO₄³⁻', name: 'Phosphate Radical', banglaName: 'Phosphate compounds',
    atoms: [
      { elem: 'P', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.4, 0] },
      { elem: 'O', pos: [1.3, -0.5, 0] },
      { elem: 'O', pos: [-0.65, -0.5, -1.1] },
      { elem: 'O', pos: [-0.65, -0.5, 1.1] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }, { from: 0, to: 4, type: 1 }]
  }
];

export const MORE_COMPOUNDS: MoleculeData[] = [
  {
    id: 'hno3', formula: 'HNO₃', name: 'Nitric Acid', banglaName: 'Nitric acid',
    atoms: [
      { elem: 'N', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.2, 0] },
      { elem: 'O', pos: [-1.04, -0.6, 0] },
      { elem: 'O', pos: [1.04, -0.6, 0] },
      { elem: 'H', pos: [1.8, -0.1, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }, { from: 3, to: 4, type: 1 }]
  },
  {
    id: 'h3po4', formula: 'H₃PO₄', name: 'Phosphoric Acid', banglaName: 'Phosphoric acid',
    atoms: [
      { elem: 'P', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.4, 0] },
      { elem: 'O', pos: [1.3, -0.5, 0] },
      { elem: 'O', pos: [-0.65, -0.5, -1.1] },
      { elem: 'O', pos: [-0.65, -0.5, 1.1] },
      { elem: 'H', pos: [2.1, 0.1, 0] },
      { elem: 'H', pos: [-1.0, 0.1, -1.8] },
      { elem: 'H', pos: [-1.0, 0.1, 1.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }, { from: 0, to: 4, type: 1 },
      { from: 2, to: 5, type: 1 }, { from: 3, to: 6, type: 1 }, { from: 4, to: 7, type: 1 }
    ]
  },
  {
    id: 'naoh', formula: 'NaOH', name: 'Sodium Hydroxide', banglaName: 'Sodium hydroxide',
    atoms: [
      { elem: 'Na', pos: [-1.2, 0, 0] },
      { elem: 'O', pos: [0.5, 0, 0] },
      { elem: 'H', pos: [1.4, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }, { from: 1, to: 2, type: 1 }]
  },
  {
    id: 'koh', formula: 'KOH', name: 'Potassium Hydroxide', banglaName: 'Potassium hydroxide',
    atoms: [
      { elem: 'K', pos: [-1.2, 0, 0] },
      { elem: 'O', pos: [0.6, 0, 0] },
      { elem: 'H', pos: [1.5, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }, { from: 1, to: 2, type: 1 }]
  },
  {
    id: 'cao', formula: 'CaO', name: 'Calcium Oxide', banglaName: 'Calcium oxide (lime)',
    atoms: [
      { elem: 'Ca', pos: [-0.8, 0, 0] },
      { elem: 'O', pos: [0.8, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }]
  },
  {
    id: 'caoh2', formula: 'Ca(OH)₂', name: 'Calcium Hydroxide', banglaName: 'Calcium hydroxide (lime water)',
    atoms: [
      { elem: 'Ca', pos: [0, 0, 0] },
      { elem: 'O', pos: [-1.5, 0, 0] },
      { elem: 'H', pos: [-2.4, 0, 0] },
      { elem: 'O', pos: [1.5, 0, 0] },
      { elem: 'H', pos: [2.4, 0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 1 }, { from: 1, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }, { from: 3, to: 4, type: 1 }]
  },
  {
    id: 'caco3', formula: 'CaCO₃', name: 'Calcium Carbonate', banglaName: 'Calcium carbonate (limestone)',
    atoms: [
      { elem: 'C', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.2, 0] },
      { elem: 'O', pos: [-1.04, -0.6, 0] },
      { elem: 'O', pos: [1.04, -0.6, 0] },
      { elem: 'Ca', pos: [0, -2.0, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }, { from: 4, to: 2, type: 1 }, { from: 4, to: 3, type: 1 }]
  },
  {
    id: 'ch3cooh', formula: 'CH₃COOH', name: 'Ethanoic Acid', banglaName: 'Ethanoic Acid (Vinegar)',
    atoms: [
      { elem: 'C', pos: [-0.8, 0, 0] },
      { elem: 'C', pos: [0.7, 0, 0] },
      { elem: 'O', pos: [1.3, 1.0, 0] },
      { elem: 'O', pos: [1.5, -1.0, 0] },
      { elem: 'H', pos: [2.4, -0.8, 0] },
      { elem: 'H', pos: [-1.2, 0.9, 0] },
      { elem: 'H', pos: [-1.2, -0.4, 0.8] },
      { elem: 'H', pos: [-1.2, -0.4, -0.8] }
    ],
    bonds: [
      { from: 0, to: 1, type: 1 }, { from: 1, to: 2, type: 2 }, { from: 1, to: 3, type: 1 },
      { from: 3, to: 4, type: 1 }, { from: 0, to: 5, type: 1 }, { from: 0, to: 6, type: 1 }, { from: 0, to: 7, type: 1 }
    ]
  },
  {
    id: 'so3', formula: 'SO₃²⁻', name: 'Sulfite Radical', banglaName: 'Sulfite compounds',
    atoms: [
      { elem: 'S', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.2, 0] },
      { elem: 'O', pos: [-1.04, -0.6, 0] },
      { elem: 'O', pos: [1.04, -0.6, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }, { from: 0, to: 3, type: 1 }]
  },
  {
    id: 'no2', formula: 'NO₂⁻', name: 'Nitrite Radical', banglaName: 'Nitrite compounds',
    atoms: [
      { elem: 'N', pos: [0, 0, 0] },
      { elem: 'O', pos: [-1.0, 0.6, 0] },
      { elem: 'O', pos: [1.0, 0.6, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 1 }]
  },
  {
    id: 'cuso4', formula: 'CuSO₄', name: 'Copper Sulfate', banglaName: 'Copper sulfate (mulberry)',
    atoms: [
      { elem: 'S', pos: [0, 0, 0] },
      { elem: 'O', pos: [0, 1.4, 0] },
      { elem: 'O', pos: [1.3, -0.5, 0] },
      { elem: 'O', pos: [-0.65, -0.5, -1.1] },
      { elem: 'O', pos: [-0.65, -0.5, 1.1] },
      { elem: 'Cu', pos: [2.5, 0.5, 0] }
    ],
    bonds: [{ from: 0, to: 1, type: 2 }, { from: 0, to: 2, type: 2 }, { from: 0, to: 3, type: 1 }, { from: 0, to: 4, type: 1 }, { from: 5, to: 2, type: 1 }]
  }
];

COMMON_COMPOUNDS_3D.push(...MORE_COMPOUNDS);
