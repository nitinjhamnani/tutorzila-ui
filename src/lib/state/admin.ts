
import { atom } from "jotai";
import type { ApiTutor } from "@/types";

export const selectedTutorAtom = atom<ApiTutor | null>(null);
