/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: process.env.NEXT_PUBLIC_PROTOCOL,
                hostname: process.env.NEXT_PUBLIC_HOST,
                port: process.env.NEXT_PUBLIC_PORT,
            },
        ],
    },
};

export default nextConfig;
