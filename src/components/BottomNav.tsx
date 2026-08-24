import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  User,
  Plus,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  onOpenAddTx: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenAddTx }) => {
  const { activeTab, setActiveTab } = useFinance();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'History', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { id: 'analytics', label: 'Reports', icon: <PieChart className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budgets', icon: <Target className="w-5 h-5" /> },
    { id: 'profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2 lg:hidden transition-colors">
      <div className="flex items-center justify-around relative">
        {navItems.slice(0, 2).map((item) => (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              activeTab === item.id
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === item.id ? 'bg-indigo-50 dark:bg-indigo-950/70' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        ))}

        {/* Center Floating Action Button */}
        <div className="flex flex-col items-center -mt-6">
          <button
            id="fab-add-transaction-btn"
            onClick={onOpenAddTx}
            className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40 active:scale-95 transition-transform"
            aria-label="Add transaction"
          >
            <Plus className="w-6 h-6" />
          </button>
          <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 mt-1">Add</span>
        </div>

        {navItems.slice(2).map((item) => (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              activeTab === item.id
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === item.id ? 'bg-indigo-50 dark:bg-indigo-950/70' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
