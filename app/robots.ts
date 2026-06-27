import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
		},
		sitemap: "https://suryansh.work/sitemap.xml",
		host: "https://suryansh.work",
	};
}
