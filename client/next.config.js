/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		NEXT_PUBLIC_ZEGO_APP_ID: 656124032,
	},
	images: {
		domains: ["localhost"],
	},
};

module.exports = nextConfig;
