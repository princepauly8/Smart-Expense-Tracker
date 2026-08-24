import React from 'react';
import { useCampus } from '../context/CampusContext';
import { Bell, Sparkles, Calendar, BookOpen, CheckSquare, X } from 'lucide-react';

export const PushBannerToast: React.FC = () => {
  const { activePushBanner, dismissPushBanner, setActiveTab } = useCampus();

  if (!activePushBanner) return null;

  const getIcon = () => {
    switch (activePushBanner.category) {
      case 'event':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'assignment':
        return <CheckSquare className="w-4 h-4 text-rose-400" />;
      case 'academic':
        return <BookOpen className="w-4 h-4 text-blue-400" />;
      default:
        return <Bell className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-50 animate-bounce-short">
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 shadow-2xl rounded-2xl p-3 flex items-start gap-3 ring-1 ring-white/10">
        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
          {getIcon()}
        </div>
        <div
          className="flex-1 min-w-0 cursor-pointer"
          onClick={() => {
            if (activePushBanner.category === 'event') setActiveTab('events');
            else if (activePushBanner.category === 'assignment') setActiveTab('assignments');
            else if (activePushBanner.category === 'academic') setActiveTab('resources');
            dismissPushBanner();
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">
              CampusPulse Push Notification
            </span>
            <span className="text-[10px] text-slate-400">Just now</span>
          </div>
          <h4 className="text-xs font-bold text-white truncate">{activePushBanner.title}</h4>
          <p className="text-[11px] text-slate-300 line-clamp-1">{activePushBanner.message}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissPushBanner();
          }}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
