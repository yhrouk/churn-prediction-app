import React from 'react';

interface NavbarProps {
  username?: string;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ username = 'User', onLogout }) => {
  return (
    <header className="bg-slate-900/90 border-b border-slate-800 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* App Title / Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
            C
          </div>
          <div>
            <h1 className="text-base font-bold text-white leading-none">Churn AI</h1>
            <span className="text-[10px] text-slate-400 font-medium">Analytics & Prediction Platform</span>
          </div>
        </div>

        {/* User Info & Logout Button */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-slate-400">Welcome,</p>
            <p className="text-xs font-semibold text-slate-200">{username}</p>
          </div>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 hover:border-rose-800/60 text-slate-300 border border-slate-700/60 font-medium text-xs rounded-xl transition-all cursor-pointer"
          >
            Log Out
          </button>
        </div>

      </div>
    </header>
  );
};