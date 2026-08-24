import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  Moon,
  Sun,
  Bell,
  Smartphone,
  Monitor,
  Download,
  Plus,
} from 'lucide-react';

interface NavbarProps {
  onOpenNotifications: () => void;
  onOpenBackup: () => void;
  onOpenAddTx: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNotifications,
  onOpenBackup,
  onOpenAddTx,
}) => {
  const {
    user,
    unreadNotificationCount,
    isDarkMode,
    toggleDarkMode,
    isMobileFrame,
    toggleMobileFrame,
    setActiveTab,
    activeTab,
  } = useFinance();

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          id="brand-logo-btn"
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <span className="text-base font-extrabold">F</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                FinTrack
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Daily Financial Management
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex lg:hidden items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'transactions', label: 'Transactions' },
            { id: 'analytics', label: 'Analytics' },
            { id: 'budgets', label: 'Budgets' },
          ].map((tab) => (
            <button
              key={tab.id}
              id={`nav-link-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Quick Add Button */}
          <button
            id="quick-add-tx-nav-btn"
            onClick={onOpenAddTx}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:shadow-indigo-600/30 active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Backup & Export */}
          <button
            id="backup-nav-btn"
            onClick={onOpenBackup}
            title="Backup & Export Data"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Mobile Frame Toggle */}
          <button
            id="mobile-frame-toggle-btn"
            onClick={toggleMobileFrame}
            title={isMobileFrame ? 'Switch to Fullscreen Responsive View' : 'Switch to Mobile Android Device Frame'}
            className={`p-2 rounded-xl transition-colors ${
              isMobileFrame
                ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Dark Mode Toggle */}
          <button
            id="dark-mode-toggle-btn"
            onClick={toggleDarkMode}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notification Center */}
          <button
            id="notification-center-btn"
            onClick={onOpenNotifications}
            title="Notifications & Alerts"
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* User Profile Avatar */}
          <div
            id="user-profile-nav-btn"
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-1 cursor-pointer select-none"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/60 shadow-xs"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
