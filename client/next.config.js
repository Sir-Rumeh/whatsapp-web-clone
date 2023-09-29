/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		NEXT_PUBLIC_ZEGO_APP_ID: 656124032,
		NEXT_PUBLIC_ZEGO_SERVER_ID: "212b3e9dc5c2bb23823f39f9d03bffed",
	},
	images: {
		domains: ["localhost"],
	},
};

module.exports = nextConfig;
