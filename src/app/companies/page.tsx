import { CompanyDirectory } from "@/components/companies/CompanyDirectory";
import { ContactCta } from "@/components/sections/ContactCta";
import { PageHero } from "@/components/sections/PageHero";
import { sectors, totalCompanies, totalSites } from "@/content/portfolio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Companies — Business Portfolio Directory",
  description: `The complete business portfolio of American Elite Enterprises: ${totalCompanies} companies and initiatives across ${sectors.length} sectors, with links to each company's website.`,
  path: "/companies/",
});

export default function CompaniesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Our Companies", path: "/companies/" }]}
        eyebrow="Company directory"
        title={
          <>
            Our <span className="text-accent-gradient">companies.</span>
          </>
        }
        lead={`The full American Elite portfolio — ${totalCompanies} businesses and initiatives across ${totalSites} websites. Filter by sector, search by name, and visit each company directly.`}
      />
      <section aria-labelledby="directory-title" className="relative bg-page-alt py-16 text-fg sm:py-24">
        <div className="container-x">
          <h2 id="directory-title" className="sr-only">
            All companies
          </h2>
          <CompanyDirectory searchable />
        </div>
      </section>
      <ContactCta />
    </>
  );
}
