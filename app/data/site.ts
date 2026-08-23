// Single source of truth for the facts that show up in metadata, JSON-LD and
// page copy at once. Anything duplicated across those three drifts eventually —
// Google notices the inconsistency long before a human does.

export const SITE_URL = "https://suryansh.work";

export const PERSON_NAME = "Suryansh Chaudhary";
export const PERSON_ROLE = "Full-Stack AI Engineer";
export const EMPLOYER = "Spiral Kite Labs";

/** Stable @id values so every page references the same graph nodes. */
export const ID = {
	person: `${SITE_URL}/#person`,
	website: `${SITE_URL}/#website`,
	profilePage: `${SITE_URL}/#profilepage`,
	macget: `${SITE_URL}/#macget`,
	oratora: `${SITE_URL}/#oratora`,
} as const;

export const PRODUCTS = {
	macget: {
		name: "MacGet",
		url: "https://macget.suryansh.work",
		github: "https://github.com/Suryansh-Codes2209/Macget",
		// TODO(suryansh): confirm this slug — Product Hunt returns 403 to
		// scripted requests, so it could not be verified from here.
		productHunt: "https://www.producthunt.com/products/macget",
	},
	oratora: {
		name: "Oratora",
		url: "https://oratora.live",
	},
	signalBoy: {
		name: "Signal Boy",
		url: "https://signalboy.suryansh.work",
		github: "https://github.com/Suryansh-Codes2209/Signal-Boy",
	},
} as const;

export const SOCIALS = {
	github: "https://github.com/Suryansh-Codes2209",
	linkedin: "https://www.linkedin.com/in/suryansh-chaudhary-2209/",
	x: "https://x.com/Suryansh_2001",
	email: "suryansh.codes2001@gmail.com",
} as const;

/**
 * Every profile and property that represents this same person or their work.
 * `sameAs` is how Google collapses "Suryansh Chaudhary" across the web into one
 * entity instead of several — the main defence against the namesakes currently
 * outranking this site.
 */
export const SAME_AS = [
	SOCIALS.github,
	SOCIALS.linkedin,
	SOCIALS.x,
	PRODUCTS.macget.url,
	PRODUCTS.macget.productHunt,
	PRODUCTS.oratora.url,
	PRODUCTS.signalBoy.url,
];

/** Site-wide internal links — crawl paths for the pages that aren't the homepage. */
export const NAV_PAGES = [
	{ href: "/about", label: "About" },
	{ href: "/skills", label: "Skills" },
	{ href: "/projects", label: "Projects" },
	{ href: "/blog", label: "Blog" },
	{ href: "/contact", label: "Contact" },
] as const;
