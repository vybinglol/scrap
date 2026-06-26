"use client";

import { useEffect } from "react";
import { isTauri } from "@tauri-apps/api/core";

// Checks for an update once on launch — desktop only, no-op in the browser.
// Wired from v0.1 so every installed build is auto-updatable. The endpoint
// (GitHub Releases latest.json) is published by the Phase 2 CI; until then this
// just fails quietly.
export function DesktopUpdater() {
  useEffect(() => {
    if (!isTauri()) return;
    let cancelled = false;

    (async () => {
      try {
        const { check } = await import("@tauri-apps/plugin-updater");
        const update = await check();
        if (cancelled || !update) return;
        await update.downloadAndInstall();
        const { relaunch } = await import("@tauri-apps/plugin-process");
        await relaunch();
      } catch {
        // no endpoint yet / offline / no update — ignore
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
