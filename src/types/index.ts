

export type UserRole = "parent" | "tutor" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string; // URL to avatar image
  status?: "Active" | "Inactive";
  phone?: string;
  countryCode?: string;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  gender?: "male" | "female" | "other" | "";
  dateOfBirth?: string; // ISO date string
  whatsappEnabled?: boolean;
  registeredDate?: string;
  createdBy?: string;
  createdByUsername?: string;
  profilePicUrl?: string;
  active?: boolean;
}

export interface LocationDetails {
  name?: string; 
  address: string;
  area?: string; // e.g., neighborhood or sublocality
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  googleMapsUrl?: string;
}

export interface BudgetDetails {
  defaultRate?: number;
  finalRate?: number;
  daysPerWeek?: number;
  hoursPerDay?: number;
  totalFees?: number;
  totalHours?: number;
  totalDays?: number;
}

export interface TutorProfile extends User {
  subjects: string[];
  experience: string;
  grade?: string; // Kept for simplicity, but gradeLevelsTaught is more descriptive
  hourlyRate: string;
  bio: string;
  isRateNegotiable?: boolean;
  qualifications: string[];
  teachingMode: ("Online" | "Offline (In-person)" | "In-person")[]; // Allow "In-person"
  gradeLevelsTaught: string[];
  boardsTaught: string[];
  preferredDays: string[];
  preferredTimeSlots: string[];
  location?: string;
  rating: number;
  languages?: string[];
  mockIsRecommendedBySystem?: boolean;
  mockIsDemoRequestedByCurrentUser?: boolean;
  mockIsShortlistedByCurrentUser?: boolean;
}

export interface PublicEnquiryDetails {
  enquiryCode: string;
  subjects: string;
  board: string;
  grade: string;
  area: string;
  state: string;
  city: string;
  country: string;
  createdOn: string;
  studentName: string;
  notes: string;
  availabilityDays: string;
  availabilityTime: string;
  addressName?: string;
  address: string;
  googleMapsLink?: string;
  pincode?: string;
  additionalNotes?: string;
  tutorGenderPreference: string;
  startDatePreference: string;
  online: boolean;
  offline: boolean;
  daysPerWeek?: number;
  hoursPerDay?: number;
  totalFees?: number;
  totalDays?: number;
}


export interface PublicTutorProfileResponse {
  tutorName: string;
  subjects: string;
  grades: string;
  boards: string;
  area: string;
  city: string;
  state: string;
  country: string;
  gender: string;
  qualifications: string;
  availabilityDays: string;
  availabilityTime: string;
  bio: string;
  languages: string;
  online: boolean;
  offline: boolean;
  experience: string;
  hourlyRate: number;
  hybrid: boolean;
  rateNegotiable: boolean;
}

export interface TuitionRequirement {
  id:string;
  enquiryCode?: string;
  parentId?: string;
  parentName?: string;
  parentEmail?: string;
  parentPhone?: string;
  studentName?: string;
  subject: string[];
  gradeLevel: string;
  scheduleDetails: string | null;
  preferredDays?: string[];
  preferredTimeSlots?: string[];
  location?: LocationDetails | null;
  address?: string; 
  additionalNotes?: string | null;
  status: "open" | "matched" | "closed" | "accepted" | "reopened";
  postedAt: string; // ISO date string
  board?: string;
  teachingMode?: string[];
  applicantsCount?: number;
  mockIsRecommended?: boolean;
  mockIsAppliedByCurrentUser?: boolean;
  mockIsShortlistedByCurrentUser?: boolean;
  appliedTutorIds?: string[];
  createdBy?: 'PARENT' | 'ADMIN';
  tutorGenderPreference?: 'MALE' | 'FEMALE' | 'NO_PREFERENCE';
  startDatePreference?: 'IMMEDIATELY' | 'WITHIN_A_MONTH' | 'JUST_EXPLORING';
  budget?: BudgetDetails;
}

