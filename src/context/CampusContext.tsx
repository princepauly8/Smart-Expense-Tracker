import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudentProfile,
  ClassScheduleItem,
  CampusEvent,
  StudyResource,
  Assignment,
  Announcement,
  NotificationItem,
  ChatMessage,
  ActiveTab,
  UserRole,
} from '../types';
import {
  INITIAL_STUDENT,
  FACULTY_PROFILE,
  CLASS_SCHEDULE,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_RESOURCES,
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTIFICATIONS,
} from '../data/campusData';

interface CampusContextType {
  // Navigation & Frame
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isMobileFrame: boolean;
  toggleMobileFrame: () => void;
  
  // Student & Auth
  currentStudent: StudentProfile;
  setCurrentStudent: (student: StudentProfile) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  switchProfile: (role: UserRole) => void;
  updateProfile: (updated: Partial<StudentProfile>) => void;
  isIdCardOpen: boolean;
  setIsIdCardOpen: (open: boolean) => void;

  // Schedule
  schedule: ClassScheduleItem[];

  // Announcements
  announcements: Announcement[];
  markAnnouncementAsRead: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'timeAgo' | 'read'>) => void;
  deleteAnnouncement: (id: string) => void;

  // Events
  events: CampusEvent[];
  registerForEvent: (eventId: string) => { success: boolean; passId?: string };
  unregisterFromEvent: (eventId: string) => void;
  addEvent: (event: Omit<CampusEvent, 'id' | 'registeredCount' | 'isRegistered'>) => void;
  selectedEventForDetail: CampusEvent | null;
  setSelectedEventForDetail: (event: CampusEvent | null) => void;
  selectedEventForPass: CampusEvent | null;
  setSelectedEventForPass: (event: CampusEvent | null) => void;

  // Resources
  resources: StudyResource[];
  toggleBookmarkResource: (resourceId: string) => void;
  addResource: (resource: Omit<StudyResource, 'id' | 'uploadDate' | 'downloadCount' | 'isBookmarked'>) => void;
  downloadResource: (resource: StudyResource) => void;
  selectedResourceForPreview: StudyResource | null;
  setSelectedResourceForPreview: (resource: StudyResource | null) => void;

  // Assignments
  assignments: Assignment[];
  addAssignment: (assignment: Omit<Assignment, 'id' | 'status'>) => void;
  updateAssignmentStatus: (assignmentId: string, status: Assignment['status']) => void;
  deleteAssignment: (id: string) => void;
  selectedAssignmentForAi: Assignment | null;
  setSelectedAssignmentForAi: (assignment: Assignment | null) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  triggerPushNotification: (title: string, message: string, category?: NotificationItem['category'], actionTab?: ActiveTab) => void;
  activePushBanner: { title: string; message: string; category: string } | null;
  dismissPushBanner: () => void;

  // AI Assistant
  chatMessages: ChatMessage[];
  isAiLoading: boolean;
  sendAiMessage: (messageText: string) => Promise<void>;
  generateStudyPlan: (subject: string, days: number, hours: number) => Promise<string>;
  explainConcept: (concept: string, subject: string) => Promise<string>;
  clearChat: () => void;
  activeQuickPrompt: string | null;
  setActiveQuickPrompt: (prompt: string | null) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistent Navigation & Frame state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(() => {
    const saved = localStorage.getItem('campuspulse_mobile_frame');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // User & Profile
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [currentStudent, setCurrentStudent] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('campuspulse_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });
  const [isIdCardOpen, setIsIdCardOpen] = useState(false);

  // Modals & Selected Objects
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<CampusEvent | null>(null);
  const [selectedEventForPass, setSelectedEventForPass] = useState<CampusEvent | null>(null);
  const [selectedResourceForPreview, setSelectedResourceForPreview] = useState<StudyResource | null>(null);
  const [selectedAssignmentForAi, setSelectedAssignmentForAi] = useState<Assignment | null>(null);

  // Academic Data State
  const [schedule] = useState<ClassScheduleItem[]>(CLASS_SCHEDULE);
  
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('campuspulse_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem('campuspulse_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [resources, setResources] = useState<StudyResource[]>(() => {
    const saved = localStorage.getItem('campuspulse_resources');
    return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
  });

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    const saved = localStorage.getItem('campuspulse_assignments');
    return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('campuspulse_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Push Banner Simulator
  const [activePushBanner, setActivePushBanner] = useState<{ title: string; message: string; category: string } | null>(null);

  // AI Assistant Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: `Hello **${currentStudent.name.split(' ')[0]}**! 👋 I'm **CampusPulse AI**, your university academic assistant.\n\nI can help you with:\n- 📅 **Campus Events**: "What events are happening this week?"\n- 💡 **Concept Explanations**: "Explain Raft consensus or Page Replacement"\n- 📚 **Exam Study Plans**: "Generate a 5-day study plan for Operating Systems"\n- ⏰ **Assignments**: "What assignments are due in the next 48 hours?"\n\nHow can I help you today?`,
      timestamp: 'Just now',
      suggestions: [
        'What events are happening this week?',
        'Explain Virtual Memory and Paging in OS',
        'Give me a 5-day study plan for CS301 exam',
        'What assignments are due?',
      ],
    },
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeQuickPrompt, setActiveQuickPrompt] = useState<string | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('campuspulse_mobile_frame', JSON.stringify(isMobileFrame));
  }, [isMobileFrame]);

  useEffect(() => {
    localStorage.setItem('campuspulse_student', JSON.stringify(currentStudent));
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('campuspulse_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('campuspulse_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('campuspulse_resources', JSON.stringify(resources));
  }, [resources]);

  useEffect(() => {
    localStorage.setItem('campuspulse_assignments', JSON.stringify(assignments));
  }, [assignments]);

  useEffect(() => {
    localStorage.setItem('campuspulse_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Frame toggle
  const toggleMobileFrame = () => setIsMobileFrame((prev) => !prev);

  // Switch role between student and faculty
  const switchProfile = (role: UserRole) => {
    setUserRole(role);
    if (role === 'faculty' || role === 'admin') {
      setCurrentStudent(FACULTY_PROFILE);
    } else {
      setCurrentStudent(INITIAL_STUDENT);
    }
  };

  const updateProfile = (updated: Partial<StudentProfile>) => {
    setCurrentStudent((prev) => ({ ...prev, ...updated }));
  };

  // Push Notification simulation
  const triggerPushNotification = (
    title: string,
    message: string,
    category: NotificationItem['category'] = 'academic',
    actionTab?: ActiveTab
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title,
      message,
      category,
      timestamp: 'Just now',
      isRead: false,
      actionTab,
      priority: 'high',
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActivePushBanner({ title, message, category });

    // Auto dismiss banner after 5 seconds
    setTimeout(() => {
      setActivePushBanner(null);
    }, 5000);
  };

  const dismissPushBanner = () => setActivePushBanner(null);

  // Announcement Actions
  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, read: true } : ann))
    );
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'date' | 'timeAgo' | 'read'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timeAgo: 'Just now',
      read: false,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    triggerPushNotification(`📢 ${newAnn.title}`, newAnn.content.slice(0, 80) + '...', 'academic', 'dashboard');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Event Actions
  const registerForEvent = (eventId: string): { success: boolean; passId?: string } => {
    const passCode = `PASS-${eventId.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    let eventTitle = '';

    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          eventTitle = evt.title;
          return {
            ...evt,
            isRegistered: true,
            registeredCount: evt.registeredCount + 1,
            registrationPassId: passCode,
          };
        }
        return evt;
      })
    );

    triggerPushNotification(
      '🎟️ Event Registration Confirmed',
      `You are registered for "${eventTitle}". Pass code: ${passCode}`,
      'event',
      'events'
    );

    return { success: true, passId: passCode };
  };

  const unregisterFromEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId) {
          return {
            ...evt,
            isRegistered: false,
            registeredCount: Math.max(0, evt.registeredCount - 1),
            registrationPassId: undefined,
          };
        }
        return evt;
      })
    );
  };

  const addEvent = (eventData: Omit<CampusEvent, 'id' | 'registeredCount' | 'isRegistered'>) => {
    const newEvent: CampusEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      registeredCount: 0,
      isRegistered: false,
    };
    setEvents((prev) => [newEvent, ...prev]);
    triggerPushNotification(`🎉 New Campus Event: ${newEvent.title}`, `Date: ${newEvent.date} at ${newEvent.venue}`, 'event', 'events');
  };

  // Resource Actions
  const toggleBookmarkResource = (resourceId: string) => {
    setResources((prev) =>
      prev.map((res) => (res.id === resourceId ? { ...res, isBookmarked: !res.isBookmarked } : res))
    );
  };

  const addResource = (resData: Omit<StudyResource, 'id' | 'uploadDate' | 'downloadCount' | 'isBookmarked'>) => {
    const newRes: StudyResource = {
      ...resData,
      id: `res-${Date.now()}`,
      uploadDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      downloadCount: 0,
      isBookmarked: false,
    };
    setResources((prev) => [newRes, ...prev]);
    triggerPushNotification(`📚 New Resource: ${newRes.title}`, `Uploaded for ${newRes.courseCode} (${newRes.subject})`, 'academic', 'resources');
  };

  const downloadResource = (res: StudyResource) => {
    // Increment download count
    setResources((prev) =>
      prev.map((item) => (item.id === res.id ? { ...item, downloadCount: item.downloadCount + 1 } : item))
    );

    // Create a real downloadable text file with formatted study notes
    const content = `=====================================================
${res.title}
Course: ${res.courseCode} - ${res.subject} (Semester ${res.semester})
Author: ${res.author} | Verified by Faculty: ${res.verifiedByFaculty ? 'Yes' : 'No'}
Downloaded from CampusPulse AI Student Companion
=====================================================

${res.contentPreview}

=====================================================
Tags: ${res.tags.join(', ')}
CampusPulse AI Study Resource Archive
`;

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${res.courseCode}_${res.title.replace(/[^a-zA-Z0-9]/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Assignment Actions
  const addAssignment = (asgData: Omit<Assignment, 'id' | 'status'>) => {
    const newAsg: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
      status: 'Pending',
    };
    setAssignments((prev) => [newAsg, ...prev]);
    triggerPushNotification(`📝 New Assignment: ${newAsg.title}`, `Course: ${newAsg.courseCode} • Due: ${newAsg.dueDate}`, 'assignment', 'assignments');
  };

  const updateAssignmentStatus = (assignmentId: string, status: Assignment['status']) => {
    setAssignments((prev) =>
      prev.map((asg) => {
        if (asg.id === assignmentId) {
          const isNowSubmitted = status === 'Submitted' || status === 'Graded';
          return {
            ...asg,
            status,
            submittedAt: isNowSubmitted ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : undefined,
          };
        }
        return asg;
      })
    );
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // Notifications
  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => setNotifications([]);

  // AI Assistant Chat Method
  const sendAiMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setIsAiLoading(true);

    try {
      // Build real contextual payload about student's courses, timetable, pending assignments & events
      const studentContext = {
        student: {
          name: currentStudent.name,
          major: currentStudent.major,
          semester: currentStudent.semester,
          cgpa: currentStudent.cgpa,
          enrolledCourses: currentStudent.enrolledCourses,
        },
        todaySchedule: schedule.map((s) => ({
          course: `${s.courseCode} - ${s.courseName}`,
          time: `${s.startTime} - ${s.endTime}`,
          room: s.room,
        })),
        pendingAssignments: assignments
          .filter((a) => a.status === 'Pending' || a.status === 'In Progress')
          .map((a) => ({
            title: a.title,
            course: a.courseCode,
            due: `${a.dueDate} ${a.dueTime}`,
            priority: a.priority,
          })),
        upcomingEvents: events.slice(0, 3).map((e) => ({
          title: e.title,
          date: e.date,
          venue: e.venue,
          registered: e.isRegistered,
        })),
      };

      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          context: studentContext,
          conversationHistory: chatMessages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const assistantText = data.reply || 'Sorry, I could not process your query right now.';

      const assistantMessage: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: 'Just now',
        suggestions: [
          'Can you elaborate with a Kotlin code example?',
          'How does this topic appear in midterm exams?',
          'Give me 3 practice quiz questions on this',
        ],
      };

      setChatMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('AI chat failed:', err);
      const fallbackMessage: ChatMessage = {
        id: `msg-ai-err-${Date.now()}`,
        sender: 'assistant',
        text: `I had trouble connecting to the cloud AI service. However, here is a quick guide:\n\nFor academic topics, make sure to review the **Resources Hub** and check **Pending Assignments** on your dashboard.`,
        timestamp: 'Just now',
      };
      setChatMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateStudyPlan = async (subject: string, days: number, hours: number): Promise<string> => {
    try {
      const res = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, daysLeft: days, hoursPerDay: hours }),
      });
      const data = await res.json();
      return data.plan;
    } catch (err) {
      return `### 🗓️ ${days}-Day Study Plan for ${subject}\n\n- Daily Target: ${hours} hours/day\n- Focus: Core theoretical pillars, practice problems, and lab exercises.`;
    }
  };

  const explainConcept = async (concept: string, subject: string): Promise<string> => {
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, subject }),
      });
      const data = await res.json();
      return data.explanation;
    } catch (err) {
      return `### Overview of ${concept}\n\nKey topic in ${subject}. Review textbook and practice implementation problems.`;
    }
  };

  const clearChat = () => {
    setChatMessages([
      {
        id: 'msg-cleared',
        sender: 'assistant',
        text: `Chat cleared! How can I assist you with your studies or campus events today?`,
        timestamp: 'Just now',
        suggestions: [
          'What events are happening this week?',
          'Explain Deadlock conditions in OS',
          'Give me a 5-day study plan for exams',
        ],
      },
    ]);
  };

  return (
    <CampusContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isMobileFrame,
        toggleMobileFrame,
        currentStudent,
        setCurrentStudent,
        userRole,
        setUserRole,
        switchProfile,
        updateProfile,
        isIdCardOpen,
        setIsIdCardOpen,
        schedule,
        announcements,
        markAnnouncementAsRead,
        addAnnouncement,
        deleteAnnouncement,
        events,
        registerForEvent,
        unregisterFromEvent,
        addEvent,
        selectedEventForDetail,
        setSelectedEventForDetail,
        selectedEventForPass,
        setSelectedEventForPass,
        resources,
        toggleBookmarkResource,
        addResource,
        downloadResource,
        selectedResourceForPreview,
        setSelectedResourceForPreview,
        assignments,
        addAssignment,
        updateAssignmentStatus,
        deleteAssignment,
        selectedAssignmentForAi,
        setSelectedAssignmentForAi,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        triggerPushNotification,
        activePushBanner,
        dismissPushBanner,
        chatMessages,
        isAiLoading,
        sendAiMessage,
        generateStudyPlan,
        explainConcept,
        clearChat,
        activeQuickPrompt,
        setActiveQuickPrompt,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = (): CampusContextType => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
