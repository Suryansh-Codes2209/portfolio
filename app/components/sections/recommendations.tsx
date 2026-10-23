import { Linkedin } from "lucide-react";
import { recommendations } from "../../data/recommendations";
import { Chapter } from "../vox/chapter";
import { Highlight } from "../vox/highlight";
import { KineticHeading } from "../vox/kinetic-heading";

/** Split a paragraph around the phrase that gets the marker. */
function marked(text: string, phrase: string) {
  const at = text.indexOf(phrase);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <Highlight>{phrase}</Highlight>
      {text.slice(at + phrase.length)}
    </>
  );
}

export function RecommendationsSection() {
  return (
    <Chapter id="testimonials" number={5} kicker="The receipts" tone="bg-2">
      <KineticHeading text="Don't take my word for it." highlight="word" />

      <div className="mx-auto mt-16 max-w-3xl space-y-14">
        {recommendations.map((r) => (
          <figure key={r.name} className="relative m-0 -rotate-[0.6deg]">
            <div className="paper relative px-7 py-12 sm:px-14 [clip-path:polygon(0_1%,4%_0,30%_1%,60%_0,96%_0.6%,100%_0,99.4%_50%,100%_99%,70%_100%,40%_99.2%,8%_100%,0_99.4%,0.6%_50%)]">
              <span aria-hidden className="tape absolute left-10 top-2 h-6 w-24 -rotate-3" />
              <span aria-hidden className="tape absolute right-10 top-2 h-6 w-24 rotate-3" />
              <span aria-hidden className="block h-12 font-serif text-[110px] leading-[0.9] text-accent">&ldquo;</span>
              <blockquote className="m-0 space-y-5 font-serif text-xl leading-snug text-fg sm:text-2xl">
                {r.paragraphs.map((p, j) => (
                  <p key={j}>{marked(p, r.highlight)}</p>
                ))}
              </blockquote>
              <figcaption className="mt-10 flex flex-col gap-4 border-t border-dashed border-line-strong pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-fg font-serif text-lg text-fg">
                    {r.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium text-fg">{r.name}</p>
                    <p className="text-[12px] leading-relaxed text-fg-subtle">{r.relation}</p>
                  </div>
                </div>
                <a
                  href={r.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 self-start font-mono text-[10px] uppercase tracking-[0.2em] text-accent-text hover:underline sm:self-auto"
                >
                  <Linkedin className="h-3 w-3" /> via {r.source} · {r.date}
                </a>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </Chapter>
  );
}
