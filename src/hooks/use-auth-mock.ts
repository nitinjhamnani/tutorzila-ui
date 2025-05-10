"use client";

import type { User, UserRole, TutorProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useEffect } from "react";

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
    const determinedRole: UserRole = role || (email.includes("tutor") ? "tutor" : email.includes("admin") ? "admin" : "parent");

    let mockUserData: User | TutorProfile = {
      id: Date.now().toString(),
      name: email.split("@")[0] || "User",
      email,
      role: determinedRole,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };

    if (determinedRole === 'tutor') {
      mockUserData = {
        ...mockUserData,
        subjects: ['Mathematics', 'Physics'], // Sample data
        experience: '3-5 years', // Sample data
        // Other fields like bio, grade, hourlyRate, teachingMode will be undefined for the mock
        // and thus count towards incompleteness for the progress bar.
      } as TutorProfile;
    }
    
    setUser(mockUserData); 
    router.push("/dashboard");
    return Promise.resolve(mockUserData);
  };

  const signup = (name: string, email: string, role: UserRole) => {
     let mockUserData: User | TutorProfile = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };

    if (role === 'tutor') {
       mockUserData = {
        ...mockUserData,
        subjects: [], // Initially empty for a new tutor
        experience: '', // Initially empty
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
