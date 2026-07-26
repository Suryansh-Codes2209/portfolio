import { allBlogs } from "contentlayer/generated";

const BASE = "https://suryansh.work";

export const dynamic = "force-static";

// llms-full.txt — the companion to llms.txt: every published post's full
// Markdown source in one document, so an AI assistant can ingest the whole
// site without crawling page by page.
export function GET() {
  const posts = allBlogs
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const sections = posts
    .map((p) => {
      const date = new Date(p.date).toISOString().slice(0, 10);
      const tags = p.tags?.length ? `\nTags: ${p.tags.join(", ")}` : "";
      return `# ${p.title}

Source: ${BASE}/blog/${p.slug}
Published: ${date}${tags}

${p.description}

${p.body.raw.trim()}`;
    })
    .join("\n\n---\n\n");

  const body = `# Suryansh Chaudhary — suryansh.work (full text)

> Full text of every published build log on suryansh.work. Author: Suryansh
> Chaudhary, Full-Stack AI Engineer. Creator of MacGet, a free open-source
> macOS download manager. See ${BASE}/llms.txt for the curated site map.

---

${sections}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
