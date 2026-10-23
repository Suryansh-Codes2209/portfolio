import { allBlogs } from "contentlayer/generated";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Chapter } from "../vox/chapter";
import { KineticHeading } from "../vox/kinetic-heading";
import { TapedCard } from "../vox/taped-card";

/** Latest three posts, clipped out of the paper like newspaper cuttings. */
export function BlogSection() {
  const latestPosts = allBlogs
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <Chapter id="blog" number={6} kicker="Writing">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <KineticHeading text="Notes from the build log" highlight="build log" />
        <Link href="/blog" className="hidden items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-fg-subtle hover:text-fg sm:flex">
          All posts <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {latestPosts.map((post, i) => {
          return (
            <TapedCard key={post.slug} seed={post.slug} fig={`Clipping ${String(i + 1).padStart(2, "0")} · ${new Date(post.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`} className="group p-3">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="halftone relative aspect-[16/10] overflow-hidden bg-bg-2">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover grayscale-[35%] sepia-[20%] transition duration-500 group-hover:scale-[1.03] group-hover:grayscale-0 group-hover:sepia-0"
                    />
                  ) : (
                    // no cover art yet: a big typeset headline stands in
                    <p className="absolute inset-0 flex items-end p-4 font-serif text-3xl leading-none text-fg-faint">{post.title}</p>
                  )}
                </div>
                <div className="px-2 pb-2 pt-4">
                  <div className="mb-2 flex flex-wrap gap-2">
                    {post.tags?.slice(0, 2).map((tag) => (
                      <span key={tag} className="font-mono text-[10px] uppercase tracking-widest text-accent-text">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-serif text-2xl leading-tight text-fg decoration-highlight decoration-[6px] underline-offset-[-2px] group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-fg-subtle">{post.description}</p>
                </div>
              </Link>
            </TapedCard>
          );
        })}
      </div>
    </Chapter>
  );
}
