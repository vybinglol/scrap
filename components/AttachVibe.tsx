"use client";

import { useEffect, useRef, useState } from "react";
import type { Pin } from "@/lib/types";
import { Sparkle, Close } from "./icons";

type Props = {
  pins: Pin[];
  attachedPinId?: string;
  onAttach: (pinId: string | undefined) => void;
  // Optional text shown beside the star (used for the app-wide control).
  label?: string;
  title?: string;
  align?: "left" | "right";
};

// The star button + pin picker, reused to theme a list, a note, or the whole
// app from a saved pin. When a pin is attached the star fills with the accent.
export function AttachVibe({
  pins,
  attachedPinId,
  onAttach,
  label,
  title = "Attach a pin as the vibe",
  align = "left",
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const attached = Boolean(attachedPinId);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={title}
        aria-pressed={attached}
        title={title}
        className={
          label
            ? "press flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm font-medium hover:border-accent"
            : "press rounded-lg p-1.5 text-text-soft hover:text-text"
        }
        style={attached ? { color: "var(--accent)" } : undefined}
      >
        <Sparkle className="h-5 w-5" />
        {label && <span className="text-text">{label}</span>}
      </button>

      {open && (
        <div
          className={`absolute top-full z-20 mt-2 w-64 rounded-2xl border border-line bg-surface p-2 shadow-lg ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {pins.length === 0 ? (
            <p className="px-1 py-1.5 text-sm text-text-soft">
              No saved inspiration yet — add some in the Vibe tab.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {attached && (
                <button
                  type="button"
                  onClick={() => {
                    onAttach(undefined);
                    setOpen(false);
                  }}
                  className="press flex items-center gap-1 rounded-full border border-line bg-bg-2 px-3 py-1.5 text-sm text-text-soft"
                >
                  <Close className="h-3.5 w-3.5" /> Detach
                </button>
              )}
              {pins.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onAttach(p.id);
                    setOpen(false);
                  }}
                  className="press h-12 w-12 overflow-hidden rounded-xl border-2"
                  style={{
                    borderColor:
                      p.id === attachedPinId ? "var(--accent)" : "transparent",
                  }}
                  title={p.title || p.url}
                >
                  {p.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center bg-bg-2 text-xs text-text-soft">
                      {p.kind}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
