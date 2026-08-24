import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Sparkles,
  Calendar,
  BookOpen,
  CheckSquare,
  Clock,
  MapPin,
  AlertCircle,
  QrCode,
  ArrowRight,
  TrendingUp,
  Award,
  ChevronRight,
  UserCheck,
  CheckCircle2,
  Share2,
  Code2,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    currentStudent,
    schedule,
    announcements,
    events,
    assignments,
    setActiveTab,
    setIsIdCardOpen,
    registerForEvent,
    setSelectedEventForDetail,
    updateAssignmentStatus,
    sendAiMessage,
    setActiveQuickPrompt,
  } = useCampus();

  const [aiQuickInput, setAiQuickInput] = useState('');

  // Pending assignments sorted by due date
  const pendingAssignments = assignments
    .filter((a) => a.status === 'Pending' || a.status === 'In Progress')
    .slice(0, 3);

  // Pinned or recent announcements
  const topAnnouncements = announcements.slice(0, 2);

  // Next upcoming event
  const featuredEvent = events.find((e) => e.isFeatured) || events[0];

  const handleQuickAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiQuickInput.trim()) {
      sendAiMessage(aiQuickInput.trim());
      setActiveTab('ai-assistant');
      setAiQuickInput('');
    }
  };

  const handleLaunchPrompt = (prompt: string) => {
    setActiveQuickPrompt(prompt);
    sendAiMessage(prompt);
    setActiveTab('ai-assistant');
  };

  return (
    <div className="space-y-5 pb-6">
      {/* Welcome & Student Status Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 text-white p-5 sm:p-6 shadow-xl shadow-indigo-950/20">
        {/* Background Subtle Wave Accents */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={currentStudent.avatarUrl}
              alt={currentStudent.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/30 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider text-indigo-100">
                  {currentStudent.major}
                </span>
                <span className="text-xs text-indigo-200">Year {currentStudent.year}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                Good morning, {currentStudent.name.split(' ')[0]}!
              </h2>
              <p className="text-xs text-indigo-200/90 font-medium">
                {currentStudent.studentId} • {currentStudent.campusBranch}
              </p>
            </div>
          </div>

          {/* Quick QR Pass Button */}
          <button
            onClick={() => setIsIdCardOpen(true)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-3.5 py-2 rounded-2xl transition-all shadow-sm"
          >
            <QrCode className="w-4 h-4 text-indigo-300" />
            <span>Digital ID Card</span>
          </button>
        </div>

        {/* Academic Performance Snapshot Cards */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-white/10">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 text-indigo-200 text-[11px] font-medium">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Current CGPA</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white mt-1">
              {currentStudent.cgpa}{' '}
              <span className="text-[10px] text-indigo-200 font-normal">/ 4.0</span>
            </div>
            <div className="text-[10px] text-emerald-300 font-semibold flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> Top 5%
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 text-indigo-200 text-[11px] font-medium">
              <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Attendance</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white mt-1">
              {currentStudent.attendancePercentage}%
            </div>
            <div className="text-[10px] text-emerald-300 font-semibold">Safe (&gt; 75%)</div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5 text-indigo-200 text-[11px] font-medium">
              <BookOpen className="w-3.5 h-3.5 text-blue-300" />
              <span>Credits Done</span>
            </div>
            <div className="text-lg sm:text-xl font-black text-white mt-1">
              {currentStudent.creditsCompleted}{' '}
              <span className="text-[10px] text-indigo-200 font-normal">
                /{currentStudent.totalCredits}
              </span>
            </div>
            <div className="text-[10px] text-indigo-200 font-medium">On Track</div>
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Query Bar */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 rounded-3xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
              CampusPulse AI Tutor & Copilot
            </span>
          </div>
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
          >
            Open Full AI Chat <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <form onSubmit={handleQuickAiSubmit} className="relative mt-2">
          <input
            type="text"
            value={aiQuickInput}
            onChange={(e) => setAiQuickInput(e.target.value)}
            placeholder="Ask AI: 'Explain Deadlock', '5-day exam plan', 'What events this week?'..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-4 pr-24 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>Ask</span>
          </button>
        </form>

        {/* Preset Smart Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-2.5 pt-1">
          {[
            'What events are happening this week?',
            'Explain Virtual Memory in OS',
            'Give me a 5-day study plan for exams',
            'What assignments are due?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleLaunchPrompt(prompt)}
              className="text-[11px] whitespace-nowrap bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 px-2.5 py-1 rounded-xl transition-all font-medium"
            >
              💡 {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Today's Class Schedule */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
              Today's Class Schedule (Monday)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {schedule.length} Sessions
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {schedule.slice(0, 3).map((item, index) => {
            const isOngoing = index === 0;
            const isNext = index === 1;

            return (
              <div
                key={item.id}
                className={`rounded-2xl p-4 border transition-all ${
                  isOngoing
                    ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-1 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isOngoing
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : isNext
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {isOngoing ? '● Happening Now' : isNext ? 'Next up (11:00 AM)' : 'Afternoon'}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                    {item.type}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {item.courseCode}: {item.courseName}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Instructor: {item.instructor}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-medium">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-rose-500" />
                    <span>{item.room}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Urgent Assignments & Pinned Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pending Assignments */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Pending Assignments
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('assignments')}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
            >
              View All ({assignments.length}) <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingAssignments.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">
                🎉 No pending assignments! You're all caught up.
              </div>
            ) : (
              pendingAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 hover:border-indigo-300 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                        {asg.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {asg.courseCode}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1 truncate">
                      {asg.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-amber-500" /> Due: {asg.dueDate} at{' '}
                      {asg.dueTime}
                    </p>
                  </div>

                  <button
                    onClick={() => updateAssignmentStatus(asg.id, 'Submitted')}
                    title="Mark as Completed"
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pinned College Announcements */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Official Campus Notices
              </h3>
            </div>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full">
              Pinned
            </span>
          </div>

          <div className="space-y-2.5">
            {topAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="p-3 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40"
              >
                <div className="flex items-center justify-between text-[10px] text-amber-800 dark:text-amber-300 font-semibold mb-1">
                  <span>{ann.authorRole}</span>
                  <span>{ann.timeAgo}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ann.title}</h4>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                  {ann.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Campus Event Banner with Instant Registration */}
      {featuredEvent && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="relative h-36 sm:h-44 w-full overflow-hidden">
            <img
              src={featuredEvent.bannerImage}
              alt={featuredEvent.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="bg-indigo-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                Featured {featuredEvent.category} Event
              </span>
            </div>
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <h3 className="text-base sm:text-lg font-black tracking-tight leading-snug">
                {featuredEvent.title}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                <span>📅 {featuredEvent.date}</span>
                <span>•</span>
                <span>📍 {featuredEvent.venue}</span>
              </p>
            </div>
          </div>

          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 max-w-xl">
              {featuredEvent.description}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setSelectedEventForDetail(featuredEvent)}
                className="flex-1 sm:flex-none text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                Details
              </button>

              {featuredEvent.isRegistered ? (
                <button
                  onClick={() => setActiveTab('events')}
                  className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 text-white flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pass Ready</span>
                </button>
              ) : (
                <button
                  onClick={() => registerForEvent(featuredEvent.id)}
                  className="flex-1 sm:flex-none text-xs font-bold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all"
                >
                  <span>1-Click Register</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Portals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('resources')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-400 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Study Notes Hub</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Syllabus, PDFs & Past Papers
          </p>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-400 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Calendar className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Campus Events</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Fests, Talks & QR Passes
          </p>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-400 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Assignment Board</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Submission Trackers & AI Help
          </p>
        </button>

        <button
          onClick={() => setActiveTab('android-source')}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-400 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
            <Code2 className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Android Studio Kit</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Kotlin / Jetpack Code & ZIP
          </p>
        </button>
      </div>
    </div>
  );
};
