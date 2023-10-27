/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	env: {
		NEXT_HOST: "https://whatsapp-web-clone-production.up.railway.app",
		NEXT_PUBLIC_ZEGO_APP_ID: 656124032,
		NEXT_PUBLIC_ZEGO_SERVER_ID: "212b3e9dc5c2bb23823f39f9d03bffed",
		NEXT_EDEN_API_KEY:
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNzk5ZTZkZWItNzM0OC00OWQ0LTgxNmEtMzVkYmI1MzgyNmYzIiwidHlwZSI6ImFwaV90b2tlbiJ9.P06bufY6AEpkanaLSkBy1kwzQd8XRr-WRluU4s7gv0s",
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "**",
			},
		],
	},
};

module.exports = nextConfig;
