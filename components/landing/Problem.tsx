import { Squiggle } from "@/components/Doodles";

export function Problem() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
      <Squiggle className="doodle mx-auto mb-5 h-3 w-28 text-accent" />
      <p className="font-display text-3xl leading-snug text-text sm:text-4xl">
        Every other to-do app is a blank white screen and a sad gray checklist.
      </p>
      <p className="mt-4 text-lg text-text-soft">
        No color. No doodles. No life. You spend all day in it — why does it feel
        like a tax form?
      </p>
    </section>
  );
}
