
"use client";

import type { User, UserRole, TutorProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useEffect, useState } from "react";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data"; 

const initialUser: User | null = null;

const localStorageJSONStorage = createJSONStorage<User | null>(() => {
  if (typeof window !== 'undefined') {
    return localStorage;
  }
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
});

const userAtom = atomWithStorage<User | null>("mock_user", initialUser, localStorageJSONStorage);

const ensureArrayField = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') return value.split(',').map(item => item.trim()).filter(item => item);
  return [];
};


export function useAuthMock() {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    setIsCheckingAuth(true);
    if (typeof window !== 'undefined') {
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
    }
    setIsCheckingAuth(false);
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
          ...existingMockTutor, 
          id: existingMockTutor.id || baseUserData.id, 
          name: existingMockTutor.name || baseUserData.name,
          email: existingMockTutor.email, 
          role: 'tutor', 
          avatar: existingMockTutor.avatar || baseUserData.avatar,
          status: existingMockTutor.status || baseUserData.status,
          phone: existingMockTutor.phone || baseUserData.phone || "9876543210", 
          isEmailVerified: existingMockTutor.isEmailVerified !== undefined ? existingMockTutor.isEmailVerified : baseUserData.isEmailVerified,
          isPhoneVerified: existingMockTutor.isPhoneVerified !== undefined ? existingMockTutor.isPhoneVerified : baseUserData.isPhoneVerified,
          gender: existingMockTutor.gender || baseUserData.gender,
          dateOfBirth: existingMockTutor.dateOfBirth || baseUserData.dateOfBirth,
          subjects: ensureArrayField(existingMockTutor.subjects),
          qualifications: ensureArrayField(existingMockTutor.qualifications),
          teachingMode: ensureArrayField(existingMockTutor.teachingMode),
          gradeLevelsTaught: ensureArrayField(existingMockTutor.gradeLevelsTaught),
          boardsTaught: ensureArrayField(existingMockTutor.boardsTaught),
          preferredDays: ensureArrayField(existingMockTutor.preferredDays),
          preferredTimeSlots: ensureArrayField(existingMockTutor.preferredTimeSlots),
        };
      } else { 
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
    } else { // PARENT
      if (email.toLowerCase() === "alice.smith@example.com") {
        finalUserData = {
          ...baseUserData,
          id: "p1", 
          name: "Alice Smith", 
          role: 'parent',
        };
      } else if (email.toLowerCase() === "bob.johnson@example.com") {
        finalUserData = {
            ...baseUserData,
            id: "p2",
            name: "Bob Johnson",
            role: 'parent',
        };
      }
       else {
        finalUserData = {
          ...baseUserData,
          role: 'parent',
        };
      }
    }
    
    setUser(finalUserData);
    if (finalUserData.role === 'tutor') {
      router.push("/tutor/dashboard"); 
    } else if (finalUserData.role === 'parent') {
      router.push("/parent/dashboard"); // Updated redirect for parent
    } else if (finalUserData.role === 'admin') {
      router.push("/dashboard/admin");
    } else {
      router.push("/"); 
    }
    return Promise.resolve(finalUserData);
  };

  const signup = (name: string, email: string, role: UserRole, phone?: string) => {
     let mockUserData: User | TutorProfile = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
      status: "Active",
      phone: phone || (role === "tutor" ? "9876543210" : undefined), 
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
      router.push("/tutor/dashboard"); 
    } else if (role === 'parent') {
      router.push("/parent/dashboard"); // Updated redirect for parent
    } else {
       router.push("/"); 
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem("mock_user");
    }
    router.push("/"); 
  };

  return {
    user,
    isAuthenticated: !!user,
    isCheckingAuth,
    login,
    signup,
    logout,
  };
}
