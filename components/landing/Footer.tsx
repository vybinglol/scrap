import { site } from "@/lib/site";
import { Sparkle } from "@/components/icons";
import { Star } from "@/components/Doodles";

export function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-10 text-center sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-on-accent">
            <Sparkle className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl text-text">{site.name}</span>
          <Star className="doodle h-4 w-4 text-accent" />
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-text-soft">
          <a
            href={site.kofiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text"
          >
            Ko-fi ☕
          </a>
          <a
            href={site.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text"
          >
            GitHub
          </a>
          <a href={site.webAppPath} className="hover:text-text">
            Open the web app
          </a>
        </nav>

        <p className="text-sm text-text-soft">
          Made with ☕ + doodles by {site.author} · ©{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
