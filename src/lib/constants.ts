
import type { Option as MultiSelectOption } from '@/components/ui/multi-select-command';

export const allSubjectsList: MultiSelectOption[] = [
    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Hindi",
    "English",
    "Kannada",
    "Computer Science",
    "Social Studies",
    "History",
    "Geography",
    "Civics / Political Science",
    "Sociology",
    "EVS (Environmental Studies)",
    "Commerce",
    "Statistics",
    "Sanskrit",
    "Home Science",
    "Physical Education",
    "Psychology",
    "Tamil",
    "Telugu",
    "Malayalam",
    "Economics",
    "Business Studies",
    "Accountancy",
    "Environmental Science",
    "French",
    "Spanish",
    "German",
    "Coding",
    "Other"
].map(s => ({ value: s, label: s }));

export const gradeLevelsList: string[] = [
    "Nursery", "LKG", "UKG",
    "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5",
    "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10",
    "Grade 11", "Grade 12",
    "College Level", "Adult Learner", "Other"
];

export const boardsList: string[] = [
    "CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"
];

export const qualificationsList: MultiSelectOption[] = [
    "High School",
    "Associate's Degree",
    "Bachelor of Arts (B.A.)",
    "Bachelor of Science (B.Sc.)",
    "Bachelor of Commerce (B.Com.)",
    "Bachelor of Technology (B.Tech.)",
    "Bachelor of Engineering (B.E.)",
    "Bachelor of Education (B.Ed.)",
    "Master of Arts (M.A.)",
    "Master of Science (M.Sc.)",
    "Master of Commerce (M.Com.)",
    "Master of Technology (M.Tech.)",
    "Master of Engineering (M.E.)",
    "Master of Computer Applications (MCA)",
    "Master of Business Administration (MBA)",
    "PhD (Doctor of Philosophy)",
    "Teaching Certification",
    "Subject Matter Expert",
    "Other"
].map(q => ({ value: q, label: q }));

export const languagesList: MultiSelectOption[] = [
    "English", "Hindi", "Spanish", "French", "German", "Mandarin", "Japanese", "Other"
].map(l => ({ value: l, label: l }));

export const teachingModeOptions: { id: string; label: string }[] = [
  { id: "Online", label: "Online" },
  { id: "Offline (In-person)", label: "Offline (In-person)" },
];

export const daysOptions: MultiSelectOption[] = [
  { value: "Monday", label: "Monday" }, { value: "Tuesday", label: "Tuesday" }, { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" }, { value: "Friday", label: "Friday" }, { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" }, { value: "Weekdays", label: "Weekdays" }, { value: "Weekends", label: "Weekends" },
  { value: "Flexible", label: "Flexible"},
];

export const timeSlotsOptions: MultiSelectOption[] = [
  { value: "7:00 AM - 9:00 AM", label: "7:00 AM - 9:00 AM" },
  { value: "9:00 AM - 11:00 AM", label: "9:00 AM - 11:00 AM" },
  { value: "11:00 AM - 1:00 PM", label: "11:00 AM - 1:00 PM" },
  { value: "1:00 PM - 3:00 PM", label: "1:00 PM - 3:00 PM" },
  { value: "3:00 PM - 5:00 PM", label: "3:00 PM - 5:00 PM" },
  { value: "5:00 PM - 7:00 PM", label: "5:00 PM - 7:00 PM" },
  { value: "7:00 PM - 9:00 PM", label: "7:00 PM - 9:00 PM" },
  { value: "Flexible", label: "Flexible" },
];

export const tutorGenderPreferenceOptions = [
    { value: "NO_PREFERENCE", label: "No Preference" },
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" }
];

export const startDatePreferenceOptions = [
    { value: "IMMEDIATELY", label: "Immediately" },
    { value: "WITHIN_A_MONTH", label: "Within a month" },
    { value: "JUST_EXPLORING", label: "Just exploring" }
];
