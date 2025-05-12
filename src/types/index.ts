
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
  subject: string;
  gradeLevel: string;
  scheduleDetails: string; // Kept for full context if needed elsewhere, or for initial data
  preferredDays?: string[]; // Changed to string array
  preferredTime?: string[]; // Changed to string array
  location?: string; // e.g., "Online", "Student's Home", "Tutor's Home"
  additionalNotes?: string;
  status: "open" | "matched" | "closed";
  postedAt: string; // ISO date string
  board?: string; // e.g., "CBSE", "ICSE"
  teachingMode?: string[]; // e.g., ["Online"], ["Offline"], ["Online", "Offline"]
}

export interface TutorProfile extends User {
  subjects: string[];
  grade?: string; // Grade level the tutor specializes in - represents a general grade category
  experience: string; // e.g., "5+ years", "1-3 years"
  hourlyRate?: string; 
  bio?: string;
  qualifications?: string[]; // Changed to string array for multi-select
  teachingMode?: string[]; // Changed to string array e.g. ["Online", "In-person"]
  gradeLevelsTaught?: string[]; // Specific grade levels tutor teaches (multi-select)
  boardsTaught?: string[]; // New field for boards tutor is familiar with (multi-select)
  preferredDays?: string[]; // New field for preferred teaching days (multi-select)
  preferredTimeSlots?: string[]; // New field for preferred teaching time slots (multi-select)
  location?: string; // For in-person tutoring
  rating?: number; // Optional rating for the tutor
}

export interface Testimonial {
  id: string;
  name: string;
  role: "Parent" | "Tutor";
  text: string;
  avatarSeed: string; 
  rating: number; // e.g. 1-5
  date: string; // ISO date string for when the testimonial was given
}

export interface DemoSession {
  id: string;
  studentName: string;
  subject: string;
  date: string; // ISO date string
  time: string; // e.g., "10:00 AM - 11:00 AM"
  status: "Scheduled" | "Completed" | "Cancelled";
  joinLink?: string; // Optional link to join a virtual session
}
