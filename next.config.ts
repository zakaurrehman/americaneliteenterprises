import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The previous WordPress site used trailing slashes (e.g. /dr-daniel-davidson/).
  // Keeping them preserves every existing indexed URL exactly.
  trailingSlash: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  // Retired WordPress routes. Pages that were placeholders, broken plugin pages
  // or empty posts are redirected to their closest meaningful destination.
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/leadership", destination: "/dr-daniel-davidson/", permanent: true },
      { source: "/login", destination: "/contact/", permanent: true },
      { source: "/login-page", destination: "/contact/", permanent: true },
      { source: "/register", destination: "/contact/", permanent: true },
      { source: "/membership-plans", destination: "/american-elite-club/", permanent: true },
      { source: "/testing", destination: "/", permanent: true },
      { source: "/blog-post-title", destination: "/", permanent: true },
      {
        source: "/business-engineering-vs-business-development",
        destination: "/american-elite-global-solutions/",
        permanent: true,
      },
      { source: "/feed", destination: "/", permanent: true },
      { source: "/comments/feed", destination: "/", permanent: true },
      { source: "/author/:slug*", destination: "/about/", permanent: true },
      { source: "/category/:slug*", destination: "/", permanent: true },
      { source: "/wp-sitemap.xml", destination: "/sitemap.xml", permanent: true },
      { source: "/:file(wp-sitemap-.*\\.xml)", destination: "/sitemap.xml", permanent: true },
      { source: "/wp-admin/:path*", destination: "/", permanent: false },
      { source: "/wp-login.php", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
