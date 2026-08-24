import React, { useState, useRef, useEffect } from 'react';
import { useCampus } from '../context/CampusContext';
import {
  Sparkles,
  Send,
  Trash2,
  Copy,
  Check,
  BookmarkPlus,
  BookOpen,
  Calendar,
  Clock,
  Code2,
  BrainCircuit,
  GraduationCap,
  Lightbulb,
  FileText,
} from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const {
    chatMessages,
    isAiLoading,
    sendAiMessage,
    clearChat,
    generateStudyPlan,
    explainConcept,
    addResource,
    triggerPushNotification,
  } = useCampus();

  const [inputMessage, setInputMessage] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'study-plan' | 'explainer'>('chat');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Study Plan Generator State
  const [planSubject, setPlanSubject] = useState('Operating Systems (CS301)');
  const [planDays, setPlanDays] = useState(5);
  const [planHours, setPlanHours] = useState(3);
  const [planTarget, setPlanTarget] = useState('A+');
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // Concept Explainer State
  const [explainTopic, setExplainTopic] = useState('Virtual Memory & Page Replacement');
  const [explainSubject, setExplainSubject] = useState('Computer Science');
  const [explainDifficulty, setExplainDifficulty] = useState('Intermediate');
  const [generatedExplanation, setGeneratedExplanation] = useState<string | null>(null);
  const [isGeneratingExplanation, setIsGeneratingExplanation] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiLoading]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isAiLoading) {
      const text = inputMessage.trim();
      setInputMessage('');
      sendAiMessage(text);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveToNotes = (title: string, content: string, subjectName: string) => {
    addResource({
      title,
      subject: subjectName,
      courseCode: 'AI-GEN',
      semester: 5,
      type: 'Notes',
      author: 'CampusPulse AI Tutor',
      authorRole: 'AI Assistant',
      fileSize: '1.2 KB',
      tags: ['AI Generated', 'Study Notes', 'Cheat Sheet'],
      contentPreview: content,
      verifiedByFaculty: false,
      fileFormat: 'MD',
    });
    triggerPushNotification(
      '📝 Saved to Notes Library',
      `"${title}" has been added to your study resources.`,
      'academic'
    );
  };

  const handleCreatePlan = async () => {
    setIsGeneratingPlan(true);
    const plan = await generateStudyPlan(planSubject, planDays, planHours);
    setGeneratedPlan(plan);
    setIsGeneratingPlan(false);
  };

  const handleExplainConcept = async () => {
    setIsGeneratingExplanation(true);
    const explanation = await explainConcept(explainTopic, explainSubject);
    setGeneratedExplanation(explanation);
    setIsGeneratingExplanation(false);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-4">
      {/* Header with Navigation Pills */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                  CampusPulse AI Assistant
                </h2>
                <span className="text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md">
                  Gemini Powered
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your 24/7 intelligent university tutor, concept explainer & study companion
              </p>
            </div>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            <button
              onClick={() => setActiveSubTab('chat')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === 'chat'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💬 AI Chat
            </button>
            <button
              onClick={() => setActiveSubTab('study-plan')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === 'study-plan'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🗓️ Exam Plan
            </button>
            <button
              onClick={() => setActiveSubTab('explainer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeSubTab === 'explainer'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              💡 Explainer
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Live Interactive AI Chat */}
      {activeSubTab === 'chat' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm flex flex-col h-[600px] max-h-[75vh]">
          {/* Chat Toolbar */}
          <div className="p-3 px-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Connected to Campus Intelligence Graph
              </span>
            </div>
            <button
              onClick={clearChat}
              title="Clear Conversation History"
              className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {chatMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-indigo-600/20">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-md shadow-indigo-600/20'
                        : 'bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/80 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans space-y-2">
                      {msg.text.split('\n\n').map((paragraph, i) => (
                        <p key={i}>{paragraph}</p>
                      ))}
                    </div>

                    {/* AI Message Action Tools */}
                    {!isUser && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700/70 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{msg.timestamp}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <button
                            onClick={() =>
                              handleSaveToNotes(
                                `AI Note: ${msg.text.slice(0, 30)}...`,
                                msg.text,
                                'General Study Notes'
                              )
                            }
                            className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                          >
                            <BookmarkPlus className="w-3.5 h-3.5" />
                            <span>Save to Notes</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isAiLoading && (
              <div className="flex gap-3 justify-start items-center">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                  <span className="ml-1 text-indigo-600 dark:text-indigo-300 font-medium">
                    CampusPulse AI is analyzing your coursework & generating insights...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="p-2.5 px-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {[
                'What events are happening this week?',
                'Explain Dynamic Programming & Memoization',
                'Give me a 5-day study plan for exams',
                'What assignments are due in 48 hours?',
                'Help me understand Raft consensus leader election',
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => sendAiMessage(chip)}
                  disabled={isAiLoading}
                  className="text-[11px] whitespace-nowrap bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full transition-all"
                >
                  ⚡ {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask anything about exams, lectures, code, campus events..."
              disabled={isAiLoading}
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-2xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isAiLoading}
              className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30 transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Tab 2: Dedicated Exam Study Plan Generator */}
      {activeSubTab === 'study-plan' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Exam Roadmap & Study Plan Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Generate an accelerated, high-yield study timetable customized to your available
                hours
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Course / Subject
              </label>
              <select
                value={planSubject}
                onChange={(e) => setPlanSubject(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Operating Systems & Concurrency (CS301)">
                  Operating Systems (CS301)
                </option>
                <option value="Distributed Systems & Cloud (CS402)">
                  Distributed Systems (CS402)
                </option>
                <option value="Deep Learning & Neural Networks (AI310)">
                  Deep Learning (AI310)
                </option>
                <option value="Linear Algebra & Optimization (MA301)">
                  Linear Algebra (MA301)
                </option>
                <option value="Digital Signal Processing (EE304)">DSP & IoT (EE304)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Days Until Exam: <span className="text-indigo-600 font-bold">{planDays} Days</span>
              </label>
              <input
                type="range"
                min="1"
                max="14"
                value={planDays}
                onChange={(e) => setPlanDays(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Study Hours Per Day:{' '}
                <span className="text-indigo-600 font-bold">{planHours} Hours</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                value={planHours}
                onChange={(e) => setPlanHours(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>

          <button
            onClick={handleCreatePlan}
            disabled={isGeneratingPlan}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all"
          >
            {isGeneratingPlan ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Crafting High-Yield Study Schedule...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {planDays}-Day Revision Plan</span>
              </>
            )}
          </button>

          {generatedPlan && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Your Custom Study Plan for {planSubject}
                </h4>
                <button
                  onClick={() =>
                    handleSaveToNotes(
                      `${planDays}-Day Study Plan: ${planSubject}`,
                      generatedPlan,
                      planSubject
                    )
                  }
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" /> Save Plan to Notes
                </button>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {generatedPlan}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Deep Concept Explainer */}
      {activeSubTab === 'explainer' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Feynman Concept Explainer & Code Tutor
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Break down any complex syllabus topic into crystal-clear analogies and code
                demonstrations
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Concept or Topic to Master
              </label>
              <input
                type="text"
                value={explainTopic}
                onChange={(e) => setExplainTopic(e.target.value)}
                placeholder="e.g. Deadlocks in OS, Backpropagation, Raft Leader Election, Dijkstra vs A*"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Subject Domain
                </label>
                <select
                  value={explainSubject}
                  onChange={(e) => setExplainSubject(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="Computer Science">Computer Science & Algorithms</option>
                  <option value="Operating Systems">Operating Systems & Kernels</option>
                  <option value="Distributed Systems">Distributed Systems & Cloud</option>
                  <option value="Machine Learning & AI">Machine Learning & Neural Nets</option>
                  <option value="Mathematics">Applied Mathematics & Linear Algebra</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Depth
                </label>
                <select
                  value={explainDifficulty}
                  onChange={(e) => setExplainDifficulty(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200"
                >
                  <option value="Beginner">Beginner (Intuitive Analogy & Basics)</option>
                  <option value="Intermediate">Intermediate (Core Equations + Code)</option>
                  <option value="Advanced">Advanced (Edge Cases & Exam Pitfalls)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleExplainConcept}
              disabled={isGeneratingExplanation || !explainTopic.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-all mt-2"
            >
              {isGeneratingExplanation ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Deep Explanation...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Explain Concept Step-by-Step</span>
                </>
              )}
            </button>
          </div>

          {generatedExplanation && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  💡 Explanation: {explainTopic}
                </h4>
                <button
                  onClick={() =>
                    handleSaveToNotes(
                      `Explanation: ${explainTopic}`,
                      generatedExplanation,
                      explainSubject
                    )
                  }
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" /> Save to Study Notes
                </button>
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {generatedExplanation}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
