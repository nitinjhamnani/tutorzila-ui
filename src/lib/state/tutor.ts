
import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from 'jotai/utils';

// This will hold the full account details structure.
// Using atomWithStorage will persist this data in localStorage.
export const tutorProfileAtom = atomWithStorage<any | null>(
    "tutorzila_tutor_profile", // Unique key for localStorage
    null, // Initial value
    createJSONStorage(() => {
        if (typeof window !== 'undefined') {
            return localStorage;
        }
        // Dummy storage for SSR
        return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
        };
    })
);
