"use client";

import { useState } from "react";
import type { Pin } from "@/lib/types";
import { newId } from "@/lib/storage";
import { parsePinterestUrl, fetchPinVibe } from "@/lib/pinterest";
import { Sparkle, Plus } from "./icons";

type Props = { onAdd: (pin: Pin) => void };

const EXAMPLES = [
  "https://www.pinterest.com/pin/989947561831324728/",
  "https://www.pinterest.com/junnygarza/bruh/",
];

export function AddInspiration({ onAdd }: Props) {
  const [url, setUrl] = useState("");
  const [busy, setBusy] = useState(false);

  async function add(raw: string) {
    const value = raw.trim();
    if (!value) return;
    setBusy(true);
    const { kind, url: normalized } = parsePinterestUrl(value);

    // Pull the image's colors and turn them into a palette — this is what makes
    // the pin re-theme the app.
    const vibe = await fetchPinVibe(normalized);

    const pin: Pin = {
      id: newId(),
      url: normalized,
      kind,
      imageUrl: vibe.imageUrl,
      title: vibe.title,
      palette: vibe.palette,
      mood: vibe.mood,
      addedAt: Date.now(),
    };
    onAdd(pin);
    setUrl("");
    setBusy(false);
  }

  return (
    <div className="sketch-card taped flex flex-col gap-3 p-4">
      <div className="flex items-center gap-2">
        <Sparkle className="h-5 w-5 text-accent" />
        <h3 className="font-display text-2xl text-text">Add inspiration</h3>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          add(url);
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a Pinterest pin, board, profile, or any link…"
          className="min-w-0 flex-1 rounded-2xl border border-line bg-surface px-4 py-2.5 text-sm text-text outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={busy}
          className="press flex items-center justify-center gap-1.5 rounded-2xl bg-accent px-4 py-2.5 font-medium text-on-accent disabled:opacity-60"
        >
          <Plus className="h-5 w-5" />
          {busy ? "Adding…" : "Pin it"}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2 text-xs text-text-soft">
        <span>Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => add(ex)}
            className="press rounded-full border border-line bg-bg-2/60 px-2.5 py-1 hover:text-text"
          >
            {ex.replace("https://www.pinterest.com", "").slice(0, 28)}…
          </button>
        ))}
      </div>
    </div>
  );
}
