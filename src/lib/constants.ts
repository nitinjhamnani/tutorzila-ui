
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

export const simpleTutorGenderPreferenceOptions = [
    { value: "any", label: "No Preference" },
    { value: "male", label: "Male" },
    { value: "female", label: "Female" }
];

export const startDatePreferenceOptions = [
    { value: "IMMEDIATELY", label: "Immediately" },
    { value: "WITHIN_A_MONTH", label: "Within a month" },
    { value: "JUST_EXPLORING", label: "Just exploring" }
];

export const simpleStartDatePreferenceOptions = [
    { value: "immediately", label: "Immediately" },
    { value: "within_month", label: "Within a month" },
    { value: "exploring", label: "Just exploring" }
];
