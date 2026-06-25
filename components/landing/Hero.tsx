import Link from "next/link";
import { site } from "@/lib/site";
import { VibeSwitcher } from "./VibeSwitcher";
import { AppMockup } from "./AppMockup";
import { Star, Heart } from "@/components/Doodles";
import { Sparkle } from "@/components/icons";

export function Hero() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
        {/* Left: pitch */}
        <div className="fade-up flex flex-col gap-6">
          <span className="taped inline-flex w-fit items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm font-medium text-text-soft">
            <Sparkle className="h-4 w-4 text-accent" /> A to-do app with a
            personality
          </span>

          <h1 className="font-display text-5xl leading-[0.95] text-text sm:text-6xl md:text-7xl">
            Your to-do list,
            <br />
            but make it{" "}
            <span className="underline-sketch text-accent">yours</span>
            <Star className="doodle ml-2 inline h-8 w-8 text-accent" />
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-text-soft">
            Scrapable turns your Pinterest inspiration into your app&apos;s actual
            look — colors, mood, fonts, doodles and all. A to-do + notes app that
            becomes <em className="text-text">you</em>. Free for Mac.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={site.downloadUrl}
                className="press inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-base font-semibold text-on-accent shadow-lg"
              >
                <AppleMark className="h-5 w-5" />
                Download free for Mac
              </a>
              <Link
                href={site.webAppPath}
                className="press inline-flex items-center gap-2 rounded-full border-2 border-line px-6 py-3 text-base font-semibold text-text hover:border-accent"
              >
                Try it in your browser
              </Link>
            </div>
            <p className="pl-1 text-sm text-text-soft">
              Free forever. No account. Your data stays on your device.
            </p>
          </div>

          <div className="pt-1">
            <VibeSwitcher />
          </div>
        </div>

        {/* Right: live mockup */}
        <div className="fade-up relative">
          <Heart className="doodle absolute -left-4 -top-5 h-7 w-7 -rotate-12 text-accent-2" />
          <Star className="doodle absolute -right-3 bottom-6 h-6 w-6 text-accent" />
          <AppMockup />
        </div>
      </div>
    </section>
  );
}

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 384 512" className={className} fill="currentColor" aria-hidden>
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
    </svg>
  );
}
