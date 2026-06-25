// Hand-drawn SVG flourishes used as decoration around the workspace.
// All inherit `currentColor` so they pick up whatever text color is set.

type DoodleProps = { className?: string; style?: React.CSSProperties };

export function Squiggle({ className, style }: DoodleProps) {
  return (
    <svg viewBox="0 0 120 12" fill="none" className={className} style={style} aria-hidden>
      <path
        d="M2 6c8-7 16 7 24 0s16-7 24 0 16 7 24 0 16-7 24 0 16 7 18 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Star({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3c.8 3.4 2.6 5.2 6 6-3.4.8-5.2 2.6-6 6-.8-3.4-2.6-5.2-6-6 3.4-.8 5.2-2.6 6-6Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Arrow({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 60 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 14c12-9 28-11 50-7m0 0c-4-2-7-4-9-8m9 8c-5 1-9 2-12 5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Heart({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z"
        fill="currentColor"
      />
    </svg>
  );
}

// The check path shared by the task-complete animation.
export function CheckMark({ className }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 13.5 10 18.5 19.5 6.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
