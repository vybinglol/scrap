"use client";

import { useMemo, useState } from "react";
import type { Note, Pin } from "@/lib/types";
import { getNotes, newId, saveNotes } from "@/lib/storage";
import { useLocalState } from "@/lib/useLocalState";
import { pinScope } from "@/lib/vibe";
import { VoiceRecorder } from "./VoiceRecorder";
import { AttachVibe } from "./AttachVibe";
import { Plus, Trash, Pencil } from "./icons";
import { Star } from "./Doodles";

function preview(body: string) {
  const t = body.trim().replace(/\s+/g, " ");
  return t.length > 90 ? `${t.slice(0, 90)}…` : t;
}

export function Notes({ pins }: { pins: Pin[] }) {
  const [notes, setNotes, hydrated] = useLocalState<Note[]>(
    getNotes,
    saveNotes,
    [],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [interim, setInterim] = useState("");

  const sorted = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt - a.updatedAt),
    [notes],
  );
  const selected = notes.find((n) => n.id === selectedId) ?? null;

  // A note can wear an attached pin's palette + preset on its editing surface.
  const attachedPin = selected
    ? pins.find((p) => p.id === selected.attachedPinId)
    : undefined;
  const scope = pinScope(attachedPin);

  function createNote() {
    const note: Note = {
      id: newId(),
      title: "",
      body: "",
      updatedAt: Date.now(),
    };
    setNotes((prev) => [note, ...prev]);
    setSelectedId(note.id);
  }

  function updateNote(id: string, patch: Partial<Note>) {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...patch, updatedAt: Date.now() } : n,
      ),
    );
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  function appendDictation(text: string) {
    if (!selected) return;
    const sep = selected.body && !/\s$/.test(selected.body) ? " " : "";
    updateNote(selected.id, { body: selected.body + sep + text.trim() + " " });
  }

  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-3xl bg-bg-2/50" />;
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      {/* List */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={createNote}
          className="press flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-2.5 font-medium text-on-accent"
        >
          <Plus className="h-5 w-5" /> New note
        </button>

        <ul className="flex flex-col gap-2.5">
          {sorted.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => setSelectedId(n.id)}
                className={`sketch-card press w-full p-3 text-left ${
                  n.id === selectedId ? "ring-2 ring-accent" : ""
                }`}
              >
                <div className="flex items-start gap-2">
                  <Star className="mt-1 h-3.5 w-3.5 shrink-0 text-accent" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-xl text-text">
                      {n.title || "Untitled"}
                    </p>
                    <p className="truncate text-sm text-text-soft">
                      {preview(n.body) || "Empty note"}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          ))}
          {sorted.length === 0 && (
            <li className="rounded-2xl border-2 border-dashed border-line p-6 text-center text-sm text-text-soft">
              No notes yet. Jot something down ✏️
            </li>
          )}
        </ul>
      </div>

      {/* Editor */}
      <div>
        {!selected ? (
          <div className="sketch-card grid min-h-[260px] place-items-center p-8 text-center">
            <div className="flex flex-col items-center gap-3 text-text-soft">
              <Pencil className="h-8 w-8" />
              <p className="font-display text-2xl text-text">
                Pick a note, or start a new one
              </p>
              <p className="text-sm">Type it, or tap dictate and just talk.</p>
            </div>
          </div>
        ) : (
          <div
            className="note-editor sketch-card flex flex-col gap-3 p-5"
            style={scope.vars as React.CSSProperties}
            data-preset={scope.preset}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <VoiceRecorder
                  onFinal={appendDictation}
                  onInterim={setInterim}
                />
                <AttachVibe
                  pins={pins}
                  attachedPinId={selected.attachedPinId}
                  onAttach={(id) =>
                    updateNote(selected.id, { attachedPinId: id })
                  }
                  title="Theme this note with a pin"
                />
              </div>
              <button
                type="button"
                onClick={() => deleteNote(selected.id)}
                className="press flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-text-soft hover:text-text"
              >
                <Trash className="h-4 w-4" /> Delete
              </button>
            </div>

            <input
              value={selected.title}
              onChange={(e) => updateNote(selected.id, { title: e.target.value })}
              placeholder="Title"
              className="note-title bg-transparent font-display text-text outline-none placeholder:text-text-soft/50"
            />
            <div className="note-rule h-px w-full bg-line" />

            <textarea
              value={selected.body}
              onChange={(e) => updateNote(selected.id, { body: e.target.value })}
              placeholder="Start writing… or dictate."
              rows={12}
              className="note-body min-h-[240px] w-full resize-y bg-transparent text-text outline-none placeholder:text-text-soft/50"
            />

            {/* Live interim transcript (greyed). */}
            {interim && (
              <p className="rounded-xl bg-bg-2/60 px-3 py-2 text-sm italic text-text-soft">
                {interim}…
              </p>
            )}

            <p className="text-right text-xs text-text-soft">
              Autosaved ·{" "}
              {new Date(selected.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
