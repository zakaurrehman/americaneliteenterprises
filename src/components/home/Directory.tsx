import Link from "next/link";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import { companies } from "@/content/portfolio";

// The group's core entities — the companies with their own profile page here.
const coreEntities = companies.filter((c) => c.profile);

/**
 * Homepage showcase of the core entities (server-rendered). The full,
 * filterable directory of every business lives on /companies/.
 */
export function Directory() {
  return (
    <section aria-labelledby="directory-title" className="cv-auto relative bg-page-alt py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          id="directory-title"
          index="03"
          eyebrow="Core entities"
          align="split"
          title={
            <>
              The businesses <span className="text-accent-gradient">behind the group.</span>
            </>
          }
          lead={`At the core of American Elite are ${coreEntities.length} group entities. Around them sits a wider portfolio of ${companies.length} businesses — every one listed in the full directory.`}
        />
        <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {coreEntities.map((company, i) => (
            <li key={company.name} data-reveal style={{ "--reveal-delay": i % 4 } as React.CSSProperties}>
              <CompanyCard company={company} />
            </li>
          ))}
        </ul>
        <div className="mt-12 flex justify-center">
          <Link
            href="/companies/"
            className="glass group inline-flex min-h-12 items-center gap-3 rounded-xl px-6 text-[0.95rem] font-semibold text-fg transition-colors hover:border-accent/50"
          >
            View all {companies.length} businesses
            <ArrowRight width={18} height={18} className="arrow-nudge text-accent" />
          </Link>
        </div>
      </div>
    </section>
  );
}
