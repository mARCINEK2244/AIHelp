import React from 'react';
import type { CravingLog, Substance, UserInfo, FeedbackMemory, CravingDetails } from '../types';
import CravingLogger from './CravingLogger';
import ProgressChart from './ProgressChart';
import InfoPanel from './InfoPanel';
import HistoryLog from './HistoryLog';
import { RotateCcwIcon, Trash2Icon, LogOutIcon } from './icons';
import SobrietyTracker from './SobrietyTracker';
import StrategyEffectivenessReport from './StrategyEffectivenessReport';

interface DashboardProps {
  substance: Substance;
  userInfo: UserInfo;
  cravingLogs: CravingLog[];
  feedbackMemory?: FeedbackMemory;
  onTriggerAlarm: (data: { symptoms: CravingDetails; triggers: string[] }) => void;
  onGoBack: () => void;
  onReset: () => void;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ substance, userInfo, cravingLogs, feedbackMemory, onTriggerAlarm, onGoBack, onReset, onLogout }) => {
  return (
    <div className="p-4 space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-100">Panel Wsparcia</h1>
            <p className="text-teal-400 text-lg">Monitorujesz: <span className="font-semibold">{substance.name}</span></p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
             <button 
                onClick={onGoBack}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
                title="Zmień monitorowaną substancję"
            >
                <RotateCcwIcon className="w-4 h-4" /> Zmień
            </button>
             <button 
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
                title="Wyloguj się"
            >
                <LogOutIcon className="w-4 h-4" /> Wyloguj
            </button>
        </div>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <SobrietyTracker startDate={userInfo.abstinenceStart} />
          <CravingLogger onTriggerAlarm={onTriggerAlarm} substanceId={substance.id} />
          <ProgressChart data={cravingLogs} />
          <StrategyEffectivenessReport feedbackMemory={feedbackMemory} />
          <HistoryLog logs={cravingLogs} substanceId={substance.id} />

          <div className="bg-slate-800 p-6 rounded-lg border border-red-500/30">
            <h3 className="text-lg font-semibold text-red-400">Strefa niebezpieczna</h3>
            <p className="text-slate-400 text-sm mt-1 mb-4">Poniższa akcja jest nieodwracalna. Spowoduje usunięcie wszystkich Twoich danych z tego konta.</p>
            <button
                onClick={onReset}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-400"
            >
                <Trash2Icon className="w-4 h-4" /> Resetuj postępy
            </button>
        </div>

        </div>
        <div className="md:col-span-1">
          <InfoPanel substance={substance} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;