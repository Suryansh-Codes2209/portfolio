import type { MetadataRoute } from "next";
import { allBlogs } from "contentlayer/generated";

const BASE_URL = "https://suryansh.work";

const published = allBlogs.filter((post) => post.published);

// Newest post date doubles as the "last time the site meaningfully changed",
// so hub pages don't churn their lastmod on every unrelated redeploy.
const latestPostDate = published.reduce<Date>((latest, post) => {
	const d = new Date(post.date);
	return d > latest ? d : latest;
}, new Date(0));

type Route = {
	path: string;
	priority: number;
	changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
	lastModified: Date;
};

export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes: Route[] = [
		{ path: "", priority: 1.0, changeFrequency: "weekly", lastModified: latestPostDate },
		{ path: "/macget", priority: 0.9, changeFrequency: "weekly", lastModified: latestPostDate },
		{ path: "/blog", priority: 0.9, changeFrequency: "weekly", lastModified: latestPostDate },
		{ path: "/projects", priority: 0.7, changeFrequency: "monthly", lastModified: latestPostDate },
		{ path: "/contact", priority: 0.4, changeFrequency: "yearly", lastModified: latestPostDate },
		{
			path: "/macget/privacy",
			priority: 0.2,
			changeFrequency: "yearly",
			lastModified: latestPostDate,
		},
	];

	const blogRoutes: Route[] = published.map((post) => ({
		path: `/blog/${post.slug}`,
		// Posts are the pages that actually earn long-tail traffic — rank them
		// above the secondary static pages.
		priority: 0.8,
		changeFrequency: "monthly" as const,
		lastModified: new Date(post.date),
	}));

	return [...staticRoutes, ...blogRoutes].map((r) => ({
		url: `${BASE_URL}${r.path}`,
		lastModified: r.lastModified,
		changeFrequency: r.changeFrequency,
		priority: r.priority,
	}));
}
