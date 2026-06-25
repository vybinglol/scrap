"use client";

import { useState } from "react";
import { Plus } from "./icons";

type Props = {
  onAdd: (name: string, color: string) => void;
};

const SWATCHES = [
  "#7c9cff",
  "#ff9eb1",
  "#f2c14e",
  "#5fd0a8",
  "#c98bff",
  "#ff7a59",
];

export function AddCategory({ onAdd }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(SWATCHES[0]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name.trim(), color);
    setName("");
    setColor(SWATCHES[0]);
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="press hover-wiggle grid min-h-[140px] place-items-center rounded-[18px] border-2 border-dashed border-line text-text-soft hover:text-text"
      >
        <span className="flex flex-col items-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-current">
            <Plus className="h-5 w-5" />
          </span>
          <span className="font-display text-2xl">New list</span>
        </span>
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="sketch-card flex flex-col gap-3 p-4"
      style={{ ["--accent" as string]: color }}
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="List name"
        className="bg-transparent font-display text-3xl text-text outline-none placeholder:text-text-soft/60"
      />
      <div className="flex flex-wrap items-center gap-2">
        {SWATCHES.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={`Use color ${c}`}
            onClick={() => setColor(c)}
            className="press h-7 w-7 rounded-full border-2"
            style={{
              background: c,
              borderColor: c === color ? "var(--text)" : "transparent",
            }}
          />
        ))}
        <label className="press grid h-7 w-7 cursor-pointer place-items-center rounded-full border-2 border-line">
          <span className="text-xs text-text-soft">+</span>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="sr-only"
            aria-label="Custom color"
          />
        </label>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="press rounded-full px-4 py-1.5 text-sm font-medium text-on-accent"
          style={{ background: color }}
        >
          Add list
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="press rounded-full px-4 py-1.5 text-sm text-text-soft hover:text-text"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
