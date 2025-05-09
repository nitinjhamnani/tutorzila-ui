
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
  // getItem: (key) => { // Next.js specific handling for server/client mismatch
  //   if (typeof window === 'undefined') return initialUser;
  //   return localStorageJSONStorage.getItem(key);
  // }
});

export function useAuthMock() {
  const [user, setUser] = useAtom(userAtom);
  const router = useRouter();

  // This effect ensures that localStorage is only accessed on the client side.
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
  }, []); // setUser is stable from jotai


  const login = (email: string, role: UserRole) => {
    // In a real app, you'd verify credentials against a backend.
    const mockUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0] || "User",
      email,
      role,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    };
    setUser(mockUser);
    router.push("/dashboard");
  };

  const signup = (name: string, email: string, role: UserRole) => {
    // In a real app, you'd save the user to a backend.
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
