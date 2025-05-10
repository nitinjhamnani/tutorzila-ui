
export type UserRole = "parent" | "tutor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string; // URL to avatar image
  status?: "Active" | "Inactive"; // Added status
}

export interface TuitionRequirement {
  id:string;
  parentId: string;
  parentName?: string; // Optional, denormalized
  subject: string;
  gradeLevel: string;
  scheduleDetails: string;
  location?: string; // e.g., "Online", "Student's Home", "Tutor's Home"
  additionalNotes?: string;
  status: "open" | "matched" | "closed";
  postedAt: string; // ISO date string
}

export interface TutorProfile extends User {
  subjects: string[];
  grade?: string; // Grade level the tutor specializes in
  experience: string; // e.g., "5+ years", "1-3 years"
  hourlyRate?: string; 
  bio?: string;
  qualifications?: string;
  teachingMode?: "Online" | "In-person" | "Hybrid"; // Added teachingMode
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



