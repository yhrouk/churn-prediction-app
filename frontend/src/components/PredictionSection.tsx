import React, { useState } from 'react';
import { predictChurn, type BackendPredictPayload, type PredictResponse } from '../services/api';

export const PredictionSection: React.FC = () => {
  const [tenure, setTenure] = useState<number>(12);
  const [monthlyCharges, setMonthlyCharges] = useState<number>(85.5);
  const [contract, setContract] = useState<string>('Month-to-month');

  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload: BackendPredictPayload = {
      tenure: Number(tenure),
      monthly_charges: Number(monthlyCharges),
      contract,
    };

    try {
      const res = await predictChurn(payload);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Prediction request failed');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (prob: number) => {
    if (prob >= 0.7) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (prob >= 0.3) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form Input */}
      <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-1">Customer Churn Evaluator</h3>
        <p className="text-xs text-slate-400 mb-6">Enter customer metrics to compute probability of churn.</p>

        {error && (
          <div className="p-3 mb-4 text-xs text-rose-400 bg-rose-950/50 border border-rose-800/60 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tenure (Months)</label>
            <input
              type="number"
              min="0"
              value={tenure}
              onChange={(e) => setTenure(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Monthly Charges ($)</label>
            <input
              type="number"
              step="0.1"
              value={monthlyCharges}
              onChange={(e) => setMonthlyCharges(Number(e.target.value))}
              required
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Contract Type</label>
            <select
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="Month-to-month">Month-to-month</option>
              <option value="One year">One year</option>
              <option value="Two year">Two year</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="sm:col-span-2 mt-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm rounded-xl shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer"
          >
            {loading ? 'Processing Model Payload...' : 'Calculate Churn Risk'}
          </button>
        </form>
      </div>

      {/* Probability Result */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col justify-between backdrop-blur-sm">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Probability Output</h3>
          <p className="text-xs text-slate-400 mb-6">Real-time model inference result</p>

          {result ? (
            <div className="space-y-6">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Risk Classification</span>
                <span className={`inline-block px-3 py-1 text-xs font-bold rounded-lg border ${getRiskColor(result.probability)}`}>
                  {result.probability >= 0.7 ? 'HIGH RISK' : result.probability >= 0.3 ? 'MEDIUM RISK' : 'LOW RISK'}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-400 block mb-1">Estimated Probability</span>
                <p className="text-4xl font-extrabold text-white">{(result.probability * 100).toFixed(1)}%</p>
              </div>

              <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                <div
                  className="bg-indigo-500 h-full transition-all duration-500"
                  style={{ width: `${result.probability * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-center text-slate-500 border border-dashed border-slate-800 rounded-xl p-4 text-xs">
              Submit model parameters to estimate churn probability.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};