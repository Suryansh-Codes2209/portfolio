import type { MetadataRoute } from "next";
import { allBlogs } from "contentlayer/generated";

const BASE_URL = "https://suryansh.work";

export default function sitemap(): MetadataRoute.Sitemap {
	const staticRoutes = [
		"",
		"/projects",
		"/blog",
		"/macget",
		"/macget/privacy",
		"/contact",
	].map((route) => ({
		url: `${BASE_URL}${route}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: route === "" || route === "/macget" ? 1 : 0.7,
	}));

	const blogRoutes = allBlogs
		.filter((post) => post.published)
		.map((post) => ({
			url: `${BASE_URL}/blog/${post.slug}`,
			lastModified: new Date(post.date),
			changeFrequency: "monthly" as const,
			priority: 0.6,
		}));

	return [...staticRoutes, ...blogRoutes];
}
