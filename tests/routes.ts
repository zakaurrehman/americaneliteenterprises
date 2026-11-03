import { entities } from "../src/content/entities";
import { sectors } from "../src/content/portfolio";

export const routes = [
  "/",
  "/about/",
  "/companies/",
  "/industries/",
  ...sectors.map((s) => `/industries/${s.slug}/`),
  "/dr-daniel-davidson/",
  ...entities.map((e) => `/${e.slug}/`),
  "/contact/",
];

/** Retired WordPress URLs and where they should now land. */
export const legacyRedirects: [string, string][] = [
  ["/home/", "/"],
  ["/leadership/", "/dr-daniel-davidson/"],
  ["/login/", "/contact/"],
  ["/login-page/", "/contact/"],
  ["/register/", "/contact/"],
  ["/membership-plans/", "/american-elite-club/"],
  ["/testing/", "/"],
  ["/blog-post-title/", "/"],
  ["/business-engineering-vs-business-development/", "/american-elite-global-solutions/"],
  ["/feed/", "/"],
  ["/wp-sitemap.xml", "/sitemap.xml"],
  ["/wp-sitemap-posts-page-1.xml", "/sitemap.xml"],
];
