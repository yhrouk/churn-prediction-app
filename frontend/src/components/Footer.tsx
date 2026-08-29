import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/40 border-t border-slate-800/80 py-6 text-slate-400 text-xs mt-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Churn AI Platform. All rights reserved.</p>
        <div className="flex space-x-6">
          <span className="hover:text-slate-200 cursor-pointer">Privacy Policy</span>
          <span className="hover:text-slate-200 cursor-pointer">API Specs</span>
        </div>
      </div>
    </footer>
  );
};