/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/individual-progress-pro",
  output: "export",
  // basePath: "",
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
    fonts: [
      {
        family: "Vazirmatn",
        src: "/fonts/Vazirmatn-VariableFont_wght.ttf",
      },
      {
        family: "Inter",
        src: "/fonts/Inter-VariableFont_opsz,wght.ttf",
      },
    ],
  },
};

export default nextConfig;
