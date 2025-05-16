
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
  avatarSeed: string;
  rating: number;
  date: string;
}

export interface DemoSession {
  id: string;
  tutorName?: string;
  tutorAvatarSeed?: string; 
  studentName: string;
  subject: string;
  gradeLevel: string;
  board: string;
  date: string; // ISO string
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Requested"; // Added "Requested"
  joinLink?: string;
  mode?: "Online" | "Offline (In-person)";
  feedbackSubmitted?: boolean;
}

export interface MyClass {
  id: string;
  subject: string;
  tutorName: string;
  tutorAvatarSeed: string; // For mock avatar
  studentName: string;
  mode: "Online" | "Offline (In-person)";
  schedule: {
    days: string[];
    time: string; // e.g., "5:00 PM - 6:00 PM"
  };
  status: "Ongoing" | "Upcoming" | "Past" | "Cancelled";
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  nextSession?: string; // ISO date string (for upcoming/ongoing)
}
