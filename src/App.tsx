import React from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './components/Dashboard';
import { AIAssistant } from './components/AIAssistant';
import { EventManagement } from './components/EventManagement';
import { StudyResourcesHub } from './components/StudyResourcesHub';
import { AssignmentTracker } from './components/AssignmentTracker';
import { NotificationCenter } from './components/NotificationCenter';
import { AdminPanel } from './components/AdminPanel';
import { AndroidSourceViewer } from './components/AndroidSourceViewer';
import { StudentIDCardModal } from './components/StudentIDCardModal';
import { PushBannerToast } from './components/PushBannerToast';
import {
  Wifi,
  BatteryMedium,
  Signal,
  Smartphone,
  LayoutDashboard,
  Sparkles,
  Calendar,
  BookOpen,
  CheckSquare,
  Shield,
  Code2,
  Bell,
  GraduationCap,
  Maximize2,
} from 'lucide-react';
import { ActiveTab } from './types';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileFrame,
    toggleMobileFrame,
    currentStudent,
    userRole,
    unreadNotificationCount,
    setIsIdCardOpen,
  } = useCampus();

  // Tab Screen Dispatcher
  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'events':
        return <EventManagement />;
      case 'resources':
        return <StudyResourcesHub />;
      case 'assignments':
        return <AssignmentTracker />;
      case 'notifications':
        return <NotificationCenter />;
      case 'admin':
        return <AdminPanel />;
      case 'android-source':
        return <AndroidSourceViewer />;
      default:
        return <Dashboard />;
    }
  };

  const desktopSidebarLinks: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }[] = [
    {
      id: 'dashboard',
      label: 'Student Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'ai-assistant',
      label: 'AI Student Assistant',
      icon: <Sparkles className="w-5 h-5 text-indigo-400" />,
    },
    {
      id: 'events',
      label: 'Campus Events & Passes',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'resources',
      label: 'Notes & Resources Hub',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'assignments',
      label: 'Assignment Tracker',
      icon: <CheckSquare className="w-5 h-5" />,
    },
    {
      id: 'notifications',
      label: 'Notifications & Alerts',
      icon: <Bell className="w-5 h-5" />,
      badge: unreadNotificationCount > 0 ? unreadNotificationCount : undefined,
    },
    {
      id: 'admin',
      label: 'Faculty Admin Portal',
      icon: <Shield className="w-5 h-5" />,
    },
    {
      id: 'android-source',
      label: 'Android Kotlin Studio Code',
      icon: <Code2 className="w-5 h-5 text-emerald-400" />,
    },
  ];

  // 1. Android Phone Device Frame Mode (Simulating Android Physical Chassis)
  if (isMobileFrame) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-2 sm:p-6 select-none font-sans">
        {/* Device Frame Control Bar */}
        <div className="mb-2.5 flex items-center justify-between w-full max-w-[400px] px-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono font-bold text-indigo-400">
              <Smartphone className="w-3.5 h-3.5" /> Android Device (Material 3)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
              Pixel 8 Pro
            </span>
          </div>

          <button
            onClick={toggleMobileFrame}
            className="text-xs font-semibold text-slate-300 hover:text-white flex items-center gap-1 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-xl transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Fullscreen View</span>
          </button>
        </div>

        {/* Physical Smartphone Chassis */}
        <div className="w-full max-w-[400px] h-[860px] max-h-[94vh] bg-slate-900 rounded-[50px] p-3 shadow-2xl shadow-indigo-950/80 ring-1 ring-slate-700/80 relative flex flex-col overflow-hidden">
          {/* Inner Bezel Screen */}
          <div className="w-full h-full bg-slate-50 dark:bg-slate-950 rounded-[40px] flex flex-col overflow-hidden relative border border-slate-800">
            {/* Heads-up Android Push Notification Toast */}
            <PushBannerToast />

            {/* Android Status Bar */}
            <div className="h-7 bg-white dark:bg-slate-900 flex items-center justify-between px-6 text-[11px] font-semibold text-slate-800 dark:text-slate-200 z-30 shrink-0 select-none border-b border-slate-100 dark:border-slate-800/60">
              <span>9:41</span>
              {/* Front Camera Notch Hole */}
              <div className="w-3.5 h-3.5 rounded-full bg-black mx-auto ring-1 ring-slate-800" />
              <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Mobile App Bar */}
            <Navbar />

            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto p-3.5 relative no-scrollbar">
              {renderActiveScreen()}
            </main>

            {/* Bottom Android Navigation Bar */}
            <BottomNav />

            {/* Android Gesture Navigation Bar Pill */}
            <div className="h-3.5 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0">
              <div className="w-28 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>

        {/* Digital Student ID Card Modal */}
        <StudentIDCardModal />
      </div>
    );
  }

  // 2. Fullscreen Responsive Desktop / Tablet Layout
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased transition-colors relative">
      {/* Heads-up Toast */}
      <PushBannerToast />

      {/* Desktop Navigation Sidebar */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-white flex-col shrink-0 border-r border-slate-800 select-none">
        {/* Brand Header */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-800">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-black text-white tracking-tight block">
              CampusPulse AI
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block">
              Student Mobile Hub
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto no-scrollbar">
          {desktopSidebarLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                id={`desktop-nav-${link.id}`}
                onClick={() => setActiveTab(link.id)}
                className={`w-full p-2.5 rounded-2xl flex items-center justify-between transition-all text-xs font-semibold ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Student Quick Profile Card in Sidebar */}
        <div className="p-3.5 border-t border-slate-800">
          <div
            onClick={() => setIsIdCardOpen(true)}
            className="flex items-center gap-3 bg-slate-800/80 hover:bg-slate-800 p-2.5 rounded-2xl cursor-pointer transition-colors"
          >
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-indigo-400"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{currentStudent.name}</p>
              <p className="text-[10px] text-indigo-300 truncate">
                {currentStudent.studentId} • Sem {currentStudent.semester}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Navbar />

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
          {renderActiveScreen()}
        </main>
      </div>

      {/* Bottom Bar for Mobile Screen Viewports */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30">
        <BottomNav />
      </div>

      {/* Digital Student ID Card Modal */}
      <StudentIDCardModal />
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <MainAppContent />
    </CampusProvider>
  );
}
