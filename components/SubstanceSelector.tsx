
import React from 'react';
import { SUBSTANCES } from '../constants';
import type { Substance } from '../types';
import { BrainCircuitIcon, HeartPulseIcon } from './icons';

interface SubstanceSelectorProps {
  onSelect: (substance: Substance) => void;
}

const SubstanceSelector: React.FC<SubstanceSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 animate-fade-in">
      <div className="mb-8">
        <HeartPulseIcon className="w-20 h-20 text-teal-400 mx-auto" />
        <h1 className="text-4xl md:text-5xl font-bold mt-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-sky-400">
          Asystent Wsparcia
        </h1>
        <p className="text-slate-400 mt-2 text-lg">Wybierz substancję, aby rozpocząć swoją drogę do wolności.</p>
        <p className="text-sm text-slate-500 mt-4 max-w-md mx-auto">Ta aplikacja jest narzędziem wspierającym i nie zastępuje profesjonalnej pomocy medycznej. W kryzysie skontaktuj się ze specjalistą.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-2xl">
        {SUBSTANCES.map((substance) => (
          <button
            key={substance.id}
            onClick={() => onSelect(substance)}
            className="group relative p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-teal-400/50 hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            <div className="flex flex-col items-center">
              <BrainCircuitIcon className="w-8 h-8 text-slate-400 group-hover:text-teal-400 transition-colors" />
              <h3 className="text-lg font-semibold mt-3 text-slate-200">{substance.name}</h3>
              <p className="text-sm text-slate-500">{substance.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubstanceSelector;
