import React, { useState } from 'react';
import type { CravingLog } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProgressChartProps {
  data: CravingLog[];
}

type TimeRange = 'week' | 'month' | 'all';

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-700 p-2 border border-slate-600 rounded">
        <p className="label text-slate-300">{`Dzień: ${label}`}</p>
        <p className="intro text-teal-400">{`Śr. intensywność: ${payload[0].value}`}</p>
        <p className="intro text-sky-400">{`Liczba głodów: ${payload[1].value}`}</p>
      </div>
    );
  }
  return null;
};

const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  
  const processData = (logs: CravingLog[], range: TimeRange) => {
    if (!logs || logs.length === 0) return [];
    
    const now = new Date();
    let filteredLogs = logs;

    if (range === 'week') {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      filteredLogs = logs.filter(log => new Date(log.timestamp) >= sevenDaysAgo);
    } else if (range === 'month') {
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      thirtyDaysAgo.setHours(0, 0, 0, 0);
      filteredLogs = logs.filter(log => new Date(log.timestamp) >= thirtyDaysAgo);
    }
    
    const aggregatedData: { [key: string]: { sum: number; count: number } } = {};

    filteredLogs.forEach(log => {
      const dateKey = log.timestamp.substring(0, 10); // YYYY-MM-DD format
      if (!aggregatedData[dateKey]) {
        aggregatedData[dateKey] = { sum: 0, count: 0 };
      }
      aggregatedData[dateKey].sum += log.totalIntensity;
      aggregatedData[dateKey].count += 1;
    });
    
    const sortedDates = Object.keys(aggregatedData).sort((a, b) => a.localeCompare(b));

    const chartData = sortedDates.map(dateKey => {
      const [_year, month, day] = dateKey.split('-');
      return {
        name: `${day}.${month}`,
        'Średnia intensywność': Number((aggregatedData[dateKey].sum / aggregatedData[dateKey].count).toFixed(1)),
        'Liczba głodów': aggregatedData[dateKey].count,
      };
    });

    return chartData;
  };

  const chartData = processData(data, timeRange);

  const timeRangeLabels: { [key in TimeRange]: string } = {
    week: 'ostatnie 7 dni',
    month: 'ostatnie 30 dni',
    all: 'cała historia'
  };

  const TimeRangeButton: React.FC<{range: TimeRange, label: string}> = ({range, label}) => {
      const isActive = timeRange === range;
      const baseClasses = "px-3 py-1 text-sm rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-teal-400";
      const activeClasses = "bg-teal-600 text-white font-semibold";
      const inactiveClasses = "bg-slate-700 hover:bg-slate-600 text-slate-300";
      return (
          <button onClick={() => setTimeRange(range)} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
              {label}
          </button>
      )
  }

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
        <h2 className="text-xl font-semibold text-slate-100">Postępy w czasie ({timeRangeLabels[timeRange]})</h2>
        <div className="flex items-center gap-2 self-end sm:self-center">
            <TimeRangeButton range="week" label="7 Dni" />
            <TimeRangeButton range="month" label="30 Dni" />
            <TimeRangeButton range="all" label="Wszystko" />
        </div>
      </div>
      {chartData.length === 0 ? (
        <div className="text-center text-slate-400 py-10">
          <p>Brak danych do wyświetlenia w tym okresie.</p>
          <p className="text-sm">Zarejestruj swój pierwszy głód, aby zobaczyć postępy.</p>
        </div>
      ) : (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis yAxisId="left" stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" stroke="#67e8f9" />
              <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(71, 85, 105, 0.5)'}}/>
              <Legend wrapperStyle={{color: '#cbd5e1'}}/>
              <Bar yAxisId="left" dataKey="Średnia intensywność" fill="#2dd4bf" maxBarSize={40} />
              <Bar yAxisId="left" dataKey="Liczba głodów" fill="#0f766e" maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
