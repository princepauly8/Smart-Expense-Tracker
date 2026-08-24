import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  CheckSquare,
  Clock,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Calendar,
  X,
  Trash2,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Assignment, AssignmentPriority, AssignmentStatus } from '../types';

export const AssignmentTracker: React.FC = () => {
  const {
    assignments,
    addAssignment,
    updateAssignmentStatus,
    deleteAssignment,
    sendAiMessage,
    setActiveTab,
    setActiveQuickPrompt,
  } = useCampus();

  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Assignment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('CS301');
  const [newCourseName, setNewCourseName] = useState('Operating Systems & Concurrency');
  const [newDueDate, setNewDueDate] = useState('2026-10-30');
  const [newDueTime, setNewDueTime] = useState('11:59 PM');
  const [newPriority, setNewPriority] = useState<AssignmentPriority>('High');
  const [newWeight, setNewWeight] = useState('15% of Final Grade');
  const [newDesc, setNewDesc] = useState('');

  const subjects = ['All', 'CS301', 'CS402', 'AI310', 'MA301'];
  const statusFilters = ['All', 'Pending', 'In Progress', 'Submitted'];

  const filteredAssignments = assignments.filter((asg) => {
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Pending' && (asg.status === 'Pending' || asg.status === 'In Progress')) ||
      asg.status === selectedStatus;

    const matchesSubject = selectedSubject === 'All' || asg.courseCode === selectedSubject;
    return matchesStatus && matchesSubject;
  });

  const handleComplete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    updateAssignmentStatus(id, 'Submitted');

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (err) {
      console.log('Confetti effect triggered');
    }
  };

  const handleAskAiForHelp = (asg: Assignment) => {
    const prompt =
      asg.aiHelperPrompt ||
      `I am working on the assignment "${asg.title}" for ${asg.courseName} (${asg.courseCode}).
Description: ${asg.description}
Can you give me a structured step-by-step breakdown of how to solve this assignment, along with pseudocode/equations and common mistakes to avoid?`;

    setActiveQuickPrompt(prompt);
    sendAiMessage(prompt);
    setActiveTab('ai-assistant');
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addAssignment({
      title: newTitle,
      courseCode: newCourseCode,
      courseName: newCourseName,
      dueDate: newDueDate,
      dueTime: newDueTime,
      priority: newPriority,
      weight: newWeight,
      description:
        newDesc || 'Course assignment to be completed and submitted to the grading portal.',
      aiHelperPrompt: `Help me with my assignment: ${newTitle} (${newCourseCode}). Provide guidelines and architectural steps.`,
    });

    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  const pendingCount = assignments.filter(
    (a) => a.status === 'Pending' || a.status === 'In Progress'
  ).length;
  const submittedCount = assignments.filter(
    (a) => a.status === 'Submitted' || a.status === 'Graded'
  ).length;

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-6">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Assignment & Deadline Board
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Track lab submissions, term papers, project milestones & get AI homework assistance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-3">
            <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold uppercase tracking-wider block">
              Pending Submissions
            </span>
            <div className="text-xl font-black text-rose-900 dark:text-rose-100 mt-0.5">
              {pendingCount}
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl p-3">
            <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider block">
              Completed / Submitted
            </span>
            <div className="text-xl font-black text-emerald-900 dark:text-emerald-100 mt-0.5">
              {submittedCount}
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40 rounded-2xl p-3 col-span-2 sm:col-span-2 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider block">
                Completion Rate
              </span>
              <div className="text-xl font-black text-indigo-900 dark:text-indigo-100 mt-0.5">
                {assignments.length > 0
                  ? Math.round((submittedCount / assignments.length) * 100)
                  : 0}
                %
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block">
                On Schedule
              </span>
              <span className="text-[10px] text-slate-400">Semester 5</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1">
            {statusFilters.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedStatus === st
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Subject filter */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {subjects.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSubject(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedSubject === s
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Assignment Task Cards List */}
      <div className="space-y-3">
        {filteredAssignments.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              No tasks found in this view!
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              You've cleared all assignments for this selection.
            </p>
          </div>
        ) : (
          filteredAssignments.map((asg) => {
            const isCompleted = asg.status === 'Submitted' || asg.status === 'Graded';

            return (
              <div
                key={asg.id}
                className={`rounded-3xl p-4 sm:p-5 border transition-all ${
                  isCompleted
                    ? 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-80'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={(e) =>
                        handleComplete(asg.id, e)
                      }
                      title={isCompleted ? 'Mark as Incomplete' : 'Mark as Completed'}
                      className={`mt-0.5 w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                      }`}
                    >
                      {isCompleted && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            asg.priority === 'High'
                              ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                              : asg.priority === 'Medium'
                              ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {asg.priority} Priority
                        </span>

                        <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                          {asg.courseCode}: {asg.courseName}
                        </span>

                        <span className="text-[10px] text-slate-400">• {asg.weight}</span>
                      </div>

                      <h3
                        className={`text-sm font-bold text-slate-900 dark:text-white mt-1 ${
                          isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {asg.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        {asg.description}
                      </p>

                      {/* Instructions / Milestones */}
                      {asg.instructions && asg.instructions.length > 0 && (
                        <div className="mt-2.5 space-y-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl text-[11px] text-slate-600 dark:text-slate-300">
                          <span className="font-semibold text-slate-700 dark:text-slate-200 block text-[10px] uppercase">
                            Required Tasks:
                          </span>
                          {asg.instructions.map((inst, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>{inst}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            Due: {asg.dueDate} at {asg.dueTime}
                          </span>
                        </div>

                        {asg.submittedAt && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Submitted on {asg.submittedAt}
                          </span>
                        )}

                        {asg.score !== undefined && (
                          <span className="font-bold text-indigo-600 dark:text-indigo-400">
                            Grade: {asg.score}/{asg.maxScore} (95%)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="flex sm:flex-col items-center gap-2 self-end sm:self-center">
                    {/* Ask AI for Homework Guidance button */}
                    <button
                      onClick={() => handleAskAiForHelp(asg)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/10 dark:from-indigo-950 dark:to-violet-950 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-500/20 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                      <span>AI Guide</span>
                    </button>

                    <button
                      onClick={() => deleteAssignment(asg.id)}
                      title="Delete Task"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Assignment Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-rose-600" /> Add New Course Assignment
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems Lab 3: Raft Consensus"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Course Code
                  </label>
                  <select
                    value={newCourseCode}
                    onChange={(e) => {
                      setNewCourseCode(e.target.value);
                      if (e.target.value === 'CS301')
                        setNewCourseName('Operating Systems & Concurrency');
                      else if (e.target.value === 'CS402')
                        setNewCourseName('Distributed Systems & Cloud');
                      else if (e.target.value === 'AI310')
                        setNewCourseName('Deep Learning & Neural Networks');
                      else if (e.target.value === 'MA301')
                        setNewCourseName('Linear Algebra & Optimization');
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="CS301">CS301 - Operating Systems</option>
                    <option value="CS402">CS402 - Distributed Systems</option>
                    <option value="AI310">AI310 - Deep Learning</option>
                    <option value="MA301">MA301 - Linear Algebra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as AssignmentPriority)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grade Weight
                  </label>
                  <input
                    type="text"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="e.g. 15% of Final"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instructions & Description
                </label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Task requirements, deliverables, test cases..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                >
                  Add Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
