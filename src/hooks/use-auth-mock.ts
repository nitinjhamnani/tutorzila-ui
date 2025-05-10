"use client";

import type { User, UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { atom, useAtom } from "jotai";
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
    // If role is not provided, default to 'parent' for the mock.
    // In a real app, the backend would determine the role.
    const determinedRole: UserRole = role || (email.includes("tutor") ? "tutor" : email.includes("admin") ? "admin" : "parent");

    const mockUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0] || "User",
      email,
      role: determinedRole,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    setUser(mockUser); // This updates the user state for the hook
    router.push("/dashboard");
    return Promise.resolve(mockUser); // Return user for potential immediate use
  };

  const signup = (name: string, email: string, role: UserRole) => {
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    setUser(mockUser);
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    router.push("/sign-in");
  };

  return {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  };
}
