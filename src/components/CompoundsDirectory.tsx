import React, { useState } from 'react';
import { COMMON_COMPOUNDS_3D } from '../data/compounds3D';
import { Molecule3DView, MoleculeData } from './Molecule3DView';
import { Search, Hexagon } from 'lucide-react';

export const CompoundsDirectory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMolecule, setSelectedMolecule] = useState<MoleculeData | null>(COMMON_COMPOUNDS_3D[0]);

  const filteredMolecules = COMMON_COMPOUNDS_3D.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.banglaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.formula.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Hexagon className="w-6 h-6 text-emerald-400" />
            <span>Compounds and Compounds & Radicals 3D)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Important Compounds and Three Dimensional (3D) Structure of Compounds in Class IX-X Textbook
          </p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Find the compound name or signal..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/3 flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredMolecules.map((mol) => (
            <button
              key={mol.id}
              onClick={() => setSelectedMolecule(mol)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedMolecule?.id === mol.id
                  ? 'bg-emerald-500/20 border-emerald-500/50 shadow-lg shadow-emerald-900/20'
                  : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-200">{mol.formula}</h3>
                  <p className="text-sm text-slate-400">{mol.banglaName}</p>
                </div>
              </div>
            </button>
          ))}
          {filteredMolecules.length === 0 && (
            <div className="p-8 text-center text-slate-500">No compounds found।</div>
          )}
        </div>

        <div className="lg:w-2/3 min-h-[400px] lg:min-h-[600px]">
          {selectedMolecule ? (
            <Molecule3DView molecule={selectedMolecule} />
          ) : (
            <div className="w-full h-full rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-center text-slate-500">
              Select a compound from the left side
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
