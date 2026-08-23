import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
	// MacGet moved to its own Vercel deployment. These paths were indexed and
	// are linked from old posts/releases, so send them on instead of 404ing.
	redirects: async () => [
		// www answered 307 (temporary), which leaves Google treating the two
		// hosts as separate candidates. 308 states the canonical host outright.
		{
			source: "/:path*",
			has: [{ type: "host", value: "www.suryansh.work" }],
			destination: "https://suryansh.work/:path*",
			permanent: true,
		},
		{
			source: "/macget",
			destination: "https://macget.suryansh.work",
			permanent: true,
		},
		{
			source: "/macget/:path*",
			destination: "https://macget.suryansh.work/:path*",
			permanent: true,
		},
	],
	webpack: (config) => {
		config.ignoreWarnings = [
			...(config.ignoreWarnings || []),
			{ module: /@react-three\/fiber/, message: /unstable_act/ },
			{ module: /@contentlayer2\/core/, message: /Critical dependency|build dependencies/ },
			{ message: /Parsing of .* for build dependencies failed/ },
		];
		config.infrastructureLogging = {
			...(config.infrastructureLogging || {}),
			level: "error",
		};
		return config;
	},
};

export default withContentlayer(nextConfig);
