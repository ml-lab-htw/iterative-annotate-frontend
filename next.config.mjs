/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: '/backend/:path*', // Matches requests starting with /backend/
                destination: 'http://backend:8000/:path*', // Proxies to backend
            },
        ];
    },
};

export default nextConfig;
