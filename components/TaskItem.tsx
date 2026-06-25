"use client";

import { useState } from "react";
import type { Task } from "@/lib/types";
import { CheckMark } from "./Doodles";
import { Trash } from "./icons";

type Props = {
  task: Task;
  accent: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

// A few confetti bits flung outward on completion.
const CONFETTI = [
  { dx: "-26px", dy: "-22px", dr: "120deg", c: "#ff7a59" },
  { dx: "24px", dy: "-26px", dr: "-90deg", c: "#7c9cff" },
  { dx: "-30px", dy: "10px", dr: "60deg", c: "#f2c14e" },
  { dx: "30px", dy: "8px", dr: "-140deg", c: "#5fd0a8" },
  { dx: "0px", dy: "-32px", dr: "30deg", c: "#ff9eb1" },
];

export function TaskItem({ task, accent, onToggle, onDelete }: Props) {
  const [burst, setBurst] = useState(false);

  function handleToggle() {
    if (!task.done) {
      // fire confetti only when checking *on*
      setBurst(true);
      window.setTimeout(() => setBurst(false), 650);
    }
    onToggle(task.id);
  }

  return (
    <li
      className={`group relative flex items-start gap-3 rounded-2xl px-2.5 py-2 transition-colors ${
        task.done ? "opacity-55" : "hover:bg-bg-2/60"
      }`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={task.done}
        aria-label={task.done ? "Mark not done" : "Mark done"}
        className="press relative mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-[8px] border-2"
        style={{
          borderColor: accent,
          background: task.done ? accent : "transparent",
        }}
      >
        {task.done && (
          <span className="animate-check text-on-accent">
            <CheckMark className="h-4 w-4" />
          </span>
        )}

        {/* confetti pop */}
        {burst &&
          CONFETTI.map((b, i) => (
            <span
              key={i}
              className="confetti-bit pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-[2px]"
              style={
                {
                  background: b.c,
                  ["--dx"]: b.dx,
                  ["--dy"]: b.dy,
                  ["--dr"]: b.dr,
                } as React.CSSProperties
              }
            />
          ))}
      </button>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p
          className={`font-body text-[0.98rem] leading-snug text-text ${
            task.done ? "line-through decoration-2" : ""
          }`}
          style={task.done ? { textDecorationColor: accent } : undefined}
        >
          {task.title}
        </p>
        {task.detail && (
          <p className="mt-0.5 text-sm text-text-soft">{task.detail}</p>
        )}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
        className="press mt-0.5 rounded-lg p-1 text-text-soft opacity-0 transition group-hover:opacity-100 hover:text-text focus-visible:opacity-100"
      >
        <Trash className="h-4 w-4" />
      </button>
    </li>
  );
}
