
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
  preferredTimeSlots?: string[]; // Changed from preferredTime
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
  studentName: string;
  subject: string; 
  gradeLevel: string; 
  board: string; 
  date: string; 
  time: string; 
  status: "Scheduled" | "Completed" | "Cancelled";
  joinLink?: string; 
}
