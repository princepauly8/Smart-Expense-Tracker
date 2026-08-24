import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { TransactionList } from './components/TransactionList';
import { Analytics } from './components/Analytics';
import { BudgetManager } from './components/BudgetManager';
import { UserProfileModal } from './components/UserProfileModal';
import { TransactionModal } from './components/TransactionModal';
import { TransactionDetailModal } from './components/TransactionDetailModal';
import { ReceiptScannerModal } from './components/ReceiptScannerModal';
import { DataBackupModal } from './components/DataBackupModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import {
  Wifi,
  BatteryMedium,
  Signal,
  Smartphone,
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Target,
  User,
  Plus,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { ActiveTab, TransactionType } from './types';

const MainContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileFrame,
    toggleMobileFrame,
    user,
  } = useFinance();

  // Modals state
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [addTxDefaultType, setAddTxDefaultType] = useState<TransactionType>('expense');
  const [editingTxId, setEditingTxId] = useState<string | null>(null);
  const [viewingTxId, setViewingTxId] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleOpenAddTx = (type: TransactionType = 'expense') => {
    setEditingTxId(null);
    setAddTxDefaultType(type);
    setIsAddTxOpen(true);
  };

  const handleEditTx = (txId: string) => {
    setEditingTxId(txId);
    setIsAddTxOpen(true);
  };

  const handleViewTx = (txId: string) => {
    setViewingTxId(txId);
  };

  // Screen content selector
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onOpenAddTx={handleOpenAddTx}
            onOpenScanReceipt={() => setIsScannerOpen(true)}
            onOpenTxDetail={handleViewTx}
          />
        );
      case 'transactions':
        return (
          <TransactionList
            onOpenAddTx={() => handleOpenAddTx('expense')}
            onEditTx={handleEditTx}
            onViewTxDetail={handleViewTx}
          />
        );
      case 'analytics':
        return <Analytics />;
      case 'budgets':
        return <BudgetManager />;
      case 'profile':
        return <UserProfileModal />;
      default:
        return null;
    }
  };

  // Sidebar navigation items for desktop
  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'transactions', label: 'Transactions', icon: <ArrowLeftRight className="w-5 h-5" /> },
    { id: 'analytics', label: 'Reports & Analytics', icon: <PieChart className="w-5 h-5" /> },
    { id: 'budgets', label: 'Budgets & Goals', icon: <Target className="w-5 h-5" /> },
    { id: 'profile', label: 'Settings & Account', icon: <SlidersHorizontal className="w-5 h-5" /> },
  ];

  // If in Mobile Device Frame Mode (Android Pixel Frame)
  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-2 sm:p-6 select-none font-sans">
        {/* Device Frame Toolbar Header */}
        <div className="mb-3 flex items-center justify-between w-full max-w-sm px-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-mono font-semibold text-indigo-400">
            <Smartphone className="w-3.5 h-3.5" /> Android Device Preview
          </span>
          <button
            onClick={toggleMobileFrame}
            className="hover:text-white underline text-[11px]"
          >
            Switch to Fullscreen
          </button>
        </div>

        {/* Physical Smartphone Chassis */}
        <div className="w-full max-w-[395px] h-[830px] max-h-[92vh] bg-black rounded-[48px] p-3 shadow-2xl shadow-indigo-950/60 ring-1 ring-slate-800 relative flex flex-col overflow-hidden">
          {/* Inner Screen Bezel */}
          <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[38px] flex flex-col overflow-hidden relative">
            {/* Android Status Bar */}
            <div className="h-7 bg-slate-100 dark:bg-slate-900 flex items-center justify-between px-6 text-[11px] font-semibold text-slate-800 dark:text-slate-200 z-30 shrink-0 select-none">
              <span>9:41</span>
              {/* Camera Notch Hole */}
              <div className="w-4 h-4 rounded-full bg-black mx-auto" />
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mobile App Bar */}
            <Navbar
              onOpenNotifications={() => setIsNotificationOpen(true)}
              onOpenBackup={() => setIsBackupOpen(true)}
              onOpenAddTx={() => handleOpenAddTx('expense')}
            />

            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto p-4 relative no-scrollbar">
              {renderTabContent()}
            </main>

            {/* Bottom Android Navigation Bar */}
            <BottomNav onOpenAddTx={() => handleOpenAddTx('expense')} />

            {/* Android Home Navigation Pill */}
            <div className="h-4 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
              <div className="w-24 h-1 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
          </div>
        </div>

        {/* Modals Container */}
        <TransactionModal
          isOpen={isAddTxOpen}
          onClose={() => {
            setIsAddTxOpen(false);
            setEditingTxId(null);
          }}
          editTxId={editingTxId}
          initialType={addTxDefaultType}
        />

        <TransactionDetailModal
          txId={viewingTxId}
          onClose={() => setViewingTxId(null)}
          onEdit={handleEditTx}
        />

        <ReceiptScannerModal
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
        />

        <DataBackupModal
          isOpen={isBackupOpen}
          onClose={() => setIsBackupOpen(false)}
        />

        <NotificationDrawer
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
        />
      </div>
    );
  }

  // Standard Edge-to-Edge Responsive Layout (Professional Polish Theme)
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased transition-colors">
      {/* Desktop Sidebar (Professional Polish Theme) */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col shrink-0 border-r border-slate-800/80 select-none">
        {/* Brand Header */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800/60">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-600/30">
            F
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight block">
              FinTrack Pro
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
              Financial Suite
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`sidebar-link-${link.id}`}
                onClick={() => setActiveTab(link.id)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all text-sm font-semibold ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <span className={isActive ? 'text-white' : 'text-slate-400'}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Card at bottom of sidebar */}
        <div className="p-4 border-t border-slate-800">
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 p-3 rounded-xl cursor-pointer transition-colors"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/40"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-indigo-400 font-medium">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenBackup={() => setIsBackupOpen(true)}
          onOpenAddTx={() => handleOpenAddTx('expense')}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderTabContent()}
        </main>
      </div>

      <BottomNav onOpenAddTx={() => handleOpenAddTx('expense')} />

      {/* Global Modals */}
      <TransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTxId(null);
        }}
        editTxId={editingTxId}
        initialType={addTxDefaultType}
      />

      <TransactionDetailModal
        txId={viewingTxId}
        onClose={() => setViewingTxId(null)}
        onEdit={handleEditTx}
      />

      <ReceiptScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
      />

      <DataBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
