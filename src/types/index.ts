export type UserRole = "parent" | "tutor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string; // URL to avatar image
  status?: "Active" | "Inactive"; 
  phone?: string; // Added phone
  isEmailVerified?: boolean; // Added email verification status
  isPhoneVerified?: boolean; // Added phone verification status
  gender?: "male" | "female" | "other" | ""; // Added gender
  dateOfBirth?: string; // ISO date string, Added dateOfBirth
}

export interface TuitionRequirement {
  id:string;
  parentId: string;
  parentName?: string; // Optional, denormalized
  subject: string; // Changed from string[] to string
  gradeLevel: string;
  scheduleDetails: string; // Kept for full context if needed elsewhere, or for initial data
  preferredDays?: string[]; 
  preferredTime?: string[]; 
  location?: string; // e.g., "Online", "Student's Home", "Tutor's Home"
  additionalNotes?: string;
  status: "open" | "matched" | "closed";
  postedAt: string; // ISO date string
  board?: string; // e.g., "CBSE", "ICSE"
  teachingMode?: string[]; // e.g., ["Online"], ["Offline"], ["Online", "Offline"]
  applicantsCount?: number; // Added to show number of applicants
}

export interface TutorProfile extends User {
  subjects: string[];
  grade?: string; // Grade level the tutor specializes in - represents a general grade category
  experience: string; // e.g., "5+ years", "1-3 years"
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
  tutorName?: string; // Added to associate demo with a tutor
  studentName: string;
  subject: string; 
  gradeLevel: string; 
  board: string; 
  date: string; 
  time: string; 
  status: "Scheduled" | "Completed" | "Cancelled";
  joinLink?: string; 
}