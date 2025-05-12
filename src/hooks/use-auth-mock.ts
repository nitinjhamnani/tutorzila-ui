"use client";

import type { User, UserRole, TutorProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useEffect } from "react";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data"; 

const initialUser: User | null = null;

const localStorageJSONStorage = createJSONStorage<User | null>(() => localStorage);

const userAtom = atomWithStorage<User | null>("mock_user", initialUser, {
  ...localStorageJSONStorage,
});

const ensureArrayField = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') return value.split(',').map(item => item.trim()).filter(item => item);
  return [];
};


export function useAuthMock() {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("mock_user");
        setUser(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


  const login = (email: string, role?: UserRole) => {
    const determinedRole: UserRole = role || (email.toLowerCase().includes("admin") ? "admin" : email.toLowerCase().includes("tutor") ? "tutor" : "parent");

    let baseUserData: User = {
      id: Date.now().toString(),
      name: email.split("@")[0] || "User",
      email,
      role: determinedRole,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      status: "Active",
      phone: undefined,
      isEmailVerified: false,
      isPhoneVerified: false,
      gender: "",
      dateOfBirth: undefined,
    };

    let finalUserData: User | TutorProfile = baseUserData;

    if (determinedRole === 'tutor') {
      const existingMockTutor = MOCK_TUTOR_PROFILES.find(
        (mockTutor) => mockTutor.email.toLowerCase() === email.toLowerCase()
      );

      if (existingMockTutor) {
        finalUserData = { 
          ...existingMockTutor, // Spread the found tutor profile first
          // Then ensure specific fields from baseUserData or defaults are applied if not present or need override
          id: existingMockTutor.id || baseUserData.id, // Prefer existing ID
          name: existingMockTutor.name || baseUserData.name,
          email: existingMockTutor.email, // Keep existing email
          role: 'tutor', // Ensure role is tutor
          avatar: existingMockTutor.avatar || baseUserData.avatar,
          status: existingMockTutor.status || baseUserData.status,
          phone: existingMockTutor.phone || baseUserData.phone || "9876543210", // Ensure phone has a value
          isEmailVerified: existingMockTutor.isEmailVerified !== undefined ? existingMockTutor.isEmailVerified : baseUserData.isEmailVerified,
          isPhoneVerified: existingMockTutor.isPhoneVerified !== undefined ? existingMockTutor.isPhoneVerified : baseUserData.isPhoneVerified,
          gender: existingMockTutor.gender || baseUserData.gender,
          dateOfBirth: existingMockTutor.dateOfBirth || baseUserData.dateOfBirth,
          // Tutor specific fields - ensure they are arrays
          subjects: ensureArrayField(existingMockTutor.subjects),
          qualifications: ensureArrayField(existingMockTutor.qualifications),
          teachingMode: ensureArrayField(existingMockTutor.teachingMode),
          gradeLevelsTaught: ensureArrayField(existingMockTutor.gradeLevelsTaught),
          boardsTaught: ensureArrayField(existingMockTutor.boardsTaught),
          preferredDays: ensureArrayField(existingMockTutor.preferredDays),
          preferredTimeSlots: ensureArrayField(existingMockTutor.preferredTimeSlots),
        };
      } else {
        // Create a new tutor profile with default/derived values if no match found
        finalUserData = {
          ...baseUserData, 
          role: 'tutor', 
          subjects: ['Mathematics', 'Physics'], 
          experience: '1-3 years',
          grade: 'High School', 
          hourlyRate: "1000",
          bio: "A passionate and dedicated tutor.",
          qualifications: ["Relevant degree"], 
          teachingMode: ["Online"],
          phone: baseUserData.phone || "9876543210",
          gradeLevelsTaught: ["Grade 9-10", "Grade 11-12"],
          boardsTaught: ["CBSE"],
          preferredDays: ["Weekdays"],
          preferredTimeSlots: ["1700-1900"],
          location: "Online",
          rating: 4.5,
        } as TutorProfile;
      }
    } else if (determinedRole === 'admin' && email.toLowerCase().includes('admin')) {
       finalUserData = {
        ...baseUserData,
        role: 'admin',
        name: 'Admin User', 
      };
    } else { // Parent
      finalUserData = {
        ...baseUserData,
        role: 'parent',
      };
    }
    
    setUser(finalUserData);
    if (finalUserData.role === 'tutor') {
      router.push("/dashboard/enquiries");
    } else {
      router.push("/dashboard");
    }
    return Promise.resolve(finalUserData);
  };

  const signup = (name: string, email: string, role: UserRole) => {
     let mockUserData: User | TutorProfile = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      status: "Active",
      phone: role === "tutor" ? "9876543210" : undefined, 
      isEmailVerified: false,
      isPhoneVerified: false,
      gender: "",
      dateOfBirth: undefined,
    };

    if (role === 'tutor') {
       mockUserData = {
        ...mockUserData,
        subjects: [], 
        experience: '', 
        grade: '',
        hourlyRate: '',
        bio: '',
        qualifications: [], 
        teachingMode: ['Online'], 
        gradeLevelsTaught: [],
        boardsTaught: [],
        preferredDays: [],
        preferredTimeSlots: [],
        location: "Online",
        rating: 0,
      } as TutorProfile;
    }
    setUser(mockUserData);
    if (role === 'tutor') {
      router.push("/dashboard/enquiries");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("mock_user"); // Ensure local storage is also cleared
    router.push("/"); 
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };
}
