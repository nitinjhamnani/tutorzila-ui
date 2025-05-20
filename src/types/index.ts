
export type UserRole = "parent" | "tutor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string; // URL to avatar image
  status?: "Active" | "Inactive";
  phone?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  gender?: "male" | "female" | "other" | "";
  dateOfBirth?: string; // ISO date string
}

export interface TuitionRequirement {
  id:string;
  parentId: string;
  parentName?: string;
  subject: string[];
  gradeLevel: string;
  scheduleDetails: string;
  preferredDays?: string[];
  preferredTimeSlots?: string[];
  location?: string;
  additionalNotes?: string;
  status: "open" | "matched" | "closed";
  postedAt: string; // ISO date string
  board?: string;
  teachingMode?: string[];
  applicantsCount?: number;
  mockIsRecommended?: boolean;
  mockIsAppliedByCurrentUser?: boolean;
  mockIsShortlistedByCurrentUser?: boolean;
}

export interface TutorProfile extends User {
  subjects: string[];
  grade?: string;
  experience: string;
  hourlyRate?: string;
  bio?: string;
  qualifications?: string[];
  teachingMode?: string[];
  gradeLevelsTaught?: string[];
  boardsTaught?: string[];
  preferredDays?: string[];
  preferredTimeSlots?: string[];
  location?: string;
  rating?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: "Parent" | "Tutor";
  text: string;
  avatarSeed: string; // For picsum.photos seed
  rating: number;
  date: string; // ISO String
}

export interface DemoSession {
  id: string;
  tutorId?: string;
  tutorName?: string;
  tutorAvatarSeed?: string;
  studentName: string;
  subject: string;
  gradeLevel: string;
  board: string;
  date: string; // ISO string
  startTime: string;
  endTime: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Requested";
  joinLink?: string;
  mode?: "Online" | "Offline (In-person)";
  feedbackSubmitted?: boolean;
  rescheduleStatus?: 'idle' | 'pending' | 'confirmed';
}

export interface MyClass {
  id: string;
  subject: string;
  tutorId?: string;
  tutorName: string;
  tutorAvatarSeed?: string;
  studentName: string;
  mode: "Online" | "Offline (In-person)";
  schedule: {
    days: string[];
    time: string;
  };
  status: "Ongoing" | "Upcoming" | "Past" | "Cancelled";
  startDate?: string;
  endDate?: string;
  nextSession?: string;
}

export interface TutorPayment {
  id: string;
  tutorId: string;
  studentName: string;
  studentAvatarSeed?: string;
  subject?: string; // Optional, payment might be for a period
  amount: number;
  hourlyRate?: number;
  totalHours?: number;
  totalSessions?: number;
  fromDate: string; // ISO string
  toDate: string; // ISO string
  status: "Pending" | "Paid" | "Overdue";
  paymentDate?: string; // ISO string, for when it was paid
}

export interface TutorLead {
  id: string;
  tutorId: string; // To associate with a tutor
  parentName: string;
  parentAvatarSeed?: string;
  email: string;
  phone: string;
  contactedOn: string; // ISO date string
  messagesCount: number;
  lastMessageSnippet?: string; // Optional: for a preview
  status?: "New" | "Contacted" | "Interested" | "Not Interested" | "Converted" | "Archived"; // Optional: for future filtering
  enquirySubject?: string; // Optional: subject they were interested in
  enquiryGrade?: string; // Optional: grade they were interested in
  leadsConsumed?: number; // Number of leads this contact cost
}

