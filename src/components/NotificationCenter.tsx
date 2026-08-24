import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  CheckSquare,
  BookOpen,
  Send,
  Sparkles,
  AlertTriangle,
  Clock,
  Shield,
  Smartphone,
} from 'lucide-react';
import { NotificationCategory } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    triggerPushNotification,
    setActiveTab,
  } = useCampus();

  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [customTitle, setCustomTitle] = useState('Exam Hall Ticket Released');
  const [customMessage, setCustomMessage] = useState(
    'Mid-term examination hall passes are now downloadable from the portal.'
  );
  const [customCategory, setCustomCategory] = useState<NotificationCategory>('academic');

  const filters = ['All', 'academic', 'assignment', 'event', 'admin'];

  const filteredNotifications = notifications.filter((n) => {
    return selectedFilter === 'All' || n.category === selectedFilter;
  });

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'event':
        return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'assignment':
        return <CheckSquare className="w-4 h-4 text-rose-500" />;
      case 'academic':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Campus Notification Center
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Official broadcasts, deadline warnings, event passes & simulated Android push alerts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsAsRead}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark All Read</span>
            </button>

            <button
              onClick={clearNotifications}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Clear all alerts"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                selectedFilter === f
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No notifications in this category
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markNotificationAsRead(notif.id);
                if (notif.actionTab) {
                  setActiveTab(notif.actionTab);
                } else if (notif.category === 'event') {
                  setActiveTab('events');
                } else if (notif.category === 'assignment') {
                  setActiveTab('assignments');
                } else if (notif.category === 'academic') {
                  setActiveTab('resources');
                }
              }}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                notif.isRead
                  ? 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                  : 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800/80 shadow-sm'
              }`}
            >
              <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(notif.category)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {notif.category} Alert
                    </span>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                  {notif.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Android Push Notification Simulator Tool */}
      <div className="bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2 text-indigo-400">
          <Smartphone className="w-4 h-4" />
          <h3 className="text-xs font-bold uppercase tracking-wider">
            Firebase Cloud Messaging (FCM) Simulator
          </h3>
        </div>
        <p className="text-xs text-slate-300">
          Test real-time Android push notifications on your simulated device. Trigger custom campus
          alerts or deadline warnings:
        </p>

        {/* Quick presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {[
            {
              title: '⚡ Hackathon Round 1 Results',
              msg: 'Finalists have been announced on the portal.',
              cat: 'event' as NotificationCategory,
              tab: 'events' as const,
            },
            {
              title: '⚠️ Assignment Due in 4 Hours',
              msg: 'Operating Systems Lab 2 submission deadline approaching.',
              cat: 'assignment' as NotificationCategory,
              tab: 'assignments' as const,
            },
            {
              title: '📢 Class Relocation Notice',
              msg: 'CS402 Distributed Systems lecture shifted to Auditorium B.',
              cat: 'academic' as NotificationCategory,
              tab: 'dashboard' as const,
            },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                triggerPushNotification(preset.title, preset.msg, preset.cat, preset.tab);
              }}
              className="text-[11px] whitespace-nowrap bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl transition-colors font-medium"
            >
              Push "{preset.title}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
