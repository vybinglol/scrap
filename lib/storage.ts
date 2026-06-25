// The one and only persistence layer. Everything reads/writes through here.
// Swap this file's internals for a Supabase adapter later and nothing else
// in the app needs to change.

import type { Category, HouseVibe, Note, Pin, Task } from "./types";
import { DEFAULT_HOUSE_VIBE } from "./vibe";

const KEYS = {
  categories: "scrapable.categories",
  tasks: "scrapable.tasks",
  notes: "scrapable.notes",
  pins: "scrapable.pins",
  houseVibe: "scrapable.houseVibe",
  housePinId: "scrapable.housePinId",
} as const;

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / disabled — fail quietly, the app still works in-session
  }
}

// A small id helper that works even where crypto.randomUUID is unavailable.
export function newId(): string {
  if (isBrowser() && "randomUUID" in crypto) return crypto.randomUUID();
  return `id-${Math.random().toString(36).slice(2)}-${performance.now().toString(36)}`;
}

// --- Seed defaults --------------------------------------------------------
// The three starter categories from the brief, each with its own warm accent.
export function defaultCategories(): Category[] {
  return [
    { id: "cat-school", name: "School", accentColor: "#7c9cff" },
    { id: "cat-life", name: "Life", accentColor: "#ff9eb1" },
    { id: "cat-business", name: "Business", accentColor: "#f2c14e" },
  ];
}

// --- Public interface (keep this stable) ---------------------------------
export function getCategories(): Category[] {
  const stored = read<Category[] | null>(KEYS.categories, null);
  if (stored && stored.length) return stored;
  const seeded = defaultCategories();
  write(KEYS.categories, seeded);
  return seeded;
}
export function saveCategories(categories: Category[]): void {
  write(KEYS.categories, categories);
}

export function getTasks(): Task[] {
  return read<Task[]>(KEYS.tasks, []);
}
export function saveTasks(tasks: Task[]): void {
  write(KEYS.tasks, tasks);
}

export function getNotes(): Note[] {
  return read<Note[]>(KEYS.notes, []);
}
export function saveNotes(notes: Note[]): void {
  write(KEYS.notes, notes);
}

export function getPins(): Pin[] {
  return read<Pin[]>(KEYS.pins, []);
}
export function savePins(pins: Pin[]): void {
  write(KEYS.pins, pins);
}

export function getHouseVibe(): HouseVibe {
  return read<HouseVibe>(KEYS.houseVibe, DEFAULT_HOUSE_VIBE);
}
export function saveHouseVibe(vibe: HouseVibe): void {
  write(KEYS.houseVibe, vibe);
}

// The pin the user chose to theme the whole app. null = auto-blend all pins.
export function getHousePinId(): string | null {
  return read<string | null>(KEYS.housePinId, null);
}
export function saveHousePinId(id: string | null): void {
  write(KEYS.housePinId, id);
}
