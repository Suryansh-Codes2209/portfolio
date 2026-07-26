import { allBlogs } from "contentlayer/generated";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mdx } from "@/app/components/mdx";
import { ReadingProgress } from "@/app/components/blog/reading-progress";
import { PostToc } from "@/app/components/blog/post-toc";
import { ShareActions } from "@/app/components/blog/share-actions";
import { LikeButton } from "@/app/components/blog/like-button";
import { AuthorBit } from "@/app/components/blog/author-bit";
import { SubscribeForm } from "@/app/components/blog/subscribe-form";
import { relatedPosts } from "@/app/lib/related-posts";
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
      // Falls back to the generated opengraph-image route when a post has no cover.
      ...(post.image ? { images: [`https://suryansh.work${post.image}`] } : {}),
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
  const related = relatedPosts(post, allBlogs, 3);
  const url = `https://suryansh.work/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#post`,
        headline: post.title,
        description: post.description,
        datePublished: new Date(post.date).toISOString(),
        dateModified: new Date(post.date).toISOString(),
        // Point at the site-wide Person entity instead of re-declaring a loose
        // copy, so authorship consolidates onto one node.
        author: {
          "@type": "Person",
          "@id": "https://suryansh.work/#person",
          name: "Suryansh Chaudhary",
          url: "https://suryansh.work",
        },
        publisher: { "@id": "https://suryansh.work/#person" },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@id": "https://suryansh.work/#website" },
        image: [
          post.image
            ? `https://suryansh.work${post.image}`
            : `https://suryansh.work/blog/${post.slug}/opengraph-image`,
        ],
        keywords: post.tags?.join(", "),
        articleSection: post.tags?.[0],
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://suryansh.work" },
          { "@type": "ListItem", position: 2, name: "Blog", item: "https://suryansh.work/blog" },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <div className="bg-bg text-fg min-h-screen">
      <ReadingProgress />
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
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center justify-between">
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

      <div className="mx-auto max-w-6xl px-4 pt-28 pb-24">
        <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_680px_minmax(0,1fr)] xl:gap-8">
          {/* left rail — table of contents */}
          <aside className="hidden xl:block">
            <div className="sticky top-28 pr-2">
              <PostToc />
            </div>
          </aside>

          {/* article column */}
          <div className="mx-auto w-full min-w-0 max-w-[680px]">
            {/* header */}
            <div className="mb-8">
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
              <p className="text-lg text-fg-muted leading-relaxed mb-4">{post.description}</p>

              <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-fg-subtle">
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

            {/* cover */}
            {post.image && (
              <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-surface">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  priority
                  sizes="(min-width: 1280px) 680px, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            {/* inline actions (mobile / non-xl) */}
            <div className="mb-8 flex items-center justify-between gap-4 border-y border-line py-3 xl:hidden">
              <LikeButton slug={post.slug} />
              <ShareActions title={post.title} url={url} />
            </div>

            <div className="hidden xl:block h-px bg-line mb-10" />

            {/* mdx content */}
            <article className="prose prose-quoteless max-w-none">
              <Mdx code={post.body.code} />
            </article>

            <div className="h-px bg-line mt-14 mb-10" />

            {/* related posts */}
            {related.length > 0 && (
              <div className="mb-12">
                <h2 className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-fg-faint">
                  Related posts
                </h2>
                <div className="grid gap-3 sm:grid-cols-3">
                  {related.map((r) => (
                    <Link
                      key={r.slug}
                      href={`/blog/${r.slug}`}
                      className="group rounded-xl border border-line p-4 transition-colors duration-200 hover:border-line-strong hover:bg-surface"
                    >
                      <h3 className="text-sm font-medium text-fg leading-snug line-clamp-3 transition-colors group-hover:text-accent-text">
                        {r.title}
                      </h3>
                      {r.readingTime && (
                        <span className="mt-2 block font-mono text-[10px] text-fg-subtle">
                          {r.readingTime} min read
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* newsletter CTA */}
            <div className="my-12">
              <SubscribeForm />
            </div>

            {/* author */}
            <div className="mb-12">
              <AuthorBit />
            </div>

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

          {/* right rail — like + share (xl) */}
          <aside className="hidden xl:block">
            <div className="sticky top-28 flex flex-col items-start gap-6 pl-2">
              <LikeButton slug={post.slug} layout="col" />
              <ShareActions title={post.title} url={url} layout="col" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
