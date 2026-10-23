import { NowBento } from "../now-bento";
import { Chapter } from "../vox/chapter";
import { KineticHeading } from "../vox/kinetic-heading";

export function NowSection() {
  return (
    <Chapter id="now" number={1} kicker="Now" tone="bg-2">
      <KineticHeading text="What I'm building right now" highlight="right now" />
      <p className="mb-14 mt-5 max-w-xl text-[15px] leading-relaxed text-fg-subtle">
        A live snapshot of what I&apos;m shipping — taped up as things move.
      </p>
      <NowBento />
      <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.2em] text-fg-faint">Last updated June 2026</p>
    </Chapter>
  );
}
