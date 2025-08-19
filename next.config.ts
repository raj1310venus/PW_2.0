import type { NextConfig } from "next";

const isGhPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // When building for GitHub Pages, export a static site under the project base path
  ...(isGhPages
    ? {
        output: "export",
        basePath: "/PW_2.0",
        assetPrefix: "/PW_2.0/",
        trailingSlash: true,
      }
    : {}),
  images: {
    // Disable image optimization for static export to avoid dynamic loader requirements
    ...(isGhPages ? { unoptimized: true } : {}),
    remotePatterns: [
      // Google Maps / Photos / User Content hosts
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "lh4.googleusercontent.com" },
      { protocol: "https", hostname: "lh5.googleusercontent.com" },
      { protocol: "https", hostname: "lh6.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "maps.gstatic.com" },
      { protocol: "https", hostname: "ssl.gstatic.com" },
      { protocol: "https", hostname: "*.ggpht.com" },
      // Unsplash (open-source photography)
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "source.unsplash.com" },
      // Additional hosts present in next.config.mjs to keep parity
      { protocol: "https", hostname: "i.pravatar.cc" },
    ],
  },
};

export default nextConfig;
