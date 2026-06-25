"use client";

import { useEffect, useMemo, useState } from "react";
import type { Category, HouseVibe, Pin, Task } from "@/lib/types";
import {
  getCategories,
  getHousePinId,
  getHouseVibe,
  getPins,
  getTasks,
  saveCategories,
  saveHousePinId,
  saveHouseVibe,
  savePins,
  saveTasks,
} from "@/lib/storage";
import { useLocalState } from "@/lib/useLocalState";
import { aggregate, DEFAULT_HOUSE_VIBE, vibeFromPalette } from "@/lib/vibe";
import { fetchPinVibe } from "@/lib/pinterest";
import { ThemeProvider } from "./ThemeProvider";
import { AttachVibe } from "./AttachVibe";
import { TodoBoard } from "./TodoBoard";
import { Notes } from "./Notes";
import { VibeShelf } from "./VibeShelf";
import { Squiggle, Star } from "./Doodles";
import { Sparkle } from "./icons";

type Tab = "todos" | "notes" | "vibe";

const TABS: { id: Tab; label: string }[] = [
  { id: "todos", label: "To-Dos" },
  { id: "notes", label: "Notes" },
  { id: "vibe", label: "Vibe" },
];

export function Workspace() {
  const [tab, setTab] = useState<Tab>("todos");
  const [refreshing, setRefreshing] = useState(false);

  const [categories, setCategories] = useLocalState<Category[]>(
    getCategories,
    saveCategories,
    [],
  );
  const [tasks, setTasks] = useLocalState<Task[]>(getTasks, saveTasks, []);
  const [pins, setPins, pinsHydrated] = useLocalState<Pin[]>(
    getPins,
    savePins,
    [],
  );
  const [houseVibe, setHouseVibe] = useLocalState<HouseVibe>(
    getHouseVibe,
    saveHouseVibe,
    DEFAULT_HOUSE_VIBE,
  );
  // A specific pin chosen to theme the whole app (null = auto-blend all pins).
  const [housePinId, setHousePinId] = useLocalState<string | null>(
    getHousePinId,
    saveHousePinId,
    null,
  );

  const housePin = housePinId
    ? pins.find((p) => p.id === housePinId)
    : undefined;

  // The house vibe = the chosen pin's palette if one is pinned, else a blend of
  // every pin. Re-derive whenever the pins or the chosen pin change.
  useEffect(() => {
    if (!pinsHydrated) return;
    const pinned = housePinId ? pins.find((p) => p.id === housePinId) : undefined;
    setHouseVibe(
      pinned?.palette
        ? vibeFromPalette(pinned.palette, pinned.mood)
        : aggregate(pins),
    );
  }, [pins, pinsHydrated, housePinId, setHouseVibe]);

  const addPin = (pin: Pin) => setPins((prev) => [pin, ...prev]);

  const deletePin = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    // detach + drop derived palette from any category that used it
    setCategories((prev) =>
      prev.map((c) =>
        c.attachedPinId === id
          ? { ...c, attachedPinId: undefined, palette: undefined, preset: undefined }
          : c,
      ),
    );
    if (housePinId === id) setHousePinId(null);
  };

  // Re-derive every pin's palette from its current image, then re-theme.
  const refreshVibe = async () => {
    if (!pins.length) return;
    setRefreshing(true);
    const updated = await Promise.all(
      pins.map(async (p) => {
        const v = await fetchPinVibe(p.url);
        return {
          ...p,
          imageUrl: v.imageUrl ?? p.imageUrl,
          title: v.title ?? p.title,
          palette: v.palette ?? p.palette,
          mood: v.mood ?? p.mood,
        };
      }),
    );
    setPins(updated);
    setRefreshing(false);
  };

  const openCount = useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);

  return (
    <>
      <ThemeProvider houseVibe={houseVibe} />
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
        {/* Header */}
        <header className="relative mb-7 flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-2">
              <span className="hover-wiggle inline-grid h-9 w-9 place-items-center rounded-2xl bg-accent text-on-accent">
                <Sparkle className="h-5 w-5" />
              </span>
              <h1 className="font-display text-5xl leading-none text-text sm:text-6xl">
                Scrapable
              </h1>
              <Star className="doodle mt-1 h-5 w-5 text-accent" />
            </div>
            <p className="pl-1 text-text-soft">
              paste your pins —{" "}
              <span className="underline-sketch">they become the interface</span>
            </p>
            <Squiggle className="doodle mt-1 h-2 w-44 pl-1 text-accent" />
          </div>

          {/* Pin one board to theme the whole app. */}
          <AttachVibe
            pins={pins}
            attachedPinId={housePinId ?? undefined}
            onAttach={(id) => setHousePinId(id ?? null)}
            label="App vibe"
            title="Pin a board to theme the whole app"
            align="right"
          />
        </header>

        {/* Tabs */}
        <nav className="mb-7 flex flex-wrap items-center gap-2">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`press relative rounded-full px-4 py-2 font-medium ${
                  active ? "text-on-accent" : "text-text-soft hover:text-text"
                }`}
                style={active ? { background: "var(--accent)" } : undefined}
              >
                {t.label}
                {t.id === "todos" && openCount > 0 && (
                  <span
                    className="ml-2 rounded-full px-2 py-0.5 text-xs"
                    style={{
                      background: active
                        ? "color-mix(in srgb, var(--on-accent) 28%, transparent)"
                        : "var(--bg-2)",
                    }}
                  >
                    {openCount}
                  </span>
                )}
                {t.id === "vibe" && pinsHydrated && pins.length > 0 && (
                  <span
                    className="ml-2 rounded-full px-2 py-0.5 text-xs"
                    style={{
                      background: active
                        ? "color-mix(in srgb, var(--on-accent) 28%, transparent)"
                        : "var(--bg-2)",
                    }}
                  >
                    {pins.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Panels */}
        {tab === "todos" && (
          <TodoBoard
            categories={categories}
            setCategories={setCategories}
            tasks={tasks}
            setTasks={setTasks}
            pins={pins}
          />
        )}
        {tab === "notes" && <Notes pins={pins} />}
        {tab === "vibe" && (
          <VibeShelf
            pins={pins}
            houseVibe={houseVibe}
            housePin={housePin}
            refreshing={refreshing}
            onAdd={addPin}
            onDelete={deletePin}
            onRefresh={refreshVibe}
          />
        )}
      </div>
    </>
  );
}
