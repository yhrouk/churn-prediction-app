import React from 'react';

interface KPIProps {
  totalCustomers?: number;
  atRiskCount?: number;
  churnRate?: number;
}

export const OverviewKPIs: React.FC<KPIProps> = ({
  totalCustomers = 7043,
  atRiskCount = 1869,
  churnRate = 26.5,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Total Customers */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Total Customers
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-white">
            {totalCustomers.toLocaleString()}
          </span>
          <span className="text-xs text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
            Active Dataset
          </span>
        </div>
      </div>

      {/* 2. At Risk */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          At Risk
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-amber-400">
            {atRiskCount.toLocaleString()}
          </span>
          <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
            High / Med Tier
          </span>
        </div>
      </div>

      {/* 3. Churn Rate */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
          Churn Rate
        </span>
        <div className="flex items-baseline justify-between">
          <span className="text-3xl font-extrabold text-rose-400">
            {churnRate.toFixed(1)}%
          </span>
          <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-1 rounded-md border border-rose-500/20">
            Historical Average
          </span>
        </div>
      </div>
    </div>
  );
};