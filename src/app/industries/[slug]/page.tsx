import Link from "next/link";
import { notFound } from "next/navigation";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowRight } from "@/components/ui/icons";
import { companiesIn, getSector, sectorHref, sectors } from "@/content/portfolio";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return sectors.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) return {};
  return pageMetadata({
    title: `${sector.name} Businesses`,
    description: `${sector.name} at American Elite Enterprises: ${sector.summary} Explore the ${sector.name.toLowerCase()} companies of the group.`,
    path: sectorHref(sector.slug),
  });
}

export default async function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  const { slug } = await params;
  const sector = getSector(slug);
  if (!sector) notFound();

  const list = companiesIn(sector.slug);
  const index = sectors.indexOf(sector);
  const next = sectors[(index + 1) % sectors.length];
  const prev = sectors[(index - 1 + sectors.length) % sectors.length];

  return (
    <>
      <PageHero
        variant="cinematic"
        image={{ src: sector.image, alt: sector.imageAlt, focus: sector.focus }}
        crumbs={[
          { name: "Industries", path: "/industries/" },
          { name: sector.name, path: sectorHref(sector.slug) },
        ]}
        eyebrow={`Sector ${String(index + 1).padStart(2, "0")} of ${sectors.length}`}
        title={sector.name}
        lead={sector.summary}
      />

      <section aria-labelledby="sector-intro" className="py-20 sm:py-28 lg:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p data-reveal className="label-mono text-accent">
              About this sector
            </p>
            <p
              data-reveal
              style={{ "--reveal-delay": 1 } as React.CSSProperties}
              className="mt-6 font-display text-6xl font-semibold tracking-tight text-fg"
            >
              {list.length}
            </p>
            <p className="mt-2 text-fg-muted">
              {list.length === 1 ? "business" : "businesses"} in the {sector.name.toLowerCase()} portfolio
            </p>
          </div>
          <div className="lg:col-span-8">
            <h2 id="sector-intro" className="sr-only">
              About {sector.name}
            </h2>
            <p
              data-reveal
              className="font-display text-2xl font-medium leading-snug tracking-tight text-fg text-pretty sm:text-[1.75rem]"
            >
              {sector.intro[0]}
            </p>
            {sector.intro.slice(1).map((p) => (
              <p
                key={p}
                data-reveal
                style={{ "--reveal-delay": 1 } as React.CSSProperties}
                className="mt-8 max-w-2xl text-lg leading-relaxed text-fg-muted"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="sector-companies" className="bg-page-alt py-20 sm:py-28">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="sector-companies" data-reveal className="display-md text-fg">
              {sector.name} companies
            </h2>
            <Link
              href="/companies/"
              className="group inline-flex items-center gap-2 font-semibold text-fg"
            >
              Full directory
              <ArrowRight width={18} height={18} className="arrow-nudge" />
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((company, i) => (
              <li key={company.name} data-reveal style={{ "--reveal-delay": i % 3 } as React.CSSProperties}>
                <CompanyCard company={company} showSector={false} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <nav aria-label="Other sectors" className="border-t border-line">
        <div className="container-x grid sm:grid-cols-2">
          <Link
            href={sectorHref(prev.slug)}
            className="group flex flex-col gap-2 py-10 pr-6 sm:border-r sm:border-line"
          >
            <span className="label-mono text-fg-subtle">Previous sector</span>
            <span className="font-display text-2xl font-semibold text-fg group-hover:text-accent">
              ← {prev.name}
            </span>
          </Link>
          <Link
            href={sectorHref(next.slug)}
            className="group flex flex-col items-start gap-2 border-t border-line py-10 sm:items-end sm:border-t-0 sm:pl-6 sm:text-right"
          >
            <span className="label-mono text-fg-subtle">Next sector</span>
            <span className="font-display text-2xl font-semibold text-fg group-hover:text-accent">
              {next.name} →
            </span>
          </Link>
        </div>
      </nav>

      <ContactCta />
    </>
  );
}