export interface ApiTutor {
  id: string;
  displayName: string;
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  profilePicUrl?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  whatsappEnabled: boolean;
  registeredDate: string;
  createdBy: string;
  subjectsList: string[];
  gradesList: string[];
  boardsList: string[];
  qualificationList: string[];
  availabilityDaysList: string[];
  availabilityTimeList: string[];
  yearOfExperience: string;
  bio: string;
  addressName?: string;
  address: string;
  city: string;
  state: string;
  area: string;
  pincode: string;
  country: string;
  googleMapsLink?: string;
  hourlyRate: number;
  languagesList: string[];
  profileCompletion: number;
  isActive: boolean;
  isRateNegotiable: boolean;
  isBioReviewed: boolean;
  isLive?: boolean;
  online: boolean;
  offline: boolean;
  isHybrid: boolean;
  
  gender: string;
  isVerified: boolean;
  bankDetails?: {
    paymentType?: 'UPI' | 'NEFT/IMPS';
    accountNumber?: string;
  };
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
  enquiryId?: string;
  tutorId?: string;
  tutorName?: string;
  tutorAvatarSeed?: string;
  studentName: string;
  subject: string;
  gradeLevel: string;
  board: string;
  date: string; // ISO string
  day?: string;
  startTime: string;
  endTime: string;
  duration?: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "Requested";
  joinLink?: string;
  demoLink?: string;
  mode?: "Online" | "Offline (In-person)";
  feedbackSubmitted?: boolean;
  rescheduleStatus?: 'idle' | 'pending' | 'confirmed';
  rating?: number; 
  parentComment?: string;
  isPaid?: boolean;
  demoFee?: number;
}

export interface EnquiryDemo {
  demoId: string;
  demoStatus: "SCHEDULED" | "COMPLETED" | "CANCELLED" | "REQUESTED";
  demoDetails: {
    enquiryId?: string;
    studentName: string;
    tutorName: string;
    subjects: string;
    grade: string;
    board: string;
    day: string;
    date: string;
    startTime: string;
    duration: string;
    demoLink: string;
    demoFees: number;
    online: boolean;
    offline: boolean;
    paid: boolean;
  }
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

export interface ParentPayment {
  id: string;
  parentId: string;
  tutorId: string;
  tutorName: string;
  tutorAvatarSeed?: string;
  subject: string; 
  amount: number;
  dueDate: string; // ISO string
  paidDate?: string; // ISO string, if paid
  status: "Paid" | "Due" | "Upcoming" | "Overdue";
  invoiceId?: string; 
  description?: string; // e.g., "Monthly fee for Physics tutoring"
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

export interface TutorTransaction {
  id: string;
  type?: "Credit" | "Debit";
  amount?: number;
  status?: string;
  mode?: string;
  date: string; // ISO date string
  summary: string;
}

export interface ConversationSummary {
  id: string;
  tutorId: string;
  tutorName: string;
  tutorAvatarSeed: string;
  lastMessage: string;
  lastMessageTimestamp: string; // ISO string
  unreadCount: number;
  status?: "Online" | "Offline" | "Away"; 
  enquirySubject?: string; 
  enquiryId?: string; // Added for more robust linking
}

export interface Message {
  id: string;
  sender: "You" | string; // Allow dynamic sender name (e.g., tutor's name or "System")
  text?: string; // Text is optional for info_block type
  timestamp: Date;
  type?: 'chat' | 'info_block'; // New type property
  enquiry?: TuitionRequirement; // Property to hold enquiry details for info_block
}

export interface AdminDashboardData {
  noOfParent: number;
  noOfTutors: number;
  noOfOpenEnquiries: number;
  noOfActiveEnquiries: number;
}

export interface TutorDashboardMetrics {
  enquiriesAssigned: number;
  demoScheduled: number;
  profileViews: number;
  averageRating: number;
}
