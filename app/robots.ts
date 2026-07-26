import type { MetadataRoute } from "next";

const BASE_URL = "https://suryansh.work";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: [
			{
				userAgent: "*",
				allow: "/",
				// API routes return JSON and have no business in the index; the
				// Next build output is never useful to a crawler either.
				disallow: ["/api/", "/_next/static/chunks/"],
			},
			// Answer engines increasingly drive discovery — opt in explicitly so
			// they don't fall back to conservative defaults.
			{ userAgent: "GPTBot", allow: "/" },
			{ userAgent: "OAI-SearchBot", allow: "/" },
			{ userAgent: "ClaudeBot", allow: "/" },
			{ userAgent: "PerplexityBot", allow: "/" },
			{ userAgent: "Google-Extended", allow: "/" },
		],
		sitemap: `${BASE_URL}/sitemap.xml`,
		host: BASE_URL,
	};
}
