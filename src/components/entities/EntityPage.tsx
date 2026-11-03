import Link from "next/link";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { ContactCta } from "@/components/sections/ContactCta";
import { PageHero } from "@/components/sections/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";
import { getEntity } from "@/content/entities";
import { companiesIn, getSector, sectorHref } from "@/content/portfolio";
import { pageMetadata } from "@/lib/seo";

export function entityMetadata(slug: string) {
  const entity = getEntity(slug);
  return pageMetadata({
    title: entity.name,
    description: entity.metaDescription,
    path: `/${entity.slug}/`,
  });
}

/** Profile page for one of American Elite's core entities. */
export function EntityPage({ slug }: { slug: string }) {
  const entity = getEntity(slug);
  const sector = getSector(entity.sector)!;
  const related = companiesIn(entity.sector).filter((c) => c.profile !== `/${entity.slug}/`);

  return (
    <>
      <PageHero
        variant="split"
        image={{ src: entity.image, alt: entity.imageAlt }}
        crumbs={[
          { name: "Industries", path: "/industries/" },
          { name: sector.name, path: sectorHref(sector.slug) },
          { name: entity.name, path: `/${entity.slug}/` },
        ]}
        eyebrow={`${sector.name} · Part of American Elite Enterprises`}
        title={entity.name}
        lead={entity.tagline}
      >
        <ButtonLink href={entity.website.url} external>
          Visit website<span className="sr-only">: {entity.website.label}</span>
        </ButtonLink>
      </PageHero>

      <section aria-labelledby="entity-overview" className="py-20 sm:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="entity-overview" data-reveal className="label-mono text-accent">
              Overview
            </h2>
            <div className="mt-8 space-y-6">
              {entity.body.map((p, i) => (
                <p
                  key={p.slice(0, 40)}
                  data-reveal
                  className={
                    i === 0
                      ? "font-display text-2xl font-medium leading-snug tracking-tight text-fg text-pretty"
                      : "max-w-2xl text-lg leading-relaxed text-fg-muted"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div
              data-reveal
              className="glass rounded-2xl p-8 lg:sticky lg:top-28"
            >
              <p className="label-mono text-accent">At a glance</p>
              <dl>
              <div className="mt-6 border-t border-line pt-5">
                <dt className="text-sm text-fg-muted">Sector</dt>
                <dd className="mt-1">
                  <Link href={sectorHref(sector.slug)} className="font-display font-semibold text-fg underline decoration-accent underline-offset-4 hover:text-accent">
                    {sector.name}
                  </Link>
                </dd>
              </div>
              <div className="mt-5 border-t border-line pt-5">
                <dt className="text-sm text-fg-muted">Website</dt>
                <dd className="mt-1">
                  <a
                    href={entity.website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all font-display font-semibold text-fg underline decoration-accent underline-offset-4 hover:text-accent"
                  >
                    {entity.website.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
              <div className="mt-5 border-t border-line pt-5">
                <dt className="text-sm text-fg-muted">Parent organization</dt>
                <dd className="mt-1">
                  <Link href="/about/" className="font-display font-semibold text-fg underline decoration-accent underline-offset-4 hover:text-accent">
                    American Elite Enterprises
                  </Link>
                </dd>
              </div>
              </dl>
            </div>
          </aside>
        </div>

        {entity.services && (
          <div className="container-x mt-20 lg:mt-28">
            <h2 data-reveal className="display-md text-fg">
              What we do
            </h2>
            <ol className="mt-10 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
              {entity.services.map((service, i) => (
                <li
                  key={service}
                  data-reveal
                  style={{ "--reveal-delay": i % 4 } as React.CSSProperties}
                  className="border-b border-line py-8 pr-6"
                >
                  <span className="font-display text-sm font-semibold tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-4 font-display text-lg font-medium leading-snug text-fg">
                    {service}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="bg-page-alt py-20 sm:py-28">
          <div className="container-x">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 id="related-title" data-reveal className="display-md text-fg">
                Also in {sector.name}
              </h2>
              <Link href={sectorHref(sector.slug)} className="group inline-flex items-center gap-2 font-semibold text-fg">
                Explore {sector.name}
                <ArrowRight width={18} height={18} className="arrow-nudge" />
              </Link>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 6).map((company) => (
                <li key={company.name} data-reveal>
                  <CompanyCard company={company} showSector={false} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <ContactCta />
    </>
  );
}
