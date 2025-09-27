
import type { Option as MultiSelectOption } from '@/components/ui/multi-select-command';

export const allSubjectsList: MultiSelectOption[] = [
    "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", 
    "Geography", "Computer Science", "Art", "Music", "Economics", 
    "Business Studies", "Accountancy", "Social Studies", "Environmental Science",
    "French", "Spanish", "German", "Hindi", "Coding", "Robotics", "Other"
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
  { value: "0800-1000", label: "8:00 AM - 10:00 AM" }, { value: "1000-1200", label: "10:00 AM - 12:00 PM" },
  { value: "1200-1400", label: "12:00 PM - 2:00 PM" }, { value: "1400-1600", label: "2:00 PM - 4:00 PM" },
  { value: "1600-1800", label: "4:00 PM - 6:00 PM" }, { value: "1800-2000", label: "6:00 PM - 8:00 PM" },
  { value: "2000-2200", label: "8:00 PM - 10:00 PM" }, { value: "Flexible", label: "Flexible"},
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
