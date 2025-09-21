
import { atom } from "jotai";

export interface LoaderState {
  isLoading: boolean;
  message?: string;
}

export const loaderAtom = atom<LoaderState>({ isLoading: false, message: undefined });
