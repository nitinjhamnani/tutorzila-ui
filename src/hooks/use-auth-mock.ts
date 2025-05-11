"use client";

import type { User, UserRole, TutorProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useEffect } from "react";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data"; // Import MOCK_TUTOR_PROFILES

const initialUser: User | null = null;

const localStorageJSONStorage = createJSONStorage<User | null>(() => localStorage);

const userAtom = atomWithStorage<User | null>("mock_user", initialUser, {
  ...localStorageJSONStorage,
});

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
    const determinedRole: UserRole = role || (email.toLowerCase().includes("tutor") ? "tutor" : email.toLowerCase().includes("admin") ? "admin" : "parent");

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
    };

    let finalUserData: User | TutorProfile = baseUserData;

    if (determinedRole === 'tutor') {
      const existingMockTutor = MOCK_TUTOR_PROFILES.find(
        (mockTutor) => mockTutor.email.toLowerCase() === email.toLowerCase()
      );

      if (existingMockTutor) {
        // Use existing mock tutor data, ensuring all fields are correctly typed
        finalUserData = { ...existingMockTutor };
      } else {
        // Create a new tutor profile with default/derived values if no match found
        finalUserData = {
          ...baseUserData, // Spread base user data
          role: 'tutor', // Explicitly set role to tutor
          subjects: ['Mathematics', 'Physics'], 
          experience: '1-3 years',
          grade: 'High School', // Added default grade
          hourlyRate: "1000",
          bio: "A passionate and dedicated tutor.",
          qualifications: "Relevant degree and certifications.",
          teachingMode: "Online",
          phone: baseUserData.phone || "9876543210", // Ensure phone is included
          // isEmailVerified and isPhoneVerified are already in baseUserData
        } as TutorProfile;
      }
    } else if (determinedRole === 'admin' && email.toLowerCase().includes('admin')) {
       finalUserData = {
        ...baseUserData,
        role: 'admin',
        name: 'Admin User', // Specific name for admin
      };
    } else { // Parent
      finalUserData = {
        ...baseUserData,
        role: 'parent',
      };
    }
    
    setUser(finalUserData); 
    router.push("/dashboard");
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
    };

    if (role === 'tutor') {
       mockUserData = {
        ...mockUserData,
        subjects: [], 
        experience: '', 
        grade: '',
        hourlyRate: '',
        bio: '',
        qualifications: '',
        teachingMode: 'Online',
      } as TutorProfile;
    }
    setUser(mockUserData);
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
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