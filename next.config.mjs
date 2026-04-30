import { withContentlayer } from "next-contentlayer";

/** @type {import('next').NextConfig} */
const nextConfig = {
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
