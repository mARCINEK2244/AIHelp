import React, { useState, useMemo } from 'react';
import type { CravingDetails } from '../types';
import { getSymptomList } from '../symptoms';

interface CravingLoggerProps {
  onTriggerAlarm: (data: { symptoms: CravingDetails; triggers: string[] }) => void;
  substanceId: string;
}

const CravingLogger: React.FC<CravingLoggerProps> = ({ onTriggerAlarm, substanceId }) => {
  const symptomList = useMemo(() => getSymptomList(substanceId), [substanceId]);

  const initialDetails = useMemo(() => {
    return symptomList.reduce((acc, symptom) => {
      acc[symptom.key] = 0;
      return acc;
    }, {} as CravingDetails);
  }, [symptomList]);

  const [details, setDetails] = useState<CravingDetails>(initialDetails);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [triggerInput, setTriggerInput] = useState('');

  const handleDetailChange = (key: string, value: number) => {
    setDetails(prev => ({ ...prev, [key]: value }));
  };
  
  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && triggerInput.trim()) {
      e.preventDefault();
      const newTrigger = triggerInput.trim().replace(/,$/, '');
      if (newTrigger && !triggers.includes(newTrigger)) {
        setTriggers(prev => [...prev, newTrigger]);
      }
      setTriggerInput('');
    }
  };

  const removeTrigger = (triggerToRemove: string) => {
    setTriggers(prev => prev.filter(t => t !== triggerToRemove));
  };


  const activeSymptoms = useMemo(() => {
    return Object.entries(details).reduce((acc, [key, value]) => {
      if (value > 0) {
        acc[key] = value;
      }
      return acc;
    }, {} as CravingDetails);
  }, [details]);
  
  const totalIntensity = useMemo(() => {
     return Object.values(activeSymptoms).reduce((sum, value) => sum + value, 0);
  }, [activeSymptoms]);

  const handleConfirm = () => {
    if (totalIntensity > 0) {
      onTriggerAlarm({ symptoms: activeSymptoms, triggers });
      setDetails(initialDetails); // Reset form after submission
      setTriggers([]);
    }
  };

  const getIntensityColor = (value: number) => {
    if (value === 0) return 'text-slate-400';
    if (value <= 3) return 'text-green-400';
    if (value <= 7) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  return (
    <div className="bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-700 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">Dziennik Głodu</h2>
          <p className="text-slate-400">Oceń nasilenie objawów w skali 0-10 (0 = brak).</p>
        </div>
        <div className="text-center bg-slate-900/50 p-3 rounded-lg self-stretch sm:self-center">
          <p className="text-slate-400 text-sm uppercase tracking-wider">Suma</p>
          <p className={`text-4xl font-bold ${getIntensityColor(totalIntensity)} transition-colors`}>
            {totalIntensity}
          </p>
        </div>
      </div>
      
      <div className="space-y-5 max-h-[40vh] overflow-y-auto pr-3 -mr-3">
        {symptomList.map(symptom => (
          <div key={symptom.key}>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300">{symptom.label}</label>
              <span className={`text-lg font-bold w-8 text-center ${getIntensityColor(details[symptom.key])}`}>
                {details[symptom.key]}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={details[symptom.key]}
              onChange={(e) => handleDetailChange(symptom.key, Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb"
            />
          </div>
        ))}
      </div>
      
      <div className="mt-8 border-t border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-slate-200">Dodaj wyzwalacze (opcjonalnie)</h3>
          <p className="text-sm text-slate-400 mb-3">Wpisz co wywołało głód (np. 'Kawa', 'Stres') i naciśnij Enter.</p>
          <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900/50 rounded-lg border border-slate-600">
             {triggers.map(trigger => (
                <span key={trigger} className="flex items-center gap-2 bg-sky-500/20 text-sky-300 text-sm font-medium px-3 py-1 rounded-full">
                    {trigger}
                    <button onClick={() => removeTrigger(trigger)} className="text-sky-200 hover:text-white">&times;</button>
                </span>
            ))}
            <input
              type="text"
              value={triggerInput}
              onChange={(e) => setTriggerInput(e.target.value)}
              onKeyDown={handleTriggerKeyDown}
              placeholder={triggers.length === 0 ? "Wpisz wyzwalacz..." : "Dodaj kolejny..."}
              className="flex-1 bg-transparent p-1 focus:outline-none text-white min-w-[120px]"
            />
          </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleConfirm}
          disabled={totalIntensity === 0}
          className="w-full max-w-md px-6 py-3 bg-teal-600 hover:bg-teal-500 rounded-lg font-semibold transition-all duration-300 text-lg disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed transform hover:scale-105"
        >
          {totalIntensity === 0 ? 'Wypełnij dziennik' : `Zatwierdź i uzyskaj pomoc (Suma: ${totalIntensity})`}
        </button>
      </div>
       <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #2dd4bf;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #1f2937;
        }
        .range-thumb::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #2dd4bf;
          cursor: pointer;
          border-radius: 50%;
           border: 2px solid #1f2937;
        }
      `}</style>
    </div>
  );
};

export default CravingLogger;