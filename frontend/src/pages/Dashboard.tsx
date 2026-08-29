import React from 'react';
import { Navbar } from '../components/Navbar';
import { PredictionSection } from '../components/PredictionSection';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import {  Footer } from '../components/Footer'
import { OverviewKPIs } from '../components/OverviewKPIs';


interface DashboardProps {
  username: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ username, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      <div>
        {/* 1. Header Navigation */}
        <Navbar username={username} onLogout={onLogout} />

        {/* 2. Main Content Body */}
        <main className="max-w-7xl mx-auto p-6 space-y-10">
          
          <section>
            <OverviewKPIs totalCustomers={7043} atRiskCount={1869} churnRate={26.5} />
          </section>
          
          {/* Section A: Prediction Form & Probability Analysis */}
          <section>
            <PredictionSection />
          </section>

          {/* Section B: Visual Analytics Charts */}
          <section>
            <AnalyticsCharts />
          </section>

        </main>
      </div>

      {/* 3. Footer */}
      <Footer />
    </div>
  );
};