"use client";

import { useEffect, useState } from "react";

// Generic "state mirrored to storage" hook.
//
// SSR-safety: the first client render uses `initial` (matching the server's
// output) and only *after* mount do we load the real value from storage and
// flip `hydrated` true. This avoids React hydration mismatches that would
// otherwise come from reading localStorage during render.
//
// `load` and `save` are expected to be stable module-level functions
// (lib/storage.ts), so they're safe to depend on directly.
export function useLocalState<T>(
  load: () => T,
  save: (value: T) => void,
  initial: T,
): readonly [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // Load once on mount (client only).
  useEffect(() => {
    // Intentional one-time hydration from storage — this is the whole point
    // of the hook, not an accidental cascading render.
    /* eslint-disable react-hooks/set-state-in-effect */
    setState(load());
    setHydrated(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [load]);

  // Persist on every change, but only after we've hydrated (so we never
  // clobber stored data with the placeholder `initial`).
  useEffect(() => {
    if (hydrated) save(state);
  }, [state, hydrated, save]);

  return [state, setState, hydrated] as const;
}
