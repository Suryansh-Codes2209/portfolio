import { allBlogs } from "contentlayer/generated";
import { ArrowLeft, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/app/components/mdx";
import "./mdx.css";

export const revalidate = 60;

type Props = { params: { slug: string } };

export async function generateStaticParams(): Promise<Props["params"][]> {
  return allBlogs.filter((p) => p.published).map((p) => ({ slug: p.slug }));
}

export default function BlogPostPage({ params }: Props) {
  const post = allBlogs.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div className="bg-black text-zinc-100 min-h-screen">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full bg-claude-600/[0.05] blur-[120px]" />
      </div>

      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md border-b border-claude-500/10 bg-black/80">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All posts
          </Link>
          <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            suryansh.work
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-28 pb-24 relative">
        {/* header */}
        <div className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {post.tags?.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-[10px] text-claude-400/70 border border-claude-500/20 bg-claude-500/[0.07] px-2 py-0.5 rounded-full">
                <Tag className="w-2.5 h-2.5" />{tag}
              </span>
            ))}
            {post.readingTime && (
              <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                <Clock className="w-2.5 h-2.5" />{post.readingTime} min read
              </span>
            )}
            <span className="text-[10px] text-zinc-600">
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display text-zinc-100 mb-4 leading-snug">
            {post.title}
          </h1>
          <p className="text-zinc-400 leading-relaxed">{post.description}</p>
        </div>

        <div className="h-px bg-gradient-to-r from-claude-500/20 via-claude-600/20 to-transparent mb-10" />

        {/* mdx content */}
        <article className="prose prose-invert prose-zinc prose-quoteless max-w-none
          prose-headings:font-display prose-headings:text-zinc-100
          prose-p:text-zinc-400 prose-p:leading-relaxed
          prose-a:text-claude-400 prose-a:no-underline hover:prose-a:text-claude-300
          prose-code:text-claude-300 prose-code:bg-claude-500/10 prose-code:border-claude-500/20
          prose-pre:bg-zinc-900/80 prose-pre:border prose-pre:border-zinc-800
          prose-strong:text-zinc-200
          prose-li:text-zinc-400">
          <Mdx code={post.body.code} />
        </article>

        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent mt-14 mb-10" />

        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all posts
        </Link>
      </div>
    </div>
  );
}
