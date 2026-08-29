import React from 'react';

export const AnalyticsCharts: React.FC = () => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
      <h3 className="text-xl font-bold text-white mb-1">Analytics Overview</h3>
      <p className="text-xs text-slate-400 mb-6">Customer retention insights and distributions.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 h-48 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Churn by Contract Type</span>
          <div className="flex items-end justify-between h-28 pt-4 px-2">
            <div className="flex flex-col items-center gap-1 w-1/3">
              <div className="w-full bg-indigo-500/80 h-20 rounded-t-md" />
              <span className="text-[10px] text-slate-400">Monthly</span>
            </div>
            <div className="flex flex-col items-center gap-1 w-1/3">
              <div className="w-full bg-indigo-500/40 h-8 rounded-t-md" />
              <span className="text-[10px] text-slate-400">1-Year</span>
            </div>
            <div className="flex flex-col items-center gap-1 w-1/3">
              <div className="w-full bg-indigo-500/20 h-4 rounded-t-md" />
              <span className="text-[10px] text-slate-400">2-Year</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 h-48 flex flex-col justify-between">
          <span className="text-xs text-slate-400 font-semibold uppercase">Risk Distribution</span>
          <div className="space-y-3 my-auto">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-emerald-400">Low Risk</span>
                <span className="text-slate-400">62%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full"><div className="bg-emerald-500 h-2 rounded-full w-[62%]" /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-400">Medium Risk</span>
                <span className="text-slate-400">23%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full"><div className="bg-amber-500 h-2 rounded-full w-[23%]" /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-400">High Risk</span>
                <span className="text-slate-400">15%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full"><div className="bg-rose-500 h-2 rounded-full w-[15%]" /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};