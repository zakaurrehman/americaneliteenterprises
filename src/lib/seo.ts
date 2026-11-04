import type { Metadata } from "next";
import { entities } from "@/content/entities";
import { site } from "@/content/site";

/**
 * Builds route metadata with a canonical URL and matching Open Graph tags.
 * The share image comes from app/opengraph-image.tsx for every route.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const orgId = `${site.url}/#organization`;

export function organizationJsonLd() {
  const { address } = site.contact;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.name,
        alternateName: site.shortName,
        url: site.url,
        logo: `${site.url}/brand/american-elite-crest.png`,
        description: site.description,
        foundingDate: String(site.foundedYear),
        telephone: "+1-310-766-6600",
        email: site.contact.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: address.street,
          addressLocality: address.city,
          addressRegion: address.region,
          postalCode: address.postalCode,
          addressCountry: address.country,
        },
        founder: {
          "@type": "Person",
          name: site.founder.name,
          url: `${site.url}/dr-daniel-davidson/`,
        },
        subOrganization: entities.map((e) => ({
          "@type": "Organization",
          name: e.name,
          url: e.website.url,
        })),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": orgId },
        inLanguage: "en-US",
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
