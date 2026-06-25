"use client";

import type { HouseVibe, Palette, Pin } from "@/lib/types";
import { AddInspiration } from "./AddInspiration";
import { Trash, Sparkle, Link as LinkIcon } from "./icons";
import { Star, Heart } from "./Doodles";

const PRESET_LABEL: Record<string, string> = {
  cozy: "Cozy",
  "dark-academia": "Dark academia",
  "minimal-clean": "Minimal clean",
  "playful-y2k": "Playful Y2K",
};

const ROLES: (keyof Palette)[] = ["bg", "surface", "accent", "accent2", "text"];

function Swatches({ palette, size = "h-6 w-6" }: { palette: Palette; size?: string }) {
  return (
    <div className="flex gap-1">
      {ROLES.map((role) => (
        <span
          key={role}
          title={`${role}: ${palette[role]}`}
          className={`${size} rounded-md border border-black/10`}
          style={{ background: palette[role] }}
        />
      ))}
    </div>
  );
}

type Props = {
  pins: Pin[];
  houseVibe: HouseVibe;
  housePin?: Pin;
  refreshing: boolean;
  onAdd: (pin: Pin) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
};

export function VibeShelf({
  pins,
  houseVibe,
  housePin,
  refreshing,
  onAdd,
  onDelete,
  onRefresh,
}: Props) {
  const themedCount = pins.filter((p) => p.palette).length;

  const subtitle = housePin
    ? `${PRESET_LABEL[houseVibe.preset]} · pinned from "${
        housePin.title || "a board"
      }"`
    : themedCount
      ? `${PRESET_LABEL[houseVibe.preset]} · blended from ${themedCount} pin${
          themedCount === 1 ? "" : "s"
        }`
      : "Neutral default — add a pin to set the mood";

  return (
    <div className="flex flex-col gap-6">
      {/* House vibe summary — the palette the whole app is wearing. */}
      <div className="sketch-card flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-accent text-on-accent">
            <Sparkle className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-2xl leading-none text-text">
              House vibe
            </p>
            <p className="text-xs text-text-soft">{subtitle}</p>
          </div>
        </div>

        <Swatches palette={houseVibe.palette} size="h-8 w-8" />

        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing || pins.length === 0}
          className="press ml-auto rounded-full border border-line px-4 py-2 text-sm font-medium text-text hover:border-accent disabled:opacity-50"
        >
          {refreshing ? "Refreshing…" : "↻ Refresh vibe"}
        </button>
      </div>

      <AddInspiration onAdd={onAdd} />

      {pins.length === 0 ? (
        <div className="sketch-card grid place-items-center gap-3 p-12 text-center">
          <span className="doodle flex gap-2 text-accent">
            <Star className="h-6 w-6" />
            <Heart className="h-6 w-6" />
            <Sparkle className="h-6 w-6" />
          </span>
          <p className="font-display text-3xl text-text">
            Your workspace is a blank canvas
          </p>
          <p className="max-w-sm text-sm text-text-soft">
            Paste a Pinterest pin or board and the whole app re-skins to match its
            colors and mood. Add more and the vibe evolves.
          </p>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm text-text-soft">Where this vibe came from</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pins.map((pin) => (
              <div key={pin.id} className="sketch-card group relative flex gap-3 p-3">
                {/* extracted thumbnail */}
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-bg-2">
                  {pin.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={pin.imageUrl}
                      alt={pin.title || ""}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="grid h-full w-full place-items-center text-text-soft">
                      <LinkIcon className="h-6 w-6" />
                    </span>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <p className="line-clamp-2 text-sm font-medium text-text">
                    {pin.title || pin.url}
                  </p>
                  {pin.palette ? (
                    <Swatches palette={pin.palette} />
                  ) : (
                    <p className="text-xs text-text-soft">No palette read</p>
                  )}
                  <a
                    href={pin.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto text-xs text-text-soft hover:text-accent"
                  >
                    {pin.kind} on Pinterest ↗
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() => onDelete(pin.id)}
                  aria-label="Remove inspiration"
                  className="press absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-bg-2 text-text-soft opacity-0 transition group-hover:opacity-100 hover:text-text"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
