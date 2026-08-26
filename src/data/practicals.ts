import { PracticalExperiment } from '../types';

export const NCTB_CLASS_9_10_PRACTICALS: PracticalExperiment[] = [
  {
    id: 'exp_neutralization',
    title: 'Neutralization of HCl and NaOH with Temperature Change',
    banglaTitle: 'Reduction reaction of sodium hydroxide and hydrochloric acid and observation of temperature change',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 8: Chemistry and Energy / Practical Chemistry',
    objective:
      'Perform the reduction reaction by mixing certain amounts of dilute hydrochloric acid (HCl) and sodium hydroxide (NaOH) in a beaker, measuring the rise in temperature and determining the change in pH.।',
    theory:
      'The chemical reaction in which certain amount of acid and certain amount of base react with each other to form neutral salt and water by eliminating the properties of acid and base is called reduction reaction.। The heat of neutralization of strong acids and strong bases is always constant and has a value of -57.34 kJ/mol.।',
    principle: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) + heat (ΔH = -57.3 kJ/mol)',
    apparatus: [
      '500 ml beaker',
      'Digital Thermometer (Thermometer)',
      'Measuring Cylinder',
      'Dropper',
      'Glass Stirring Rod',
      'Digital pH meter',
    ],
    chemicals: [
      { chemicalId: 'hcl', requiredAmount: '25 mL (1.0 M HCl)' },
      { chemicalId: 'naoh', requiredAmount: '25 mL (1.0 M NaOH)' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Prepare beaker and record initial temperature',
        instruction: 'Take clean beaker from lab bench and initial temperature (25°C) note।',
        actionType: 'OBSERVE',
        observationHint: 'Beaker is completely clean and dry।',
        expectedResult: 'The prepared beaker was placed in the lab।',
      },
      {
        stepNumber: 2,
        title: 'Hydrochloric acid (HCl) is added',
        instruction: 'Pour 25 ml of dilute hydrochloric acid into the beaker and observe the value with a pH meter (pH ~ 1.0)।',
        chemicalToAdd: { chemicalId: 'hcl', volume: 25 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Up to 25 ml spot of clear colorless acid beaker penetrated।',
        expectedResult: 'Acidic solution (pH 1.0) was prepared।',
      },
      {
        stepNumber: 3,
        title: 'Sodium hydroxide (NaOH) mixt',
        instruction: 'Slowly add 25 mL of sodium hydroxide solution to the beaker via dropper।',
        chemicalToAdd: { chemicalId: 'naoh', volume: 25 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'The two solutions were mixed to form a clear table salt solution।',
        expectedResult: 'Mitigation reaction started।',
      },
      {
        stepNumber: 4,
        title: 'Stir and observe the temperature with a glass rod',
        instruction: 'Stir the solution gently with a glass rod and note the rise in temperature on the thermometer।',
        actionType: 'STIR',
        observationHint: '25 mercury in the thermometer°C increased from 29.5°C has reached। Bikar is jealous।',
        expectedResult: 'Heat generator mitigation completed successfully।',
      },
      {
        stepNumber: 5,
        title: 'Ensuring final pH and neutrality',
        instruction: 'pH Check the final pH of the solution with a meter (pH = 7.0).।',
        actionType: 'TEST_PH',
        observationHint: 'pH The value indicates the solution is now completely neutral।',
        expectedResult: 'Obtaining neutral NaCl solution।',
      },
    ],
    observations: [
      'HCl Its initial solution was colorless and strongly acidic (pH 1.0).।',
      'NaOH The temperature after addition is 25.0°C increased from 29.5°C has increased (ΔT = +4.5°C).',
      'The pH value of the final solution was found to be 7.0 indicating neutrality।',
      'No gas or bottom is produced।',
    ],
    calculations:
      'Heat generated is Q = m · s · ΔT\nThe mass of the total solution is m ≈ 50 g (50 mL)\nRelative heat of water s = 4.18 J/g·°C\nrise in temperature ΔT = 4.5 °C\nQ = 50 × 4.18 × 4.5 = 940.5 J',
    equations: ['HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) + 57.3 kJ/mol'],
    result:
      'The reaction of sodium hydroxide and hydrochloric acid is an exothermic exothermic reaction and results in neutral sodium chloride solution.।',
    precautions: [
      'Safety goggles and apron should be worn when working with strong acids and alkalis।',
      'Adding acid should be done slowly and not quickly।',
      'The bulb of the thermometer should be immersed directly in the solution without touching the wall of the beaker.।',
    ],
    vivaQuestions: [
      {
        question: 'Why is the quenching heat constant of strong acid and strong base (-57.34 kJ)?',
        answer:
          'Because all strong acids and bases dissociate completely in aqueous solution। As a result, the main reaction of any strong acid-base reaction is H⁺(aq) + OH⁻(aq) → H₂O(l), So the value of heat released is always the same।',
      },
      {
        question: 'Is the reduction reaction exothermic or exothermic?',
        answer: 'Reduction reaction is always an exothermic reaction।',
      },
      {
        question: 'What can be the name of indicator used in this test?',
        answer: 'Phenolphthalein or Universal Indicator।',
      },
    ],
    quizQuestions: [
      {
        id: 'q1',
        question: 'What is the heat of reduction of strong acid and strong alkali?',
        options: ['-57.34 kJ/mol', '+57.34 kJ/mol', '-100.5 kJ/mol', '0 kJ/mol'],
        correctIndex: 0,
        explanation: 'For strong acids and bases, the quenching heat is always constant -57.34 kJ/mol.।',
      },
      {
        id: 'q2',
        question: 'What is the pH value of the solution in complete neutralization?',
        options: ['1.0', '7.0', '14.0', '4.5'],
        correctIndex: 1,
        explanation: 'A solution is neutral (pH 7.0) when the acid and base are completely neutralized।',
      },
    ],
  },

  {
    id: 'exp_h2_gas_prep',
    title: 'Preparation and Pop-Test of Hydrogen Gas (Zn + HCl)',
    banglaTitle: 'Hydrogen gas preparation and Pop-Test by reaction of zinc and acid',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 7: Chemical Reactions and Gas Preparation',
    objective:
      'Prepare hydrogen gas by reacting zinc metal with dilute hydrochloric acid and confirm presence of gas by Pop test with burning stick.।',
    theory:
      'Metals above hydrogen in the metal reactivity series displace hydrogen from weak mineral acids to produce hydrogen gas and associated metal salts.।',
    principle: 'Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)↑',
    apparatus: [
      'Laboratory Beaker / Test Tube',
      'Delivery Tube',
      'Splint',
      'dropper',
      'Test tube holder',
    ],
    chemicals: [
      { chemicalId: 'zn', requiredAmount: '2 grams of zinc granules' },
      { chemicalId: 'hcl', requiredAmount: '20 ml of dilute hydrochloric acid (1.0 M)' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Take zinc granules in containers',
        instruction: 'Take 2 grams of granular zinc metal (Zn) in a beaker or test tube।',
        chemicalToAdd: { chemicalId: 'zn', volume: 10 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Gray shiny zinc grains are deposited on the bottom of the pot।',
        expectedResult: 'Zinc metal is accepted।',
      },
      {
        stepNumber: 2,
        title: 'Add mild hydrochloric acid',
        instruction: 'Slowly pour 20 ml of dilute HCl acid over the zinc grains।',
        chemicalToAdd: { chemicalId: 'hcl', volume: 20 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Instantly, gas bubbles begin to rise rapidly over the zinc grains।',
        expectedResult: 'Hydrogen gas emission begins।',
      },
      {
        stepNumber: 3,
        title: 'Perform Pop Test',
        instruction: 'Hold a burning matchstick to the mouth of the pot and observe।',
        actionType: 'TEST_GAS',
        observationHint: 'soft ‘Pop’ (Pop) The gas burned in a blue flame with noise।',
        expectedResult: 'Confirmation of hydrogen gas is complete।',
      },
    ],
    observations: [
      'On addition of acid, a colorless and odorless gas is evolved with intense bubbling।',
      'The zinc grains at the bottom of the pot are slowly corroded।',
      'The burning stick is soft when held in the mouth of the pot ‘Pop’ The flame flared up with a noise।',
    ],
    equations: ['Zn(s) + 2HCl(aq) → ZnCl₂(aq) + H₂(g)↑'],
    result:
      'The reaction of zinc and hydrochloric acid produced flammable hydrogen gas, which was confirmed by the pop test.।',
    precautions: [
      'Do not put your mouth over the mouth of the test tube as hydrogen gas is highly flammable।',
      'Use the test tube holder during the reaction as the vessel heats up।',
    ],
    vivaQuestions: [
      {
        question: 'How is hydrogen gas detected?',
        answer: 'It is mild when held by a burning stick ‘Pop’ It glows with a pale blue flame।',
      },
      {
        question: 'Can mild HCl react with copper metal to form hydrogen?',
        answer:
          'No, because copper cannot replace hydrogen as it is below hydrogen in the activation series।',
      },
    ],
    quizQuestions: [
      {
        id: 'q1',
        question: 'Zn + 2HCl What does zinc do in the reaction?',
        options: ['rust', 'disgusting', 'the catalyst', 'indicator'],
        correctIndex: 1,
        explanation: 'Zinc is oxidized by giving up electrons, so it is a reductant।',
      },
    ],
  },

  {
    id: 'exp_fe_cuso4_displacement',
    title: 'Single Displacement of Copper by Iron (Fe + CuSO4)',
    banglaTitle: 'Replacement reaction and color change of iron nail in copper sulphate solution',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 7: Chemical Reactions (Substitution)',
    objective:
      'of copper sulfate (CuSO₄) Substitution of copper by immersing an iron (Fe) nail in the blue solution, observing the change in color of the solution and the reddish-brown copper layer.।',
    theory:
      'Active metals can displace less active metals from aqueous solutions of their salts। Since iron (Fe) is more active than copper (Cu), it releases copper from copper sulfate to form ferrous sulfate.।',
    principle: 'Fe(s) + CuSO₄(aq)[bright blue] → FeSO₄(aq)[light green] + Cu(s)↓[Reddish-brown]',
    apparatus: [
      'disorder',
      'Clean iron nails (rubbed with sandpaper)',
      'glass rod',
      'Measuring chong',
    ],
    chemicals: [
      { chemicalId: 'cuso4', requiredAmount: '30 mL of copper sulfate solution (0.5 M CuSO₄)' },
      { chemicalId: 'fe', requiredAmount: 'Iron Nail / Iron Powder (Fe)' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Taking blue solution of copper sulphate',
        instruction: 'Pour 30 mL of bright blue copper sulfate solution into the beaker।',
        chemicalToAdd: { chemicalId: 'cuso4', volume: 30 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'The beaker filled to a beautiful deep sky blue color।',
        expectedResult: 'CuSO₄ The solution is prepared in the lab।',
      },
      {
        stepNumber: 2,
        title: 'Immersion of iron nail in Bikar solution',
        instruction: 'Add iron nails or iron powder to the blue solution in the beaker।',
        chemicalToAdd: { chemicalId: 'fe', volume: 10 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'A reddish-brown copper powder has begun to accumulate on the iron nail।',
        expectedResult: 'The substitution reaction is initiated।',
      },
      {
        stepNumber: 3,
        title: 'Observation of movement and color change',
        instruction: 'Stir the solution with a glass rod and observe the color change from blue to light green।',
        actionType: 'STIR',
        observationHint: 'The dark blue solution is completely light green (FeSO₄) turned into color।',
        expectedResult: 'FeSO₄ Obtaining solution and free copper precipitate।',
      },
    ],
    observations: [
      'The dark blue color of copper sulfate gradually fades to light green।',
      'Iron nails have a bright reddish-brown copper coating।',
      'It is a clear single displacement and redox reaction।',
    ],
    equations: ['Fe(s) + CuSO₄(aq) → FeSO₄(aq) + Cu(s)↓'],
    result:
      'Iron displaces copper from copper sulfate solution to produce light green ferrous sulfate and reddish-brown copper metal.।',
    precautions: [
      'Before using the iron nails, the rust should be cleaned thoroughly with emery paper।',
    ],
    vivaQuestions: [
      {
        question: 'Why does the blue color of the solution become green?',
        answer: 'Blue colored Cu²⁺ The ion Fe²⁺ is converted into ions and Fe²⁺ Its aqueous solution is light green।',
      },
      {
        question: 'Which is oxidized and which is oxidized in this reaction?',
        answer: 'Iron (Fe) is oxidized to Fe²⁺ is and Cu²⁺ The ion is oxidized to Cu metal।',
      },
    ],
    quizQuestions: [
      {
        id: 'q1',
        question: 'Fe + CuSO4 What color coating falls on the nail in the reaction?',
        options: ['white', 'the black', 'Reddish-brown', 'the blue'],
        correctIndex: 2,
        explanation: 'The color of free copper metal is reddish-brown.।',
      },
    ],
  },

  {
    id: 'exp_precipitation_agno3_nacl',
    title: 'Precipitation Reaction of AgNO3 and NaCl (Chloride Ion ID)',
    banglaTitle: 'White bottom and bi-substitution of silver chloride in reaction of silver nitrate and sodium chloride',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 7: Chemical Reactions and Precipitation',
    objective:
      'Silver nitrate (AgNO₃) and detection of silver chloride (AgCl) thick white precipitate by bi-displacement reaction of sodium chloride (NaCl) and detection of chloride ion।',
    theory:
      'A chemical reaction in which an aqueous solution of reactant compounds is mixed and their mutual ion exchange results in the formation of insoluble solids that settle at the bottom of the container as a sediment is called a precipitation reaction.।',
    principle: 'AgNO₃(aq) + NaCl(aq) → AgCl(s)↓[Thick white bottom] + NaNO₃(aq)',
    apparatus: ['disorder', 'dropper', 'glass rod', 'Measuring chong'],
    chemicals: [
      { chemicalId: 'agno3', requiredAmount: '20 ml silver nitrate solution (0.1 M)' },
      { chemicalId: 'nacl', requiredAmount: '20 ml sodium chloride solution (0.5 M)' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Taking silver nitrate solution',
        instruction: '20 ml of transparent silver nitrate (AgNO₃) Pour the solution।',
        chemicalToAdd: { chemicalId: 'agno3', volume: 20 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Colorless AgNO like transparent glass₃ The solution is ready।',
        expectedResult: 'AgNO₃ The solution is accepted।',
      },
      {
        stepNumber: 2,
        title: 'Add sodium chloride solution',
        instruction: 'Add 20 mL of NaCl solution to the beaker using a dropper।',
        chemicalToAdd: { chemicalId: 'nacl', volume: 20 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'As soon as the first drop fell, a thick white curd-like bottom was formed।',
        expectedResult: 'AgCl It forms a thick white precipitate।',
      },
    ],
    observations: [
      'When the two transparent colorless liquids mix, a thick milky white base is formed on the eyelid।',
      'After standing for a while AgCl precipitates to the bottom of the beaker।',
    ],
    equations: ['AgNO₃(aq) + NaCl(aq) → AgCl(s)↓ + NaNO₃(aq)'],
    result:
      'The reaction of silver nitrate with sodium chloride produces a white precipitate of insoluble silver chloride, which is a classic example of a double-replacement reaction.।',
    precautions: ['AgNO₃ May cause black spots on skin, so use dropper carefully।'],
    vivaQuestions: [
      {
        question: 'AgCl Solvent is soluble in what medium?',
        answer: 'Dilute ammonium hydroxide (NH₄OH) In solution the diamine dissolves forming a silver complex।',
      },
    ],
    quizQuestions: [
      {
        id: 'q1',
        question: 'AgCl What is the color of the bottom?',
        options: ['bright yellow', 'solid white', 'the blue', 'the black'],
        correctIndex: 1,
        explanation: 'AgCl Curdy white precipitate।',
      },
    ],
  },

  {
    id: 'exp_cation_precipitation',
    title: 'Identification of Cu2+ and Fe3+ Cations by NaOH Precipitation',
    banglaTitle: 'Add alkali to metal salt solution Cu²⁺ And Fe³⁺ Bottom detection of cations',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Practical Chemistry: Alkalinity / Cation Identification',
    objective:
      'Identification of cations by addition of sodium hydroxide to copper sulphate and ferric chloride solutions to produce light sky-blue and reddish-brown precipitates, respectively.।',
    theory:
      'The hydroxides of most transition metals are insoluble in water and have distinctive colors। Metals form characteristic precipitates when NaOH is added to solutions of metal salts।',
    principle:
      'CuSO₄ + 2NaOH → Cu(OH)₂↓[light blue] + Na₂SO₄\nFeCl₃ + 3NaOH → Fe(OH)₃↓[reddish brown] + 3NaCl',
    apparatus: ['Disorders', 'dropper', 'Test tube rack'],
    chemicals: [
      { chemicalId: 'cuso4', requiredAmount: '15 ml of copper sulfate' },
      { chemicalId: 'fecl3', requiredAmount: '15 ml of ferric chloride' },
      { chemicalId: 'naoh', requiredAmount: '20 ml sodium hydroxide' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Addition of alkali to copper sulfate solution and Cu²⁺ identification',
        instruction: 'Beaker blue CuSO₄ Add a few drops of NaOH solution to the solution।',
        chemicalToAdd: { chemicalId: 'cuso4', volume: 15 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Jelly-like light sky blue Cu(OH)₂ The bottom is made।',
        expectedResult: 'Cu²⁺ Ion is sure।',
      },
      {
        stepNumber: 2,
        title: 'NaOH Alkali addition',
        instruction: 'NaOH Clarify the bottom by adding solution।',
        chemicalToAdd: { chemicalId: 'naoh', volume: 15 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'The light blue bottom is clearly visible।',
        expectedResult: 'Cu(OH)₂ Create a summary।',
      },
    ],
    observations: [
      'CuSO₄ Addition of NaOH to the solution gives light blue color Cu(OH).₂ fall down।',
      'FeCl₃ Adding NaOH to the solution gives reddish-brown Fe(OH).₃ fall down।',
    ],
    equations: [
      'Cu²⁺(aq) + 2OH⁻(aq) → Cu(OH)₂(s)↓ (light blue)',
      'Fe³⁺(aq) + 3OH⁻(aq) → Fe(OH)₃(s)↓ (reddish-brown)',
    ],
    result: 'Cu of unknown solution with prominent bottom color²⁺ and Fe³⁺ Cation was definitely identified।',
    precautions: ['NaOH Do not apply alkali directly to the skin।'],
    vivaQuestions: [
      {
        question: 'Fe²⁺ and Fe³⁺ What is the difference in the color of the bottom of the ion?',
        answer: 'Fe²⁺ Gives dirty green bottom and Fe³⁺ Gives reddish-brown bottom।',
      },
    ],
    quizQuestions: [
      {
        id: 'q1',
        question: 'Fe³⁺ What color precipitates in the reaction of NaOH with the ion?',
        options: ['the blue', 'reddish brown', 'yellow', 'white'],
        correctIndex: 1,
        explanation: 'Fe(OH)₃ A reddish brown bottom।',
      },
    ],
  },
  {
    id: 'exp_co2_preparation',
    title: 'Preparation of Carbon Dioxide Gas and Testing its Properties',
    banglaTitle: 'CO in reaction of mild acid with carbonate salt₂ Gas preparation and religion test',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 7: Chemical Reactions / Chapter 10: Mineral Resources (Metals-Non-Metals)',
    objective:
      'Prepare carbon dioxide gas by reacting marble stone (calcium carbonate) with dilute hydrochloric acid and prove its religion by mixing lime water.।',
    theory:
      'The reaction of mild acid with any carbonate or bicarbonate salt produces carbon dioxide (CO) in bubbles.₂) Gas is produced। This gas is colorless and odorless। It reacts with lime water (calcium hydroxide solution) to form insoluble calcium carbonate, making lime water cloudy.।',
    principle:
      'Step 1: CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑\n2nd step: CO₂(g) + Ca(OH)₂(aq) → CaCO₃(s)↓ + H₂O(l)',
    apparatus: ['Beaker', 'Calcium carbonate (marble pieces)', 'Dilute HCl'],
    chemicals: [
      { chemicalId: 'caco3', requiredAmount: '10 g marble pieces' },
      { chemicalId: 'hcl', requiredAmount: '20 ml of dilute HCl' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Taking marble stone beaker',
        instruction: 'Calcium carbonate (CaCO₃) Or take marble chips।',
        chemicalToAdd: { chemicalId: 'caco3', volume: 10 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Solid white marble chips were collected in the beaker।',
        expectedResult: 'CaCO₃ Beaker accepted।'
      },
      {
        stepNumber: 2,
        title: 'Slight acid addition and gas formation',
        instruction: 'Pour dilute hydrochloric acid (HCl) into the beaker।',
        chemicalToAdd: { chemicalId: 'hcl', volume: 20 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'A large amount of bubbles (Effervescence) is produced which is CO₂ gas।',
        expectedResult: 'CO₂ Gas is produced।'
      }
    ],
    observations: [
      'As soon as the marble chips and acid are mixed, a colorless gas is emitted noisily in the form of bubbles.।',
      'When the gas produced is passed through lime water, the lime water becomes milky white and cloudy (CaCO₃ due to bottom)।'
    ],
    equations: [
      'CaCO₃(s) + 2HCl(aq) → CaCl₂(aq) + H₂O(l) + CO₂(g)↑'
    ],
    result: 'The experiment proved that the reaction of mild acid with carbonate salt produces CO₂ Gas is produced।',
    precautions: ['Care should be taken when using acid। Care should be taken that the gas does not escape।'],
    vivaQuestions: [
      {
        question: 'Excess CO in lime water₂ What happens when driving?',
        answer: 'Turbid lime water becomes clear again, because of the soluble calcium bicarbonate [Ca(HCO₃)₂] is produced।'
      }
    ],
    quizQuestions: [
      {
        id: 'q_co2_1',
        question: 'Which gas is produced by the reaction of weak acid with carbonate salt?',
        options: ['O₂', 'H₂', 'CO₂', 'Cl₂'],
        correctIndex: 2,
        explanation: 'CO on reaction of mild acid with any carbonate salt₂ Gas is produced।'
      }
    ]
  },
  {
    id: 'exp_anion_test_so4',
    title: 'Identification of Sulfate (SO₄²⁻) Anion',
    banglaTitle: 'By adding barium chloride to the salt solution sulfate (SO₄²⁻) Anion detection',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Practical Chemistry: Identification of acidic radical / anion',
    objective:
      'Barium chloride (BaCl) in solution of an unknown salt (such as sulfuric acid or sodium sulfate)₂) Detection of sulphate element by addition of solution।',
    theory:
      'Barium chloride (BaSO₄) A white precipitate is formed, which is insoluble in dilute hydrochloric or nitric acid।',
    principle: 'SO₄²⁻(aq) + Ba²⁺(aq) → BaSO₄(s)↓ [white bottom]',
    apparatus: ['test tube or beaker', 'dropper'],
    chemicals: [
      { chemicalId: 'h2so4', requiredAmount: '10 ml sulfuric acid' },
      { chemicalId: 'bacl2', requiredAmount: '10 ml barium chloride' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Taking sulfate solution',
        instruction: 'Take a solution of dilute sulfuric acid or any sulfate salt in a beaker।',
        chemicalToAdd: { chemicalId: 'h2so4', volume: 10 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'A clear solution is prepared।',
        expectedResult: 'Sulphate solution was taken।'
      },
      {
        stepNumber: 2,
        title: 'Add barium chloride',
        instruction: 'A few drops of barium chloride (BaCl₂) Add the solution।',
        chemicalToAdd: { chemicalId: 'bacl2', volume: 10 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Immediately, a thick white bottom was formed।',
        expectedResult: 'BaSO₄ Its white sediment is formed।'
      }
    ],
    observations: [
      'Barium chloride reacts immediately upon addition and an insoluble white precipitate (BaSO₄) is produced।',
      'This white precipitate does not dissolve even if mild HCl acid is added।'
    ],
    equations: [
      'H₂SO₄(aq) + BaCl₂(aq) → BaSO₄(s)↓ + 2HCl(aq)'
    ],
    result: 'The insoluble white bottom of barium sulfate confirms that sulfate (SO.) in a given solution₄²⁻) substantive present।',
    precautions: ['Barium salts are toxic, so be careful when using them।'],
    vivaQuestions: [
      {
        question: 'What is the white bottom produced in sulfate detection?',
        answer: 'of barium sulfate (BaSO₄)।'
      }
    ],
    quizQuestions: [
      {
        id: 'q_so4_1',
        question: 'Which reagent is used to detect sulfate radicals?',
        options: ['Dilute HCl', 'barium chloride', 'Silver nitrate', 'Ammonium hydroxide'],
        correctIndex: 1,
        explanation: 'BaSO when barium chloride is added to a solution of sulphate base₄ It has a white bottom।'
      }
    ]
  },
  {
    id: 'exp_exothermic_cao',
    title: 'Exothermic Reaction between Calcium Oxide and Water',
    banglaTitle: 'Observing the generation of heat (exothermic reaction) in the reaction of slaked lime and water',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 8: Chemistry and Energy',
    objective:
      'Observing the exothermic reaction of adding water to solid slaked lime (CaO) and obtaining evidence of temperature rise।',
    theory:
      'Chemical reactions that produce heat are called exothermic reactions। Mixing water with calcium oxide (slaked lime) produces calcium hydroxide (slaked lime) or limewater and generates a lot of heat.।',
    principle: 'CaO(s) + H₂O(l) → Ca(OH)₂(aq) + heat (ΔH = -63.7 kJ/mol)',
    apparatus: ['disorder', 'thermometer', 'glass rod'],
    chemicals: [
      { chemicalId: 'h2o', requiredAmount: '20 ml of water' },
      { chemicalId: 'cao', requiredAmount: '10 grams of burnt lime' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Installation of water and thermometer',
        instruction: 'Take water in a beaker and record the initial temperature with a thermometer (about 25°C)।',
        chemicalToAdd: { chemicalId: 'h2o', volume: 20 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Initial temperature of water is 25°C।',
        expectedResult: 'Water is ready।'
      },
      {
        stepNumber: 2,
        title: 'Add slaked lime',
        instruction: 'Add quicklime (CaO) to the water and observe the thermometer।',
        chemicalToAdd: { chemicalId: 'cao', volume: 10 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'A lot of heat is generated and the water starts boiling and the temperature rises rapidly (around 90-100°C)।',
        expectedResult: 'An exothermic reaction has taken place।'
      }
    ],
    observations: [
      'As soon as water is added to slaked lime, the reaction begins with a hissing sound।',
      'A lot of heat is generated and the beaker becomes very hot। The mercury column of the thermometer rises rapidly।',
      'The solution turns into cloudy limewater।'
    ],
    equations: [
      'CaO(s) + H₂O(l) → Ca(OH)₂(aq) + the heat'
    ],
    result: 'An increase in temperature proves that this is an exothermic reaction।',
    precautions: ['The reaction generates a lot of heat, so avoid direct handling of the beaker with bare hands and wear eye glasses।'],
    vivaQuestions: [
      {
        question: 'What is the name of the solution formed when water is added to slaked lime?',
        answer: 'Calcium hydroxide or lime water (Limewater / Slaked lime)।'
      }
    ],
    quizQuestions: [
      {
        id: 'q_exo_1',
        question: 'What kind of reaction is the reaction of quicklime and water?',
        options: ['hot', 'hot', 'Mitigation', 'polymerization'],
        correctIndex: 1,
        explanation: 'It produces a lot of heat, so it is an exothermic reaction।'
      }
    ]
  },
  {
    id: 'exp_endothermic_nh4cl',
    title: 'Endothermic Reaction of Ammonium Chloride in Water',
    banglaTitle: 'Observe the dissolution of ammonium chloride in water and the decrease in temperature (exothermic reaction).',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 8: Chemistry and Energy',
    objective:
      'Solid ammonium chloride (NH₄Cl) Observing endothermic reactions by dissolving and finding evidence of temperature decrease।',
    theory:
      'A chemical reaction or physical change in which heat is absorbed from the environment and the temperature decreases is called an exothermic reaction or process.। When ammonium chloride is mixed with water, it dissolves by absorbing heat।',
    principle: 'NH₄Cl(s) + H₂O(l) + the heat → NH₄⁺(aq) + Cl⁻(aq) (ΔH = +14.8 kJ/mol)',
    apparatus: ['disorder', 'thermometer', 'glass rod'],
    chemicals: [
      { chemicalId: 'h2o', requiredAmount: '20 ml of water' },
      { chemicalId: 'nh4cl', requiredAmount: '10 grams of ammonium chloride' }
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Installation of water and thermometer',
        instruction: 'Take water in a beaker and record the initial temperature with a thermometer (about 25°C)।',
        chemicalToAdd: { chemicalId: 'h2o', volume: 20 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Initial temperature of water is 25°C।',
        expectedResult: 'Water is ready।'
      },
      {
        stepNumber: 2,
        title: 'Add ammonium chloride',
        instruction: 'Ammonium chloride (NH₄Cl) Add and stir with a glass rod। Note the thermometer।',
        chemicalToAdd: { chemicalId: 'nh4cl', volume: 10 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'As the salt dissolves, the temperature drops rapidly (about 10-15°C)। Dew may form on the outside of the beaker।',
        expectedResult: 'Thermal process has taken place।'
      }
    ],
    observations: [
      'As ammonium chloride is added, the solution becomes very cold।',
      'The mercury column of the thermometer falls downwards, indicating a decrease in temperature।'
    ],
    equations: [
      'NH₄Cl(s) + H₂O(l) + the heat → NH₄⁺(aq) + Cl⁻(aq)'
    ],
    result: 'A decrease in temperature proves that it is an exothermic reaction/process।',
    precautions: ['The thermometer should be handled with care so as not to break it।'],
    vivaQuestions: [
      {
        question: 'In exothermic reactions ΔH How is the value?',
        answer: 'In exothermic reactions ΔH Its value is positive (+).।'
      }
    ],
    quizQuestions: [
      {
        id: 'q_endo_1',
        question: 'What happens when ammonium chloride is dissolved in water?',
        options: ['The temperature rises', 'The temperature remains unchanged', 'The temperature decreases', 'The solution is heated'],
        correctIndex: 2,
        explanation: 'As this is an exothermic reaction, heat is absorbed from the environment and the temperature of the solution decreases।'
      }
    ]
  },
  {
    id: 'exp_titration_standard',
    title: 'Acid-Base Titration: Determination of Unknown Concentration of Acid',
    banglaTitle: 'Acid-base titration: Determination of concentration of unknown HCl acid by standard NaOH',
    nctbClass: '9th-10th Class / SSC & HSC',
    chapter: 'Chapter 8: Chemistry and Energy / Quantitative Chemistry',
    objective:
      'Measure the molarity (S) of an unknown concentration of hydrochloric acid (HCl) with a standard sodium hydroxide (NaOH) solution using a burette, conical flask and phenolphthalein indicator.₁V₁ = S₂V₂) to determine।',
    theory:
      'The process of determining the exact density and volume of a solution of unknown concentration with the help of a proof solution of known concentration in the presence of a suitable indicator is called titration.। Complete neutralization of strong acids and strong bases has pH = 7.0 as the end point।',
    principle: 'HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l) | Source: S₁V₁ = S₂V₂',
    apparatus: [
      'Burette (50 mL)',
      'Conical Flask 250 mL',
      'Pipette (Pipette 25 mL)',
      'Dropper and beaker',
      'Magnetic steerer and stand',
    ],
    chemicals: [
      { chemicalId: 'hcl', requiredAmount: '25 mL of HCl solution of unknown concentration' },
      { chemicalId: 'naoh', requiredAmount: '50 mL of 0.1 M standard NaOH solution' },
      { chemicalId: 'phenolphthalein', requiredAmount: '2-3 drops of phenolphthalein indicator' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Add acid and indicator to flask',
        instruction: 'Take 25 ml of HCl solution in a conical flask and add 2-3 drops of phenolphthalein.।',
        chemicalToAdd: { chemicalId: 'hcl', volume: 25 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Phenolphthalein is completely colorless in acidic medium।',
        expectedResult: 'A colorless acidic solution is prepared in a flask।',
      },
      {
        stepNumber: 2,
        title: 'Addition of alkali from burette and determination of end point',
        instruction: 'Open the stopcock of the burette and add dropwise the standard 0.1 M NaOH solution and shake the flask.।',
        chemicalToAdd: { chemicalId: 'naoh', volume: 25 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'A sudden addition of a drop of NaOH turned the colorless solution into a permanent pale pink color।',
        expectedResult: 'The end point of the titration is reached।',
      },
    ],
    observations: [
      'The initial reading on the buret was 0.00 mL and the final reading was 25.00 mL।',
      'Volume of alkali used (V₂) = 25.00 mL।',
      'At the end point the color of the solution changed from colorless to a permanent light pink color।',
    ],
    equations: ['HCl(aq) + NaOH(aq) → NaCl(aq) + H₂O(l)'],
    result:
      'S₁V₁ = S₂V₂ Concentration S of the unknown HCl acid by applying the formula₁ = (25.0 × 0.1) / 25.0 = 0.10 M Determined।',
    precautions: [
      'The meniscus of the liquid should be correctly aligned with the zero mark of the burette।',
      'The conical flask should be continuously stirred slowly during the titration।',
    ],
    vivaQuestions: [
      {
        question: 'What is the difference between end point and equivalence point in titration?',
        answer:
          'Equivalent point is the theoretical point at which equal amounts of acid and base are chemically completely neutralized। And the point that is visually identified by changing the color of the indicator is called the termination point।',
      },
    ],
    quizQuestions: [
      {
        id: 'q_titr_1',
        question: 'Which indicator is most suitable for titration of strong acid and strong base?',
        options: ['Phenolphthalein or Methyl Orange', 'Just starch', 'Barium chloride only', 'Potassium iodide'],
        correctIndex: 0,
        explanation: 'Both phenolphthalein and methyl orange are suitable for strong acid and strong base titrations as the steep pH changes range from 3.5 to 10.5.।',
      },
    ],
  },
  {
    id: 'exp_electrolysis_water',
    title: 'Electrolysis of Acidified Water (2H2O -> 2H2 + O2)',
    banglaTitle: 'Electrolysis of water and evidence of a 2:1 volume ratio of hydrogen-oxygen',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 8: Chemistry and Energy (Electroanalysis)',
    objective:
      'Prove 2:1 ratio of hydrogen gas at cathode and oxygen gas at anode by electrolysis of dilute sulfuric acid water using Hoffmann voltameter and DC power source.।',
    theory:
      'Pure water is very mild electrolysis। Adding a small amount of acid increases the dissociation of water ions। H at the cathode when current flows⁺ The ion accepts electrons from H₂ OH in gas and anode⁻ Or water gives up electrons to O₂ produces gas।',
    principle:
      'Cathode (oxidation): 4H⁺(aq) + 4e⁻ → 2H₂(g)↑\nAnode (oxidation): 2H₂O(l) → O₂(g)↑ + 4H⁺(aq) + 4e⁻\nOverall reaction: 2H₂O(l) → 2H₂(g) + O₂(g)',
    apparatus: [
      'Voltmeter or U-tube (Voltameter)',
      'Platinum or Graphite Electrodes',
      '12 volt DC battery / power supply',
      'Connecting cable and switch',
      'Splint for Pop-test',
    ],
    chemicals: [
      { chemicalId: 'h2o', requiredAmount: '100 ml of water' },
      { chemicalId: 'h2so4', requiredAmount: '5 ml of dilute sulfuric acid (to increase conductivity)' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Intake of acid mixed with voltameter',
        instruction: 'Take water in the voltameter and add a few drops of mild sulfuric acid।',
        chemicalToAdd: { chemicalId: 'h2o', volume: 50 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Prepare electrolytic solution।',
        expectedResult: 'The electrolytic cell is ready।',
      },
      {
        stepNumber: 2,
        title: 'Switching on the DC power supply',
        instruction: 'Switch on the 12 volt DC battery and observe gas bubbles at both electrodes।',
        chemicalToAdd: { chemicalId: 'h2so4', volume: 5 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Bubbling occurs at a faster rate at the cathode and twice as slowly at the anode।',
        expectedResult: 'Start electrolysis of water।',
      },
      {
        stepNumber: 3,
        title: 'Determination of gas collection and volume ratio',
        instruction: 'Observe the tube scale and perform the pop test।',
        actionType: 'TEST_GAS',
        observationHint: 'The volume of gas produced at the cathode is exactly twice that of the gas produced at the anode (2:1).।',
        expectedResult: '2:1 ratio of hydrogen and oxygen is proven।',
      },
    ],
    observations: [
      'Colorless hydrogen gas collects at the cathode, which ignites with a pop on contact with the burning rod.।',
      'Oxygen gas collects at the anode which makes the gently burning wick glow brightly।',
      'The volume ratio of cathode and anode gas is always found to be 2:1।',
    ],
    equations: ['2H₂O(l) → 2H₂(g) + O₂(g)'],
    result:
      'By electrolysis, the volume ratio of hydrogen to oxygen in water molecules was proved to be 2:1 (H₂O)।',
    precautions: [
      'Always use DC power, not AC।',
      'Care must be taken as the hydrogen gas produced is highly flammable।',
    ],
    vivaQuestions: [
      {
        question: 'Why is sulfuric acid added to water?',
        answer: 'Pure water is electrically non-conductive, so a small amount of acid is added to increase the conductivity and ions of the water।',
      },
    ],
    quizQuestions: [
      {
        id: 'q_elec_1',
        question: 'What gas is produced at the cathode in the electrolysis of water?',
        options: ['Oxygen (O₂)', 'Hydrogen (H₂)', 'Chlorine (Cl₂)', 'Sulfur dioxide'],
        correctIndex: 1,
        explanation: 'Positive H at cathode (-).⁺ The ion accepts electrons from hydrogen (H₂) produces gas।',
      },
    ],
  },
  {
    id: 'exp_electrochemical_cell',
    title: 'Daniell Electrochemical Cell (Zn-Cu Galvanic Cell)',
    banglaTitle: 'Daniel Electrochemical cell (galvanic cell) construction and generation of electricity',
    nctbClass: 'IX-XTH CLASS / SSC',
    chapter: 'Chapter 8: Chemistry and Energy (Galvanic Cells)',
    objective:
      'Making Daniel cells using zinc rods, copper rods, their own salt solution and salt bridges to convert chemical energy into electrical energy and measure a potential of 1.10 volts।',
    theory:
      'A cell in which chemical energy is directly converted into electrical energy through spontaneous chemical reactions is called a galvanic cell or voltaic cell.। Since zinc is more reactive than copper, zinc is oxidized to give up electrons and copper ions are oxidized by accepting electrons.।',
    principle:
      'Anode (oxidation): Zn(s) → Zn²⁺(aq) + 2e⁻ (E° = -0.76 V)\nCathode (oxidation): Cu²⁺(aq) + 2e⁻ → Cu(s) (E° = +0.34 V)\nCell type: E°cell = E°cathode - E°anode = +0.34 - (-0.76) = +1.10 V',
    apparatus: [
      'Two 250 mL beakers',
      'Zinc Bar (Zn) and Copper Bar (Cu)',
      'Salt Bridge (Agar-Agar U-Nol mixed with KCl)',
      'Digital voltmeter and connection cable',
      'A small LED bulb',
    ],
    chemicals: [
      { chemicalId: 'znso4', requiredAmount: '50 mL of 1.0 M ZnSO₄ the solution' },
      { chemicalId: 'cuso4', requiredAmount: '50 mL of 1.0 M CuSO₄ the solution' },
    ],
    steps: [
      {
        stepNumber: 1,
        title: 'Half cells and solution are prepared',
        instruction: 'ZnSO in a beaker₄ solution and zinc rod and CuSO in another beaker₄ Keep the solution and copper rod।',
        chemicalToAdd: { chemicalId: 'cuso4', volume: 50 },
        actionType: 'ADD_CHEMICAL',
        observationHint: 'Two separate half cells are prepared।',
        expectedResult: 'Anode and cathode form half cells।',
      },
      {
        stepNumber: 2,
        title: 'Installation and connection of salt bridges',
        instruction: 'Connect the voltmeter by placing a KCl salt bridge across the junction of both beakers।',
        actionType: 'OBSERVE',
        observationHint: 'The voltmeter shows a reading of 1.10 volts and the bulb lights up।',
        expectedResult: 'Electricity production started।',
      },
    ],
    observations: [
      'With the circuit connected, a potential of +1.10 V is found on the digital voltmeter।',
      'Electrons flow from the zinc anode to the copper cathode through the outer wire।',
      'After some reaction the mass of the zinc rod decreases and the mass increases as the copper rod is coated with reddish copper.।',
    ],
    equations: ['Zn(s) + Cu²⁺(aq) → Zn²⁺(aq) + Cu(s) | E°cell = +1.10 V'],
    result: 'Chemical energy is successfully converted into electrical energy in a Daniell cell।',
    precautions: [
      'A cotton plug should be firmly attached to both ends of the salt bridge so that the solution does not spill out।',
      'The entrances should be cleaned with tissue paper।',
    ],
    vivaQuestions: [
      {
        question: 'What is the function of salt bridge in galvanic cell?',
        answer: 'Connecting the two half-cells and maintaining the electrolyte neutrality of the solution by maintaining the flow of cations and anions in both solutions.।',
      },
    ],
    quizQuestions: [
      {
        id: 'q_dan_1',
        question: 'Evidence of standard Daniell cells (E°cell) how much',
        options: ['1.10 V', '2.20 V', '0.76 V', '0.34 V'],
        correctIndex: 0,
        explanation: 'E°cell = E°(Cu²⁺/Cu) - E°(Zn²⁺/Zn) = +0.34 - (-0.76) = 1.10 V।',
      },
    ],
  },
];

