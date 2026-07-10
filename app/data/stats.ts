// Build-time proof stats for the hero. Never throws — falls back to static
// numbers so a failed/ratelimited fetch can't break the build or the hero.
const FALLBACK = { githubStars: 0, macgetDownloads: 0 };

type Stats = { githubStars: number; macgetDownloads: number };

async function safeJson(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "suryansh-portfolio" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getProofStats(): Promise<Stats> {
  const [repo, releases] = await Promise.all([
    safeJson("https://api.github.com/repos/Suryansh-Codes2209/Macget"),
    safeJson("https://api.github.com/repos/Suryansh-Codes2209/Macget/releases"),
  ]);

  const githubStars = typeof repo?.stargazers_count === "number" ? repo.stargazers_count : FALLBACK.githubStars;

  let macgetDownloads = FALLBACK.macgetDownloads;
  if (Array.isArray(releases)) {
    macgetDownloads = releases.reduce((sum: number, r: any) => {
      const assets = Array.isArray(r?.assets) ? r.assets : [];
      return sum + assets.reduce((s: number, a: any) => s + (a?.download_count ?? 0), 0);
    }, 0);
  }

  return { githubStars, macgetDownloads };
}

// Compact display: 1234 -> "1.2k"
export function compact(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k`;
  return String(n);
}
