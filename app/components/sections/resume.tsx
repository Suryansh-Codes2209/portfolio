import { Download } from "lucide-react";
import { coreStrengths, education, experience } from "../../data/experience";
import { Timeline } from "../ui/timeline";
import { Chapter } from "../vox/chapter";
import { KineticHeading } from "../vox/kinetic-heading";
import { RemotionClip } from "../vox/remotion-clip";
import { Stamp } from "../vox/stamp";
import { TapedCard } from "../vox/taped-card";

/** The dossier: a scroll-inked timeline beside the Timeline clip. */
export function ResumeSection() {
  return (
    <Chapter id="resume" number={7} kicker="Career" tone="bg-2">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <KineticHeading text="The path here" highlight="path" />
        <a
          href="/suryansh.pdf"
          download
          className="group relative inline-flex items-center gap-2 border-2 border-fg bg-surface px-5 py-2.5 text-sm text-fg shadow-paper transition-transform hover:-rotate-1"
        >
          <Download className="h-4 w-4" /> Download the dossier (PDF)
          <Stamp className="absolute -right-6 -top-5 bg-bg-2 text-[9px]" rotate={12}>
            CV
          </Stamp>
        </a>
      </div>

      <div className="mt-16 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Timeline
            data={experience.map((exp) => ({
              title: (
                <div>
                  <p className="font-serif text-3xl text-fg md:text-4xl">{exp.period.split(" ")[0]}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-fg-subtle">{exp.type}</p>
                </div>
              ),
              content: (
                <TapedCard seed={exp.company} tape="none" className="p-6">
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent-text">
                    {exp.company} · {exp.period}
                  </p>
                  <h3 className="mb-3 mt-1 font-serif text-2xl text-fg">{exp.role}</h3>
                  <p className="mb-4 text-[13px] leading-relaxed text-fg-subtle">{exp.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <span key={t} className="border border-line-strong px-2 py-0.5 font-mono text-[10px] text-fg-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </TapedCard>
              ),
            }))}
          />
        </div>

        <aside className="space-y-12 lg:col-span-5">
          <TapedCard seed="timeline-clip" fig="Fig. 07 — The path, as a dolly shot · Remotion" tape="corners" className="p-2.5">
            <RemotionClip id="timeline" poster="/video/posters/timeline.jpg" label="Animated timeline of Suryansh's career" />
          </TapedCard>

          <TapedCard seed="education" fig="Fig. 07.1 — Education" className="p-6">
            {education.map((edu) => (
              <div key={edu.degree}>
                <h3 className="font-serif text-2xl text-fg">{edu.degree}</h3>
                <p className="mt-1 text-sm text-fg-muted">{edu.institution}</p>
                <p className="mt-0.5 font-mono text-[11px] text-fg-faint">{edu.period}</p>
              </div>
            ))}
          </TapedCard>

          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-accent-text">Core strengths</p>
            <div className="flex flex-wrap gap-2">
              {coreStrengths.map((s) => (
                <span key={s} className="marker text-sm">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Chapter>
  );
}
