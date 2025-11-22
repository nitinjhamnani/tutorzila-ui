
import { atom } from "jotai";

// This atom controls the visibility of the main AppHeader and AppFooter.
// It defaults to true, meaning the layout is visible.
// Specific pages (like the homepage during redirection) can set it to false.
export const layoutVisibilityAtom = atom(true);
