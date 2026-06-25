// Minimal line icons (stroke = currentColor). Kept local so the app needs no
// icon-library dependency.

type IconProps = { className?: string };

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Plus({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function Trash({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-1 13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1L6 7" />
    </svg>
  );
}

export function Mic({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
    </svg>
  );
}

export function Pencil({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      <path d="M4 20h4L18.5 9.5a2 2 0 0 0-3-3L5 17l-1 3Z" />
    </svg>
  );
}

export function Palette({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      <path d="M12 3a9 9 0 1 0 0 18 2 2 0 0 0 2-2 2 2 0 0 1 2-2h1a4 4 0 0 0 4-4 9 9 0 0 0-9-8Z" />
      <circle cx="7.5" cy="11" r="1" fill="currentColor" stroke="none" />
      <circle cx="11" cy="7.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="8.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Close({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Sparkle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      <path d="M12 4c.6 3.4 2.6 5.4 6 6-3.4.6-5.4 2.6-6 6-.6-3.4-2.6-5.4-6-6 3.4-.6 5.4-2.6 6-6Z" />
    </svg>
  );
}

export function Link({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...base}>
      <path d="M9 15l6-6M10 6l1-1a4 4 0 0 1 6 6l-1 1M14 18l-1 1a4 4 0 0 1-6-6l1-1" />
    </svg>
  );
}
