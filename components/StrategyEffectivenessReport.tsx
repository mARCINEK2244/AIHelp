import React from 'react';
import type { FeedbackMemory, StrategyEffectiveness } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart2Icon, AlertTriangleIcon } from './icons';

interface StrategyEffectivenessReportProps {
  feedbackMemory?: FeedbackMemory;
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const isNotEffective = payload[0]?.payload?.not_effective;
    return (
      <div className="bg-slate-700 p-3 border border-slate-600 rounded-lg shadow-lg">
        <p className="label text-slate-200 font-semibold mb-2">{label}</p>
        <p className="intro text-teal-400">{`Liczba użyć: ${payload[0].value}`}</p>
        <p className="intro text-sky-400">{`Śr. pomocność (0-3): ${payload[1].value}`}</p>
        {isNotEffective && (
             <p className="text-amber-400 text-xs mt-2 flex items-center gap-1"><AlertTriangleIcon className="w-4 h-4"/> Nieskuteczna</p>
        )}
      </div>
    );
  }
  return null;
};

const StrategyEffectivenessReport: React.FC<StrategyEffectivenessReportProps> = ({ feedbackMemory }) => {
  const strategyData = React.useMemo(() => {
    if (!feedbackMemory || !feedbackMemory.strategy_effectiveness || Object.keys(feedbackMemory.strategy_effectiveness).length === 0) {
      return [];
    }
    const effectivenessData: StrategyEffectiveness = feedbackMemory.strategy_effectiveness;
    return Object.entries(effectivenessData)
      .map(([name, data]) => ({
        name,
        'Liczba użyć': data.uses,
        'Średnia pomocność': parseFloat(data.avg_help.toFixed(2)),
        not_effective: data.tag === 'not_effective'
      }))
      .sort((a, b) => b['Liczba użyć'] - a['Liczba użyć']); // Sort by most used
  }, [feedbackMemory]);

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <BarChart2Icon className="w-6 h-6 text-teal-400" />
        <h2 className="text-xl font-semibold text-slate-100">Raport Skuteczności Strategii</h2>
      </div>
       <p className="text-sm text-slate-400 mb-6">Ten wykres pokazuje, jak często używasz poszczególnych strategii radzenia sobie i jak oceniasz ich skuteczność (w skali 0-3).</p>
      {strategyData.length === 0 ? (
        <div className="text-center text-slate-400 py-10">
          <p>Brak danych o skuteczności strategii.</p>
          <p className="text-sm">Gdy zaczniesz korzystać z planów i oceniać ich kroki, tutaj pojawi się analiza.</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 150 + strategyData.length * 50 }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={strategyData}
              margin={{ top: 5, right: 20, left: 30, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis type="number" stroke="#94a3b8" domain={[0, 3]} tickCount={4} label={{ value: 'Średnia pomocność (0-3)', position: 'insideBottom', offset: -10, fill: '#94a3b8' }} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" width={140} tick={{ fontSize: 12 }}/>
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(71, 85, 105, 0.5)'}}/>
              <Legend wrapperStyle={{color: '#cbd5e1', paddingTop: '20px'}}/>
              <Bar dataKey="Liczba użyć" name="Liczba użyć" fill="#0f766e" background={{ fill: '#47556933' }}/>
              <Bar dataKey="Średnia pomocność" name="Średnia pomocność" fill="#2dd4bf" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default StrategyEffectivenessReport;