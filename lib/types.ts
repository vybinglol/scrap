// Core data model for Scrapable. Kept deliberately small and storage-agnostic
// so a future Supabase adapter only has to satisfy these shapes.

// --- The vibe engine -----------------------------------------------------

// The five theme roles, written to CSS variables and read by every component.
export type Palette = {
  bg: string;
  surface: string;
  accent: string;
  accent2: string;
  text: string;
};

export type Mood = {
  warmth: "warm" | "cool" | "neutral";
  lightness: "light" | "dark";
  saturation: "muted" | "vivid";
};

// Each preset bundles a font pairing + texture + doodle/checkbox style.
export type Preset = "cozy" | "dark-academia" | "minimal-clean" | "playful-y2k";

// Aggregate of everything pinned — themes the app shell + notes.
export type HouseVibe = { palette: Palette; mood: Mood; preset: Preset };

// --- Entities ------------------------------------------------------------

export type Category = {
  id: string;
  name: string; // "School" | "Life" | "Business" | user-defined
  accentColor: string; // manual fallback used only when no pin is attached
  attachedPinId?: string; // the board/pin that themes this category
  palette?: Palette; // derived from the attached pin
  preset?: Preset;
};

export type Task = {
  id: string;
  categoryId: string;
  title: string;
  detail?: string;
  done: boolean;
  createdAt: number;
};

export type Note = {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
  attachedPinId?: string; // optional pin that themes this note's surface
};

export type PinKind = "pin" | "board" | "profile" | "link";

export type Pin = {
  id: string;
  url: string; // original Pinterest / external URL
  kind: PinKind;
  imageUrl?: string; // representative image (og:image)
  title?: string;
  palette?: Palette; // extracted + role-assigned, cached
  mood?: Mood;
  addedAt: number;
};
