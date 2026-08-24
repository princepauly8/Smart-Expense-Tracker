export type ActiveTab =
  | 'dashboard'
  | 'ai-assistant'
  | 'events'
  | 'resources'
  | 'assignments'
  | 'notifications'
  | 'admin'
  | 'android-source'
  | 'profile';

export type UserRole = 'student' | 'faculty' | 'admin';

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatarUrl: string;
  department: string;
  major: string;
  degree: string;
  semester: number;
  year: number;
  cgpa: number;
  creditsCompleted: number;
  totalCredits: number;
  attendancePercentage: number;
  campusBranch: string;
  dormRoom?: string;
  role: UserRole;
  enrolledCourses: string[]; // course IDs
  phone?: string;
}

export interface ClassScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
  building: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
  color: string;
  attendancePresent: number;
  attendanceTotal: number;
}

export type EventCategory = 'Tech' | 'Cultural' | 'Workshop' | 'Sports' | 'Career' | 'Academic';

export interface CampusEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  description: string;
  bannerImage: string;
  capacity: number;
  registeredCount: number;
  isRegistered: boolean;
  registrationPassId?: string;
  tags: string[];
  registrationDeadline: string;
  speakers?: { name: string; title: string; company: string }[];
  isFeatured?: boolean;
}

export type ResourceType = 'PDF' | 'Notes' | 'Slides' | 'Code' | 'ExamPaper' | 'LabManual';

export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  courseCode: string;
  semester: number;
  type: ResourceType;
  author: string;
  authorRole?: string;
  uploadDate: string;
  fileSize: string;
  downloadCount: number;
  isBookmarked: boolean;
  tags: string[];
  contentPreview: string;
  verifiedByFaculty: boolean;
  fileFormat: string;
}

export type AssignmentPriority = 'High' | 'Medium' | 'Low';
export type AssignmentStatus = 'Pending' | 'In Progress' | 'Submitted' | 'Graded';

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string;
  dueTime: string;
  priority: AssignmentPriority;
  status: AssignmentStatus;
  score?: number;
  maxScore?: number;
  weight: string;
  description: string;
  instructions?: string[];
  submissionUrl?: string;
  submittedAt?: string;
  aiHelperPrompt?: string;
}

export type AnnouncementCategory = 'Urgent' | 'Academic' | 'Exam' | 'Campus' | 'Placement';

export interface Announcement {
  id: string;
  title: string;
  category: AnnouncementCategory;
  author: string;
  authorRole: string;
  date: string;
  timeAgo: string;
  content: string;
  isPinned: boolean;
  read: boolean;
  departmentScope?: string;
}

export type NotificationCategory = 'assignment' | 'event' | 'academic' | 'admin';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionTab?: ActiveTab;
  actionId?: string;
  priority: 'high' | 'normal';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  codeSnippet?: {
    lang: string;
    code: string;
  };
  suggestions?: string[];
  isStudyPlan?: boolean;
}
