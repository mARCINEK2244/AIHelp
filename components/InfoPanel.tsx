
import React, { useState } from 'react';
import type { Substance } from '../types';
import { TargetIcon, InfoIcon } from './icons';

interface InfoPanelProps {
  substance: Substance;
}

type ActiveTab = 'triggers' | 'symptoms';

const InfoPanel: React.FC<InfoPanelProps> = ({ substance }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('triggers');

  const tabButtonStyle = (isActive: boolean) =>
    `w-full flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors border-b-2 ${
      isActive
        ? 'border-teal-400 text-teal-300'
        : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-500'
    }`;

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4 text-slate-100">Informacje o substancji</h2>
      
      <div className="border-b border-slate-700">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('triggers')}
            className={tabButtonStyle(activeTab === 'triggers')}
          >
            <TargetIcon className="w-5 h-5" />
            Wyzwalacze
          </button>
          <button
            onClick={() => setActiveTab('symptoms')}
            className={tabButtonStyle(activeTab === 'symptoms')}
          >
            <InfoIcon className="w-5 h-5" />
            Objawy Głodu
          </button>
        </nav>
      </div>

      <div className="mt-6">
        {activeTab === 'triggers' && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="font-semibold text-slate-300">Typowe wyzwalacze głodu:</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              {substance.triggers.map((trigger, index) => (
                <li key={index}>{trigger}</li>
              ))}
            </ul>
          </div>
        )}
        {activeTab === 'symptoms' && (
          <div className="space-y-3 animate-fade-in">
            <h3 className="font-semibold text-slate-300">Typowe objawy głodu:</h3>
            <ul className="list-disc list-inside space-y-2 text-slate-400">
              {substance.symptoms.map((symptom, index) => (
                <li key={index}>{symptom}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
