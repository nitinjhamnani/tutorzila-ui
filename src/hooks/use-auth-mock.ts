
"use client";

import type { User, UserRole, TutorProfile } from "@/types";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import { useEffect, useState } from "react";
import { MOCK_TUTOR_PROFILES } from "@/lib/mock-data"; 
import { useGlobalLoader } from "@/hooks/use-global-loader";

const initialUser: User | null = null;
const initialToken: string | null = null;

const localStorageJSONStorage = createJSONStorage<any>(() => {
  if (typeof window !== 'undefined') {
    return localStorage;
  }
  // Return a dummy storage for SSR
  return {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
});

const userAtom = atomWithStorage<User | null>("tutorzila_user", initialUser, localStorageJSONStorage);
const tokenAtom = atomWithStorage<string | null>("tutorzila_token", initialToken, localStorageJSONStorage);

const ensureArrayField = (value: any): string[] => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') return value.split(',').map(item => item.trim()).filter(item => item);
  return [];
};


export function useAuthMock() {
  const [user, setUser] = useAtom(userAtom);
  const [token, setToken] = useAtom(tokenAtom);
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { showLoader, hideLoader } = useGlobalLoader();

  useEffect(() => {
    // This effect ensures state is synchronized with localStorage on mount
    const storedUser = localStorage.getItem("tutorzila_user");
    const storedToken = localStorage.getItem("tutorzila_token");
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(JSON.parse(storedToken));
      } catch (e) {
        console.error("Failed to parse auth data from storage", e);
        localStorage.removeItem("tutorzila_user");
        localStorage.removeItem("tutorzila_token");
        setUser(null);
        setToken(null);
      }
    }
    setIsCheckingAuth(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _constructUserObject = (email: string, role: UserRole, name?: string, phone?: string, profilePicture?: string): User | TutorProfile => {
      let baseUserData: User = {
          id: `user-${Date.now()}`,
          name: name || email.split("@")[0],
          email,
          role,
          avatar: profilePicture || undefined, // Set avatar ONLY from API response
          status: "Active",
          phone: phone,
          isEmailVerified: false,
          isPhoneVerified: false,
      };

      if (role === 'tutor') {
          const existingTutor = MOCK_TUTOR_PROFILES.find(t => t.email.toLowerCase() === email.toLowerCase());
          if (existingTutor) {
            // Use existing tutor data but prioritize the new profile picture from the API
            return { 
                ...existingTutor, 
                name: name || existingTutor.name, 
                role: 'tutor', 
                avatar: profilePicture || undefined // Set avatar ONLY from API response
            };
          }
          
          return {
              ...baseUserData,
              role: 'tutor',
              subjects: [], experience: '', grade: '', hourlyRate: '', bio: '',
              qualifications: [], teachingMode: [], gradeLevelsTaught: [], boardsTaught: [],
              preferredDays: [], preferredTimeSlots: [], location: '', rating: 0,
          } as TutorProfile;
      }
      return baseUserData;
  }

  const setSession = (token: string, type: string, email: string, name?: string, phone?: string, profilePicture?: string) => {
      const role = type.toLowerCase() as UserRole;
      const userObject = _constructUserObject(email, role, name, phone, profilePicture);
      
      setToken(token);
      setUser(userObject);
  };

  const login = async (username: string, password?: string) => {
    showLoader("Signing in..."); // Show loader immediately
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    
    const response = await fetch(`${apiBaseUrl}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': '*/*' },
        body: JSON.stringify({ username, password }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      hideLoader(); // Hide loader on failure
      throw new Error(responseData.message || "Sign in failed. Please check your credentials.");
    }

    if (responseData.token && responseData.type) {
        // Use username (phone number) as a placeholder for email since it's not in the response
        setSession(responseData.token, responseData.type, username, responseData.name, username, responseData.profilePicture);
        
        const role = responseData.type.toLowerCase();
        // The loader will hide automatically on the next page load
        if (role === 'tutor') {
            router.push("/tutor/dashboard");
        } else if (role === 'parent') {
            router.push("/parent/dashboard");
        } else if (role === 'admin') {
            router.push("/admin/dashboard");
        } else {
            hideLoader(); // Hide loader if no specific redirect
            router.push("/");
        }
    } else {
        hideLoader(); // Hide loader on invalid response
        throw new Error("Invalid response from server during login. Missing token or user type.");
    }

    return responseData;
  };

  const logout = () => {
    showLoader("Logging out...");
    
    // Clear state
    setUser(null);
    setToken(null);

    // Clear persisted state from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem("tutorzila_user");
      localStorage.removeItem("tutorzila_token");
      localStorage.removeItem("tutorzila_tutor_profile");
    }

    // Use router to navigate, which allows the loader to persist until the next page loads.
    router.push("/");
  };


  return {
    user,
    token,
    isAuthenticated: !!token, // Auth status is based on token presence
    isCheckingAuth,
    login,
    setSession, // Expose setSession for sign-up flow
    logout,
  };
}
