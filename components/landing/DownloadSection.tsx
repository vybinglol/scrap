"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";
import { isMac } from "@/lib/platform";

export function DownloadSection() {
  // Detect platform after mount to avoid hydration mismatch.
  const [mac, setMac] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMac(isMac());
  }, []);

  return (
    <section id="download" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="sketch-card flex flex-col items-center gap-6 p-8 text-center">
        <h2 className="font-display text-4xl text-text sm:text-5xl">
          {mac ? "Get Scrapable for Mac" : "Grab it when you're on a Mac"}
        </h2>

        {/* Primary CTA — always the Mac download; web link always available too. */}
        <div className="flex flex-col items-center gap-3">
          <a
            href={site.downloadUrl}
            className="press inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-lg font-semibold text-on-accent shadow-lg"
          >
            ⬇ Download free for Mac
          </a>
          <p className="text-sm text-text-soft">
            v{site.version} · {site.fileSize} · {site.macMin} · {site.arch}
          </p>
          <Link
            href={site.webAppPath}
            className="text-sm font-medium text-text underline decoration-accent decoration-2 underline-offset-4"
          >
            Not on Mac? Use the web version →
          </Link>
        </div>

        {/* Install instructions for an UNSIGNED app.
            REMOVE this whole block once the app is signed with an Apple
            Developer ID and notarized — then it opens with a normal double-click. */}
        <div className="mt-2 w-full rounded-2xl border border-line bg-bg-2/50 p-5 text-left">
          <p className="font-display text-2xl text-text">
            First time opening it?
          </p>
          <p className="mt-1 text-sm text-text-soft">
            Scrapable is a free, open-source indie app, so it isn&apos;t paid into
            Apple&apos;s notarization program yet. macOS will ask you to confirm
            it&apos;s safe — this is normal. Here&apos;s the one-time step:
          </p>
          <ol className="mt-3 flex list-decimal flex-col gap-1.5 pl-5 text-sm text-text">
            <li>
              Drag <strong>Scrapable</strong> into your Applications folder.
            </li>
            <li>
              <strong>Right-click (or Control-click)</strong> Scrapable →{" "}
              <strong>Open</strong> → <strong>Open</strong>.
            </li>
            <li>That&apos;s it — it opens normally every time after that.</li>
          </ol>
          <p className="mt-3 text-xs text-text-soft">
            Power user? Run{" "}
            <code className="rounded bg-bg-2 px-1.5 py-0.5">
              xattr -cr /Applications/Scrapable.app
            </code>{" "}
            in Terminal to clear the quarantine flag.
          </p>
        </div>
      </div>
    </section>
  );
}
