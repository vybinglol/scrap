"use client";

import { useMemo, useState } from "react";
import type { Category, Pin, Task } from "@/lib/types";
import { moodToPreset, onAccentColor, themeVars } from "@/lib/vibe";
import { AttachVibe } from "./AttachVibe";
import { TaskItem } from "./TaskItem";
import { Squiggle } from "./Doodles";
import { Plus, Trash, Palette, Sparkle } from "./icons";

type Props = {
  category: Category;
  tasks: Task[];
  pins: Pin[];
  onAddTask: (categoryId: string, title: string, detail?: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onRecolor: (id: string, color: string) => void;
  onDelete: (id: string) => void;
  onAttach: (categoryId: string, pinId: string | undefined) => void;
};

export function CategoryColumn({
  category,
  tasks,
  pins,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onRename,
  onRecolor,
  onDelete,
  onAttach,
}: Props) {
  const [draft, setDraft] = useState("");
  const [detail, setDetail] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [showDone, setShowDone] = useState(false);

  const { active, done } = useMemo(() => {
    const a: Task[] = [];
    const d: Task[] = [];
    for (const t of tasks) (t.done ? d : a).push(t);
    a.sort((x, y) => x.createdAt - y.createdAt);
    d.sort((x, y) => y.createdAt - x.createdAt);
    return { active: a, done: d };
  }, [tasks]);

  const attachedPin = pins.find((p) => p.id === category.attachedPinId);

  // A column wears its attached pin's full palette + preset. With no pin, it
  // inherits the house vibe and just uses the manual accent color.
  const themed = attachedPin?.palette;
  const preset = attachedPin?.mood ? moodToPreset(attachedPin.mood) : undefined;
  const accent = themed ? themed.accent : category.accentColor;
  const scopeStyle = (
    themed
      ? themeVars(themed)
      : {
          "--accent": category.accentColor,
          "--accent-2": category.accentColor,
          "--on-accent": onAccentColor(category.accentColor),
        }
  ) as React.CSSProperties;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    onAddTask(category.id, draft.trim(), detail.trim() || undefined);
    setDraft("");
    setDetail("");
    setShowDetail(false);
  }

  return (
    <section
      className="sketch-card relative flex flex-col overflow-hidden"
      style={scopeStyle}
      data-preset={preset}
    >
      {/* Faint texture wash from the attached pin's image. */}
      {attachedPin?.imageUrl && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.10]"
          style={{
            backgroundImage: `url(${attachedPin.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {/* Accent tint at the top of the card. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24"
        style={{
          background: `linear-gradient(to bottom, color-mix(in srgb, ${accent} 26%, transparent), transparent)`,
        }}
      />

      <div className="relative flex flex-col gap-3 p-4">
        {/* Header */}
        <header className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <input
              value={category.name}
              onChange={(e) => onRename(category.id, e.target.value)}
              aria-label="Category name"
              className="w-full truncate bg-transparent font-display text-3xl leading-none text-text outline-none focus:underline"
              style={{ textDecorationColor: accent }}
            />
            <Squiggle className="doodle mt-1 h-2 w-24" style={{ color: accent }} />
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            {/* Attach a pin as this list's vibe */}
            <AttachVibe
              pins={pins}
              attachedPinId={category.attachedPinId}
              onAttach={(pinId) => onAttach(category.id, pinId)}
              title="Attach a pin as this list's vibe"
              align="right"
            />
            {/* Recolor — manual fallback, only when no pin themes this list. */}
            {!attachedPin && (
              <label
                className="press grid cursor-pointer place-items-center rounded-lg p-1.5 text-text-soft hover:text-text"
                title="Recolor"
              >
                <Palette className="h-5 w-5" />
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => onRecolor(category.id, e.target.value)}
                  className="sr-only"
                  aria-label="Category color"
                />
              </label>
            )}
            {/* Delete category */}
            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete the "${category.name}" list and its tasks?`))
                  onDelete(category.id);
              }}
              aria-label="Delete category"
              className="press rounded-lg p-1.5 text-text-soft hover:text-text"
            >
              <Trash className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Inspiration shelf */}
        {attachedPin && (
          <a
            href={attachedPin.url}
            target="_blank"
            rel="noreferrer"
            className="press taped flex items-center gap-3 rounded-2xl border border-line bg-surface/80 p-2 pr-3"
          >
            {attachedPin.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={attachedPin.imageUrl}
                alt=""
                className="h-12 w-12 rounded-xl object-cover"
              />
            ) : (
              <span
                className="grid h-12 w-12 place-items-center rounded-xl text-on-accent"
                style={{ background: accent }}
              >
                <Sparkle className="h-5 w-5" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-text">
                {attachedPin.title || "Pinned inspiration"}
              </span>
              <span className="block text-xs text-text-soft">
                from Pinterest ↗
              </span>
            </span>
          </a>
        )}

        {/* Add task */}
        <form onSubmit={submit} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2 rounded-2xl border border-line bg-surface px-3 py-1.5">
            <button
              type="submit"
              aria-label="Add task"
              className="press grid h-7 w-7 shrink-0 place-items-center rounded-full text-on-accent"
              style={{ background: accent }}
            >
              <Plus className="h-4 w-4" />
            </button>
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onFocus={() => setShowDetail(true)}
              placeholder="Add something…"
              className="min-w-0 flex-1 bg-transparent py-1 text-[0.98rem] text-text outline-none placeholder:text-text-soft/70"
            />
          </div>
          {showDetail && (
            <input
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="A little detail (optional)"
              className="mx-1 bg-transparent text-sm text-text-soft outline-none placeholder:text-text-soft/60"
            />
          )}
        </form>

        {/* Active tasks */}
        <ul className="flex flex-col gap-0.5">
          {active.map((t) => (
            <TaskItem
              key={t.id}
              task={t}
              accent={accent}
              onToggle={onToggleTask}
              onDelete={onDeleteTask}
            />
          ))}
          {active.length === 0 && (
            <li className="px-2 py-3 text-center text-sm text-text-soft">
              {done.length ? "All done — nice. ✨" : "Nothing here yet."}
            </li>
          )}
        </ul>

        {/* Done group */}
        {done.length > 0 && (
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setShowDone((v) => !v)}
              className="press flex w-full items-center gap-2 rounded-xl px-2 py-1 text-left text-sm text-text-soft hover:text-text"
            >
              <span
                className="grid h-5 w-5 place-items-center rounded-full text-xs text-on-accent"
                style={{ background: accent }}
              >
                {done.length}
              </span>
              Done
              <span className="ml-auto text-xs">{showDone ? "hide" : "show"}</span>
            </button>
            {showDone && (
              <ul className="flex flex-col gap-0.5">
                {done.map((t) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    accent={accent}
                    onToggle={onToggleTask}
                    onDelete={onDeleteTask}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
