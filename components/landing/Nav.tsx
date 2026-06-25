import { site } from "@/lib/site";
import { Sparkle } from "@/components/icons";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#download", label: "Download" },
  { href: "#support", label: "Support" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-bg/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <a href="#top" className="flex items-center gap-2">
          <span className="hover-wiggle grid h-8 w-8 place-items-center rounded-xl bg-accent text-on-accent">
            <Sparkle className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl text-text">{site.name}</span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-text-soft transition-colors hover:text-text"
            >
              {l.label}
            </a>
          ))}
        </div>

        <a
          href={site.downloadUrl}
          className="press rounded-full bg-accent px-4 py-2 text-sm font-semibold text-on-accent"
        >
          Download free
        </a>
      </nav>
    </header>
  );
}
