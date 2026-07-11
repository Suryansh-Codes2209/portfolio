import type { Blog } from "contentlayer/generated";

/**
 * Rank other published posts by shared-tag overlap with the current post and
 * return the top `limit`. Ties break toward the more recent post. Pure function
 * over the existing frontmatter — no new data needed.
 */
export function relatedPosts(current: Blog, all: Blog[], limit = 3): Blog[] {
  const currentTags = new Set(current.tags ?? []);

  return all
    .filter((p) => p.published && p.slug !== current.slug)
    .map((p) => ({
      post: p,
      score: (p.tags ?? []).filter((t) => currentTags.has(t)).length,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime();
    })
    .filter((x) => x.score > 0)
    .slice(0, limit)
    .map((x) => x.post);
}
