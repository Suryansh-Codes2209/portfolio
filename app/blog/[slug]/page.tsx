import { allBlogs } from "contentlayer/generated";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/app/components/mdx";
import { ThemeToggle } from "../../components/theme-toggle";
import "./mdx.css";

export const revalidate = 60;

type Props = { params: { slug: string } };

const published = allBlogs
  .filter((p) => p.published)
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export async function generateStaticParams(): Promise<Props["params"][]> {
  return published.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = allBlogs.find((p) => p.slug === params.slug);
  if (!post) return {};

  const url = `https://suryansh.work/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      url,
      publishedTime: new Date(post.date).toISOString(),
      authors: ["Suryansh Chaudhary"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      creator: "@Suryansh_2001",
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = allBlogs.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const index = published.findIndex((p) => p.slug === params.slug);
  // `published` is sorted newest → oldest, so "previous" (older) sits at index + 1
  // and "next" (newer) sits at index - 1.
  const prevPost = index !== -1 && index < published.length - 1 ? published[index + 1] : null;
  const nextPost = index > 0 ? published[index - 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: { "@type": "Person", name: "Suryansh Chaudhary", url: "https://suryansh.work" },
    publisher: { "@type": "Person", name: "Suryansh Chaudhary" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://suryansh.work/blog/${post.slug}` },
    image: [`https://suryansh.work/blog/${post.slug}/opengraph-image`],
    keywords: post.tags?.join(", "),
  };

  return (
    <div className="bg-bg text-fg min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-0 right-1/3 w-[500px] h-[500px] rounded-full bg-claude-600/[0.05] blur-[120px]" />
      </div>

      {/* nav */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md">
        <div className="max-w-[68ch] mx-auto px-5 h-14 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-xs text-fg-subtle hover:text-fg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All posts
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-[68ch] mx-auto px-4 pt-28 pb-24 relative">
        {/* header */}
        <div className="mb-10">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 rounded-full border border-accent/20 bg-accent-soft px-2 py-0.5 text-[10px] text-accent-text"
                >
                  <Tag className="w-2.5 h-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-display text-fg mb-4 leading-snug">
            {post.title}
          </h1>
          <p className="text-fg-muted leading-relaxed mb-4">{post.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-fg-subtle">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            {post.readingTime && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {post.readingTime} min read
                </span>
              </>
            )}
          </div>
        </div>

        <div className="h-px bg-line mb-10" />

        {/* mdx content */}
        <article className="prose prose-quoteless max-w-none">
          <Mdx code={post.body.code} />
        </article>

        <div className="h-px bg-line mt-14 mb-10" />

        {(prevPost || nextPost) && (
          <div className="grid gap-4 sm:grid-cols-2 mb-10">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group rounded-xl border border-line p-5 transition-colors duration-200 hover:border-line-strong hover:bg-surface"
              >
                <span className="flex items-center gap-1 text-[11px] text-fg-subtle">
                  <ArrowLeft className="w-3 h-3" />
                  Previous
                </span>
                <span className="mt-2 block text-sm font-medium text-fg line-clamp-2 transition-colors duration-150 group-hover:text-accent-text">
                  {prevPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group rounded-xl border border-line p-5 text-right transition-colors duration-200 hover:border-line-strong hover:bg-surface"
              >
                <span className="flex items-center justify-end gap-1 text-[11px] text-fg-subtle">
                  Next
                  <ArrowRight className="w-3 h-3" />
                </span>
                <span className="mt-2 block text-sm font-medium text-fg line-clamp-2 transition-colors duration-150 group-hover:text-accent-text">
                  {nextPost.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}

        <Link
          href="/blog"
          className="flex items-center gap-2 text-sm text-fg-subtle hover:text-fg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all posts
        </Link>
      </div>
    </div>
  );
}
