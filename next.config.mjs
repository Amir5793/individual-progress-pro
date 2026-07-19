/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/individual-progress-pro",
  output: "export",
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;
