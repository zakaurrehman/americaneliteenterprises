import type { MetadataRoute } from "next";
import { entities } from "@/content/entities";
import { sectorHref, sectors } from "@/content/portfolio";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority,
  });

  return [
    page("/", 1),
    page("/about/", 0.8),
    page("/companies/", 0.9),
    page("/industries/", 0.8),
    ...sectors.map((s) => page(sectorHref(s.slug), 0.7)),
    page("/dr-daniel-davidson/", 0.7),
    ...entities.map((e) => page(`/${e.slug}/`, 0.6)),
    page("/contact/", 0.6),
  ];
}
