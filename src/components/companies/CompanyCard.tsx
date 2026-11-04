import Link from "next/link";
import { getSector, type Company } from "@/content/portfolio";
import { CompanyLogo } from "@/components/companies/CompanyLogo";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";

/**
 * Company card. Core entities link to their internal profile page; all others
 * link to their own website. Additional domains are listed beneath.
 */
export function CompanyCard({
  company,
  showSector = true,
}: {
  company: Company;
  /** Hide the sector label where the context already names the sector. */
  showSector?: boolean;
}) {
  const [primary, ...more] = company.sites;
  const sectorName = getSector(company.sector)?.name;
  const internal = Boolean(company.profile);
  const TitleLink = internal ? Link : "a";
  const titleLinkProps = internal ? {} : { target: "_blank", rel: "noopener noreferrer" };

  return (
    <article className="glass spotlight edge-light group relative flex h-full flex-col rounded-2xl p-6 transition-[background-color,transform] duration-500 ease-[var(--ease-expo)] hover:-translate-y-0.5 hover:bg-tint-strong">
      <div className="flex items-start justify-between gap-4">
        <CompanyLogo name={company.name} highlight={internal} />
        {showSector && <span className="label-mono text-[0.62rem] text-fg-subtle">{sectorName}</span>}
      </div>

      <h3 className="mt-6 font-display text-lg font-semibold leading-snug tracking-tight text-fg [overflow-wrap:anywhere]">
        <TitleLink
          href={company.profile ?? primary.url}
          {...titleLinkProps}
          className="after:absolute after:inset-0 after:z-[3] after:content-['']"
        >
          {company.name}
          {!internal && <span className="sr-only"> (opens in a new tab)</span>}
        </TitleLink>
      </h3>

      {company.description && (
        <p className="mt-2 text-[0.925rem] leading-relaxed text-fg-muted">{company.description}</p>
      )}

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-3">
          <span className="min-w-0 truncate font-mono text-xs text-fg-subtle">
            {internal ? "Group profile" : primary.label}
          </span>
          <span
            aria-hidden
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line text-fg transition-colors duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-on-accent"
          >
            {internal ? (
              <ArrowRight width={16} height={16} className="arrow-nudge" />
            ) : (
              <ArrowUpRight width={16} height={16} className="arrow-nudge-diag" />
            )}
          </span>
        </div>

        {(internal || more.length > 0) && (
          <ul className="relative z-[4] mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-line pt-3 text-xs">
            {(internal ? company.sites : more).map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-6 items-center gap-1 text-accent underline-offset-4 hover:underline"
                >
                  {s.label}
                  <ArrowUpRight width={12} height={12} />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
