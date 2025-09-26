import React, { useState, useEffect } from 'react';
import { CalendarCheckIcon } from './icons';

interface SobrietyTrackerProps {
  startDate: string;
}

const SobrietyTracker: React.FC<SobrietyTrackerProps> = ({ startDate }) => {
  const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateDuration = () => {
      const start = new Date(startDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDuration({ days, hours, minutes, seconds });
    };

    calculateDuration();
    const intervalId = setInterval(calculateDuration, 1000);

    return () => clearInterval(intervalId);
  }, [startDate]);

  const StatCard: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <div className="flex flex-col items-center bg-slate-700/50 p-4 rounded-lg">
      <span className="text-3xl font-bold text-teal-300">{String(value).padStart(2, '0')}</span>
      <span className="text-xs text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <CalendarCheckIcon className="w-6 h-6 text-teal-400" />
        <h2 className="text-xl font-semibold text-slate-100">Twoja droga do wolności</h2>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        <StatCard value={duration.days} label="Dni" />
        <StatCard value={duration.hours} label="Godzin" />
        <StatCard value={duration.minutes} label="Minut" />
        <StatCard value={duration.seconds} label="Sekund" />
      </div>
    </div>
  );
};

export default SobrietyTracker;
