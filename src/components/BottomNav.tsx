import React from 'react';
import { useCampus } from '../context/CampusContext';
import {
  LayoutDashboard,
  Sparkles,
  Calendar,
  BookOpen,
  CheckSquare,
  Shield,
  Code2,
} from 'lucide-react';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, userRole, unreadNotificationCount, assignments } = useCampus();

  const pendingAssignmentsCount = assignments.filter(
    (a) => a.status === 'Pending' || a.status === 'In Progress'
  ).length;

  const navItems: {
    id: ActiveTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    highlight?: boolean;
  }[] = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'ai-assistant',
      label: 'AI Tutor',
      icon: <Sparkles className="w-5 h-5" />,
      highlight: true,
    },
    {
      id: 'events',
      label: 'Events',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      id: 'resources',
      label: 'Notes',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'assignments',
      label: 'Tasks',
      icon: <CheckSquare className="w-5 h-5" />,
      badge: pendingAssignmentsCount > 0 ? pendingAssignmentsCount : undefined,
    },
    {
      id: userRole === 'faculty' ? 'admin' : 'android-source',
      label: userRole === 'faculty' ? 'Admin' : 'Android App',
      icon: userRole === 'faculty' ? <Shield className="w-5 h-5" /> : <Code2 className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around z-30 shrink-0 select-none shadow-lg">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl transition-all relative ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            {/* Active Pill Indicator (Material 3 style) */}
            <div
              className={`px-4 py-1 rounded-full flex items-center justify-center transition-all ${
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 dark:from-indigo-950 dark:to-violet-950 text-indigo-600 dark:text-indigo-300'
                    : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400'
                  : 'bg-transparent'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
            <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
