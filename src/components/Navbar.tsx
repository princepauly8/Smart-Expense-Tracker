import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  GraduationCap,
  Bell,
  QrCode,
  Smartphone,
  Maximize2,
  Sparkles,
  Shield,
  User,
  Search,
  Code2,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentStudent,
    userRole,
    switchProfile,
    unreadNotificationCount,
    setActiveTab,
    isMobileFrame,
    toggleMobileFrame,
    setIsIdCardOpen,
  } = useCampus();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 py-2.5 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Campus Brand & Student Status */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 cursor-pointer shrink-0"
          >
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white truncate">
                CampusPulse
              </span>
              <span className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-md">
                {userRole === 'faculty' ? 'Faculty Admin' : `Sem ${currentStudent.semester}`}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {currentStudent.name} • {userRole === 'faculty' ? 'Dean Office' : 'CS & AI'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick AI Trigger */}
          <button
            onClick={() => setActiveTab('ai-assistant')}
            id="nav-ai-btn"
            title="Ask CampusPulse AI"
            className="hidden sm:flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 dark:from-indigo-950/50 dark:to-violet-950/50 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>AI Tutor</span>
          </button>

          {/* Android Kotlin Source Code Viewer */}
          <button
            onClick={() => setActiveTab('android-source')}
            id="nav-android-source-btn"
            title="View Android Studio Source Code & Architecture"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
          >
            <Code2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </button>

          {/* Student ID Card Pass */}
          <button
            onClick={() => setIsIdCardOpen(true)}
            id="nav-id-card-btn"
            title="Digital Student ID & Library Pass"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <QrCode className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setActiveTab('notifications')}
            id="nav-notifications-btn"
            title="Campus Notifications & Alerts"
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          {/* Device Frame Toggle (Android Chassis vs Fullscreen) */}
          <button
            onClick={toggleMobileFrame}
            id="nav-frame-toggle-btn"
            title={isMobileFrame ? 'Expand to Fullscreen View' : 'Switch to Android Device Frame'}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isMobileFrame ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
              id="nav-role-switcher-btn"
              className="flex items-center gap-1.5 p-1.5 pl-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <img
                src={currentStudent.avatarUrl}
                alt={currentStudent.name}
                className="w-5 h-5 rounded-lg object-cover ring-1 ring-indigo-500/40"
              />
              <span className="hidden md:inline capitalize">{userRole}</span>
            </button>

            {isRoleMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                onClick={() => setIsRoleMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentStudent.name}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    ID: {currentStudent.studentId}
                  </p>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => switchProfile('student')}
                    className={`w-full px-3 py-2 text-left text-xs rounded-xl flex items-center gap-2.5 transition-colors ${
                      userRole === 'student'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <div>
                      <div className="font-semibold">Student Mode</div>
                      <div className="text-[10px] text-slate-400">Alex Rivera (B.Tech Sem 5)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => switchProfile('faculty')}
                    className={`w-full px-3 py-2 text-left text-xs rounded-xl flex items-center gap-2.5 transition-colors mt-1 ${
                      userRole === 'faculty'
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-500" />
                    <div>
                      <div className="font-semibold">Faculty & Admin Mode</div>
                      <div className="text-[10px] text-slate-400">Dr. Marcus Vance (HOD)</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
