import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Shield,
  Megaphone,
  Calendar,
  BookOpen,
  Users,
  Plus,
  Send,
  AlertCircle,
  TrendingUp,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';
import { AnnouncementCategory } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    announcements,
    addAnnouncement,
    currentStudent,
    events,
    resources,
    triggerPushNotification,
  } = useCampus();

  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<AnnouncementCategory>('Exam');
  const [isPinned, setIsPinned] = useState(true);

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    addAnnouncement({
      title: annTitle,
      content: annContent,
      author: 'Dr. Marcus Vance (Head of Department)',
      authorRole: 'Faculty / Admin',
      category: annCategory,
      isPinned,
    });

    triggerPushNotification(
      `📢 ${annTitle}`,
      annContent.slice(0, 80) + '...',
      'admin'
    );

    setAnnTitle('');
    setAnnContent('');
  };

  const studentList = [
    {
      name: 'Alex Rivera',
      id: 'AIT-2023-CS-0842',
      cgpa: 3.86,
      attendance: 91.5,
      branch: 'CS & AI (Sem 5)',
      status: 'Dean’s Honor List',
    },
    {
      name: 'Sophia Chen',
      id: 'AIT-2023-CS-0811',
      cgpa: 3.92,
      attendance: 95.0,
      branch: 'CS & AI (Sem 5)',
      status: 'Dean’s Honor List',
    },
    {
      name: 'David Kim',
      id: 'AIT-2023-CS-0790',
      cgpa: 3.45,
      attendance: 84.0,
      branch: 'CS & AI (Sem 5)',
      status: 'Good Standing',
    },
    {
      name: 'Elena Rostova',
      id: 'AIT-2023-CS-0912',
      cgpa: 3.78,
      attendance: 89.2,
      branch: 'CS & AI (Sem 5)',
      status: 'Good Standing',
    },
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/30">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Faculty & Administration Portal
              </h2>
              <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-md">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Department of Computer Science & AI • Dean of Student Welfare
            </p>
          </div>
        </div>

        {/* Admin Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Enrolled Students
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">420</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Active Events
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {events.length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Verified Notes
            </span>
            <span className="text-lg font-black text-slate-900 dark:text-white">
              {resources.length}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Avg Batch CGPA
            </span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">3.68</span>
          </div>
        </div>
      </div>

      {/* Broadcast Announcement to Android Devices */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Broadcast Campus Notice to Students
          </h3>
        </div>

        <form onSubmit={handleBroadcastAnnouncement} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Notice Headline
            </label>
            <input
              type="text"
              required
              value={annTitle}
              onChange={(e) => setAnnTitle(e.target.value)}
              placeholder="e.g. Schedule for End-Semester Practical Examinations"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={annCategory}
                onChange={(e) => setAnnCategory(e.target.value as AnnouncementCategory)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Exam">Exam Notice</option>
                <option value="Academic">Academic Schedule</option>
                <option value="Urgent">Urgent / Dean Alert</option>
                <option value="Campus">Campus & Hostel</option>
                <option value="Placement">Placement & Career</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="pinNotice"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
              />
              <label
                htmlFor="pinNotice"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Pin to Student Dashboard
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Detailed Announcement
            </label>
            <textarea
              rows={3}
              required
              value={annContent}
              onChange={(e) => setAnnContent(e.target.value)}
              placeholder="Instructions, date, rules, and guidelines..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Notice & Send Android Push Alert</span>
          </button>
        </form>
      </div>

      {/* Student Directory Snapshot */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Student Performance & Attendance Roster
            </h3>
          </div>
          <span className="text-xs text-slate-500">Semester 5 (CS-AI Batch 2026)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Student ID</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {studentList.map((stu, i) => (
                <tr
                  key={i}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                      {stu.name[0]}
                    </div>
                    <span>{stu.name}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 dark:text-slate-400">
                    {stu.id}
                  </td>
                  <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">
                    {stu.cgpa}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">
                    <span className="text-emerald-600 font-semibold">{stu.attendance}%</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                      {stu.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
