import { allBlogs } from "contentlayer/generated";

const BASE = "https://suryansh.work";

export const dynamic = "force-static";

// llms.txt — a curated Markdown map of the site for AI assistants and coding
// agents. Generated from contentlayer so new posts show up automatically
// instead of drifting out of a hand-maintained static file.
export function GET() {
  const posts = allBlogs
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const postLines = posts
    .map((p) => `- [${p.title}](${BASE}/blog/${p.slug}): ${p.description}`)
    .join("\n");

  const body = `# Suryansh Chaudhary — suryansh.work

> Full-Stack AI Engineer building in public. Creator of MacGet, a free
> open-source macOS download manager (SwiftUI + an actor-based concurrent
> engine). Builds production AI agents with LangGraph, LangChain, FastAPI and
> Google Cloud Run. Writes build logs about shipping real AI systems.

## Key pages
- [Home](${BASE}): Overview, current work, experience, and contact.
- [MacGet](${BASE}/macget): Free open-source multi-threaded download manager for macOS — chunked HTTP downloads, browser-extension capture, YouTube/HLS via bundled yt-dlp.
- [Projects](${BASE}/projects): Full list of shipped projects.
- [Blog](${BASE}/blog): Build logs and engineering notes.
- [Contact](${BASE}/contact): Email and social links.

## Blog posts
${postLines}

## About the author
- Name: Suryansh Chaudhary
- Role: Full-Stack AI Engineer at Spiral Kite Labs (2024–present)
- Education: B.Tech Computer Science (AI), Poornima Group
- Expertise: LangGraph, LangChain, RAG, FastAPI, Python, React, Next.js, TypeScript, Swift/SwiftUI, Docker, Google Cloud Run

## Optional
- [RSS feed](${BASE}/rss.xml)
- [Full text of all posts](${BASE}/llms-full.txt)
- [GitHub](https://github.com/Suryansh-Codes2209)
- [X / Twitter](https://x.com/Suryansh_2001)
- [LinkedIn](https://www.linkedin.com/in/suryansh-chaudhary-2209/)
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
