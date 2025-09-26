import React, { useState, useMemo } from 'react';
import type { CravingLog } from '../types';
import { ChevronDownIcon } from './icons';
import { getSymptomLabelMap } from '../symptoms';

interface HistoryLogProps {
  logs: CravingLog[];
  substanceId: string;
}

const LogItem: React.FC<{ log: CravingLog; substanceId: string }> = ({ log, substanceId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const symptomKeyToLabelMap = useMemo(() => getSymptomLabelMap(substanceId), [substanceId]);
  const date = new Date(log.timestamp);
  
  const formattedDate = date.toLocaleDateString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const getIntensityColor = (value: number) => {
    if (value <= 30) return 'bg-green-500/20 text-green-300';
    if (value <= 80) return 'bg-yellow-500/20 text-yellow-300';
    return 'bg-red-500/20 text-red-300';
  };

  return (
    <li className="bg-slate-700/50 rounded-lg">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
          <span className="font-mono text-slate-400">{formattedDate} <span className="text-slate-500">{formattedTime}</span></span>
          <span className={`px-2 py-1 text-sm font-bold rounded ${getIntensityColor(log.totalIntensity)}`}>
            Suma: {log.totalIntensity}
          </span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-slate-600/50">
          {log.triggers && log.triggers.length > 0 && (
            <>
                <h4 className="text-sm text-slate-300 font-semibold mt-3 mb-2">Zgłoszone wyzwalacze:</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                    {log.triggers.map(trigger => (
                        <span key={trigger} className="bg-sky-500/20 text-sky-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                            {trigger}
                        </span>
                    ))}
                </div>
            </>
          )}
          <h4 className="text-sm text-slate-300 font-semibold mt-3 mb-2">Zgłoszone objawy:</h4>
          <ul className="space-y-1 text-sm">
            {Object.entries(log.details).map(([key, value]) => (
                <li key={key} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-md">
                    <span className="text-slate-300">{symptomKeyToLabelMap[key] || key}</span>
                    <span className="font-bold text-teal-300">{value}/10</span>
                </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};


const HistoryLog: React.FC<HistoryLogProps> = ({ logs, substanceId }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">Historia Zapisów</h2>
      {logs.length === 0 ? (
        <div className="text-center text-slate-400 py-10">
          <p>Brak zapisanych głodów.</p>
          <p className="text-sm">Twoja historia pojawi się tutaj, gdy zaczniesz ją tworzyć.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {logs.map(log => (
            <LogItem key={log.timestamp} log={log} substanceId={substanceId} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryLog;